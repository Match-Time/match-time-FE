'use client';

/**
 * Lightweight fetch wrapper for the Spring backend.
 * All endpoints are assumed to live under the same origin unless
 * NEXT_PUBLIC_API_BASE is provided.
 */

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ||
  'https://matchtime-app-purple-firefly-5004.fly.dev';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface ApiOptions extends RequestInit {
  method?: HttpMethod;
  body?: any;
}

async function request<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const url = `${API_BASE}${path}`;
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const res = await fetch(url, {
    ...options,
    method: options.method || 'GET',
    headers,
    body:
      options.body && typeof options.body !== 'string'
        ? JSON.stringify(options.body)
        : options.body,
  });

  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || `Request failed: ${res.status}`);
  }

  // No content
  if (res.status === 204) return undefined as unknown as T;

  const text = await res.text();
  if (!text) return undefined as unknown as T;
  try {
    return JSON.parse(text) as T;
  } catch {
    // In case backend sends plain text
    return text as unknown as T;
  }
}

// --- Types from backend ---
export type RoomType = 'WEEKLY' | 'ONCE';

export interface Room {
  id: number;
  name: string;
  type: RoomType;
  inviteCode: string;
  confirmedDate?: string | null;
  confirmedDay?: string | null;
  confirmedStart?: string | null;
  confirmedEnd?: string | null;
}

export interface User {
  id: number;
  email: string;
  password: string;
  nickname: string;
}

export interface RecommendedDate {
  date: string; // ISO yyyy-MM-dd
  availableCount: number;
}

// --- Auth / user ---
export async function fetchUsers() {
  return request<User[]>('/api/users');
}

export async function createUser(user: {
  email: string;
  password: string;
  nickname: string;
}) {
  return request<User>('/api/users', {method: 'POST', body: user});
}

export async function updateUserNickname(userId: number, nickname: string) {
  return request<User>(`/api/users/${userId}`, {
    method: 'PUT',
    body: {nickname},
  });
}

export async function fetchUserRooms(userId: number) {
  return request<Room[]>(`/api/users/${userId}/rooms`);
}

// --- Room ---
export async function fetchRooms() {
  return request<Room[]>('/api/rooms');
}

export async function fetchRoom(roomId: number) {
  return request<Room>(`/api/rooms/${roomId}`);
}

export async function fetchRoomUsers(roomId: number) {
  return request<User[]>(`/api/rooms/${roomId}/users`);
}

export async function createRoom(body: {name: string; type: RoomType}) {
  return request<Room>('/api/rooms', {method: 'POST', body});
}

export async function updateRoomName(roomId: number, name: string) {
  return request<Room>(`/api/rooms/${roomId}`, {method: 'PUT', body: {name}});
}

export async function deleteRoom(roomId: number) {
  return request(`/api/rooms/${roomId}`, {method: 'DELETE'});
}

export async function joinRoom(userId: number, roomId: number) {
  return request(`/api/users/${userId}/rooms/${roomId}`, {method: 'POST'});
}

export async function leaveRoom(userId: number, roomId: number) {
  return request(`/api/rooms/${roomId}/users/${userId}`, {method: 'DELETE'});
}

export async function joinByInvite(userId: number, inviteCode: string) {
  return request(`/api/join`, {method: 'POST', body: {userId, inviteCode}});
}

export async function recommendDates(roomId: number) {
  return request<RecommendedDate[]>(`/api/rooms/${roomId}/recommend`);
}

export async function confirmRoomDate(
  roomId: number,
  payload: {type: RoomType; date?: string; day?: string; start?: string; end?: string},
) {
  return request(`/api/rooms/${roomId}/confirm`, {method: 'POST', body: payload});
}

// --- Availability (monthly) ---
export async function fetchUserMonthlyUnavailable(userId: number) {
  return request<string[]>(`/api/users/${userId}/unavailable/monthly`);
}

export async function saveUserMonthlyUnavailable(
  userId: number,
  dates: string[],
) {
  return request(`/api/users/${userId}/unavailable/monthly`, {
    method: 'PUT',
    body: {dates},
  });
}

export async function fetchRoomMonthlyUnavailable(userId: number, roomId: number) {
  return request<string[]>(`/api/users/${userId}/rooms/${roomId}/unavailable/monthly`);
}

export async function saveRoomMonthlyUnavailable(
  userId: number,
  roomId: number,
  dates: string[],
) {
  return request(`/api/users/${userId}/rooms/${roomId}/unavailable/monthly`, {
    method: 'PUT',
    body: {dates},
  });
}
