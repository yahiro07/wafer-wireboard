import clsx from "clsx";
import { useEffect, useMemo, useRef } from "react";
import { Size } from "@/hooks/common-types";
import { useDomElementSize } from "@/hooks/use-dom-element-size";
import { startDragSession } from "@/utils/drag-session";
import { clampValue } from "@/utils/number-utils";

export type FieldSight = {
  zoom: number; //0 for 1x
  eyeOffset: { x: number; y: number };
};

export type FieldSightHandlers = {
  onWheel: (
    e: WheelEvent,
    context: { pointer: { x: number; y: number }; areaSize: Size },
  ) => void;
  onPointerDown: (e: PointerEvent) => void;
};

export function createFieldSightHandlers(
  getSight: () => FieldSight,
  setSightAttrs: (newSight: Partial<FieldSight>) => void,
  configs: { minZoom: number; maxZoom: number },
): FieldSightHandlers {
  return {
    onWheel(e: WheelEvent, context) {
      const sight = getSight();
      const zoom = sight.zoom;
      const newZoom = clampValue(
        zoom - e.deltaY * 0.005,
        configs.minZoom,
        configs.maxZoom,
      );
      const scale = Math.pow(2, zoom);
      const newScale = Math.pow(2, newZoom);
      const scaleRatio = newScale / scale;
      const cx = context.areaSize.width / 2;
      const cy = context.areaSize.height / 2;
      const px = context.pointer.x;
      const py = context.pointer.y;
      const newEyeOffset = {
        x: (1 - scaleRatio) * (px - cx) + scaleRatio * sight.eyeOffset.x,
        y: (1 - scaleRatio) * (py - cy) + scaleRatio * sight.eyeOffset.y,
      };
      setSightAttrs({ zoom: newZoom, eyeOffset: newEyeOffset });
    },
    onPointerDown(e0: PointerEvent) {
      if (e0.buttons === 4) {
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
    window.addEventListener("pointerdown", handlers.onPointerDown, {
      capture: true,
    });
    return () => {
      window.removeEventListener("pointerdown", handlers.onPointerDown, {
        capture: true,
      });
    };
  }, [handlers]);

  useEffect(() => {
    const baseDiv = baseDivRef.current;
    if (!baseDiv) return;
    const onWheel = (e: WheelEvent) => {
      handlers.onWheel(e, {
        pointer: {
          x: e.clientX - baseDiv.getBoundingClientRect().left,
          y: e.clientY - baseDiv.getBoundingClientRect().top,
        },
        areaSize: {
          width: baseDiv.clientWidth,
          height: baseDiv.clientHeight,
        },
      });
      e.preventDefault();
    };

    baseDiv.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      baseDiv.removeEventListener("wheel", onWheel);
    };
  }, [handlers]);

  const outerAreaSize = useDomElementSize(baseDivRef);

  const transformSpec = useMemo(() => {
    if (!outerAreaSize) return undefined;
    const tx = outerAreaSize.width / 2 + sight.eyeOffset.x;
    const ty = outerAreaSize.height / 2 + sight.eyeOffset.y;
    const sc = Math.pow(2, sight.zoom);
    const tx2 = boardSize.width / 2;
    const ty2 = boardSize.height / 2;
    return `translate(${tx}px, ${ty}px) scale(${sc}) translate(${-tx2}px, ${-ty2}px)`;
  }, [sight, outerAreaSize, boardSize]);

  return (
    <div
      ref={baseDivRef}
      className={clsx("w-full h-full relative overflow-hidden", className)}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          transform: transformSpec,
          transformOrigin: "top left",
          border: "solid 2px #ccc8",
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
