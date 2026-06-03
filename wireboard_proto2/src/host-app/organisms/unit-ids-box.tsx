import { seqNumbers } from "beams/ax/array-utils";
import { ReactNode } from "react";
import { HsUnitPortsSpec } from "@/framework/host/host-types";
import { PortCell } from "@/host-app/organisms/port-cell";
import { handleUnitBoxDragging } from "@/host-app/organisms/unit-box-drag-handler";

const PortCellsRow = ({
  unitId,
  numMultiPorts,
  isOutput,
  portSubtypes,
}: {
  unitId: string;
  numMultiPorts?: number;
  isOutput?: boolean;
  portSubtypes?: string[];
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
              portSubtypes={portSubtypes}
            />
          );
        })
      ) : (
        <PortCell
          unitId={unitId}
          isOutput={isOutput}
          portSubtypes={portSubtypes}
        />
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
            portSubtypes={portsSpec?.outputPortSubtypes}
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
            portSubtypes={portsSpec?.inputPortSubtypes}
          />
        )}
        {overlayPos === "bottom" && <UnitIdOverlay unitId={unitId} />}
      </div>
    </div>
  );
};
