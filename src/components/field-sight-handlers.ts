import { FieldSight } from "@/components/field-sight-plane";
import { clampValue } from "@/auxiliaries/helpers";
import { startDragSession } from "@/auxiliaries/drag-session";

export type FieldSightHandlers = {
  onWheel: (e: WheelEvent) => void;
  onPointerDown: (e: PointerEvent) => void;
};

export function createFieldSightHandlers(
  getSight: () => FieldSight,
  setSightAttrs: (newSight: Partial<FieldSight>) => void,
  configs: { minScaling: number; maxScaling: number },
): FieldSightHandlers {
  return {
    onWheel(e: WheelEvent) {
      const sight = getSight();
      const currScaling = sight.eyeScaling;
      const scaleRatio = 1 - e.deltaY * 0.0015;
      const nextScaling = clampValue(
        currScaling * scaleRatio,
        configs.minScaling,
        configs.maxScaling,
      );
      const scaleDiff = nextScaling / currScaling;
      setSightAttrs({
        eyeScaling: nextScaling,
        eyeOffset: {
          x: sight.eyeOffset.x * scaleDiff,
          y: sight.eyeOffset.y * scaleDiff,
        },
      });
    },
    onPointerDown(e0: PointerEvent) {
      if (e0.pointerType === "touch" && !e0.isPrimary) return;

      const startPos = getSight().eyeOffset;
      startDragSession(
        e0,
        {
          onMove(e) {
            const relX = e.position.x - e.originalPosition.x;
            const relY = e.position.y - e.originalPosition.y;
            const newPos = {
              x: startPos.x + relX,
              y: startPos.y + relY,
            };
            setSightAttrs({ eyeOffset: newPos });
          },
        },
        { coordinate: "screen" },
      );
    },
  };
}
