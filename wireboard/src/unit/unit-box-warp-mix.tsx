import { useMemo } from "react";
import { Icons } from "@/common/icons";
import { store } from "@/model/store";
import { UnitItem } from "@/model/types";
import { SlotCardBox } from "@/unit/unit-box";

const InnerAntennaButton = ({
  active,
  onClick,
}: {
  active: boolean;
  onClick: () => void;
}) => {
  return (
    <div
      className="w-[30px] h-[30px] bg-gray-400 flex-c text-white"
      style={{ color: active ? "#6cf" : "#ccc" }}
      onClick={onClick}
    >
      <Icons.Antenna size={20} />
    </div>
  );
};

export const WrapMixReceiverSlotCardBox = ({
  unitItem,
}: {
  unitItem: UnitItem;
}) => {
  const { hideWarpedWires } = store.useSnapshot();
  const handleAntennaClick = () => {
    store.toggleHideWarpedWires();
  };
  const excludingPortIds = useMemo(
    () => (hideWarpedWires ? ["auxInput"] : []),
    [hideWarpedWires],
  );
  return (
    <SlotCardBox
      unitItem={unitItem}
      innerContent={
        <div className="absolute bottom-0 left-0 m-2">
          <InnerAntennaButton
            active={hideWarpedWires}
            onClick={handleAntennaClick}
          />
        </div>
      }
      excludingPortIds={excludingPortIds}
      altSidePortIds={["auxOutput"]}
    />
  );
};

export const WrapMixEmitterSlotCardBox = ({
  unitItem,
}: {
  unitItem: UnitItem;
}) => {
  const { hideWarpedWires } = store.useSnapshot();

  const excludingPortIds = useMemo(
    () => (hideWarpedWires ? ["auxOutput"] : []),
    [hideWarpedWires],
  );
  return (
    <SlotCardBox unitItem={unitItem} excludingPortIds={excludingPortIds} />
  );
};
