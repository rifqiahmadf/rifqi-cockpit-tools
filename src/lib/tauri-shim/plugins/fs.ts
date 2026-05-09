/**
 * Browser-compatible shim for @tauri-apps/plugin-fs
 */

const API_BASE_URL = (import.meta as unknown as { env: Record<string, string> }).env.VITE_API_BASE_URL || '/api';

export interface ReadTextFileOptions {
  signal?: AbortSignal;
}

export interface WriteTextFileOptions {
  signal?: AbortSignal;
}

export interface MkdirOptions {
  recursive?: boolean;
  signal?: AbortSignal;
}

export interface RemoveOptions {
  recursive?: boolean;
  signal?: AbortSignal;
}

export async function readTextFile(
  path: string,
  options?: ReadTextFileOptions
): Promise<string> {
  const url = `${API_BASE_URL}/fs/read?path=${encodeURIComponent(path)}`;
  const response = await fetch(url, { signal: options?.signal });

  if (!response.ok) {
    throw new Error(`Failed to read file: HTTP ${response.status}`);
  }

  const data = await response.json();
  return data.content;
}

export async function writeTextFile(
  path: string,
  content: string,
  options?: WriteTextFileOptions
): Promise<void> {
  const url = `${API_BASE_URL}/fs/write`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path, content }),
    signal: options?.signal,
  });

  if (!response.ok) {
    throw new Error(`Failed to write file: HTTP ${response.status}`);
  }
}

export async function exists(path: string): Promise<boolean> {
  try {
    const url = `${API_BASE_URL}/fs/exists?path=${encodeURIComponent(path)}`;
    const response = await fetch(url);

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    return data.exists === true;
  } catch {
    return false;
  }
}

export async function mkdir(
  path: string,
  options?: MkdirOptions
): Promise<void> {
  const url = `${API_BASE_URL}/fs/mkdir`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path, recursive: options?.recursive ?? false }),
    signal: options?.signal,
  });

  if (!response.ok) {
    throw new Error(`Failed to create directory: HTTP ${response.status}`);
  }
}

export async function remove(path: string, options?: RemoveOptions): Promise<void> {
  const url = `${API_BASE_URL}/fs/remove`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ path, recursive: options?.recursive ?? false }),
    signal: options?.signal,
  });

  if (!response.ok) {
    throw new Error(`Failed to remove: HTTP ${response.status}`);
  }
}

export async function readDir(path: string): Promise<Array<{ name: string; isDirectory: boolean }>> {
  const url = `${API_BASE_URL}/fs/read-dir?path=${encodeURIComponent(path)}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to read directory: HTTP ${response.status}`);
  }

  const data = await response.json();
  return data.entries || [];
}

export async function copyFile(from: string, to: string): Promise<void> {
  const url = `${API_BASE_URL}/fs/copy`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to }),
  });

  if (!response.ok) {
    throw new Error(`Failed to copy file: HTTP ${response.status}`);
  }
}

export async function renameFile(oldPath: string, newPath: string): Promise<void> {
  const url = `${API_BASE_URL}/fs/rename`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ oldPath, newPath }),
  });

  if (!response.ok) {
    throw new Error(`Failed to rename file: HTTP ${response.status}`);
  }
}

export async function stat(path: string): Promise<{ isFile: boolean; isDirectory: boolean; size: number; modifiedAt: string }> {
  const url = `${API_BASE_URL}/fs/stat?path=${encodeURIComponent(path)}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to stat: HTTP ${response.status}`);
  }

  return response.json();
}
