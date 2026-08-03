import clsx from "clsx";
import { store } from "@/model/store";

export const DebugOverlay = () => {
  const { wireItems } = store.useSnapshot();
  return (
    <div
      className={clsx(
        "absolute-full pointer-events-none text-[12px] text-green-400",
        "whitespace-pre-wrap",
      )}
    >
      {JSON.stringify(wireItems, null, 2)}
    </div>
  );
};
