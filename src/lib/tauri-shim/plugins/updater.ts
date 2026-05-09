export interface UpdateInfo {
  available: boolean;
  version?: string;
  date?: string;
  body?: string;
}

export interface Update {
  available: boolean;
  version: string;
  date: string;
  body?: string;
  currentVersion: string;
  downloadAndInstall: () => Promise<void>;
}

export async function check(): Promise<Update | null> {
  return null;
}

export async function checkUpdate(): Promise<Update | null> {
  return check();
}
