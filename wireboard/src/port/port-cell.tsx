import { Point } from "mofur/ax-ui";
import { useEffect, useRef } from "react";
import { domEditAreaId } from "@/base/constants";
import { IconsEx } from "@/base/icons";
import { connectionActions } from "@/port/connection-actions";
import { handlePortCellDragging } from "@/port/port-cell-drag-handler";
import {
  PortCellHighlightingState,
  usePortCellHighlightingModel,
} from "@/port/port-cell-highlighting-model";
import { UnitTemporalPort } from "@/unit/unit-temporal-ports-model";

const PortCellView = ({
  withIcon,
  highlightingState,
}: {
  withIcon?: boolean;
  highlightingState: PortCellHighlightingState;
}) => {
  return (
    <div
      className="w-[30px] h-[30px] bg-gray-400 cursor-pointer flex-c text-gray-100"
      style={{
        background: highlightingState === "truthy" ? "orange" : undefined,
        border:
          highlightingState === "truthyOutlined"
            ? "1.5px solid orange"
            : undefined,
      }}
    >
      {withIcon && <IconsEx.ConnectorPortUp />}
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
) {
  useEffect(() => {
    const boardDom = document.getElementById(domEditAreaId);
    const el = portDivRef.current;
    if (el && boardDom) {
      const position = getElementCenterPositionInBoard(el, boardDom);
      const { portKey, subtypes, direction } = port;
      const unitId = portKey.split(".")[0];
      const portItem = { portKey, unitId, direction, subtypes, position };
      connectionActions.addPortItem(portItem);
      return () => {
        connectionActions.removePortItem(portKey);
      };
    }
  }, [port, portDivRef]);
}

export const PortCell = ({ port }: { port: UnitTemporalPort }) => {
  const highlightingState = usePortCellHighlightingModel(port.portKey);
  const isOutput = port.direction === "output";
  const portDivRef = useRef<HTMLDivElement>(null);
  useAffectPortPositionToStore(portDivRef, port);
  const handlePointerDown = (e: React.PointerEvent) => {
    if (isOutput) {
      // if (1) {
      //   //fan out supported
      //   connectionLogic_toggleMultiConnectionToNearest(unit);
      // } else {
      //   //single connection mode
      //   connectionLogic_toggleSingleConnectionToNearest(unit);
      // }
      handlePortCellDragging(e, port.portKey);
    }
    e.stopPropagation();
  };
  return (
    <div ref={portDivRef} onPointerDown={handlePointerDown}>
      <PortCellView withIcon={isOutput} highlightingState={highlightingState} />
    </div>
  );
};
