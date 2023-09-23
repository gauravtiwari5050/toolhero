import { defineConfig } from "vite";
import { fileURLToPath } from "url";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    modulePreload: false,
    rollupOptions: {
      input: {
        /*tool: fileURLToPath(
          new URL("./src/appsForPages/tool/tool.html", import.meta.url)
        ),*/
        login: fileURLToPath(
          new URL("./src/appsForPages/login/login.html", import.meta.url)
        ),
      },
      output: {
        inlineDynamicImports: true,
      },
    },
  },
});
