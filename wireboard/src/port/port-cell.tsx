import clsx from "clsx";
import { Point } from "mofur/ax-ui";
import { useEffect, useRef } from "react";
import { domEditAreaId } from "@/base/constants";
import { IconsEx } from "@/base/icons";
import { getUnitIdFromPortKey } from "@/model/factory";
import { connectionActions } from "@/port/connection-actions";
import {
  handleKeyboardPortCellClick,
  handlePortCellDragging,
} from "@/port/port-cell-drag-handler";
import {
  PortCellHighlightingState,
  usePortCellHighlightingModel,
} from "@/port/port-cell-highlighting-model";
import { UnitTemporalPort } from "@/unit/unit-temporal-ports-model";

const PortCellView = ({
  highlightingState,
  noBg,
  isOutput,
}: {
  isOutput?: boolean;
  highlightingState: PortCellHighlightingState;
  noBg?: boolean;
}) => {
  return (
    <div
      className={clsx(
        "w-[30px] h-[30px] flex-c text-gray-100",
        isOutput && "cursor-pointer",
        !noBg && "bg-gray-400",
      )}
      style={{
        background: highlightingState === "truthy" ? "orange" : undefined,
        border:
          highlightingState === "truthyOutlined"
            ? "2px solid orange"
            : undefined,
      }}
    >
      {isOutput && <IconsEx.ConnectorPortUp />}
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
      const { portKey, subtypes, direction } = port;
      const unitId = getUnitIdFromPortKey(portKey);
      const portItem = { portKey, unitId, direction, subtypes, position };
      connectionActions.addPortItem(portItem);
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
      <PortCellView isOutput={isOutput} highlightingState={highlightingState} />
    </div>
  );
};

export const KeyboardPortCell = ({
  port,
  unitPosition,
}: {
  port: UnitTemporalPort;
  unitPosition: Point;
}) => {
  const highlightingState = usePortCellHighlightingModel(port.portKey);
  const portDivRef = useRef<HTMLDivElement>(null);
  useAffectPortPositionToStore(portDivRef, port, unitPosition);
  const handlePointerDown = (e: React.PointerEvent) => {
    handleKeyboardPortCellClick(e, port.portKey);
    e.stopPropagation();
  };
  return (
    <div ref={portDivRef} onPointerDown={handlePointerDown}>
      <PortCellView
        isOutput={true}
        highlightingState={highlightingState}
        noBg
      />
    </div>
  );
};

export const SpeakerPortCell = ({
  port,
  children,
  unitPosition,
}: {
  port: UnitTemporalPort;
  children: React.ReactNode;
  unitPosition: Point;
}) => {
  const highlightingState = usePortCellHighlightingModel(port.portKey);
  const portDivRef = useRef<HTMLDivElement>(null);
  useAffectPortPositionToStore(portDivRef, port, unitPosition, 40);
  return (
    <div
      ref={portDivRef}
      style={{
        background: highlightingState === "truthy" ? "orange" : undefined,
        border:
          highlightingState === "truthyOutlined"
            ? "1.5px solid orange"
            : undefined,
        color: highlightingState === "truthy" ? "white" : undefined,
      }}
    >
      {children}
    </div>
  );
};
