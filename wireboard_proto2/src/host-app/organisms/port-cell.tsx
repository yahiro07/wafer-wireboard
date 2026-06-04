import { RefObject, useEffect, useRef } from "react";
import { PortSubtype } from "@/contract/unit-interfaces";
import { decodePortKey, getDomUnitBoxId } from "@/host-app/common";
import { handlePortCellDragging } from "@/host-app/organisms/port-cell-drag-handler";
import { usePortHighlightingModel } from "@/host-app/organisms/port-highlighting-model";
import { actions } from "@/host-app/store";
import { PortDirection } from "@/host-app/types";
import { IconsEx } from "@/shared/components/icons";

function useAffectPortAttributesToStore(
  portDivRef: RefObject<HTMLDivElement | null>,
  portKey: string,
  portSubtypes: PortSubtype[],
) {
  useEffect(() => {
    const el = portDivRef.current;
    if (el) {
      const portRect = el.getBoundingClientRect();
      const centerX = portRect.left + portRect.width / 2;
      const centerY = portRect.top + portRect.height / 2;

      // const editAreaEl = document.getElementById(domEditAreaId);
      // const editAreaRect = editAreaEl!.getBoundingClientRect();
      // const positionX = centerX - editAreaRect.left;
      // const positionY = centerY - editAreaRect.top;

      const { unitId, direction } = decodePortKey(portKey);

      const domUnitBoxId = getDomUnitBoxId(unitId);
      const unitBoxEl = document.getElementById(domUnitBoxId);
      const unitBoxRect = unitBoxEl!.getBoundingClientRect();
      const relativeX = centerX - unitBoxRect.left;
      const relativeY = centerY - unitBoxRect.top;

      actions.addPortItem(portKey, {
        // position: { x: positionX, y: positionY },
        relativePositionInUnit: { x: relativeX, y: relativeY },
        unitId,
        direction,
        portSubtypes,
      });

      return () => {
        actions.removePortItem(portKey);
      };
    }
  }, [portKey, portDivRef.current, portSubtypes]);
}

export const PortCell = ({
  portKey,
  portDirection,
  portSubtypes,
}: {
  portKey: string;
  portDirection: PortDirection;
  portSubtypes: PortSubtype[];
}) => {
  const portDivRef = useRef<HTMLDivElement>(null);
  useAffectPortAttributesToStore(portDivRef, portKey, portSubtypes);
  const highlightingState = usePortHighlightingModel(portKey);
  const isOutput = portDirection === "output";
  return (
    <div
      ref={portDivRef}
      className="text-white bg-gray-500 w-4 h-4 flex-c text-xs cursor-pointer relative"
      onPointerDown={
        isOutput ? (e) => handlePortCellDragging(e, portKey) : undefined
      }
      style={{
        background: highlightingState === "truthy" ? "orange" : undefined,
        border:
          highlightingState === "truthyOutlined"
            ? "1.5px solid orange"
            : undefined,
      }}
    >
      {isOutput && <IconsEx.ConnectorPortUp />}
      <div className="flex-v absolute left-0 top-4 text-xs text-green-500">
        {portSubtypes?.map((subtype, i) => (
          <div key={i}>{subtype}</div>
        ))}
      </div>
    </div>
  );
};
