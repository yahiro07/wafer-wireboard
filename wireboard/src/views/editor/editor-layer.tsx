import { boardSize, domEditAreaId } from "@/base/constants";
import { FieldSightPlane } from "@/components/field-sight-plane";
import { store } from "@/model/store";
import { SlotCardBox } from "@/unit/unit-box";
import {
  KeyboardSystemPortBox,
  SpeakerSystemPortBox,
} from "@/unit/unit-box-specials";
import { DebugPortsLayer } from "@/views/editor/debug-ports-layer";
import { useWireItems } from "@/views/editor/use-wire-items";
import { WiringLayer } from "@/views/editor/wiring-layer";

export const EditorLayer = () => {
  const { unitItems, sight } = store.useSnapshot();
  const wires = useWireItems();
  return (
    <FieldSightPlane sight={sight} boardSize={boardSize}>
      <WiringLayer boardSize={boardSize} wires={wires} />
      <div
        id={domEditAreaId}
        className="relative h-full"
        style={{ border: "solid 2px #ccc8" }}
      >
        {unitItems.map((item) => {
          if (item.unitId === "builtInKeyboard") {
            return <KeyboardSystemPortBox key={item.unitId} unit={item} />;
          } else if (item.unitId === "builtInPreOutput") {
            return <SpeakerSystemPortBox key={item.unitId} unit={item} />;
          } else {
            return <SlotCardBox key={item.unitId} unitItem={item} />;
          }
        })}
      </div>
      <DebugPortsLayer />
    </FieldSightPlane>
  );
};
