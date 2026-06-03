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
  const id = portIndex
    ? isOutput
      ? `${unitId}_output_${portIndex}`
      : `${unitId}_input_${portIndex}`
    : `${unitId}${isOutput ? "_output" : "_input"}`;
  return (
    <div
      id={`dom_unit_port_${id}`}
      className="text-white bg-gray-500 w-4 h-4 flex-c text-xs cursor-pointer relative"
      onPointerDown={(e) =>
        handlePortCellDragging(e, id, isOutput ?? false, portIndex)
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
