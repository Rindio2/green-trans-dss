'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiFetch, setSession } from '../lib/api';

export default function AuthForm({ mode = 'login' }) {
  const router = useRouter();
  const isRegister = mode === 'register';
  const [form, setForm] = useState({ fullName: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const path = isRegister ? '/auth/register' : '/auth/login';
      const payload = isRegister ? form : { email: form.email, password: form.password };
      const data = await apiFetch(path, {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      setSession(data);
      router.push('/dashboard');
    } catch (err) {
      setError(err.message || 'Không thể đăng nhập');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <Link href="/" className="logo" style={{ marginBottom: 22 }}>
          <span className="logo-mark">G</span>
          <span>GreenTrans DSS</span>
        </Link>
        <h1 style={{ fontSize: 36, lineHeight: 1.1 }}>
          {isRegister ? 'Tạo tài khoản' : 'Đăng nhập'}
        </h1>
        <p className="muted">
          {isRegister
            ? 'Tạo tài khoản để lưu kịch bản vận chuyển và xem dashboard.'
            : 'Đăng nhập để tạo và quản lý kịch bản vận chuyển xanh.'}
        </p>

        {error && <div className="alert">{error}</div>}

        <form onSubmit={handleSubmit} className="form-grid" style={{ gridTemplateColumns: '1fr' }}>
          {isRegister && (
            <div className="form-row">
              <label>Họ tên</label>
              <input value={form.fullName} onChange={(e) => updateField('fullName', e.target.value)} required />
            </div>
          )}
          <div className="form-row">
            <label>Email</label>
            <input type="email" value={form.email} onChange={(e) => updateField('email', e.target.value)} required />
          </div>
          <div className="form-row">
            <label>Mật khẩu</label>
            <input type="password" value={form.password} onChange={(e) => updateField('password', e.target.value)} required minLength={6} />
          </div>
          <button className="btn" type="submit" disabled={loading}>
            {loading ? 'Đang xử lý...' : isRegister ? 'Đăng ký' : 'Đăng nhập'}
          </button>
        </form>

        <p className="muted" style={{ marginTop: 18, marginBottom: 0 }}>
          {isRegister ? 'Đã có tài khoản?' : 'Chưa có tài khoản?'}{' '}
          <Link href={isRegister ? '/login' : '/register'} style={{ color: 'var(--primary)', fontWeight: 800 }}>
            {isRegister ? 'Đăng nhập' : 'Đăng ký'}
          </Link>
        </p>
      </div>
    </div>
  );
}
