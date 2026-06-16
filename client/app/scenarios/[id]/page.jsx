'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import AppShell from '../../../components/AppShell';
import ResultView from '../../../components/ResultView';
import { apiFetch } from '../../../lib/api';

export default function ScenarioDetailPage() {
  const params = useParams();
  const [scenario, setScenario] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await apiFetch(`/scenarios/${params.id}`);
        setScenario(data.scenario);
      } catch (err) {
        setError(err.message || 'Không thể tải kịch bản');
      } finally {
        setLoading(false);
      }
    }
    if (params.id) load();
  }, [params.id]);

  return (
    <AppShell>
      <div className="page-header no-print">
        <div>
          <h1 style={{ fontSize: 42 }}>Kết quả kịch bản</h1>
          <p className="muted">Bảng so sánh, điểm tổng hợp và khuyến nghị phương án.</p>
        </div>
      </div>
      {error && <div className="alert">{error}</div>}
      {loading && <p>Đang tải kết quả...</p>}
      {scenario && <ResultView scenario={scenario} />}
    </AppShell>
  );
}
