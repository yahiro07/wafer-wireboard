import { ReactUnitTemplateFn } from "wafer-host/react";
import { store } from "@/model/store";
import { hmrActions } from "@/periphery/hmr-handler";

export const createAdvancedControlUnit: ReactUnitTemplateFn = (
  unitInterface,
) => {
  unitInterface.completeSetup({
    unitAspects: { unitType: "sequencer" },
  });

  return {
    RenderUi() {
      //this unit shows optional ui for host app and directly refer app's store
      const { songKey } = store.useSnapshot();
      return <div className="w-[300px] h-[160px] p-2">key: {songKey}</div>;
    },
  };
};

import.meta.hot?.on("vite:afterUpdate", () => {
  hmrActions.handleUnitSourceUpdate("advancedControl");
});
