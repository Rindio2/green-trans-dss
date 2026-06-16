'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import AppShell from '../../components/AppShell';
import StatCard from '../../components/StatCard';
import { apiFetch, formatNumber, optionLabel } from '../../lib/api';

export default function DashboardPage() {
  const [scenarios, setScenarios] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await apiFetch('/scenarios');
        setScenarios(data.scenarios || []);
      } catch (err) {
        setError(err.message || 'Không thể tải dashboard');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const stats = useMemo(() => {
    const road = scenarios.filter((item) => item.recommendation?.selectedOption === 'road').length;
    const waterway = scenarios.filter((item) => item.recommendation?.selectedOption === 'waterway').length;
    const none = scenarios.filter((item) => item.recommendation?.selectedOption === 'none').length;
    const totalTeu = scenarios.reduce((sum, item) => sum + Number(item.teu || 0), 0);
    return { road, waterway, none, totalTeu };
  }, [scenarios]);

  return (
    <AppShell>
      <div className="page-header">
        <div>
          <h1 style={{ fontSize: 42 }}>Dashboard</h1>
          <p className="muted">Theo dõi các kịch bản vận chuyển xanh đã tạo.</p>
        </div>
        <Link className="btn" href="/scenarios/new">Tạo kịch bản mới</Link>
      </div>

      {error && <div className="alert">{error}</div>}
      {loading ? <p>Đang tải dữ liệu...</p> : (
        <>
          <div className="grid-4">
            <StatCard label="Tổng kịch bản" value={scenarios.length} />
            <StatCard label="Chọn đường bộ" value={stats.road} />
            <StatCard label="Chọn đường thủy" value={stats.waterway} />
            <StatCard label="Tổng TEU đã phân tích" value={formatNumber(stats.totalTeu)} />
          </div>

          <div className="card" style={{ marginTop: 22 }}>
            <h3>Kịch bản gần đây</h3>
            {scenarios.length === 0 ? (
              <p className="muted">Chưa có kịch bản nào. Hãy tạo kịch bản đầu tiên.</p>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Tên kịch bản</th>
                      <th>Tuyến</th>
                      <th>TEU</th>
                      <th>Khuyến nghị</th>
                      <th>Ngày tạo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scenarios.map((scenario) => (
                      <tr key={scenario._id}>
                        <td><Link href={`/scenarios/${scenario._id}`} style={{ fontWeight: 800, color: 'var(--primary)' }}>{scenario.name}</Link></td>
                        <td>{scenario.origin} → {scenario.destination}</td>
                        <td>{scenario.teu}</td>
                        <td>{optionLabel(scenario.recommendation?.selectedOption)}</td>
                        <td>{new Date(scenario.createdAt).toLocaleDateString('vi-VN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </AppShell>
  );
}
