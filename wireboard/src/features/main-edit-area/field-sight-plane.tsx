import clsx from "clsx";
import { clampValue } from "mofur/ax";
import { Size, startDragSession } from "mofur/ax-ui";
import { useDomElementSize } from "mofur/mo-react";
import React, { useEffect, useMemo, useRef } from "react";

export type FieldSight = {
  eyeScaling: number;
  eyeOffset: { x: number; y: number };
};

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
      const scaleRatio = 2 ** (-e.deltaY * 0.005);
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
      handlers.onWheel(e);
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
    const sc = sight.eyeScaling;
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
