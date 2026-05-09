/**
 * Browser-compatible shim for @tauri-apps/api
 * Re-exports all Tauri API modules with browser-compatible implementations
 */

export * from './core';
export * from './event';
export * from './app';
export * from './window';
export * from './webview';
export * from './dpi';
export * from './path';

export * as dialog from './plugins/dialog';
export * as fs from './plugins/fs';
export * as opener from './plugins/opener';
export * as updater from './plugins/updater';
export * as process from './plugins/process';
export * as notification from './plugins/notification';

/**
 * Check if running in a real Tauri environment
 */
export function isTauri(): boolean {
  return '__TAURI__' in window;
}

/**
 * Check if running in browser mode (using shims)
 */
export function isBrowser(): boolean {
  return !isTauri();
}
