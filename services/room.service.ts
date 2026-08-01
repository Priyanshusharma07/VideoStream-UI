import { getAccessToken } from '@/lib/auth-session';

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE ?? '').replace(/\/+$/, '');

function apiUrl(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  if (API_BASE) return `${API_BASE}${normalized}`;

  if (typeof window !== 'undefined') {
    const withoutApiPrefix = normalized.startsWith('/api/')
      ? normalized.slice('/api'.length)
      : normalized;
    return `/api/proxy${withoutApiPrefix}`;
  }

  const withApi = normalized.startsWith('/api') ? normalized : `/api${normalized}`;
  return withApi;
}

async function getAuthHeaders(token?: string | null): Promise<Record<string, string>> {
  const t = token ?? await getAccessToken();
  return {
    'Content-Type': 'application/json',
    ...(t ? { Authorization: `Bearer ${t}` } : {}),
  };
}

export interface RoomDetails {
  id: string;
  roomCode: string;
  name: string;
  creatorId: number;
  status: 'ACTIVE' | 'LOCKED' | 'ENDED';
  maxParticipants: number;
  allowChat: boolean;
  allowScreenShare: boolean;
  allowCamera: boolean;
  allowMicrophone: boolean;
}

export interface JoinRoomResponse {
  room: {
    id: string;
    roomCode: string;
    name: string;
    role: 'OWNER' | 'MODERATOR' | 'MEMBER';
    status: 'ACTIVE' | 'LOCKED' | 'ENDED';
  };
  media: {
    provider: 'livekit';
    url: string;
    token: string;
  };
}

export async function createRoom(
  params: { name: string; password?: string; maxParticipants?: number },
  token?: string | null
): Promise<RoomDetails> {
  const headers = await getAuthHeaders(token);
  const res = await fetch(apiUrl('/v1/rooms'), {
    method: 'POST',
    headers,
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to create room');
  }
  return res.json();
}

export async function getRoomDetails(roomCode: string, token?: string | null): Promise<RoomDetails> {
  const headers = await getAuthHeaders(token);
  const res = await fetch(apiUrl(`/v1/rooms/${roomCode}`), {
    headers,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to fetch room details');
  }
  return res.json();
}

export async function joinRoom(
  roomCode: string,
  password?: string,
  token?: string | null
): Promise<JoinRoomResponse> {
  const headers = await getAuthHeaders(token);
  const res = await fetch(apiUrl(`/v1/rooms/${roomCode}/join`), {
    method: 'POST',
    headers,
    body: JSON.stringify({ password }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to join room');
  }
  return res.json();
}

export async function leaveRoom(roomCode: string, token?: string | null): Promise<void> {
  const headers = await getAuthHeaders(token);
  const res = await fetch(apiUrl(`/v1/rooms/${roomCode}/leave`), {
    method: 'POST',
    headers,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to leave room');
  }
}

export async function getRoomMembers(roomCode: string, token?: string | null) {
  const headers = await getAuthHeaders(token);
  const res = await fetch(apiUrl(`/v1/rooms/${roomCode}/members`), {
    headers,
  });
  if (!res.ok) {
    throw new Error('Failed to fetch room members');
  }
  return res.json();
}

export async function getRoomMessages(roomCode: string, token?: string | null) {
  const headers = await getAuthHeaders(token);
  const res = await fetch(apiUrl(`/v1/rooms/${roomCode}/messages`), {
    headers,
  });
  if (!res.ok) {
    throw new Error('Failed to fetch room messages');
  }
  return res.json();
}

export async function endRoom(roomCode: string, token?: string | null): Promise<void> {
  const headers = await getAuthHeaders(token);
  const res = await fetch(apiUrl(`/v1/rooms/${roomCode}/end`), {
    method: 'POST',
    headers,
  });
  if (!res.ok) {
    throw new Error('Failed to end room');
  }
}

export async function lockRoom(roomCode: string, token?: string | null): Promise<void> {
  const headers = await getAuthHeaders(token);
  const res = await fetch(apiUrl(`/v1/rooms/${roomCode}/lock`), {
    method: 'POST',
    headers,
  });
  if (!res.ok) {
    throw new Error('Failed to lock room');
  }
}

export async function unlockRoom(roomCode: string, token?: string | null): Promise<void> {
  const headers = await getAuthHeaders(token);
  const res = await fetch(apiUrl(`/v1/rooms/${roomCode}/unlock`), {
    method: 'POST',
    headers,
  });
  if (!res.ok) {
    throw new Error('Failed to unlock room');
  }
}

export async function kickMember(roomCode: string, userId: number, token?: string | null): Promise<void> {
  const headers = await getAuthHeaders(token);
  const res = await fetch(apiUrl(`/v1/rooms/${roomCode}/members/${userId}/kick`), {
    method: 'POST',
    headers,
  });
  if (!res.ok) {
    throw new Error('Failed to kick member');
  }
}
