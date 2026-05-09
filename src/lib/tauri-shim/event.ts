const API_BASE_URL = (import.meta as unknown as { env: Record<string, string> }).env.VITE_API_BASE_URL || '/api';

export type EventTarget =
  | { kind: 'Any' }
  | { kind: 'AnyLabel'; label: string }
  | { kind: 'App' }
  | { kind: 'Window'; label: string }
  | { kind: 'Webview'; label: string }
  | { kind: 'WebviewWindow'; label: string };

export interface Event<T> {
  event: EventName;
  id: number;
  payload: T;
}

export type EventCallback<T> = (event: Event<T>) => void;
export type UnlistenFn = () => void;
export type EventName = `${TauriEvent}` | (string & Record<never, never>);

export interface Options {
  target?: string | EventTarget;
}

export enum TauriEvent {
  WINDOW_RESIZED = 'tauri://resize',
  WINDOW_MOVED = 'tauri://move',
  WINDOW_CLOSE_REQUESTED = 'tauri://close-requested',
  WINDOW_DESTROYED = 'tauri://destroyed',
  WINDOW_FOCUS = 'tauri://focus',
  WINDOW_BLUR = 'tauri://blur',
  WINDOW_SCALE_FACTOR_CHANGED = 'tauri://scale-change',
  WINDOW_THEME_CHANGED = 'tauri://theme-changed',
  WINDOW_CREATED = 'tauri://window-created',
  WEBVIEW_CREATED = 'tauri://webview-created',
  DRAG_ENTER = 'tauri://drag-enter',
  DRAG_OVER = 'tauri://drag-over',
  DRAG_DROP = 'tauri://drag-drop',
  DRAG_LEAVE = 'tauri://drag-leave',
}

const sseConnections = new Map<string, EventSource>();
const sseHandlers = new Map<string, Set<(event: Event<unknown>) => void>>();

export async function listen<T>(
  eventName: string,
  handler: (event: Event<T>) => void,
  _options?: Options,
): Promise<UnlistenFn> {
  if (!sseHandlers.has(eventName)) {
    sseHandlers.set(eventName, new Set());
  }
  const handlers = sseHandlers.get(eventName)!;
  handlers.add(handler as (event: Event<unknown>) => void);

  if (!sseConnections.has(eventName)) {
    const url = `${API_BASE_URL}/events?channel=${encodeURIComponent(eventName)}`;
    const eventSource = new EventSource(url);

    eventSource.onmessage = (message) => {
      try {
        const data = JSON.parse(message.data) as Event<T>;
        const eventHandlers = sseHandlers.get(eventName);
        if (eventHandlers) {
          eventHandlers.forEach((h) => h(data));
        }
      } catch (error) {
        console.error('Failed to parse SSE message:', error);
      }
    };

    eventSource.onerror = () => {
      // SSE reconnects automatically; suppress noisy error logs
    };

    sseConnections.set(eventName, eventSource);
  }

  return () => {
    const currentHandlers = sseHandlers.get(eventName);
    if (currentHandlers) {
      currentHandlers.delete(handler as (event: Event<unknown>) => void);
      if (currentHandlers.size === 0) {
        const connection = sseConnections.get(eventName);
        if (connection) {
          connection.close();
          sseConnections.delete(eventName);
        }
        sseHandlers.delete(eventName);
      }
    }
  };
}

export async function once<T>(
  eventName: string,
  handler: (event: Event<T>) => void,
  options?: Options,
): Promise<UnlistenFn> {
  let unlisten: UnlistenFn | null = null;

  const wrappedHandler = (event: Event<T>) => {
    handler(event);
    if (unlisten) {
      unlisten();
    }
  };

  unlisten = await listen(eventName, wrappedHandler, options);
  return unlisten;
}

export async function emit(eventName: string, payload?: unknown): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/events/emit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ event: eventName, payload }),
  });

  if (!response.ok) {
    throw new Error(`Failed to emit event: HTTP ${response.status}`);
  }
}

export async function emitTo(
  _target: string | EventTarget,
  eventName: string,
  payload?: unknown,
): Promise<void> {
  await emit(eventName, payload);
}
