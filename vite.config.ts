import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import { unitLoaderPlugin } from "wafer-host/vite-plugin";
import { getUnitSourceUrls } from "./src/unit-source-urls.ts";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const debugUseLocalUnits = !!env.DEBUG_USE_LOCAL_UNITS;
  return {
    appType: "mpa",
    plugins: [
      react(),
      unitLoaderPlugin({
        unitSourceUrls: getUnitSourceUrls(debugUseLocalUnits),
        cacheFolderPath: "./.wafer-cache",
      }),
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
    server: {
      port: 3004,
      host: "0.0.0.0",
      watch: { ignored: ["**/.wafer-cache/**"] },
    },
  };
});
