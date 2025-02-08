import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "test-vault/publish.ts",
      formats: ["es"],
      fileName: () => "publish.js",
    },
    outDir: "test-vault",
    emptyOutDir: false,
    rollupOptions: {
      external: ["publish", "document", "window", "HTMLElement"],
    },
  },
});
