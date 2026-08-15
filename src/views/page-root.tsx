import clsx from "clsx";
import { bgSpecs } from "@/common/theme";
import { InformationPanel } from "@/information-panel";
import { store } from "@/model/store";
import { TopBar } from "@/views/editor-controls/top-bar";
import { MainEditArea } from "@/views/main-edit-area";
import { PickerColumn } from "./picker";

export const PageRoot = () => {
  const { infoPanelVisible } = store.useSnapshot();
  return (
    <div className={clsx("w-[100dvw] h-[100dvh] flex-h", bgSpecs.pageRoot)}>
      <div className="flex-v w-full">
        <TopBar />
        <div className="grow flex-h overflow-hidden">
          <PickerColumn />
          <MainEditArea />
        </div>
      </div>
      {infoPanelVisible && <InformationPanel />}
    </div>
  );
};
