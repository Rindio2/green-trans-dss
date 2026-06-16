export default function StatCard({ label, value, note }) {
  return (
    <div className="card">
      <p className="muted" style={{ marginBottom: 8 }}>{label}</p>
      <div className="stat-number">{value}</div>
      {note && <p className="muted" style={{ marginTop: 8, marginBottom: 0 }}>{note}</p>}
    </div>
  );
}
