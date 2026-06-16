import AppShell from '../../../components/AppShell';
import ScenarioForm from '../../../components/ScenarioForm';

export default function NewScenarioPage() {
  return (
    <AppShell>
      <div className="page-header">
        <div>
          <h1 style={{ fontSize: 42 }}>Tạo kịch bản mới</h1>
          <p className="muted">Nhập dữ liệu đường bộ, đường thủy, trọng số và ràng buộc thời gian.</p>
        </div>
      </div>
      <ScenarioForm />
    </AppShell>
  );
}
