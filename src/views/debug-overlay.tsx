import { store } from "@/model/store";
import { tx } from "@twind/core";

export const DebugOverlay = () => {
  const { wireItems } = store.useSnapshot();
  return (
    <div
      className={tx(
        "absolute-full pointer-events-none text-[12px] text-green-400",
        "whitespace-pre-wrap",
      )}
    >
      {JSON.stringify(wireItems, null, 2)}
    </div>
  );
};
