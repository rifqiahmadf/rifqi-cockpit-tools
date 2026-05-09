/**
 * Browser-compatible shim for @tauri-apps/plugin-process
 */

export async function exit(code?: number): Promise<void> {
  console.warn(`exit(${code ?? 0}) not supported in browser`);
}

export async function relaunch(): Promise<void> {
  window.location.reload();
}

export async function restart(): Promise<void> {
  window.location.reload();
}
