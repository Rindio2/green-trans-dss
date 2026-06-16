const DEFAULT_WEIGHTS = {
  cost: 0.3,
  time: 0.25,
  emission: 0.25,
  consolidation: 0.1,
  flexibility: 0.05,
  infrastructure: 0.05
};

function toNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function clampScore(value) {
  const score = toNumber(value, 3);
  return Math.min(5, Math.max(1, score));
}

function sumWeights(weights) {
  return Object.values(weights).reduce((sum, value) => sum + toNumber(value), 0);
}

export function normalizeWeights(inputWeights = {}) {
  const weights = {
    cost: toNumber(inputWeights.cost, DEFAULT_WEIGHTS.cost),
    time: toNumber(inputWeights.time, DEFAULT_WEIGHTS.time),
    emission: toNumber(inputWeights.emission, DEFAULT_WEIGHTS.emission),
    consolidation: toNumber(inputWeights.consolidation, DEFAULT_WEIGHTS.consolidation),
    flexibility: toNumber(inputWeights.flexibility, DEFAULT_WEIGHTS.flexibility),
    infrastructure: toNumber(inputWeights.infrastructure, DEFAULT_WEIGHTS.infrastructure)
  };

  const total = sumWeights(weights);

  if (total <= 0) {
    return DEFAULT_WEIGHTS;
  }

  return Object.fromEntries(
    Object.entries(weights).map(([key, value]) => [key, Number((value / total).toFixed(4))])
  );
}

function calculateLegTotals(leg, teu) {
  const distanceKm = toNumber(leg.distanceKm);
  const transportCost = toNumber(leg.transportCost);
  const handlingCost = toNumber(leg.handlingCost);
  const waitingCost = toNumber(leg.waitingCost);
  const otherCost = toNumber(leg.otherCost);
  const travelTimeHours = toNumber(leg.travelTimeHours);
  const handlingTimeHours = toNumber(leg.handlingTimeHours);
  const waitingTimeHours = toNumber(leg.waitingTimeHours);
  const bufferTimeHours = toNumber(leg.bufferTimeHours);
  const emissionFactor = toNumber(leg.emissionFactor);

  return {
    cost: transportCost + handlingCost + waitingCost + otherCost,
    time: travelTimeHours + handlingTimeHours + waitingTimeHours + bufferTimeHours,
    emission: teu * distanceKm * emissionFactor
  };
}

function calculateOptionTotals(option, teu, maxAllowedHours) {
  const legs = Array.isArray(option.legs) ? option.legs : [];
  const totals = legs.reduce(
    (acc, leg) => {
      const legTotals = calculateLegTotals(leg, teu);
      acc.cost += legTotals.cost;
      acc.time += legTotals.time;
      acc.emission += legTotals.emission;
      return acc;
    },
    { cost: 0, time: 0, emission: 0 }
  );

  return {
    ...option,
    consolidationScore: clampScore(option.consolidationScore),
    flexibilityScore: clampScore(option.flexibilityScore),
    infrastructureScore: clampScore(option.infrastructureScore),
    totals: {
      cost: Math.round(totals.cost),
      time: Number(totals.time.toFixed(2)),
      emission: Number(totals.emission.toFixed(2))
    },
    feasibleByTime: totals.time <= maxAllowedHours
  };
}

function normalizeLowerBetter(value, min, max) {
  if (max === min) return 50;
  return ((max - value) / (max - min)) * 100;
}

function normalizeHigherBetter(value, min, max) {
  if (max === min) return 50;
  return ((value - min) / (max - min)) * 100;
}

function roundScore(score) {
  return Number(Math.max(0, Math.min(100, score)).toFixed(2));
}

function addNormalizedScores(options) {
  const values = {
    cost: options.map((option) => option.totals.cost),
    time: options.map((option) => option.totals.time),
    emission: options.map((option) => option.totals.emission),
    consolidation: options.map((option) => option.consolidationScore),
    flexibility: options.map((option) => option.flexibilityScore),
    infrastructure: options.map((option) => option.infrastructureScore)
  };

  const range = Object.fromEntries(
    Object.entries(values).map(([key, list]) => [
      key,
      {
        min: Math.min(...list),
        max: Math.max(...list)
      }
    ])
  );

  return options.map((option) => ({
    ...option,
    normalized: {
      cost: roundScore(normalizeLowerBetter(option.totals.cost, range.cost.min, range.cost.max)),
      time: roundScore(normalizeLowerBetter(option.totals.time, range.time.min, range.time.max)),
      emission: roundScore(normalizeLowerBetter(option.totals.emission, range.emission.min, range.emission.max)),
      consolidation: roundScore(normalizeHigherBetter(option.consolidationScore, range.consolidation.min, range.consolidation.max)),
      flexibility: roundScore(normalizeHigherBetter(option.flexibilityScore, range.flexibility.min, range.flexibility.max)),
      infrastructure: roundScore(normalizeHigherBetter(option.infrastructureScore, range.infrastructure.min, range.infrastructure.max))
    }
  }));
}

function addTotalScores(options, weights) {
  return options.map((option) => {
    const score =
      option.normalized.cost * weights.cost +
      option.normalized.time * weights.time +
      option.normalized.emission * weights.emission +
      option.normalized.consolidation * weights.consolidation +
      option.normalized.flexibility * weights.flexibility +
      option.normalized.infrastructure * weights.infrastructure;

    return {
      ...option,
      totalScore: roundScore(score)
    };
  });
}

function buildRecommendation(options, maxAllowedHours) {
  const sortedByScore = [...options].sort((a, b) => b.totalScore - a.totalScore);
  const feasible = sortedByScore.filter((option) => option.feasibleByTime);
  const warnings = [];

  for (const option of sortedByScore) {
    if (!option.feasibleByTime) {
      warnings.push(
        `${option.type === 'road' ? 'Đường bộ' : 'Đường thủy'} có điểm ${option.totalScore}/100 nhưng vượt thời gian tối đa ${maxAllowedHours} giờ.`
      );
    }
  }

  if (feasible.length === 0) {
    return {
      selectedOption: 'none',
      reason: 'Không có phương án nào đáp ứng ràng buộc thời gian. Cần điều chỉnh lịch xuất hàng, deadline hoặc dữ liệu vận hành.',
      warnings
    };
  }

  const selected = feasible[0];
  const selectedName = selected.type === 'road' ? 'đường bộ trực tiếp' : 'kết hợp đường bộ – đường thủy';
  const betterEmission = selected.totals.emission === Math.min(...options.map((option) => option.totals.emission));
  const betterCost = selected.totals.cost === Math.min(...options.map((option) => option.totals.cost));

  const reasonParts = [
    `Phương án ${selectedName} đạt ${selected.totalScore}/100 điểm và đáp ứng thời gian tối đa ${maxAllowedHours} giờ.`
  ];

  if (betterCost) reasonParts.push('Phương án này có lợi thế về chi phí.');
  if (betterEmission) reasonParts.push('Phương án này có lợi thế về phát thải CO₂.');

  return {
    selectedOption: selected.type,
    reason: reasonParts.join(' '),
    warnings
  };
}

export function calculateScenario(rawScenario) {
  const teu = toNumber(rawScenario.teu, 1);
  const maxAllowedHours = toNumber(rawScenario.maxAllowedHours, 24);
  const weights = normalizeWeights(rawScenario.weights);

  const roadInput = rawScenario.roadOption || rawScenario.options?.find((option) => option.type === 'road');
  const waterwayInput = rawScenario.waterwayOption || rawScenario.options?.find((option) => option.type === 'waterway');

  if (!roadInput || !waterwayInput) {
    throw new Error('Both roadOption and waterwayOption are required');
  }

  const optionsWithTotals = [
    calculateOptionTotals({ ...roadInput, type: 'road' }, teu, maxAllowedHours),
    calculateOptionTotals({ ...waterwayInput, type: 'waterway' }, teu, maxAllowedHours)
  ];

  const normalized = addNormalizedScores(optionsWithTotals);
  const scored = addTotalScores(normalized, weights);
  const recommendation = buildRecommendation(scored, maxAllowedHours);

  return {
    weights,
    options: scored,
    recommendation
  };
}
