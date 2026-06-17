import { store } from "../central/store";
import { InformationPanel } from "./information-panel";
import { MainArea } from "./main-area/main-area";
import { PickerColumn } from "./picker-column/picker-column";

export const PageRoot = () => {
  const { infoPanelVisible } = store.useSnapshot();
  return (
    <div className="w-dvw h-dvh bg-[hsl(216,22%,18%)] flex-h">
      <MainArea />
      <PickerColumn />
      {infoPanelVisible && <InformationPanel />}
    </div>
  );
};
