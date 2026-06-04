import { seqNumbers } from "beams/ax/array-utils";
import { ReactNode } from "react";
import { PortSubtype } from "@/contract/unit-interfaces";
import { DestinationCode, HsUnitPortsSpec } from "@/framework/host/host-types";
import { getPortKey } from "@/host-app/common";
import { PortCell } from "@/host-app/organisms/port-cell";
import { handleUnitBoxDragging } from "@/host-app/organisms/unit-box-drag-handler";
import { PortDirection } from "@/host-app/types";

const PortCellsRow = ({
  unitId,
  numMultiPorts,
  portDirection,
  portSubtypes,
}: {
  unitId: string;
  numMultiPorts?: number;
  portDirection: PortDirection;
  portSubtypes: PortSubtype[];
}) => {
  return (
    <div className="w-full flex-ha gap-1 px-1 h-6 justify-between">
      {numMultiPorts ? (
        seqNumbers(numMultiPorts).map((i) => {
          const portKey = getPortKey(unitId, portDirection, i);
          return (
            <PortCell
              key={portKey}
              portKey={portKey}
              portDirection={portDirection}
              portSubtypes={portSubtypes}
            />
          );
        })
      ) : (
        <PortCell
          portKey={getPortKey(unitId, portDirection)}
          portDirection={portDirection}
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
  destSpec,
}: {
  unitId: string;
  children?: ReactNode;
  portsSpec?: HsUnitPortsSpec;
  destSpec?: DestinationCode;
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
            numMultiPorts={portsSpec.numMultiOutputs}
            portSubtypes={portsSpec.outputPortSubtypes}
            portDirection="output"
          />
        )}
        {overlayPos === "top" && <UnitIdOverlay unitId={unitId} />}
        {true && (
          <div className="absolute-full pl-6 text-xs flex-ha text-blue-600 pointer-events-none">
            ↑{destSpec}
          </div>
        )}
      </div>
      {children}
      <div
        className="flex-ha gap-1 px-1 h-6 relative cursor-pointer"
        onPointerDown={(e) => handleUnitBoxDragging(e, unitId)}
      >
        {portsSpec?.inputPortSubtypes && (
          <PortCellsRow
            unitId={unitId}
            numMultiPorts={portsSpec.numMultiInputs}
            portSubtypes={portsSpec.inputPortSubtypes}
            portDirection="input"
          />
        )}
        {overlayPos === "bottom" && <UnitIdOverlay unitId={unitId} />}
      </div>
    </div>
  );
};
