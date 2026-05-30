import { FieldSightPlane } from "@/components-ex/field-sight-plane";
import { WiringLayer } from "@/components-ex/wiring-layer";
import { SlotCardBox } from "@/organisms/slot-card-box";
import { sightHandlers, store } from "@/store/store";
import { useWireItems } from "@/store/use-wire-items";

const boardSize = { width: 9000, height: 6000 };

export const EditField = () => {
  const { unitItems, sight } = store.useSnapshot();
  const wires = useWireItems();
  return (
    <div className="grow">
      <FieldSightPlane
        sight={sight}
        handlers={sightHandlers}
        boardSize={boardSize}
      >
        <WiringLayer boardSize={boardSize} wires={wires} />
        <div className="relative">
          {unitItems.map((item) => (
            <SlotCardBox key={item.unitId} unit={item} />
          ))}
        </div>
      </FieldSightPlane>
    </div>
  );
};
