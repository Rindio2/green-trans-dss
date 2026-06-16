import AppShell from '../../components/AppShell';

export default function ReportsPage() {
  return (
    <AppShell>
      <div className="page-header">
        <div>
          <h1 style={{ fontSize: 42 }}>Báo cáo</h1>
          <p className="muted">Vào từng kịch bản để xuất CSV hoặc in thành PDF bằng trình duyệt.</p>
        </div>
      </div>
      <div className="card">
        <h3>Hướng dẫn xuất báo cáo</h3>
        <ol className="muted" style={{ lineHeight: 2 }}>
          <li>Vào Dashboard.</li>
          <li>Chọn một kịch bản đã tạo.</li>
          <li>Bấm “Xuất CSV” để tải dữ liệu bảng.</li>
          <li>Bấm “In / Xuất PDF” để lưu báo cáo dạng PDF.</li>
        </ol>
      </div>
    </AppShell>
  );
}
