// Every API call goes through here. A hardcoded http://localhost:8000 in a
// component works in dev and breaks the instant it is deployed.
const BASE = (import.meta.env.VITE_API_URL ?? '') + '/api';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) {
    let detail = res.statusText;
    try {
      const body = (await res.json()) as { detail?: string };
      if (body?.detail) detail = body.detail;
    } catch {
      // ignore — non-JSON error body
    }
    throw new Error(`${res.status} ${detail}`);
  }
  // 204 No Content
  if (res.status === 204) return undefined as unknown as T;
  return (await res.json()) as T;
}

export async function getJson<T>(path: string): Promise<T> {
  return request<T>(path);
}

export async function postJson<T>(path: string, body: unknown): Promise<T> {
  return request<T>(path, { method: 'POST', body: JSON.stringify(body) });
}

export async function putJson<T>(path: string, body: unknown): Promise<T> {
  return request<T>(path, { method: 'PUT', body: JSON.stringify(body) });
}

export async function del(path: string): Promise<void> {
  await request<void>(path, { method: 'DELETE' });
}

// ---------- Notes API ----------

export interface Note {
  id: number;
  title: string;
  body: string;
  created_at: string;
  updated_at: string;
}

export interface NoteInput {
  title: string;
  body: string;
}

export const notesApi = {
  list: () => getJson<Note[]>('/notes'),
  get: (id: number) => getJson<Note>(`/notes/${id}`),
  create: (input: NoteInput) => postJson<Note>('/notes', input),
  update: (id: number, input: NoteInput) => putJson<Note>(`/notes/${id}`, input),
  remove: (id: number) => del(`/notes/${id}`),
};
