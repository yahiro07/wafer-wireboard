import { IconsEx } from "@/base/icons";
import { UnitItem } from "@/central/store";
import { connectionLogic_toggleSingleConnectionToNearest } from "@/core-handlers/connection-logic";

export const PortCell = ({
  withIcon,
  onPointerDown,
}: {
  withIcon?: boolean;
  onPointerDown?: (e: React.PointerEvent) => void;
}) => {
  return (
    <div
      className="w-[30px] h-[30px] bg-gray-400 cursor-pointer flex-c text-gray-100"
      onPointerDown={onPointerDown}
    >
      {withIcon && <IconsEx.ConnectorPortUp />}
    </div>
  );
};

export const OutputPortCell = ({ unit }: { unit: UnitItem }) => {
  const handlePointerDown = (e: React.PointerEvent) => {
    connectionLogic_toggleSingleConnectionToNearest(unit);
    e.stopPropagation();
  };
  return <PortCell withIcon onPointerDown={handlePointerDown} />;
};

export const InputPortCell = () => {
  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
  };
  return <PortCell onPointerDown={handlePointerDown} />;
};
