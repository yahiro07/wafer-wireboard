import { Icons } from "@/common/icons";
import { store } from "@/model/store";
import { UnitItem } from "@/model/types";
import { SlotCardBox } from "@/unit/unit-box";

export const WrapMixReceiverSlotCardBox = ({
  unitItem,
}: {
  unitItem: UnitItem;
}) => {
  const { hideWarpedWires } = store.useSnapshot();
  const handleAntennaClick = () => {
    store.toggleHideWarpedWires();
  };
  return (
    <SlotCardBox
      unitItem={unitItem}
      innerContent={
        <div className="absolute bottom-0 left-0 m-2">
          <div
            className="w-[30px] h-[30px] bg-gray-400 flex-c text-white"
            style={{ color: hideWarpedWires ? "#6cf" : "#ccc" }}
            onClick={handleAntennaClick}
          >
            <Icons.Antenna size={20} />
          </div>
        </div>
      }
    />
  );
};
