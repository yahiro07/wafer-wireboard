import { useState } from "react";
import { Icons } from "@/components/icons";
import { store } from "@/store/store";
import { UsageContents } from "./usage-content";

type PageTab = "instruction" | "credit";

export const InformationPanel = () => {
  const [pageTab, setPageTab] = useState<PageTab>("instruction");
  return (
    <div className="absolute-full flex-c bg-black/20">
      <div className="w-full max-w-[800px] max-h-[85%] overflow-y-auto bg-gray-800 text-white p-6">
        <div className="flex-h justify-between">
          <div className="font-bold">Instruction</div>
          <div
            className="cursor-pointer"
            onClick={() => store.setInfoPanelVisible(false)}
          >
            <Icons.Close />
          </div>
        </div>
        {/* <CreditContents /> */}
        <UsageContents />
      </div>
    </div>
  );
};
