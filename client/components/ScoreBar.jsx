export default function ScoreBar({ value }) {
  const score = Math.max(0, Math.min(100, Number(value || 0)));

  return (
    <div style={{ display: 'grid', gap: 7 }}>
      <div className="scorebar"><span style={{ width: `${score}%` }} /></div>
      <strong>{score.toFixed(2)}/100</strong>
    </div>
  );
}
