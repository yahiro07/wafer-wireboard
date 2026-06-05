import { Icons } from "@/base/icons";
import { store } from "@/store/store";

export const InfoButton = () => {
  return (
    <div
      className="absolute top-0 left-0 text-white/80 m-2 text-[34px] cursor-pointer"
      onClick={store.toggleInfoPanelVisible}
    >
      <Icons.Info />
    </div>
  );
};
