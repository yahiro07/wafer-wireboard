import { DragHandlerEvent, Point, startDragSession } from "mofur/ax-ui";
import { domEditAreaId } from "@/base/constants";
import { store } from "@/model/store";
import { PortItem, PortSubtype } from "@/model/types";
import { connectionActions } from "@/port/connection-actions";
import { checkSubtypeOverlap, connectionLogic } from "@/port/connection-logic";

// type SeekerPortItem = {
//   portKey: string;
//   position: Point;
//   unitId: string;
//   direction: PortDirection;
//   portSubtypes: PortSubtype[];
// };

function getSeekerPortItems(): PortItem[] {
  // const { unitItems, portItems } = store.state;
  // return Object.entries(portItems)
  //   .map(([portKey, portItem]) => {
  //     const unit = unitItems.find((u) => u.unitId === portItem.unitId);
  //     if (!unit) return null;
  //     const portPosition = portItem.position;
  //     return {
  //       portKey,
  //       position: portPosition,
  //       unitId: portItem.unitId,
  //       direction: portItem.direction,
  //       portSubtypes: portItem.subtypes,
  //     };
  //   })
  //   .filter(Boolean) as PortItem[];
  return Object.values(store.state.portItems);
}

function findNearestPort(
  portItems: PortItem[],
  position: Point,
): PortItem | undefined {
  let nearestPort: PortItem | undefined;
  let nearestDistance = Infinity;
  for (const port of portItems) {
    const dx = port.position.x - position.x;
    const dy = port.position.y - position.y;
    const distance = Math.hypot(dx, dy);
    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestPort = port;
    }
  }
  return nearestPort;
}

function filterCandidatePorts(
  portItems: PortItem[],
  sourcePortKey: string,
  portSubtypes: PortSubtype[],
  includeSourcePort = false,
) {
  const ports = portItems.filter(
    (it) =>
      it.direction === "input" &&
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

export function handlePortCellDragging(
  e0: React.PointerEvent,
  portKey: string,
) {
  const portItems = getSeekerPortItems();
  const sourcePort = portItems.find((it) => it.portKey === portKey);
  if (!sourcePort) return;

  const baseDiv = document.getElementById(domEditAreaId)!;
  const baseRect = baseDiv.getBoundingClientRect();

  const getPositionOnEditArea = (e: DragHandlerEvent) => {
    return {
      x: e.position.x - baseRect.left,
      y: e.position.y - baseRect.top,
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
