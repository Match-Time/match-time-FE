export type RoomType = 'WEEKLY' | 'ONCE';

export interface Room {
  id: number;
  name: string;
  type: RoomType;
  inviteCode: string;
  confirmedDay?: string | null;
  confirmedStart?: string | null;
  confirmedEnd?: string | null;
  confirmedDate?: string | null;
}

export interface User {
  id: number;
  email: string;
  password: string;
  nickname: string;
}

export interface RecommendedDate {
  date: string;
  availableCount: number;
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8080/api';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });

  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || `Request failed with status ${res.status}`);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  // Some endpoints return 200 with no body; guard against empty response
  const raw = await res.text();
  if (!raw) {
    return undefined as T;
  }

  return JSON.parse(raw) as T;
}

export function fetchUsers(): Promise<User[]> {
  return request<User[]>('/users');
}

export function createUser(payload: { email: string; password: string; nickname: string }) {
  return request<User>('/users', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function fetchRooms() {
  return request<Room[]>('/rooms');
}

export function fetchUserRooms(userId: number) {
  return request<Room[]>(`/users/${userId}/rooms`);
}

export function fetchRoom(roomId: number) {
  return request<Room>(`/rooms/${roomId}`);
}

export function createRoom(payload: { name: string; type: RoomType }) {
  return request<Room>('/rooms', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function updateRoom(roomId: number, name: string) {
  return request<Room>(`/rooms/${roomId}`, {
    method: 'PUT',
    body: JSON.stringify({ name }),
  });
}

export function fetchRoomUsers(roomId: number) {
  return request<User[]>(`/rooms/${roomId}/users`);
}

export function joinRoom(roomId: number, userId: number) {
  return request<void>(`/users/${userId}/rooms/${roomId}`, {
    method: 'POST',
  });
}

export function leaveRoom(roomId: number, userId: number) {
  return request<void>(`/rooms/${roomId}/users/${userId}`, {
    method: 'DELETE',
  });
}

export function joinByInvite(userId: number, inviteCode: string) {
  return request<void>('/join', {
    method: 'POST',
    body: JSON.stringify({ userId, inviteCode }),
  });
}

export function getRecommendedDates(roomId: number) {
  return request<RecommendedDate[]>(`/rooms/${roomId}/recommend`);
}

export function confirmRoom(
  roomId: number,
  payload:
    | { type: 'ONCE'; date: string; day?: undefined; start?: undefined; end?: undefined }
    | { type: 'WEEKLY'; day: string; start: string; end: string; date?: undefined }
) {
  return request<void>(`/rooms/${roomId}/confirm`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function fetchMonthlyUnavailable(userId: number) {
  return request<string[]>(`/users/${userId}/unavailable/monthly`);
}

export function saveMonthlyUnavailable(userId: number, dates: string[]) {
  return request<void>(`/users/${userId}/unavailable/monthly`, {
    method: 'PUT',
    body: JSON.stringify({ dates }),
  });
}

export function fetchRoomMonthlyUnavailable(userId: number, roomId: number) {
  return request<string[]>(`/users/${userId}/rooms/${roomId}/unavailable/monthly`);
}

export function saveRoomMonthlyUnavailable(userId: number, roomId: number, dates: string[]) {
  return request<void>(`/users/${userId}/rooms/${roomId}/unavailable/monthly`, {
    method: 'PUT',
    body: JSON.stringify({ dates }),
  });
}

export const apiBase = API_BASE;
