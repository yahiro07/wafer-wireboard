import { Icons } from "@/common/icons";
import { store } from "@/model/store";
import clsx from "clsx";
import { clampValue } from "mofur/ax";
import { startDragSession } from "mofur/ax-ui";

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
    <div className={clsx("absolute right-0 top-1/2 -translate-y-1/2 mr-2")}>
      <div
        className={clsx(
          "w-[40px] h-[100px] bg-gray-500 flex-va justify-between cursor-pointer",
          "text-white",
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
