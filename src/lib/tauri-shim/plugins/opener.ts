/**
 * Browser-compatible shim for @tauri-apps/plugin-opener
 */

export async function openUrl(url: string): Promise<void> {
  window.open(url, '_blank', 'noopener,noreferrer');
}

export async function openPath(path: string): Promise<void> {
  console.debug('openPath() not supported in browser:', path);
}
