import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { unitLoaderPlugin } from "wafer-host/vite-plugin";
import { unitSourceUrls } from "./src/unit-source-urls";

export default defineConfig({
  appType: "mpa",
  plugins: [
    react(),
    tailwindcss(),
    unitLoaderPlugin({ unitSourceUrls, cacheFolderPath: "./.wafer-cache" }),
  ],
  define: {
    __CfPagesUrl: JSON.stringify(process.env.CF_PAGES_URL || "local-dev"),
    __CfPagesCommitSha: JSON.stringify(
      process.env.CF_PAGES_COMMIT_SHA || "local-dev",
    ),
    __CfPagesBranch: JSON.stringify(process.env.CF_PAGES_BRANCH || "local-dev"),
  },
  resolve: {
    preserveSymlinks: true,
    tsconfigPaths: true,
    dedupe: ["react", "react-dom"],
  },
  server: { port: 3004 },
});
