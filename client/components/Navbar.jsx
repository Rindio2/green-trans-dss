'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { clearSession, getStoredUser } from '../lib/api';

export default function Navbar({ app = false }) {
  const router = useRouter();
  const user = typeof window !== 'undefined' ? getStoredUser() : null;

  function logout() {
    clearSession();
    router.push('/login');
  }

  if (app) {
    return (
      <aside className="sidebar no-print">
        <Link href="/dashboard" className="logo" style={{ color: 'white' }}>
          <span className="logo-mark">G</span>
          <span>GreenTrans DSS</span>
        </Link>
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/scenarios/new">Tạo kịch bản</Link>
        <Link href="/data">Dữ liệu nền</Link>
        <Link href="/reports">Báo cáo</Link>
        <button onClick={logout}>Đăng xuất</button>
        {user && <p className="muted" style={{ marginTop: 18, color: '#94a3b8' }}>{user.fullName}</p>}
      </aside>
    );
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link href="/" className="logo">
          <span className="logo-mark">G</span>
          <span>GreenTrans DSS</span>
        </Link>
        <div className="nav-links">
          <Link href="/#features">Chức năng</Link>
          <Link href="/#model">Mô hình</Link>
          <Link href="/login">Đăng nhập</Link>
          <Link href="/register" className="btn">Bắt đầu</Link>
        </div>
      </div>
    </nav>
  );
}
