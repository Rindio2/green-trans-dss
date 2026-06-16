export const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('greentrans_token');
}

export function setSession({ token, user }) {
  localStorage.setItem('greentrans_token', token);
  localStorage.setItem('greentrans_user', JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem('greentrans_token');
  localStorage.removeItem('greentrans_user');
}

export function getStoredUser() {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('greentrans_user');
  try {
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function apiFetch(path, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const error = new Error(data?.message || 'Request failed');
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export function formatMoney(value) {
  return new Intl.NumberFormat('vi-VN').format(Number(value || 0)) + ' đ';
}

export function formatNumber(value, suffix = '') {
  return new Intl.NumberFormat('vi-VN', {
    maximumFractionDigits: 2
  }).format(Number(value || 0)) + suffix;
}

export function optionLabel(type) {
  if (type === 'road') return 'Đường bộ trực tiếp';
  if (type === 'waterway') return 'Đường bộ – đường thủy';
  return 'Không có phương án';
}
