import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  base: '/Failureis/',
  plugins: [
    tailwindcss(),
    react(),
    {
      name: "figma-asset-fix",
      resolveId(id) {
        if (id.startsWith("figma:asset/")) {
          const filename = id.split("/").pop();
          return path.resolve(__dirname, `src/assets/${filename}`);
        }
        if (id.startsWith("src/assets/")) {
          return path.resolve(__dirname, id);
        }
      },
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
