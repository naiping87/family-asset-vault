'use client';

export default function Error({ error, reset }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', minHeight: '60vh', gap: 16
    }}>
      <div style={{ fontSize: 36 }}>⚠️</div>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>出了点问题</h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{error?.message || '未知错误'}</p>
      <button className="btn btn-secondary" onClick={reset}>重试</button>
    </div>
  );
}
