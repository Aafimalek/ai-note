import { Note } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}/api${endpoint}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const data: ApiResponse<T> = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error || 'API request failed');
  }

  return data.data as T;
}

export const notesApi = {
  // Get all notes
  getAll: async (): Promise<Note[]> => {
    const notes = await apiRequest<Note[]>('/notes');
    return notes.map((note) => ({
      ...note,
      updatedAt: new Date(note.updatedAt),
      createdAt: note.createdAt ? new Date(note.createdAt) : new Date(note.updatedAt),
    }));
  },

  // Get a single note
  getOne: async (noteId: string): Promise<Note> => {
    const note = await apiRequest<Note>(`/notes/${noteId}`);
    return {
      ...note,
      updatedAt: new Date(note.updatedAt),
      createdAt: note.createdAt ? new Date(note.createdAt) : new Date(note.updatedAt),
    };
  },

  // Create a note
  create: async (note: Omit<Note, 'id' | 'updatedAt' | 'createdAt'>): Promise<Note> => {
    const created = await apiRequest<Note>('/notes', {
      method: 'POST',
      body: JSON.stringify(note),
    });
    return {
      ...created,
      updatedAt: new Date(created.updatedAt),
      createdAt: created.createdAt ? new Date(created.createdAt) : new Date(created.updatedAt),
    };
  },

  // Update a note
  update: async (
    noteId: string,
    updates: Partial<Omit<Note, 'id' | 'userId' | 'updatedAt' | 'createdAt'>>
  ): Promise<Note> => {
    const updated = await apiRequest<Note>(`/notes/${noteId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
    return {
      ...updated,
      updatedAt: new Date(updated.updatedAt),
      createdAt: updated.createdAt ? new Date(updated.createdAt) : new Date(updated.updatedAt),
    };
  },

  // Delete a note
  delete: async (noteId: string): Promise<void> => {
    await apiRequest<void>(`/notes/${noteId}`, {
      method: 'DELETE',
    });
  },

  // Toggle pin
  togglePin: async (noteId: string): Promise<Note> => {
    const updated = await apiRequest<Note>(`/notes/${noteId}/pin`, {
      method: 'PATCH',
    });
    return {
      ...updated,
      updatedAt: new Date(updated.updatedAt),
      createdAt: updated.createdAt ? new Date(updated.createdAt) : new Date(updated.updatedAt),
    };
  },

  // Add tag
  addTag: async (noteId: string, tag: string): Promise<Note> => {
    const updated = await apiRequest<Note>(`/notes/${noteId}/tags`, {
      method: 'POST',
      body: JSON.stringify({ tag }),
    });
    return {
      ...updated,
      updatedAt: new Date(updated.updatedAt),
      createdAt: updated.createdAt ? new Date(updated.createdAt) : new Date(updated.updatedAt),
    };
  },

  // Remove tag
  removeTag: async (noteId: string, tag: string): Promise<Note> => {
    const updated = await apiRequest<Note>(`/notes/${noteId}/tags?tag=${encodeURIComponent(tag)}`, {
      method: 'DELETE',
    });
    return {
      ...updated,
      updatedAt: new Date(updated.updatedAt),
      createdAt: updated.createdAt ? new Date(updated.createdAt) : new Date(updated.updatedAt),
    };
  },
};



const BACKEND_API_URL = (process.env.NEXT_PUBLIC_BACKEND_URL || 'https://ai-note-silk.vercel.app').replace(/\/$/, '');

async function backendRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${BACKEND_API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || 'Backend API request failed');
  }

  return data as T;
}

export const backendApi = {
  glossary: async (text: string): Promise<Record<string, string>> => {
    return backendRequest('/ai/glossary', {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  },

  summary: async (text: string): Promise<{ summary: string }> => {
    return backendRequest('/ai/summary', {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  },

  suggestTags: async (text: string): Promise<{ tags: string[] }> => {
    return backendRequest('/ai/tags', {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  },

  checkGrammar: async (text: string): Promise<{ corrected_text: string }> => {
    return backendRequest('/ai/grammar', {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  },

  translate: async (text: string, targetLanguage: string): Promise<{ translation: string }> => {
    return backendRequest('/ai/translate', {
      method: 'POST',
      body: JSON.stringify({ text, target_language: targetLanguage }),
    });
  },

  encrypt: async (text: string): Promise<{ encrypted_text: string }> => {
    return backendRequest('/security/encrypt', {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  },

  decrypt: async (text: string): Promise<{ decrypted_text: string }> => {
    return backendRequest('/security/decrypt', {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  },
};
