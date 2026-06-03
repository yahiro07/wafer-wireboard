import { RefObject, useEffect, useRef } from "react";
import {
  domEditAreaId,
  getDomUnitBoxId,
  getUnitIdFromPortKey,
} from "@/host-app/common";
import { handlePortCellDragging } from "@/host-app/organisms/port-cell-drag-handler";
import { actions } from "@/host-app/store";
import { PortDirection } from "@/host-app/types";
import { IconsEx } from "@/shared/components/icons";

function useAffectPortPositionToStore(
  portDivRef: RefObject<HTMLDivElement | null>,
  portKey: string,
) {
  useEffect(() => {
    const el = portDivRef.current;
    if (el) {
      const editAreaEl = document.getElementById(domEditAreaId);
      const editAreaRect = editAreaEl!.getBoundingClientRect();

      const portRect = el.getBoundingClientRect();
      const centerX = portRect.left + portRect.width / 2;
      const centerY = portRect.top + portRect.height / 2;

      const positionX = centerX - editAreaRect.left;
      const positionY = centerY - editAreaRect.top;

      const unitId = getUnitIdFromPortKey(portKey);
      const domUnitBoxId = getDomUnitBoxId(unitId);
      const unitBoxEl = document.getElementById(domUnitBoxId);
      const unitBoxRect = unitBoxEl!.getBoundingClientRect();
      const relativeX = centerX - unitBoxRect.left;
      const relativeY = centerY - unitBoxRect.top;

      actions.patchPortItem(portKey, {
        position: { x: positionX, y: positionY },
        relativePositionOnUnit: { x: relativeX, y: relativeY },
      });

      return () => {
        actions.removePortItem(portKey);
      };
    }
  }, [portKey, portDivRef.current]);
}

export const PortCell = ({
  portKey,
  portDirection,
  portSubtypes,
}: {
  portKey: string;
  portDirection: PortDirection;
  portSubtypes?: string[];
}) => {
  const portDivRef = useRef<HTMLDivElement>(null);
  useAffectPortPositionToStore(portDivRef, portKey);
  return (
    <div
      ref={portDivRef}
      className="text-white bg-gray-500 w-4 h-4 flex-c text-xs cursor-pointer relative"
      onPointerDown={(e) => handlePortCellDragging(e, portKey)}
    >
      {portDirection === "output" && <IconsEx.ConnectorPortUp />}
      <div className="flex-v absolute left-0 top-4 text-xs text-green-500">
        {portSubtypes?.map((subtype, i) => (
          <div key={i}>{subtype}</div>
        ))}
      </div>
    </div>
  );
};
