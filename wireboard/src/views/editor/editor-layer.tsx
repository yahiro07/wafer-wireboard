import { boardSize } from "@/base/constants";
import { FieldSightPlane } from "@/components/field-sight-plane";
import { store } from "@/model/store";
import { useWireItems } from "@/presenter/use-wire-items";
import { SlotCardBox } from "@/views/editor/slot-card-box";
import {
  KeyboardSystemPortBox,
  SpeakerSystemPortBox,
} from "@/views/editor/system-port-box";
import { WiringLayer } from "@/views/editor/wiring-layer";

export const EditorLayer = () => {
  const { unitItems, sight } = store.useSnapshot();
  const wires = useWireItems();
  return (
    <FieldSightPlane sight={sight} boardSize={boardSize}>
      <WiringLayer boardSize={boardSize} wires={wires} />
      <div className="relative h-full" style={{ border: "solid 2px #ccc8" }}>
        {unitItems.map((item) => {
          if (item.unitId === "builtInKeyboard") {
            return <KeyboardSystemPortBox key={item.unitId} unit={item} />;
          } else if (item.unitId === "builtInPreOutput") {
            return <SpeakerSystemPortBox key={item.unitId} unit={item} />;
          } else {
            return <SlotCardBox key={item.unitId} unit={item} />;
          }
        })}
      </div>
    </FieldSightPlane>
  );
};
