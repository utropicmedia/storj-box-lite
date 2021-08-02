import reactRefresh from "@vitejs/plugin-react-refresh";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import svgr from "vite-plugin-svgr";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  // build: {
  //   brotliSize: false,
  // },
  plugins: [
    tsconfigPaths(),
    reactRefresh(),
    svgr(),
    VitePWA({
      workbox: {
        additionalManifestEntries: [
          {
            url: "https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap",
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
  // FIXME: This is a hack to fix aws sdk issues with rollup: https://github.com/aws-amplify/amplify-js/issues/7499#issuecomment-804386820
  resolve: {
    alias: [
      {
        find: "./runtimeConfig",
        replacement: "./runtimeConfig.browser",
      },
    ],
  },
  // TODO: Should we do this? The largest chunk is smaller than the limit, but there are more files.
  // build: {
  //   rollupOptions: {
  //     output: {
  //       manualChunks(id) {
  //         if (id.includes("lodash")) {
  //           return "lodash";
  //         }
  //         if (id.includes("@redux/toolkit")) {
  //           return "reduxToolkit";
  //         }
  //         if (id.includes("@aws-sdk")) {
  //           return "awsSdk";
  //         }
  //         if (id.includes("firebase/auth")) {
  //           return "firebaseAuth";
  //         }
  //         if (id.includes("firebase/firestore")) {
  //           return "firebaseFirestore";
  //         }
  //         if (id.includes("firebase/app")) {
  //           return "firebaseApp";
  //         }
  //       },
  //     },
  //   },
  // },
});
