import reactRefresh from "@vitejs/plugin-react-refresh";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  build: {
    brotliSize: false,
  },
  plugins: [
    tsconfigPaths(),
    reactRefresh(),
    VitePWA({
      workbox: {
        additionalManifestEntries: [
          {
            url:
              "https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap",
            // eslint-disable-next-line unicorn/no-null
            revision: null,
          },
        ],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
        navigateFallback: undefined,
      },
      manifest: {
        name: "Storj Box Lite",
        short_name: "Storj Box Lite",
        theme_color: "#0055C6",
        icons: [
          {
            src: "/android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: "/android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
});
