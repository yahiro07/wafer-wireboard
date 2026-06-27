import { InformationPanel } from "@/information-panel";
import { store } from "@/model/store";
import { MainArea } from "./main-area";
import { PickerColumn } from "./picker-column";

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
