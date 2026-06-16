'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getToken } from '../lib/api';
import Navbar from './Navbar';

export default function AppShell({ children }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!getToken()) {
      router.push('/login');
      return;
    }
    setReady(true);
  }, [router]);

  if (!ready) {
    return <div className="auth-page">Đang kiểm tra đăng nhập...</div>;
  }

  return (
    <div className="app-shell">
      <Navbar app />
      <main className="main">{children}</main>
    </div>
  );
}
