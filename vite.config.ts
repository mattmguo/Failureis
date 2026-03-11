import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/Failureis/",
  plugins: [
    react(),
    {
      name: "figma-asset-fix",
      resolveId(id) {
        if (id.startsWith("figma:asset/")) {
          const filename = id.split("/").pop();
          return `/src/assets/${filename}`;
        }
      },
    },
  ],
});