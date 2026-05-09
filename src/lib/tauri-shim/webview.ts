/**
 * Browser-compatible shim for @tauri-apps/api/webview
 */

import { getCurrentWindow, type Window } from './window';

export interface WebviewOptions {
  label?: string;
  url?: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  transparent?: boolean;
  visible?: boolean;
}

class Webview {
  public label: string;
  public window: Window;

  constructor(label = 'main') {
    this.label = label;
    this.window = getCurrentWindow();
  }

  /**
   * Set webview size (browser stub)
   */
  async setSize(_width: number, _height: number): Promise<void> {
    console.debug('webview.setSize() called - no-op in browser');
  }

  /**
   * Set webview position (browser stub)
   */
  async setPosition(_x: number, _y: number): Promise<void> {
    console.debug('webview.setPosition() called - no-op in browser');
  }

  /**
   * Get webview size
   */
  async size(): Promise<{ width: number; height: number }> {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }

  /**
   * Get webview position (browser stub)
   */
  async position(): Promise<{ x: number; y: number }> {
    return { x: 0, y: 0 };
  }

  /**
   * Set webview zoom (browser uses CSS zoom)
   */
  async setZoom(_scaleFactor: number): Promise<void> {
    document.body.style.zoom = String(_scaleFactor);
  }

  /**
   * Clear all browsing data (browser stub)
   */
  async clearAllBrowsingData(): Promise<void> {
    console.debug('webview.clearAllBrowsingData() called - no-op in browser');
  }

  /**
   * Navigate to URL
   */
  async navigate(url: string): Promise<void> {
    window.location.href = url;
  }

  /**
   * Reload the webview
   */
  async reload(): Promise<void> {
    window.location.reload();
  }
}

// Singleton instance
let _webviewInstance: Webview | null = null;

/**
 * Get the current webview instance
 */
export function getCurrentWebview(): Webview {
  if (!_webviewInstance) {
    _webviewInstance = new Webview('main');
  }
  return _webviewInstance;
}

/**
 * Get a webview by label (browser stub)
 */
export async function getWebview(label: string): Promise<Webview | null> {
  if (label === 'main') {
    return getCurrentWebview();
  }
  return null;
}

/**
 * Get all webviews (browser stub)
 */
export async function getAllWebviews(): Promise<Webview[]> {
  return [getCurrentWebview()];
}

/**
 * Create a new webview (browser stub)
 */
export async function createWebview(options: WebviewOptions): Promise<Webview> {
  if (options.url) {
    window.open(options.url, '_blank');
  }
  return new Webview(options.label || 'new-webview');
}

/**
 * Current webview convenience alias
 */
export const currentWebview: Webview = getCurrentWebview();

// Re-export Webview class
export { Webview };
