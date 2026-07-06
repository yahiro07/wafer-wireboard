import { InformationPanel } from "@/information-panel";
import { store } from "@/model/store";
import { TopBar } from "@/views/editor-controls/top-bar";
import { MainEditArea } from "@/views/main-edit-area";
import { PickerColumn } from "./picker";

export const PageRoot = () => {
  const { infoPanelVisible } = store.useSnapshot();
  return (
    <div className="w-dvw h-dvh bg-[hsl(216,22%,18%)] flex-h">
      <div className="grow flex-v">
        <TopBar />
        <MainEditArea />
      </div>
      <PickerColumn />
      {infoPanelVisible && <InformationPanel />}
    </div>
  );
};
