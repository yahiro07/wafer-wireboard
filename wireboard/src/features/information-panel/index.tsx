import { Icons } from "@/components/icons";
import { store } from "@/store/store";
import { UsageContents } from "./usage-content";

export const InformationPanel = () => {
  return (
    <div className="absolute-full flex-c bg-black/30">
      <div className="w-full max-w-[800px] max-h-[80%] overflow-y-auto bg-gray-800 text-white p-4">
        <div className="flex-h px-2 py-2 font-bold justify-between">
          <div>Usage</div>
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
