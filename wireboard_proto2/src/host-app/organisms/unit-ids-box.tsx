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
  children,
}: {
  unitId: string;
  children?: ReactNode;
}) => {
  return (
    <div className="flex-v bg-gray-400">
      <div className="flex-ha gap-1 px-1 h-6 justify-between">
        <PortCell id={`${unitId}_output`} isOutput />
        <div className="text-[12px] font-bold text-white">{unitId}</div>
      </div>
      {children}
      <div className="flex-ha gap-1 px-1 h-6">
        <PortCell id={`${unitId}_input`} />
      </div>
    </div>
  );
};
