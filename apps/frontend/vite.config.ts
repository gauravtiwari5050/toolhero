import { defineConfig } from "vite";
import { fileURLToPath } from "url";
import svgr from "vite-plugin-svgr";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgr({})],
  build: {
    modulePreload: false,
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL("./src/main/main.html", import.meta.url)),
      },
      output: {
        inlineDynamicImports: true,
      },
    },
  },
});
