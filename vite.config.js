import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const rootDir = fileURLToPath(new URL(".", import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  build: {
    chunkSizeWarningLimit: 650,
    rollupOptions: {
      input: {
        main: resolve(rootDir, "index.html"),
        certifications: resolve(rootDir, "certifications.html"),
      },
    },
  },
  plugins: [react()],
});
