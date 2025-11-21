'use client';

export interface StoredUser {
  id: number;
  email: string;
  nickname: string;
}

const KEY = 'matchtime:user';

export function saveUser(user: StoredUser) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEY, JSON.stringify(user));
}

export function getUser(): StoredUser | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredUser;
  } catch {
    return null;
  }
}

export function clearUser() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(KEY);
}
