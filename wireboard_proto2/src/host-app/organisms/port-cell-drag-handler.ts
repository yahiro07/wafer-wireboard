import { Point } from "beams/ax-ui/common-types";
import { DragHandlerEvent, startDragSession } from "beams/ax-ui/drag-session";
import { PortSubtype } from "@/contract/unit-interfaces";
import { checkSubtypeOverlap, domEditAreaId } from "@/host-app/common";
import { actions, store } from "@/host-app/store";
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

export function handlePortCellDragging(
  e0: React.PointerEvent,
  portKey: string,
) {
  const portItems = getSeekerPortItems();
  const baseDiv = document.getElementById(domEditAreaId)!;
  const baseRect = baseDiv.getBoundingClientRect();

  const getPositionOnEditArea = (e: DragHandlerEvent) => {
    return {
      x: e.position.x - baseRect.left,
      y: e.position.y - baseRect.top,
    };
  };
  const sourcePort = portItems.find((it) => it.portKey === portKey);
  if (!sourcePort) return;

  startDragSession(
    e0.nativeEvent,
    {
      onDown() {
        actions.setDraggingPortKey(portKey);
      },
      onMove(e) {
        const pos = getPositionOnEditArea(e);
        const candidatePorts = portItems.filter(
          (it) =>
            it.portKey === portKey ||
            (it.direction !== sourcePort.direction &&
              checkSubtypeOverlap(it.portSubtypes, sourcePort.portSubtypes)),
        );
        const targetPort = findNearestPort(candidatePorts, pos);
        if (
          targetPort &&
          store.state.previewDestPortKey !== targetPort.portKey
        ) {
          actions.setPreviewDestPortKey(targetPort.portKey);
        }
      },
      onUpOrCancel() {
        actions.setDraggingPortKey(null);
      },
    },
    { coordinate: "page" },
  );
  e0.stopPropagation();
}
