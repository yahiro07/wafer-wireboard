import { DragHandlerEvent, Point, startDragSession } from "mofur/ax-ui";
import { findItemMappedMinimum } from "@/auxiliaries/general-utils";
import { domEditAreaId } from "@/base/constants";
import { store } from "@/model/store";
import { PortItem, PortSubtype } from "@/model/types";
import { connectionActions } from "@/port/connection-actions";
import {
  checkSubtypeOverlap,
  connectionLogic,
  getUnitIdFromPortKey,
} from "@/port/connection-logic";

function filterCandidatePorts(
  portItems: PortItem[],
  sourcePortKey: string,
  portSubtypes: PortSubtype[],
  includeSourcePort = false,
) {
  const sourceUnitId = getUnitIdFromPortKey(sourcePortKey);
  const ports = portItems.filter(
    (it) =>
      it.direction === "input" &&
      it.unitId !== sourceUnitId &&
      checkSubtypeOverlap(it.subtypes, portSubtypes),
  );
  if (includeSourcePort) {
    const sourcePort = portItems.find((it) => it.portKey === sourcePortKey);
    if (sourcePort) {
      ports.push(sourcePort);
    }
  }
  return ports;
}

function findNearestPort(
  portItems: PortItem[],
  position: Point,
): PortItem | undefined {
  return findItemMappedMinimum(portItems, (port) => {
    const dx = port.position.x - position.x;
    const dy = port.position.y - position.y;
    return Math.hypot(dx, dy);
  });
}

export function handlePortCellDragging(
  e0: React.PointerEvent,
  portKey: string,
) {
  const sourcePort = store.state.portItems[portKey];
  if (!sourcePort) return;
  const portItems = Object.values(store.state.portItems);

  const boardDom = document.getElementById(domEditAreaId)!;
  const boardRect = boardDom.getBoundingClientRect();

  const scale = store.state.sight.eyeScaling;

  const getPositionOnEditArea = (e: DragHandlerEvent) => {
    return {
      x: (e.position.x - boardRect.left) / scale,
      y: (e.position.y - boardRect.top) / scale,
    };
  };

  const internal = {
    draggingStart() {
      connectionActions.setDraggingPortKey(portKey);
    },
    draggingMove(pos: Point) {
      const candidatePorts = filterCandidatePorts(
        portItems,
        portKey,
        sourcePort.subtypes,
        true,
      );
      const targetPort = findNearestPort(candidatePorts, pos);
      if (targetPort && store.state.previewDestPortKey !== targetPort.portKey) {
        connectionActions.setPreviewDestPortKey(targetPort.portKey);
      }
    },
    draggingEnd() {
      const { draggingPortKey, previewDestPortKey } = store.state;
      if (
        draggingPortKey &&
        previewDestPortKey &&
        previewDestPortKey !== draggingPortKey
      ) {
        connectionLogic.updateConnection(draggingPortKey, previewDestPortKey);
      }
      connectionActions.setDraggingPortKey(null);
      connectionActions.setPreviewDestPortKey(null);
    },
    toggleConnectionForNearestPort(pos: Point) {
      const candidatePorts = filterCandidatePorts(
        portItems,
        portKey,
        sourcePort.subtypes,
      );
      const targetPort = findNearestPort(candidatePorts, pos);
      if (targetPort) {
        connectionLogic.updateConnection(portKey, targetPort.portKey);
      }
    },
  };

  let timerId: NodeJS.Timeout | null = null;
  let inDragging = false;

  startDragSession(
    e0.nativeEvent,
    {
      onDown() {
        timerId = setTimeout(() => {
          internal.draggingStart();
          inDragging = true;
        }, 300);
        connectionActions.setTappingPortKey(portKey);
      },
      onMove(e) {
        if (!inDragging) {
          const delta = {
            x: e.position.x - e.originalPosition.x,
            y: e.position.y - e.originalPosition.y,
          };
          if (Math.hypot(delta.x, delta.y) > 5) {
            if (timerId) {
              clearTimeout(timerId);
              timerId = null;
            }
            internal.draggingStart();
            inDragging = true;
          }
        } else {
          const pos = getPositionOnEditArea(e);
          internal.draggingMove(pos);
        }
      },
      onUpOrCancel(e) {
        if (inDragging) {
          internal.draggingEnd();
        } else {
          const pos = getPositionOnEditArea(e);
          internal.toggleConnectionForNearestPort(pos);
        }
        if (timerId) {
          clearTimeout(timerId);
          timerId = null;
        }
        connectionActions.setTappingPortKey(null);
      },
    },
    { coordinate: "page" },
  );
  e0.stopPropagation();
}

export function handleKeyboardPortCellClick(
  e0: React.PointerEvent,
  portKey: string,
) {
  const sourcePort = store.state.portItems[portKey];
  if (!sourcePort) return;
  const portItems = Object.values(store.state.portItems);

  const boardDom = document.getElementById(domEditAreaId)!;
  const boardRect = boardDom.getBoundingClientRect();

  const scale = store.state.sight.eyeScaling;

  const getPositionOnEditArea = (e: React.PointerEvent) => {
    return {
      x: (e.clientX - boardRect.left) / scale,
      y: (e.clientY - boardRect.top) / scale,
    };
  };

  const internal = {
    toggleConnectionForNearestPort(pos: Point) {
      const candidatePorts = filterCandidatePorts(
        portItems,
        portKey,
        sourcePort.subtypes,
      );
      const targetPort = findNearestPort(candidatePorts, pos);
      if (targetPort) {
        connectionLogic.updateConnectionSingle(portKey, targetPort.portKey);
      }
    },
  };

  const pos = getPositionOnEditArea(e0);
  internal.toggleConnectionForNearestPort(pos);

  e0.stopPropagation();
}
