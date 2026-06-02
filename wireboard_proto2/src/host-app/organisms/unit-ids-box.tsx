import { seqNumbers } from "beams/ax/array-utils";
import { ReactNode } from "react";
import { IconsEx } from "@/shared/components/icons";

const PortCell = ({ id, isOutput }: { id: string; isOutput?: boolean }) => {
  return (
    <div
      id={`dom_unit_port_${id}`}
      className="text-white bg-gray-500 w-4 h-4 flex-c text-xs"
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
          const id = isOutput
            ? `${unitId}_output_${i}`
            : `${unitId}_input_${i}`;
          return <PortCell key={id} id={id} isOutput={isOutput} />;
        })
      ) : (
        <PortCell
          id={`${unitId}${isOutput ? "_output" : "_input"}`}
          isOutput={isOutput}
        />
      )}
    </div>
  );
};

const UnitIdOverlay = ({ unitId }: { unitId: string }) => {
  return (
    <div className="absolute-full flex-ha justify-end px-1.5">
      <div className="text-[14px] font-bold text-white">{unitId}</div>
    </div>
  );
};

export const UnitIdsBox = ({
  unitId,
  children,
  numMultiInputs,
  numMultiOutputs,
}: {
  unitId: string;
  children?: ReactNode;
  numMultiInputs?: number;
  numMultiOutputs?: number;
}) => {
  const overlayPos = numMultiOutputs ? "bottom" : "top";
  return (
    <div className="flex-v bg-gray-400">
      <div className="flex-ha gap-1 px-1 h-6 justify-between relative">
        <PortCellsRow
          unitId={unitId}
          numMultiPorts={numMultiOutputs}
          isOutput
        />
        {overlayPos === "top" && <UnitIdOverlay unitId={unitId} />}
      </div>
      {children}
      <div className="flex-ha gap-1 px-1 h-6 relative">
        <PortCellsRow unitId={unitId} numMultiPorts={numMultiInputs} />
        {overlayPos === "bottom" && <UnitIdOverlay unitId={unitId} />}
      </div>
    </div>
  );
};
