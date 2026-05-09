/**
 * Browser-compatible shim for @tauri-apps/api/app
 */

const API_BASE_URL = (import.meta as unknown as { env: Record<string, string> }).env.VITE_API_BASE_URL || '/api';

/**
 * Get the application version
 * @returns Promise resolving to the app version string
 */
export async function getVersion(): Promise<string> {
  try {
    const response = await fetch(`${API_BASE_URL}/version`);
    if (!response.ok) {
      return '0.0.0';
    }
    const data = await response.json();
    return data.version || '0.0.0';
  } catch {
    return '0.0.0';
  }
}

/**
 * Get the application name
 * @returns Promise resolving to the app name
 */
export async function getName(): Promise<string> {
  try {
    const response = await fetch(`${API_BASE_URL}/app-info`);
    if (!response.ok) {
      return 'Cockpit Tools';
    }
    const data = await response.json();
    return data.name || 'Cockpit Tools';
  } catch {
    return 'Cockpit Tools';
  }
}

/**
 * Get the application tauri version (browser stub)
 * @returns Promise resolving to '0.0.0' (not applicable in browser)
 */
export async function getTauriVersion(): Promise<string> {
  return '0.0.0-browser-shim';
}

/**
 * Hide the application (browser stub - no-op)
 */
export async function hide(): Promise<void> {
  // No-op in browser
  console.debug('hide() called - no-op in browser');
}

/**
 * Show the application (browser stub - no-op)
 */
export async function show(): Promise<void> {
  // No-op in browser
  console.debug('show() called - no-op in browser');
}

/**
 * Set the app theme (browser stub)
 */
export async function setTheme(_theme: 'light' | 'dark' | 'system'): Promise<void> {
  // In browser, we can use CSS media queries or localStorage
  console.debug('setTheme() called - use browser prefers-color-scheme instead');
}

/**
 * Get the default window icon (browser stub)
 */
export async function getDefaultWindowIcon(): Promise<string | null> {
  return null;
}
