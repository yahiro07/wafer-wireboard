import { Point } from "beams/ax-ui/common-types";
import { DragHandlerEvent, startDragSession } from "beams/ax-ui/drag-session";
import { PortSubtype } from "wus-unit-types";
import { actions } from "@/host-app/actions";
import { checkSubtypeOverlap, domEditAreaId } from "@/host-app/common";
import { store } from "@/host-app/store";
import { PortDirection } from "@/host-app/types";

type SeekerPortItem = {
  portKey: string;
  position: Point;
  unitId: string;
  direction: PortDirection;
  portSubtypes: PortSubtype[];
};

function getSeekerPortItems(): SeekerPortItem[] {
  const { unitItems, portItems } = store.state;
  return Object.entries(portItems)
    .map(([portKey, portItem]) => {
      const unit = unitItems.find((u) => u.unitId === portItem.unitId);
      if (!unit) return null;
      const portPosition = {
        x: unit.position.x + portItem.relativePositionInUnit.x,
        y: unit.position.y + portItem.relativePositionInUnit.y,
      };
      return {
        portKey,
        position: portPosition,
        unitId: portItem.unitId,
        direction: portItem.direction,
        portSubtypes: portItem.portSubtypes,
      };
    })
    .filter(Boolean) as SeekerPortItem[];
}

function findNearestPort(
  portItems: SeekerPortItem[],
  position: Point,
): SeekerPortItem | undefined {
  let nearestPort: SeekerPortItem | undefined = undefined;
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
  portItems: SeekerPortItem[],
  sourcePortKey: string,
  portSubtypes: PortSubtype[],
  includeSourcePort = false,
) {
  const ports = portItems.filter(
    (it) =>
      it.direction === "input" &&
      checkSubtypeOverlap(it.portSubtypes, portSubtypes),
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
      actions.setDraggingPortKey(portKey);
    },
    draggingMove(pos: Point) {
      const candidatePorts = filterCandidatePorts(
        portItems,
        portKey,
        sourcePort.portSubtypes,
        true,
      );
      const targetPort = findNearestPort(candidatePorts, pos);
      if (targetPort && store.state.previewDestPortKey !== targetPort.portKey) {
        actions.setPreviewDestPortKey(targetPort.portKey);
      }
    },
    draggingEnd() {
      const { draggingPortKey, previewDestPortKey } = store.state;
      if (
        draggingPortKey &&
        previewDestPortKey &&
        previewDestPortKey !== draggingPortKey
      ) {
        actions.updateConnection(draggingPortKey, previewDestPortKey);
      }
      actions.setDraggingPortKey(null);
      actions.setPreviewDestPortKey(null);
    },
    toggleConnectionForNearestPort(pos: Point) {
      const candidatePorts = filterCandidatePorts(
        portItems,
        portKey,
        sourcePort.portSubtypes,
      );
      const targetPort = findNearestPort(candidatePorts, pos);
      if (targetPort) {
        actions.updateConnection(portKey, targetPort.portKey);
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
        actions.setTappingPortKey(portKey);
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
        actions.setTappingPortKey(null);
      },
    },
    { coordinate: "page" },
  );
  e0.stopPropagation();
}
