'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '../lib/api';

const defaultForm = {
  name: 'Kịch bản Cần Thơ - Cát Lái, 40 TEU',
  origin: 'Cần Thơ',
  destination: 'Cảng Cát Lái',
  exportPort: 'Cát Lái',
  commodity: 'Container xuất khẩu',
  containerQuantity: 20,
  teu: 40,
  maxAllowedHours: 20,
  notes: '',
  weights: {
    cost: 0.3,
    time: 0.25,
    emission: 0.25,
    consolidation: 0.1,
    flexibility: 0.05,
    infrastructure: 0.05
  },
  roadOption: {
    consolidationScore: 3,
    flexibilityScore: 5,
    infrastructureScore: 4,
    legs: [
      {
        name: 'Đường bộ trực tiếp',
        mode: 'direct_truck',
        distanceKm: 273,
        transportCost: 60000000,
        handlingCost: 0,
        waitingCost: 0,
        otherCost: 0,
        travelTimeHours: 8,
        handlingTimeHours: 0,
        waitingTimeHours: 0,
        bufferTimeHours: 0,
        emissionFactor: 0.55
      }
    ]
  },
  waterwayOption: {
    consolidationScore: 5,
    flexibilityScore: 3,
    infrastructureScore: 5,
    legs: [
      {
        name: 'Truck đầu',
        mode: 'truck_first',
        distanceKm: 40,
        transportCost: 8000000,
        handlingCost: 0,
        waitingCost: 0,
        otherCost: 0,
        travelTimeHours: 2,
        handlingTimeHours: 0,
        waitingTimeHours: 0,
        bufferTimeHours: 0,
        emissionFactor: 0.55
      },
      {
        name: 'Sà lan',
        mode: 'barge',
        distanceKm: 240,
        transportCost: 30000000,
        handlingCost: 5000000,
        waitingCost: 2000000,
        otherCost: 0,
        travelTimeHours: 14,
        handlingTimeHours: 1,
        waitingTimeHours: 1,
        bufferTimeHours: 0,
        emissionFactor: 0.2
      },
      {
        name: 'Truck cuối',
        mode: 'truck_last',
        distanceKm: 0,
        transportCost: 0,
        handlingCost: 0,
        waitingCost: 0,
        otherCost: 0,
        travelTimeHours: 0,
        handlingTimeHours: 0,
        waitingTimeHours: 0,
        bufferTimeHours: 0,
        emissionFactor: 0.55
      }
    ]
  }
};

const weightLabels = {
  cost: 'Chi phí vận chuyển',
  time: 'Thời gian vận chuyển',
  emission: 'Phát thải CO₂',
  consolidation: 'Khả năng gom container',
  flexibility: 'Độ linh hoạt',
  infrastructure: 'Kết nối hạ tầng'
};

function toNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function Field({ label, value, onChange, type = 'text', min, step = 'any' }) {
  return (
    <div className="form-row">
      <label>{label}</label>
      <input type={type} min={min} step={step} value={value} onChange={(e) => onChange(type === 'number' ? toNumber(e.target.value) : e.target.value)} />
    </div>
  );
}

function ScoreSelect({ label, value, onChange }) {
  return (
    <div className="form-row">
      <label>{label}</label>
      <select value={value} onChange={(e) => onChange(toNumber(e.target.value))}>
        {[1, 2, 3, 4, 5].map((score) => (
          <option key={score} value={score}>{score}/5</option>
        ))}
      </select>
    </div>
  );
}

export default function ScenarioForm() {
  const router = useRouter();
  const [form, setForm] = useState(defaultForm);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const weightTotal = useMemo(() => {
    return Object.values(form.weights).reduce((sum, value) => sum + Number(value || 0), 0);
  }, [form.weights]);

  function updateRoot(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function updateWeight(field, value) {
    setForm((prev) => ({
      ...prev,
      weights: {
        ...prev.weights,
        [field]: value
      }
    }));
  }

  function updateOption(optionKey, field, value) {
    setForm((prev) => ({
      ...prev,
      [optionKey]: {
        ...prev[optionKey],
        [field]: value
      }
    }));
  }

  function updateLeg(optionKey, legIndex, field, value) {
    setForm((prev) => ({
      ...prev,
      [optionKey]: {
        ...prev[optionKey],
        legs: prev[optionKey].legs.map((leg, index) => (
          index === legIndex ? { ...leg, [field]: value } : leg
        ))
      }
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await apiFetch('/scenarios', {
        method: 'POST',
        body: JSON.stringify(form)
      });
      router.push(`/scenarios/${data.scenario._id}`);
    } catch (err) {
      setError(err.message || 'Không thể tạo kịch bản');
    } finally {
      setLoading(false);
    }
  }

  function resetDefault() {
    setForm(defaultForm);
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 22 }}>
      {error && <div className="alert">{error}</div>}

      <div className="card form-section">
        <h3>1. Thông tin tuyến vận chuyển</h3>
        <div className="form-grid">
          <Field label="Tên kịch bản" value={form.name} onChange={(value) => updateRoot('name', value)} />
          <Field label="Hàng hóa" value={form.commodity} onChange={(value) => updateRoot('commodity', value)} />
          <Field label="Điểm xuất phát" value={form.origin} onChange={(value) => updateRoot('origin', value)} />
          <Field label="Điểm đến" value={form.destination} onChange={(value) => updateRoot('destination', value)} />
          <Field label="Cảng xuất khẩu" value={form.exportPort} onChange={(value) => updateRoot('exportPort', value)} />
          <Field label="Số container" value={form.containerQuantity} onChange={(value) => updateRoot('containerQuantity', value)} type="number" min="1" />
          <Field label="TEU quy đổi" value={form.teu} onChange={(value) => updateRoot('teu', value)} type="number" min="1" />
          <Field label="Thời gian tối đa cho phép (giờ)" value={form.maxAllowedHours} onChange={(value) => updateRoot('maxAllowedHours', value)} type="number" min="0" />
          <div className="form-row full">
            <label>Ghi chú</label>
            <textarea rows={3} value={form.notes} onChange={(e) => updateRoot('notes', e.target.value)} />
          </div>
        </div>
      </div>

      <div className="card form-section">
        <h3>2. Phương án đường bộ trực tiếp</h3>
        <div className="form-grid">
          <Field label="Cự ly đường bộ (km)" type="number" value={form.roadOption.legs[0].distanceKm} onChange={(value) => updateLeg('roadOption', 0, 'distanceKm', value)} />
          <Field label="Chi phí vận chuyển (VND)" type="number" value={form.roadOption.legs[0].transportCost} onChange={(value) => updateLeg('roadOption', 0, 'transportCost', value)} />
          <Field label="Thời gian di chuyển (giờ)" type="number" value={form.roadOption.legs[0].travelTimeHours} onChange={(value) => updateLeg('roadOption', 0, 'travelTimeHours', value)} />
          <Field label="Thời gian dự phòng (giờ)" type="number" value={form.roadOption.legs[0].bufferTimeHours} onChange={(value) => updateLeg('roadOption', 0, 'bufferTimeHours', value)} />
          <Field label="Hệ số phát thải truck" type="number" value={form.roadOption.legs[0].emissionFactor} onChange={(value) => updateLeg('roadOption', 0, 'emissionFactor', value)} />
          <Field label="Chi phí phát sinh khác" type="number" value={form.roadOption.legs[0].otherCost} onChange={(value) => updateLeg('roadOption', 0, 'otherCost', value)} />
          <ScoreSelect label="Khả năng gom container" value={form.roadOption.consolidationScore} onChange={(value) => updateOption('roadOption', 'consolidationScore', value)} />
          <ScoreSelect label="Độ linh hoạt" value={form.roadOption.flexibilityScore} onChange={(value) => updateOption('roadOption', 'flexibilityScore', value)} />
          <ScoreSelect label="Kết nối hạ tầng" value={form.roadOption.infrastructureScore} onChange={(value) => updateOption('roadOption', 'infrastructureScore', value)} />
        </div>
      </div>

      <div className="card form-section">
        <h3>3. Phương án kết hợp đường bộ – đường thủy</h3>
        <div className="grid-3">
          {form.waterwayOption.legs.map((leg, index) => (
            <div className="card soft" key={leg.mode} style={{ boxShadow: 'none' }}>
              <h3>{leg.name}</h3>
              <div className="form-grid" style={{ gridTemplateColumns: '1fr' }}>
                <Field label="Cự ly (km)" type="number" value={leg.distanceKm} onChange={(value) => updateLeg('waterwayOption', index, 'distanceKm', value)} />
                <Field label="Chi phí vận chuyển" type="number" value={leg.transportCost} onChange={(value) => updateLeg('waterwayOption', index, 'transportCost', value)} />
                <Field label="Chi phí xếp dỡ" type="number" value={leg.handlingCost} onChange={(value) => updateLeg('waterwayOption', index, 'handlingCost', value)} />
                <Field label="Chi phí chờ" type="number" value={leg.waitingCost} onChange={(value) => updateLeg('waterwayOption', index, 'waitingCost', value)} />
                <Field label="Thời gian di chuyển" type="number" value={leg.travelTimeHours} onChange={(value) => updateLeg('waterwayOption', index, 'travelTimeHours', value)} />
                <Field label="Thời gian xếp dỡ" type="number" value={leg.handlingTimeHours} onChange={(value) => updateLeg('waterwayOption', index, 'handlingTimeHours', value)} />
                <Field label="Thời gian chờ" type="number" value={leg.waitingTimeHours} onChange={(value) => updateLeg('waterwayOption', index, 'waitingTimeHours', value)} />
                <Field label="Hệ số phát thải" type="number" value={leg.emissionFactor} onChange={(value) => updateLeg('waterwayOption', index, 'emissionFactor', value)} />
              </div>
            </div>
          ))}
        </div>
        <div className="form-grid" style={{ marginTop: 16 }}>
          <ScoreSelect label="Khả năng gom container" value={form.waterwayOption.consolidationScore} onChange={(value) => updateOption('waterwayOption', 'consolidationScore', value)} />
          <ScoreSelect label="Độ linh hoạt" value={form.waterwayOption.flexibilityScore} onChange={(value) => updateOption('waterwayOption', 'flexibilityScore', value)} />
          <ScoreSelect label="Kết nối hạ tầng" value={form.waterwayOption.infrastructureScore} onChange={(value) => updateOption('waterwayOption', 'infrastructureScore', value)} />
        </div>
      </div>

      <div className="card form-section">
        <div className="page-header" style={{ marginBottom: 8 }}>
          <div>
            <h3>4. Trọng số tiêu chí</h3>
            <p className="muted" style={{ marginBottom: 0 }}>Backend sẽ tự chuẩn hóa nếu tổng trọng số khác 1.</p>
          </div>
          <span className={Math.abs(weightTotal - 1) < 0.001 ? 'pill' : 'pill warning'}>
            Tổng: {(weightTotal * 100).toFixed(1)}%
          </span>
        </div>
        <div className="grid-3">
          {Object.entries(form.weights).map(([key, value]) => (
            <div className="form-row" key={key}>
              <label>{weightLabels[key]}</label>
              <input type="range" min="0" max="0.6" step="0.01" value={value} onChange={(e) => updateWeight(key, toNumber(e.target.value))} />
              <strong>{(Number(value) * 100).toFixed(0)}%</strong>
            </div>
          ))}
        </div>
      </div>

      <div className="actions" style={{ justifyContent: 'flex-end' }}>
        <button type="button" className="btn secondary" onClick={resetDefault}>Reset dữ liệu mẫu</button>
        <button className="btn" type="submit" disabled={loading}>{loading ? 'Đang tính toán...' : 'Tính toán & lưu kịch bản'}</button>
      </div>
    </form>
  );
}
