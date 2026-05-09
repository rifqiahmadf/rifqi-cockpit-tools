/**
 * Browser-compatible shim for @tauri-apps/api/window
 * All window operations are no-ops or browser equivalents
 */

import type { UnlistenFn } from './event';

export interface WindowSize {
  width: number;
  height: number;
  type?: 'Logical' | 'Physical';
}

export interface WindowPosition {
  x: number;
  y: number;
  type?: 'Logical' | 'Physical';
}

export interface WindowOptions {
  label?: string;
  title?: string;
  url?: string;
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  fullscreen?: boolean;
  resizable?: boolean;
  maximizable?: boolean;
  minimizable?: boolean;
  closable?: boolean;
  decorations?: boolean;
  transparent?: boolean;
  alwaysOnTop?: boolean;
  visible?: boolean;
}

class WebWindow {
  public label: string;

  constructor(label = 'main') {
    this.label = label;
  }

  /**
   * Set the window title (updates document.title in browser)
   */
  async setTitle(title: string): Promise<void> {
    document.title = title;
  }

  /**
   * Close the window (browser stub)
   */
  async close(): Promise<void> {
    console.debug('close() called - cannot close browser window programmatically');
  }

  /**
   * Minimize the window (browser stub)
   */
  async minimize(): Promise<void> {
    console.debug('minimize() called - no browser equivalent');
  }

  /**
   * Maximize the window (uses fullscreen in browser)
   */
  async maximize(): Promise<void> {
    try {
      await document.documentElement.requestFullscreen();
    } catch (error) {
      console.debug('maximize() failed:', error);
    }
  }

  /**
   * Unmaximize the window (exits fullscreen in browser)
   */
  async unmaximize(): Promise<void> {
    try {
      await document.exitFullscreen();
    } catch (error) {
      console.debug('unmaximize() failed:', error);
    }
  }

  /**
   * Toggle maximize state
   */
  async toggleMaximize(): Promise<void> {
    if (document.fullscreenElement) {
      await this.unmaximize();
    } else {
      await this.maximize();
    }
  }

  /**
   * Check if window is maximized (checks fullscreen in browser)
   */
  async isMaximized(): Promise<boolean> {
    return document.fullscreenElement !== null;
  }

  /**
   * Show the window (browser stub)
   */
  async show(): Promise<void> {
    document.body.style.visibility = 'visible';
  }

  /**
   * Hide the window (browser stub)
   */
  async hide(): Promise<void> {
    document.body.style.visibility = 'hidden';
  }

  /**
   * Set window size (browser stub)
   */
  async setSize(_size: WindowSize): Promise<void> {
    console.debug('setSize() called - cannot resize browser window programmatically');
  }

  /**
   * Get window size
   */
  async innerSize(): Promise<WindowSize> {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
      type: 'Logical',
    };
  }

  /**
   * Set window position (browser stub)
   */
  async setPosition(_position: WindowPosition): Promise<void> {
    console.debug('setPosition() called - cannot move browser window programmatically');
  }

  /**
   * Get window position (browser stub)
   */
  async outerPosition(): Promise<WindowPosition> {
    return {
      x: window.screenX,
      y: window.screenY,
      type: 'Logical',
    };
  }

  /**
   * Check if window is visible
   */
  async isVisible(): Promise<boolean> {
    return document.visibilityState === 'visible';
  }

  /**
   * Set always on top (browser stub)
   */
  async setAlwaysOnTop(_value: boolean): Promise<void> {
    console.debug('setAlwaysOnTop() called - no browser equivalent');
  }

  /**
   * Set decorations (browser stub)
   */
  async setDecorations(_value: boolean): Promise<void> {
    console.debug('setDecorations() called - no browser equivalent');
  }

  /**
   * Listen for window close request
   */
  async onCloseRequested(handler: () => void): Promise<UnlistenFn> {
    const wrappedHandler = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      handler();
    };
    window.addEventListener('beforeunload', wrappedHandler);
    return () => {
      window.removeEventListener('beforeunload', wrappedHandler);
    };
  }

  /**
   * Listen for window events
   */
  async listen<T>(eventName: string, handler: (event: T) => void): Promise<UnlistenFn> {
    const eventMap: Record<string, string> = {
      'focus': 'focus',
      'blur': 'blur',
      'resize': 'resize',
    };

    const browserEvent = eventMap[eventName];
    if (browserEvent) {
      const wrappedHandler = () => handler({} as T);
      window.addEventListener(browserEvent, wrappedHandler);
      return () => window.removeEventListener(browserEvent, wrappedHandler);
    }

    // Return no-op unlisten for unsupported events
    return () => {};
  }

  /**
   * Focus the window
   */
  async setFocus(): Promise<void> {
    window.focus();
  }

  /**
   * Get window scale factor (browser stub)
   */
  async scaleFactor(): Promise<number> {
    return window.devicePixelRatio;
  }
}

// Singleton instance
let currentWindow: WebWindow | null = null;

/**
 * Get the current window instance
 */
export function getCurrentWindow(): WebWindow {
  if (!currentWindow) {
    currentWindow = new WebWindow('main');
  }
  return currentWindow;
}

/**
 * Get a window by label (browser stub - always returns main window)
 */
export async function getWindow(label: string): Promise<WebWindow | null> {
  if (label === 'main') {
    return getCurrentWindow();
  }
  return null;
}

/**
 * Get all windows (browser stub - always returns just main)
 */
export async function getAllWindows(): Promise<WebWindow[]> {
  return [getCurrentWindow()];
}

/**
 * Create a new window (browser stub - opens new tab)
 */
export async function createWindow(options: WindowOptions): Promise<WebWindow> {
  if (options.url) {
    window.open(options.url, '_blank');
  }
  return new WebWindow(options.label || 'new-window');
}

/**
 * Current window convenience alias
 */
export const appWindow = getCurrentWindow();

// Re-export Window class type
export { WebWindow as Window };
