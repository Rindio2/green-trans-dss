import express from 'express';
import { z } from 'zod';
import Scenario from '../models/Scenario.js';
import { requireAuth } from '../middleware/auth.js';
import { calculateScenario } from '../utils/calculate.js';

const router = express.Router();

const legSchema = z.object({
  name: z.string().optional().default(''),
  mode: z.enum(['direct_truck', 'truck_first', 'barge', 'truck_last']),
  distanceKm: z.coerce.number().min(0).default(0),
  transportCost: z.coerce.number().min(0).default(0),
  handlingCost: z.coerce.number().min(0).default(0),
  waitingCost: z.coerce.number().min(0).default(0),
  otherCost: z.coerce.number().min(0).default(0),
  travelTimeHours: z.coerce.number().min(0).default(0),
  handlingTimeHours: z.coerce.number().min(0).default(0),
  waitingTimeHours: z.coerce.number().min(0).default(0),
  bufferTimeHours: z.coerce.number().min(0).default(0),
  emissionFactor: z.coerce.number().min(0).default(0)
});

const optionSchema = z.object({
  consolidationScore: z.coerce.number().min(1).max(5).default(3),
  flexibilityScore: z.coerce.number().min(1).max(5).default(3),
  infrastructureScore: z.coerce.number().min(1).max(5).default(3),
  legs: z.array(legSchema).min(1)
});

const scenarioSchema = z.object({
  name: z.string().min(2),
  origin: z.string().min(1),
  destination: z.string().min(1),
  exportPort: z.string().optional().default('Cát Lái'),
  commodity: z.string().optional().default(''),
  containerQuantity: z.coerce.number().min(1).default(1),
  teu: z.coerce.number().min(1),
  maxAllowedHours: z.coerce.number().min(0.1).default(24),
  weights: z.object({
    cost: z.coerce.number().min(0).default(0.3),
    time: z.coerce.number().min(0).default(0.25),
    emission: z.coerce.number().min(0).default(0.25),
    consolidation: z.coerce.number().min(0).default(0.1),
    flexibility: z.coerce.number().min(0).default(0.05),
    infrastructure: z.coerce.number().min(0).default(0.05)
  }),
  roadOption: optionSchema,
  waterwayOption: optionSchema,
  notes: z.string().optional().default('')
});

router.use(requireAuth);

router.get('/', async (req, res, next) => {
  try {
    const scenarios = await Scenario.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .select('name origin destination exportPort teu maxAllowedHours options recommendation createdAt')
      .lean();

    res.json({ scenarios });
  } catch (error) {
    next(error);
  }
});

router.post('/calculate', async (req, res, next) => {
  try {
    const data = scenarioSchema.parse(req.body);
    const calculated = calculateScenario(data);

    res.json({
      scenario: {
        ...data,
        ...calculated
      }
    });
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const data = scenarioSchema.parse(req.body);
    const calculated = calculateScenario(data);

    const scenario = await Scenario.create({
      userId: req.user._id,
      name: data.name,
      origin: data.origin,
      destination: data.destination,
      exportPort: data.exportPort,
      commodity: data.commodity,
      containerQuantity: data.containerQuantity,
      teu: data.teu,
      maxAllowedHours: data.maxAllowedHours,
      weights: calculated.weights,
      options: calculated.options,
      recommendation: calculated.recommendation,
      notes: data.notes
    });

    res.status(201).json({ scenario });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const scenario = await Scenario.findOne({ _id: req.params.id, userId: req.user._id }).lean();

    if (!scenario) {
      return res.status(404).json({ message: 'Scenario not found' });
    }

    res.json({ scenario });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const deleted = await Scenario.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

    if (!deleted) {
      return res.status(404).json({ message: 'Scenario not found' });
    }

    res.json({ message: 'Scenario deleted' });
  } catch (error) {
    next(error);
  }
});

export default router;
