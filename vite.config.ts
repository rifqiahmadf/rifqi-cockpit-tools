import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// @ts-expect-error process is a nodejs global
const host = process.env.TAURI_DEV_HOST;

const tauriShimAliases = {
  "@tauri-apps/api/core": path.resolve(__dirname, "src/lib/tauri-shim/core.ts"),
  "@tauri-apps/api/event": path.resolve(__dirname, "src/lib/tauri-shim/event.ts"),
  "@tauri-apps/api/app": path.resolve(__dirname, "src/lib/tauri-shim/app.ts"),
  "@tauri-apps/api/window": path.resolve(__dirname, "src/lib/tauri-shim/window.ts"),
  "@tauri-apps/api/webview": path.resolve(__dirname, "src/lib/tauri-shim/webview.ts"),
  "@tauri-apps/api/dpi": path.resolve(__dirname, "src/lib/tauri-shim/dpi.ts"),
  "@tauri-apps/api/path": path.resolve(__dirname, "src/lib/tauri-shim/path.ts"),
  "@tauri-apps/plugin-dialog": path.resolve(__dirname, "src/lib/tauri-shim/plugins/dialog.ts"),
  "@tauri-apps/plugin-opener": path.resolve(__dirname, "src/lib/tauri-shim/plugins/opener.ts"),
  "@tauri-apps/plugin-fs": path.resolve(__dirname, "src/lib/tauri-shim/plugins/fs.ts"),
  "@tauri-apps/plugin-updater": path.resolve(__dirname, "src/lib/tauri-shim/plugins/updater.ts"),
  "@tauri-apps/plugin-process": path.resolve(__dirname, "src/lib/tauri-shim/plugins/process.ts"),
  "@tauri-apps/plugin-notification": path.resolve(__dirname, "src/lib/tauri-shim/plugins/notification.ts"),
};

export default defineConfig(async ({ mode }) => {
  const isBrowserMode = mode === "web" || mode === "browser";

  return {
    plugins: [react()],
    base: "./",

    resolve: {
      alias: isBrowserMode ? tauriShimAliases : {},
    },

    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules")) {
              if (
                id.includes("/react/") ||
                id.includes("/react-dom/") ||
                id.includes("/scheduler/")
              ) {
                return "react-vendor";
              }
              if (
                id.includes("/i18next/") ||
                id.includes("/react-i18next/")
              ) {
                return "i18n-vendor";
              }
              if (id.includes("/@tauri-apps/")) {
                return "tauri-vendor";
              }
              if (id.includes("/lucide-react/")) {
                return "ui-vendor";
              }
              return "vendor";
            }

            if (id.includes("/src/i18n/")) {
              return "i18n-core";
            }

            if (
              id.includes("/src/components/UpdateNotification") ||
              id.includes("/src/components/VersionJumpNotification") ||
              id.includes("/src/utils/updater")
            ) {
              return "update-flow";
            }
          },
        },
      },
    },

    clearScreen: false,
    server: {
      port: 1420,
      strictPort: true,
      host: host || false,
      hmr: host
        ? {
            protocol: "ws",
            host,
            port: 1421,
          }
        : undefined,
      watch: {
        ignored: ["**/src-tauri/**"],
      },
      proxy: isBrowserMode
        ? {
            "/api": {
              target: "http://localhost:3001",
              changeOrigin: true,
            },
          }
        : undefined,
    },
  };
});
