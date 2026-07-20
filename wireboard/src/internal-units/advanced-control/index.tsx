import { ReactUnitTemplateFn } from "wafer-host/react";
import { store } from "@/model/store";
import { hmrActions } from "@/periphery/hmr-handler";

const keysFirstRow = ["Eb", "Bb", "F", "C", "G", "D", "A"];
const keysSecondRow = ["Cm", "Gm", "Dm", "Am", "Em", "Bm", "F#m"];

const KeysRow = ({
  keys,
  currentKey,
  setCurrentKey,
}: {
  keys: string[];
  currentKey: string;
  setCurrentKey: (key: string) => void;
}) => {
  return (
    <div className="flex-h gap-2">
      {keys.map((key) => (
        <div
          key={key}
          className="w-[30px] flex-c cursor-pointer"
          style={key === currentKey ? { color: "blue" } : undefined}
          onClick={() => setCurrentKey(key)}
        >
          {key}
        </div>
      ))}
    </div>
  );
};

export const createAdvancedControlUnit: ReactUnitTemplateFn = (
  unitInterface,
) => {
  unitInterface.completeSetup({
    unitAspects: { unitType: "sequencer" },
  });

  return {
    RenderUi() {
      //this unit shows optional ui for host app and directly refer app's store
      const { songKey: currentKey } = store.useSnapshot();
      const setCurrentKey = store.setSongKey;
      return (
        <div className="w-[320px] h-[160px] flex-c bg-[#ddd]">
          <div className="flex-v gap-2">
            <div>Key: {currentKey}</div>
            <div className="flex-v gap-1">
              <KeysRow
                keys={keysFirstRow}
                currentKey={currentKey}
                setCurrentKey={store.setSongKey}
              />
              <KeysRow
                keys={keysSecondRow}
                currentKey={currentKey}
                setCurrentKey={setCurrentKey}
              />
            </div>
            <div className="text-sm">
              only affected some units supporting <br />
              key changes
            </div>
          </div>
        </div>
      );
    },
  };
};

import.meta.hot?.on("vite:afterUpdate", () => {
  hmrActions.handleUnitSourceUpdate("advancedControl");
});
