/**
 * Browser-compatible shim for @tauri-apps/api/path
 * Returns simulated paths for browser environment
 */

/**
 * Get the home directory path
 * In browser, returns a simulated path
 */
export async function homeDir(): Promise<string> {
  return '/home/user';
}

/**
 * Get the config directory path
 */
export async function configDir(): Promise<string> {
  return '/home/user/.config';
}

/**
 * Get the data directory path
 */
export async function dataDir(): Promise<string> {
  return '/home/user/.local/share';
}

/**
 * Get the cache directory path
 */
export async function cacheDir(): Promise<string> {
  return '/home/user/.cache';
}

/**
 * Get the desktop directory path
 */
export async function desktopDir(): Promise<string> {
  return '/home/user/Desktop';
}

/**
 * Get the documents directory path
 */
export async function documentDir(): Promise<string> {
  return '/home/user/Documents';
}

/**
 * Get the downloads directory path
 */
export async function downloadDir(): Promise<string> {
  return '/home/user/Downloads';
}

/**
 * Get the pictures directory path
 */
export async function pictureDir(): Promise<string> {
  return '/home/user/Pictures';
}

/**
 * Get the music directory path
 */
export async function audioDir(): Promise<string> {
  return '/home/user/Music';
}

/**
 * Get the video directory path
 */
export async function videoDir(): Promise<string> {
  return '/home/user/Videos';
}

/**
 * Get the temp directory path
 */
export async function tempDir(): Promise<string> {
  return '/tmp';
}

/**
 * Get the current working directory
 */
export async function currentDir(): Promise<string> {
  return '/home/user';
}

/**
 * Get the executable directory
 */
export async function exeDir(): Promise<string> {
  return '/usr/bin';
}

/**
 * Get the app config directory
 */
export async function appConfigDir(): Promise<string> {
  return '/home/user/.config/cockpit-tools';
}

/**
 * Get the app data directory
 */
export async function appDataDir(): Promise<string> {
  return '/home/user/.local/share/cockpit-tools';
}

/**
 * Get the app cache directory
 */
export async function appCacheDir(): Promise<string> {
  return '/home/user/.cache/cockpit-tools';
}

/**
 * Get the app log directory
 */
export async function appLogDir(): Promise<string> {
  return '/home/user/.local/share/cockpit-tools/logs';
}

/**
 * Join path segments with the platform separator
 * In browser, we assume Unix-style paths
 */
export function join(...paths: string[]): string {
  const parts: string[] = [];
  
  for (const path of paths) {
    if (!path) continue;
    
    // Handle absolute paths - they reset the accumulated path
    if (path.startsWith('/')) {
      parts.length = 0;
    }
    
    // Split and add parts
    const segments = path.split('/').filter((s) => s !== '' && s !== '.');
    parts.push(...segments);
  }
  
  return '/' + parts.join('/');
}

/**
 * Get the base name of a path
 */
export function basename(path: string, ext?: string): string {
  const parts = path.split('/').filter((p) => p !== '');
  let base = parts[parts.length - 1] || '';
  
  if (ext && base.endsWith(ext)) {
    base = base.slice(0, -ext.length);
  }
  
  return base;
}

/**
 * Get the directory name of a path
 */
export function dirname(path: string): string {
  const parts = path.split('/').filter((p) => p !== '');
  parts.pop();
  return parts.length === 0 ? '/' : '/' + parts.join('/');
}

/**
 * Get the extension of a path
 */
export function extname(path: string): string {
  const base = basename(path);
  const dotIndex = base.lastIndexOf('.');
  if (dotIndex === 0 || dotIndex === -1) {
    return '';
  }
  return base.slice(dotIndex);
}

/**
 * Check if a path is absolute
 */
export function isAbsolute(path: string): boolean {
  return path.startsWith('/');
}

/**
 * Resolve a path to an absolute path
 */
export function resolve(...paths: string[]): string {
  let resolved = '';
  
  for (const path of paths) {
    if (path.startsWith('/')) {
      resolved = path;
    } else {
      resolved = join(resolved, path);
    }
  }
  
  // Handle .. and .
  const parts = resolved.split('/').filter((p) => p !== '');
  const result: string[] = [];
  
  for (const part of parts) {
    if (part === '..') {
      result.pop();
    } else if (part !== '.') {
      result.push(part);
    }
  }
  
  return '/' + result.join('/');
}

/**
 * Normalize a path
 */
export function normalize(path: string): string {
  return resolve(path);
}

/**
 * Get the separator character
 */
export const sep = '/';

/**
 * Get the delimiter character
 */
export const delimiter = ':';
