import clsx from "clsx";
import { useEffect, useMemo, useRef } from "react";
import { Size } from "@/hooks/common-types";
import { useDomElementSize } from "@/hooks/use-dom-element-size";
import { startDragSession } from "@/utils/drag-session";
import { clampValue } from "@/utils/number-utils";

export type FieldSight = {
  zoom: number; //0 for 1x
  eyePosition: { x: number; y: number };
};

export type FieldSightHandlers = {
  onWheel: (e: WheelEvent) => void;
  onPointerDown: (e: PointerEvent) => void;
};

const configs = { minZoom: -2, maxZoom: 4 };

export function createFieldSightHandlers(
  getSight: () => FieldSight,
  setSightAttrs: (newSight: Partial<FieldSight>) => void,
): FieldSightHandlers {
  return {
    onWheel(e: WheelEvent) {
      const zoom = getSight().zoom;
      const newZoom = clampValue(
        zoom - e.deltaY * 0.005,
        configs.minZoom,
        configs.maxZoom,
      );
      setSightAttrs({ zoom: newZoom });
    },
    onPointerDown(e0: PointerEvent) {
      if (e0.buttons === 4) {
        const startPos = getSight().eyePosition;
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
              setSightAttrs({ eyePosition: newPos });
            },
          },
          { coordinate: "screen" },
        );
        e0.stopPropagation();
        e0.preventDefault();
      }
    },
  };
}

export const FieldSightPlane = ({
  className,
  sight,
  handlers,
  children,
  boardSize,
}: {
  className?: string;
  sight: FieldSight;
  handlers: FieldSightHandlers;
  children: React.ReactNode;
  boardSize: Size;
}) => {
  const baseDivRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    window.addEventListener("wheel", handlers.onWheel);
    window.addEventListener("pointerdown", handlers.onPointerDown, {
      capture: true,
    });
  }, [handlers]);

  const outerAreaSize = useDomElementSize(baseDivRef);

  const transformSpec = useMemo(() => {
    if (!outerAreaSize) return undefined;
    const tx = outerAreaSize.width / 2 + sight.eyePosition.x;
    const ty = outerAreaSize.height / 2 + sight.eyePosition.y;
    const sc = Math.pow(2, sight.zoom);
    const tx2 = boardSize.width / 2;
    const ty2 = boardSize.height / 2;
    return `translate(${tx}px, ${ty}px) scale(${sc}) translate(${-tx2}px, ${-ty2}px)`;
  }, [sight, outerAreaSize, boardSize]);

  return (
    <div
      ref={baseDivRef}
      className={clsx(
        "w-full h-full bd-red relative overflow-hidden",
        className,
      )}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          transform: transformSpec,
          transformOrigin: "top left",
          border: "solid 2px blue",
        }}
      >
        <div
          style={{
            width: boardSize.width,
            height: boardSize.height,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
