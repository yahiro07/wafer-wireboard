import { Point } from "mofur/ax-ui";
import { useEffect, useMemo, useRef } from "react";
import { IconsEx } from "@/base/icons";
import { portCoordinatesModel } from "@/model/port-coordinates-model";
import { UnitTemporalPort } from "@/presenter/unit-temporal-ports-model";

type PortCellPositionCallbacks = {
  onAdd: (position: Point) => void;
  onMove: (position: Point) => void;
  onRemove: () => void;
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

export const PortCell = ({
  withIcon,
  onPointerDown,
  positionCallbacks,
}: {
  withIcon?: boolean;
  onPointerDown?: (e: React.PointerEvent) => void;
  positionCallbacks: PortCellPositionCallbacks;
}) => {
  const portDivRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const boardDom = document.getElementById("domEditMainLayer");
    const el = portDivRef.current;
    if (el && boardDom) {
      const position = getElementCenterPositionInBoard(el, boardDom);
      positionCallbacks.onAdd(position);
      return () => {
        positionCallbacks.onRemove();
      };
    }
  }, [positionCallbacks]);
  return (
    <div
      ref={portDivRef}
      className="w-[30px] h-[30px] bg-gray-400 cursor-pointer flex-c text-gray-100"
      onPointerDown={onPointerDown}
    >
      {withIcon && <IconsEx.ConnectorPortUp />}
    </div>
  );
};

function createPortCellPositionCallbacks(
  port: UnitTemporalPort,
): PortCellPositionCallbacks {
  const { portKey, subtypes } = port;
  return {
    onAdd(position: Point) {
      portCoordinatesModel.addPortItem({
        portKey,
        subtypes,
        position,
      });
    },
    onMove(position: Point) {
      portCoordinatesModel.setPortItemPosition(portKey, position);
    },
    onRemove() {
      portCoordinatesModel.removePortItem(portKey);
    },
  };
}

export const OutputPortCell = ({ port }: { port: UnitTemporalPort }) => {
  const positionCallbacks = useMemo(
    () => createPortCellPositionCallbacks(port),
    [port],
  );
  const handlePointerDown = (e: React.PointerEvent) => {
    // if (1) {
    //   //fan out supported
    //   connectionLogic_toggleMultiConnectionToNearest(unit);
    // } else {
    //   //single connection mode
    //   connectionLogic_toggleSingleConnectionToNearest(unit);
    // }
    e.stopPropagation();
  };
  return (
    <PortCell
      withIcon
      onPointerDown={handlePointerDown}
      positionCallbacks={positionCallbacks}
    />
  );
};

export const InputPortCell = ({ port }: { port: UnitTemporalPort }) => {
  const positionCallbacks = useMemo(
    () => createPortCellPositionCallbacks(port),
    [port],
  );
  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
  };
  return (
    <PortCell
      onPointerDown={handlePointerDown}
      positionCallbacks={positionCallbacks}
    />
  );
};
