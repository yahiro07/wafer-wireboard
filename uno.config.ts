import { defineConfig } from "unocss";
import presetWind4 from "@unocss/preset-wind4";
import { uiColors } from "./src/common/theme";
import { transformerVariantGroup } from "unocss";

export default defineConfig({
  transformers: [transformerVariantGroup()],
  presets: [presetWind4()],
  theme: { colors: uiColors },
  configDeps: ["./src/components/ui-theme.ts"],
  shortcuts: [
    {
      "flex-h": "flex",
      "flex-hs": "flex items-start",
      "flex-ha": "flex items-center",
      "flex-v": "flex flex-col",
      "flex-vl": "flex flex-col items-start",
      "flex-va": "flex flex-col items-center",
      "flex-c": "flex items-center justify-center",
      "flex-vc": "flex flex-col items-center justify-center",
      "absolute-full": "absolute inset-0",
    },
    // bd-[#888] → border border-solid border-[#888]
    // bd-red-500 → border border-solid border-red-500
    [/^bd-(.+)$/, ([, c]) => `border border-solid border-${c}`],
  ],
});
