import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { unitLoaderPlugin } from "wafer-host/vite-plugin";
import { unitSourceUrls } from "./src/unit-source-urls.ts";

export default defineConfig({
  appType: "mpa",
  plugins: [
    react(),
    unitLoaderPlugin({ unitSourceUrls, cacheFolderPath: "./.wafer-cache" }),
  ],
  define: {
    __CfPagesUrl: JSON.stringify(process.env.CF_PAGES_URL || ""),
    __CfPagesCommitSha: JSON.stringify(process.env.CF_PAGES_COMMIT_SHA || ""),
    __CfPagesBranch: JSON.stringify(process.env.CF_PAGES_BRANCH || ""),
  },
  resolve: {
    preserveSymlinks: false,
    tsconfigPaths: true,
    dedupe: ["react", "react-dom"],
  },
  server: { port: 3004, host: "0.0.0.0" },
});
