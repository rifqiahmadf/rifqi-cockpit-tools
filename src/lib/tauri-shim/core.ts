/**
 * Browser-compatible shim for @tauri-apps/api/core
 * Routes invoke() calls to fetch('/api/invoke')
 */

const API_BASE_URL = (import.meta as unknown as { env: Record<string, string> }).env.VITE_API_BASE_URL || '/api';

export interface InvokeOptions {
  signal?: AbortSignal;
}

/**
 * Invoke a Tauri command via HTTP POST to /api/invoke
 * @param command - The command name to invoke
 * @param args - Optional arguments to pass to the command
 * @param options - Optional invoke options (e.g., AbortSignal)
 * @returns Promise resolving to the command result
 */
export async function invoke<T>(
  command: string,
  args?: Record<string, unknown>,
  options?: InvokeOptions
): Promise<T> {
  const url = `${API_BASE_URL}/invoke`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ command, args }),
    signal: options?.signal,
  });

  if (!response.ok) {
    let errorMessage = `HTTP error ${response.status}`;
    try {
      const errorData = await response.json();
      if (errorData.error) {
        errorMessage = errorData.error;
      }
    } catch {
      // Ignore JSON parse errors for error response
    }
    throw new Error(errorMessage);
  }

  const data = await response.json();
  return data.result as T;
}

/**
 * Convert a file URL to a path (browser stub)
 * In browser context, returns the URL as-is
 */
export function convertFileSrc(filePath: string, _protocol = 'asset'): string {
  if (filePath.startsWith('http://') || filePath.startsWith('https://') || filePath.startsWith('data:')) {
    return filePath;
  }
  return `${API_BASE_URL}/asset?path=${encodeURIComponent(filePath)}`;
}
