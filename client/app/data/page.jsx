import AppShell from '../../components/AppShell';

const masterData = [
  ['Hệ số truck mặc định', '0.55 kgCO₂/TEU-km', 'Có thể thay bằng số liệu doanh nghiệp'],
  ['Hệ số sà lan mặc định', '0.20 kgCO₂/TEU-km', 'Dùng để mô phỏng kịch bản'],
  ['Thang điểm bán định lượng', '1–5', 'Áp dụng cho gom container, linh hoạt, hạ tầng'],
  ['Bộ trọng số mặc định', '30% - 25% - 25% - 10% - 5% - 5%', 'Có thể điều chỉnh trong form']
];

export default function DataPage() {
  return (
    <AppShell>
      <div className="page-header">
        <div>
          <h1 style={{ fontSize: 42 }}>Dữ liệu nền</h1>
          <p className="muted">Khu vực quản lý hệ số phát thải, tuyến, cảng, ICD/depot. Bản prototype đang dùng dữ liệu mặc định.</p>
        </div>
      </div>
      <div className="card">
        <h3>Tham số mặc định</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Tham số</th><th>Giá trị</th><th>Ghi chú</th></tr>
            </thead>
            <tbody>
              {masterData.map((row) => (
                <tr key={row[0]}><td>{row[0]}</td><td>{row[1]}</td><td>{row[2]}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
