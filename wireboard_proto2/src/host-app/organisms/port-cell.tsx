import { getDomPortCellId, getPortKey } from "@/host-app/common";
import { handlePortCellDragging } from "@/host-app/organisms/port-cell-drag-handler";
import { IconsEx } from "@/shared/components/icons";

export const PortCell = ({
  unitId,
  isOutput,
  portIndex,
  portSubtypes,
}: {
  unitId: string;
  isOutput?: boolean;
  portIndex?: number;
  portSubtypes?: string[];
}) => {
  const portKey = getPortKey(unitId, isOutput ? "output" : "input", portIndex);
  const id = getDomPortCellId(portKey);
  return (
    <div
      id={id}
      className="text-white bg-gray-500 w-4 h-4 flex-c text-xs cursor-pointer relative"
      onPointerDown={(e) =>
        handlePortCellDragging(e, portKey, isOutput ?? false, portIndex)
      }
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
