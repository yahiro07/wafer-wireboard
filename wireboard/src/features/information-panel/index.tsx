import { useState } from "react";
import { Icons } from "@/base/icons";
import { TabButton } from "@/features/information-panel/tab-button";
import { store } from "@/store/store";
import { CreditContents } from "./credit-contents";
import { UsageContents } from "./usage-content";

type PageTab = "instruction" | "credits";

export const InformationPanel = () => {
  const [pageTab, setPageTab] = useState<PageTab>("instruction");
  const closePanel = () => store.setInfoPanelVisible(false);
  return (
    <div className="absolute-full flex-c bg-black/20" onClick={closePanel}>
      <div
        className="w-full max-w-[800px] max-h-[85%] overflow-y-auto bg-[hsl(216,18%,20%)] text-white p-10 pb-15"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex-ha justify-between">
          <h1 className="text-3xl font-bold">Wireboard</h1>
          <div className="flex-ha gap-6">
            <div className="flex-h gap-2">
              <TabButton
                label="Instruction"
                isActive={pageTab === "instruction"}
                onClick={() => setPageTab("instruction")}
              />
              <TabButton
                label="Credits"
                isActive={pageTab === "credits"}
                onClick={() => setPageTab("credits")}
              />
            </div>
            <button
              type="button"
              className="text-xl cursor-pointer"
              onClick={closePanel}
            >
              <Icons.Close />
            </button>
          </div>
        </div>
        <div className="mt-4">
          {pageTab === "instruction" ? <UsageContents /> : <CreditContents />}
        </div>
      </div>
    </div>
  );
};
