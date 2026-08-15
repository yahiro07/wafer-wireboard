import { Point } from "@/auxiliaries/common-types";
import { useEffect, useRef } from "react";
import { HsPortSubtype } from "wafer-host/core";
import { domEditAreaId, signalColors } from "@/main-definitions/constants";
import { getUnitIdFromPortKey } from "@/model/factory";
import { connectionActions } from "@/port/connection-actions";
import { handlePortCellDragging } from "@/port/port-cell-drag-handler";
import {
  PortCellHighlightingState,
  usePortCellHighlightingModel,
} from "@/port/port-cell-highlighting-model";
import { UnitTemporalPort } from "@/unit/unit-temporal-ports-model";
import { tx } from "@twind/core";

const PortCellView = ({
  highlightingState,
  isOutput,
  subtype,
  label,
}: {
  isOutput?: boolean;
  highlightingState: PortCellHighlightingState;
  subtype: HsPortSubtype;
  label?: string;
}) => {
  const color = signalColors[subtype];
  return (
    <div
      className={tx(
        "w-[40px] h-[40px] flex-c relative",
        isOutput && "cursor-pointer",
      )}
      style={{
        background: highlightingState === "truthy" ? "orange" : undefined,
        border:
          highlightingState === "truthyOutlined"
            ? "2px solid orange"
            : undefined,
      }}
    >
      <div
        className={tx("w-[18px] h-[18px]", "rounded-[10px]")}
        style={{ background: color }}
      />
      {label && (
        <div className="absolute-full flex-c text-white mt-8">{label}</div>
      )}
    </div>
  );
};

function getElementCenterPositionInBoard(
  el: HTMLElement,
  boardDom: HTMLElement,
): Point {
  const boardRect = boardDom.getBoundingClientRect();
  const rect = el.getBoundingClientRect();
  const scaleX = boardDom.offsetWidth
    ? boardRect.width / boardDom.offsetWidth
    : 1;
  const scaleY = boardDom.offsetHeight
    ? boardRect.height / boardDom.offsetHeight
    : 1;

  return {
    x: (rect.left + rect.width / 2 - boardRect.left) / scaleX,
    y: (rect.top + rect.height / 2 - boardRect.top) / scaleY,
  };
}

function useAffectPortPositionToStore(
  portDivRef: React.RefObject<HTMLDivElement | null>,
  port: UnitTemporalPort,
  unitPosition: Point,
  yOffset?: number,
) {
  useEffect(() => {
    const boardDom = document.getElementById(domEditAreaId);
    const el = portDivRef.current;
    if (el && boardDom) {
      const position = getElementCenterPositionInBoard(el, boardDom);
      if (yOffset !== undefined) {
        position.y += yOffset;
      }
      const { portKey, subtype, direction } = port;
      const unitId = getUnitIdFromPortKey(portKey);
      const portItem = { portKey, unitId, direction, subtype, position };
      connectionActions.addPortItem(portItem);
      console.log("add port position", portKey, position);
      return () => {
        connectionActions.removePortItem(portKey);
      };
    }
  }, [port, portDivRef, yOffset]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: manual management
  useEffect(() => {
    const boardDom = document.getElementById(domEditAreaId);
    const el = portDivRef.current;
    if (el && boardDom) {
      const position = getElementCenterPositionInBoard(el, boardDom);
      if (yOffset !== undefined) {
        position.y += yOffset;
      }
      connectionActions.setPortItemPosition(port.portKey, position);
    }
  }, [port, portDivRef, yOffset, unitPosition]);
}

export const PortCell = ({
  port,
  unitPosition,
}: {
  port: UnitTemporalPort;
  unitPosition: Point;
}) => {
  const highlightingState = usePortCellHighlightingModel(port.portKey);
  const isOutput = port.direction === "output";
  const portDivRef = useRef<HTMLDivElement>(null);
  useAffectPortPositionToStore(portDivRef, port, unitPosition);
  const handlePointerDown = (e: React.PointerEvent) => {
    if (isOutput) {
      handlePortCellDragging(e, port.portKey);
    }
    e.stopPropagation();
  };
  return (
    <div ref={portDivRef} onPointerDown={handlePointerDown}>
      <PortCellView
        isOutput={isOutput}
        highlightingState={highlightingState}
        subtype={port.subtype}
        label={port.label}
      />
    </div>
  );
};
