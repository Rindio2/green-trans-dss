'use client';

import { formatMoney, formatNumber, optionLabel } from '../lib/api';
import ScoreBar from './ScoreBar';

function getOption(scenario, type) {
  return scenario.options.find((option) => option.type === type);
}

function selectedClass(selectedOption) {
  if (selectedOption === 'none') return 'danger-box';
  return 'success-box';
}

export default function ResultView({ scenario }) {
  const road = getOption(scenario, 'road');
  const waterway = getOption(scenario, 'waterway');
  const selected = scenario.recommendation?.selectedOption;

  function exportCsv() {
    const rows = [
      ['Tieu chi', 'Duong bo', 'Duong thuy'],
      ['Chi phi', road.totals.cost, waterway.totals.cost],
      ['Thoi gian', road.totals.time, waterway.totals.time],
      ['CO2', road.totals.emission, waterway.totals.emission],
      ['Diem tong hop', road.totalScore, waterway.totalScore],
      ['Khuyen nghi', optionLabel(selected), scenario.recommendation?.reason || '']
    ];
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${scenario.name || 'greentrans-report'}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div style={{ display: 'grid', gap: 20 }}>
      <div className={selectedClass(selected)}>
        <p style={{ marginBottom: 6, fontWeight: 800 }}>Kết quả khuyến nghị</p>
        <h2 style={{ marginBottom: 10 }}>{optionLabel(selected)}</h2>
        <p style={{ marginBottom: 0 }}>{scenario.recommendation?.reason}</p>
        {scenario.recommendation?.warnings?.length > 0 && (
          <ul>
            {scenario.recommendation.warnings.map((warning, index) => (
              <li key={index}>{warning}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="grid-4">
        <div className="card">
          <p className="muted">Tuyến</p>
          <h3>{scenario.origin} → {scenario.destination}</h3>
          <p className="muted">Cảng xuất: {scenario.exportPort}</p>
        </div>
        <div className="card">
          <p className="muted">Số TEU</p>
          <div className="stat-number">{scenario.teu}</div>
          <p className="muted">{scenario.containerQuantity} container</p>
        </div>
        <div className="card">
          <p className="muted">Deadline</p>
          <div className="stat-number">{scenario.maxAllowedHours}h</div>
          <p className="muted">Thời gian tối đa</p>
        </div>
        <div className="card">
          <p className="muted">Phương án chọn</p>
          <h3>{optionLabel(selected)}</h3>
          <span className={selected === 'none' ? 'pill danger' : 'pill'}>{selected === 'none' ? 'Cần điều chỉnh' : 'Khả thi'}</span>
        </div>
      </div>

      <div className="grid-2">
        <div className="card">
          <h3>Điểm đường bộ</h3>
          <ScoreBar value={road.totalScore} />
        </div>
        <div className="card">
          <h3>Điểm đường bộ – đường thủy</h3>
          <ScoreBar value={waterway.totalScore} />
        </div>
      </div>

      <div className="card">
        <div className="page-header" style={{ marginBottom: 14 }}>
          <div>
            <h3>Bảng so sánh phương án</h3>
            <p className="muted" style={{ marginBottom: 0 }}>Các điểm chuẩn hóa được tính trên thang 0–100.</p>
          </div>
          <div className="actions no-print" style={{ marginTop: 0 }}>
            <button className="btn secondary" onClick={() => window.print()}>In / Xuất PDF</button>
            <button className="btn" onClick={exportCsv}>Xuất CSV</button>
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Tiêu chí</th>
                <th>Đường bộ</th>
                <th>Đường thủy</th>
                <th>Tốt hơn</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Chi phí</td>
                <td>{formatMoney(road.totals.cost)}</td>
                <td>{formatMoney(waterway.totals.cost)}</td>
                <td>{road.totals.cost <= waterway.totals.cost ? 'Đường bộ' : 'Đường thủy'}</td>
              </tr>
              <tr>
                <td>Thời gian</td>
                <td>{formatNumber(road.totals.time, ' giờ')}</td>
                <td>{formatNumber(waterway.totals.time, ' giờ')}</td>
                <td>{road.totals.time <= waterway.totals.time ? 'Đường bộ' : 'Đường thủy'}</td>
              </tr>
              <tr>
                <td>Phát thải CO₂</td>
                <td>{formatNumber(road.totals.emission, ' kgCO₂')}</td>
                <td>{formatNumber(waterway.totals.emission, ' kgCO₂')}</td>
                <td>{road.totals.emission <= waterway.totals.emission ? 'Đường bộ' : 'Đường thủy'}</td>
              </tr>
              <tr>
                <td>Khả năng gom container</td>
                <td>{road.consolidationScore}/5</td>
                <td>{waterway.consolidationScore}/5</td>
                <td>{road.consolidationScore >= waterway.consolidationScore ? 'Đường bộ' : 'Đường thủy'}</td>
              </tr>
              <tr>
                <td>Độ linh hoạt</td>
                <td>{road.flexibilityScore}/5</td>
                <td>{waterway.flexibilityScore}/5</td>
                <td>{road.flexibilityScore >= waterway.flexibilityScore ? 'Đường bộ' : 'Đường thủy'}</td>
              </tr>
              <tr>
                <td>Kết nối hạ tầng</td>
                <td>{road.infrastructureScore}/5</td>
                <td>{waterway.infrastructureScore}/5</td>
                <td>{road.infrastructureScore >= waterway.infrastructureScore ? 'Đường bộ' : 'Đường thủy'}</td>
              </tr>
              <tr>
                <td><strong>Điểm tổng hợp</strong></td>
                <td><strong>{road.totalScore}/100</strong></td>
                <td><strong>{waterway.totalScore}/100</strong></td>
                <td><strong>{optionLabel(selected)}</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <h3>Trọng số đang áp dụng</h3>
        <div className="grid-3">
          {Object.entries(scenario.weights).map(([key, value]) => (
            <p key={key} style={{ margin: 0 }}><strong>{key}</strong>: {(Number(value) * 100).toFixed(1)}%</p>
          ))}
        </div>
      </div>
    </div>
  );
}
