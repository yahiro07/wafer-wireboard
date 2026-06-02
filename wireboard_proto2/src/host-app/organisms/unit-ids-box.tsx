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

export const UnitIdsBox = ({
  unitId,
  destSpec,
  children,
}: {
  unitId: string;
  destSpec?: string | string[];
  children?: ReactNode;
}) => {
  const destSpecText = Array.isArray(destSpec) ? destSpec.join(", ") : destSpec;
  return (
    <div className="flex-v bg-gray-400">
      <div className="flex-ha gap-1 px-1">
        <PortCell id={`${unitId}_output`} isOutput />
        <div>{destSpecText}</div>
      </div>
      {children}
      <div className="flex-ha gap-1 px-1">
        <PortCell id={`${unitId}_input`} />
        <div>{unitId}</div>
      </div>
    </div>
  );
};
