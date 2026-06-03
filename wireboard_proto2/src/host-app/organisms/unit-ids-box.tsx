import { seqNumbers } from "beams/ax/array-utils";
import { ReactNode } from "react";
import { HsUnitPortsSpec } from "@/framework/host/host-types";
import { handlePortCellDragging } from "@/host-app/organisms/port-cell-drag-handler";
import { handleUnitBoxDragging } from "@/host-app/organisms/unit-box-drag-handler";
import { IconsEx } from "@/shared/components/icons";

const PortCell = ({
  unitId,
  isOutput,
  portIndex,
}: {
  unitId: string;
  isOutput?: boolean;
  portIndex?: number;
}) => {
  const id = portIndex
    ? isOutput
      ? `${unitId}_output_${portIndex}`
      : `${unitId}_input_${portIndex}`
    : `${unitId}${isOutput ? "_output" : "_input"}`;
  return (
    <div
      id={`dom_unit_port_${id}`}
      className="text-white bg-gray-500 w-4 h-4 flex-c text-xs cursor-pointer"
      onPointerDown={(e) =>
        handlePortCellDragging(e, id, isOutput ?? false, portIndex)
      }
    >
      {isOutput && <IconsEx.ConnectorPortUp />}
    </div>
  );
};

const PortCellsRow = ({
  unitId,
  numMultiPorts,
  isOutput,
}: {
  unitId: string;
  numMultiPorts?: number;
  isOutput?: boolean;
}) => {
  return (
    <div className="w-full flex-ha gap-1 px-1 h-6 justify-between">
      {numMultiPorts ? (
        seqNumbers(numMultiPorts).map((i) => {
          return (
            <PortCell
              key={i}
              unitId={unitId}
              isOutput={isOutput}
              portIndex={i}
            />
          );
        })
      ) : (
        <PortCell unitId={unitId} isOutput={isOutput} />
      )}
    </div>
  );
};

const UnitIdOverlay = ({ unitId }: { unitId: string }) => {
  return (
    <div className="absolute-full flex-ha justify-end px-1.5 pointer-events-none">
      <div className="text-[14px] font-bold text-white">{unitId}</div>
    </div>
  );
};

export const UnitIdsBox = ({
  unitId,
  children,
  portsSpec,
}: {
  unitId: string;
  children?: ReactNode;
  portsSpec?: HsUnitPortsSpec;
}) => {
  const overlayPos = portsSpec?.numMultiOutputs ? "bottom" : "top";
  return (
    <div className="flex-v bg-gray-400">
      <div
        className="flex-ha gap-1 px-1 h-6 justify-between relative cursor-pointer"
        onPointerDown={(e) => handleUnitBoxDragging(e, unitId)}
      >
        {portsSpec?.outputPortSubtypes && (
          <PortCellsRow
            unitId={unitId}
            numMultiPorts={portsSpec?.numMultiOutputs}
            isOutput
          />
        )}
        {overlayPos === "top" && <UnitIdOverlay unitId={unitId} />}
      </div>
      {children}
      <div
        className="flex-ha gap-1 px-1 h-6 relative cursor-pointer"
        onPointerDown={(e) => handleUnitBoxDragging(e, unitId)}
      >
        {portsSpec?.inputPortSubtypes && (
          <PortCellsRow
            unitId={unitId}
            numMultiPorts={portsSpec?.numMultiInputs}
          />
        )}
        {overlayPos === "bottom" && <UnitIdOverlay unitId={unitId} />}
      </div>
    </div>
  );
};
