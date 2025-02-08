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
      external: ["document", "window", "HTMLElement"],
    },
  },
  define: {
    Buffer: ["{}", "Buffer"],
    "process.env.NODE_DEBUG": "false",
  },
});
