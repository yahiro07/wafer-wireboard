import { Icons } from "@/common/icons";
import { store } from "@/model/store";
import { clampValue } from "@/auxiliaries/helpers";
import { startDragSession } from "@/auxiliaries/drag-session";
import { tx } from "@twind/core";

const handleScalingGaugePointerDown = (e: React.PointerEvent) => {
  const originalSight = store.state.sight;
  startDragSession(
    e.nativeEvent,
    {
      onMove(e) {
        const deltaY = e.position.y - e.originalPosition.y;
        const newScaling = clampValue(
          originalSight.eyeScaling - deltaY / 100,
          0.125,
          4,
        );
        const scaleDiff = newScaling / originalSight.eyeScaling;
        store.patchSight({
          eyeScaling: newScaling,
          eyeOffset: {
            x: originalSight.eyeOffset.x * scaleDiff,
            y: originalSight.eyeOffset.y * scaleDiff,
          },
        });
      },
    },
    { coordinate: "screen" },
  );
  e.stopPropagation();
  e.preventDefault();
};

export const ScalingGaugeContainer = () => {
  return (
    <div className={tx("absolute right-0 top-1/2 -translate-y-1/2 mr-2")}>
      <div
        className={tx(
          "w-[40px] h-[100px] bg-gray-500 flex-va justify-between",
          "text-white cursor-pointer hover:opacity-90",
        )}
        onPointerDown={handleScalingGaugePointerDown}
        onClick={(e) => e.stopPropagation()}
      >
        <span>↑</span>
        <span>
          <Icons.Zoom />
        </span>
        <span>↓</span>
      </div>
    </div>
  );
};
