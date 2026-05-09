/**
 * Browser-compatible shim for @tauri-apps/plugin-dialog
 */

export interface OpenDialogOptions {
  multiple?: boolean;
  filters?: Array<{ name: string; extensions: string[] }>;
  defaultPath?: string;
  directory?: boolean;
  recursive?: boolean;
  title?: string;
}

export interface SaveDialogOptions {
  defaultPath?: string;
  filters?: Array<{ name: string; extensions: string[] }>;
  title?: string;
}

export interface MessageDialogOptions {
  title?: string;
  kind?: 'info' | 'warning' | 'error';
  okLabel?: string;
}

export interface ConfirmDialogOptions {
  title?: string;
  okLabel?: string;
  cancelLabel?: string;
}

let fileInput: HTMLInputElement | null = null;

function createFileInput(options: OpenDialogOptions): HTMLInputElement {
  if (!fileInput) {
    fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.style.position = 'fixed';
    fileInput.style.left = '-9999px';
    fileInput.style.top = '-9999px';
    fileInput.style.opacity = '0';
    fileInput.style.pointerEvents = 'none';
    document.body.appendChild(fileInput);
  }

  fileInput.multiple = options.multiple ?? false;
  
  // @ts-ignore - webkitdirectory is not in TypeScript types
  fileInput.webkitdirectory = options.directory ?? false;
  // @ts-ignore
  fileInput.directory = options.directory ?? false;

  if (options.filters && options.filters.length > 0) {
    const acceptTypes = options.filters
      .map((f) => f.extensions.map((ext) => (ext === '*' ? '' : `.${ext}`)).join(','))
      .join(',');
    fileInput.accept = acceptTypes;
  } else {
    fileInput.accept = '';
  }

  return fileInput;
}

export async function open(
  options: OpenDialogOptions = {}
): Promise<string | string[] | null> {
  return new Promise((resolve) => {
    const input = createFileInput(options);
    let resolved = false;

    const cleanup = () => {
      input.value = '';
      resolved = true;
    };

    input.onchange = () => {
      if (resolved) return;
      cleanup();

      const files = Array.from(input.files || []);
      if (files.length === 0) {
        resolve(null);
        return;
      }

      const paths = files.map((file) => {
        // In browser, we return a fake path based on file name
        // The actual File object could be stored for later use
        return `/home/user/${file.webkitRelativePath || file.name}`;
      });

      if (options.multiple) {
        resolve(paths);
      } else {
        resolve(paths[0] || null);
      }
    };

    input.oncancel = () => {
      if (resolved) return;
      cleanup();
      resolve(null);
    };

    input.click();
  });
}

export async function save(
  options: SaveDialogOptions = {}
): Promise<string | null> {
  // Browser cannot programmatically choose save location
  // Return a simulated path
  const defaultName = options.defaultPath || 'file.txt';
  const filename = prompt('Enter filename to save:', defaultName);
  
  if (filename === null) {
    return null;
  }
  
  return `/home/user/Downloads/${filename}`;
}

export async function confirm(
  message: string,
  options: ConfirmDialogOptions = {}
): Promise<boolean> {
  const title = options.title ? `${options.title}\n\n` : '';
  return window.confirm(`${title}${message}`);
}

export async function message(
  msg: string,
  options: MessageDialogOptions = {}
): Promise<void> {
  const title = options.title || 'Message';
  
  // In browser, we can only use alert
  // The 'kind' parameter is ignored in browser
  window.alert(`${title}\n\n${msg}`);
}

export async function ask(
  message: string,
  options: ConfirmDialogOptions = {}
): Promise<boolean> {
  return confirm(message, options);
}
