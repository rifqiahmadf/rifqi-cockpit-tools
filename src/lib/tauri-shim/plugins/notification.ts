/**
 * Browser-compatible shim for @tauri-apps/plugin-notification
 */

export interface NotificationOptions {
  title: string;
  body?: string;
  icon?: string;
  tag?: string;
  data?: unknown;
}

export interface PermissionStatus {
  granted: boolean;
  denied: boolean;
}

export async function isPermissionGranted(): Promise<boolean> {
  if (!('Notification' in window)) {
    return false;
  }
  return Notification.permission === 'granted';
}

export async function requestPermission(): Promise<string> {
  if (!('Notification' in window)) {
    return 'denied';
  }
  return Notification.requestPermission();
}

export async function sendNotification(options: NotificationOptions | string): Promise<void> {
  const title = typeof options === 'string' ? options : options.title;
  const body = typeof options === 'string' ? undefined : options.body;

  if (!('Notification' in window)) {
    console.log(`[Notification] ${title}${body ? `: ${body}` : ''}`);
    return;
  }

  if (Notification.permission === 'granted') {
    new Notification(title, { body });
  } else if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      new Notification(title, { body });
    } else {
      console.log(`[Notification] ${title}${body ? `: ${body}` : ''}`);
    }
  } else {
    console.log(`[Notification] ${title}${body ? `: ${body}` : ''}`);
  }
}

export async function getNotificationPermissionStatus(): Promise<PermissionStatus> {
  if (!('Notification' in window)) {
    return { granted: false, denied: true };
  }

  return {
    granted: Notification.permission === 'granted',
    denied: Notification.permission === 'denied',
  };
}
