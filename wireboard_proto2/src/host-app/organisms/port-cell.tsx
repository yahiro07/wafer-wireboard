import { useEffect, useMemo, useRef } from "react";
import { domEditAreaId, getDomPortCellId } from "@/host-app/common";
import { handlePortCellDragging } from "@/host-app/organisms/port-cell-drag-handler";
import { actions } from "@/host-app/store";
import { PortDirection } from "@/host-app/types";
import { IconsEx } from "@/shared/components/icons";

function createPortCellModel(portKey: string) {
  return {
    setupElement(el: HTMLDivElement) {
      const editAreaEl = document.getElementById(domEditAreaId);
      const editAreaRect = editAreaEl!.getBoundingClientRect();

      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2 - editAreaRect.left;
      const centerY = rect.top + rect.height / 2 - editAreaRect.top;
      actions.setPortPosition(portKey, { x: centerX, y: centerY });

      return () => {};
    },
  };
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
  const model = useMemo(() => createPortCellModel(portKey), [portKey]);
  const portDivRef = useRef<HTMLDivElement>(null);
  const id = getDomPortCellId(portKey);

  useEffect(() => {
    const portDiv = portDivRef.current!;
    return model.setupElement(portDiv);
  }, [model]);

  return (
    <div
      ref={portDivRef}
      id={id}
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
