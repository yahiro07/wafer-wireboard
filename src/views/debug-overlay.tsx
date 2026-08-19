import { store } from "@/model/store";
import clsx from "clsx";

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
