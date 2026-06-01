import { IconsEx } from "@/components/icons";
import { actions } from "@/store/actions";
import { UnitItem } from "@/store/store";

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
  const handlePointerDown = (_: React.PointerEvent) => {
    if (unit.destUnitId) {
      actions.removeConnection(unit.unitId);
    } else {
      actions.connectToNearestUnit(unit.unitId);
    }
  };
  return <PortCell withIcon onPointerDown={handlePointerDown} />;
};
