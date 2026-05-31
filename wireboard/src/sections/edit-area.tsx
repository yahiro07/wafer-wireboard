import { unitCatalogKeyDragMime } from "@/base/drag-drop-key";
import { CatalogKey, catalog } from "@/base/showcase-entries";
import { FieldSightPlane } from "@/components-ex/field-sight-plane";
import { WiringLayer } from "@/components-ex/wiring-layer";
import { InfoButton } from "@/organisms/floating-icons";
import { SlotCardBox } from "@/organisms/slot-card-box";
import {
  KeyboardSystemPortBox,
  SpeakerSystemPortBox,
} from "@/organisms/system-port-box";
import { actions } from "@/store/actions";
import { sightHandlers, store } from "@/store/store";
import { useWireItems } from "@/store/use-wire-items";

const boardSize = { width: 9000, height: 6000 };

function isCatalogKey(value: string): value is CatalogKey {
  return Object.prototype.hasOwnProperty.call(catalog, value);
}

function useDropHandlers() {
  return {
    onDragOver(e: React.DragEvent<HTMLDivElement>) {
      if (e.dataTransfer.types.includes(unitCatalogKeyDragMime)) {
        e.preventDefault();
        e.dataTransfer.dropEffect = "copy";
      }
    },
    onDrop(e: React.DragEvent<HTMLDivElement>) {
      const catalogKey = e.dataTransfer.getData(unitCatalogKeyDragMime);
      if (!isCatalogKey(catalogKey)) return;

      e.preventDefault();
      const rect = e.currentTarget.getBoundingClientRect();
      const sight = store.state.sight;
      const scale = sight.eyeScaling;
      const position = {
        x:
          (e.clientX - rect.left - rect.width / 2 - sight.eyeOffset.x) / scale +
          boardSize.width / 2,
        y:
          (e.clientY - rect.top - rect.height / 2 - sight.eyeOffset.y) / scale +
          boardSize.height / 2,
      };
      actions.addUnit(catalogKey, position);
    },
  };
}

export const EditArea = () => {
  const { unitItems, sight, notes } = store.useSnapshot();
  const wires = useWireItems();
  const dropHandlers = useDropHandlers();
  return (
    <div
      className="grow relative"
      onDragOver={dropHandlers.onDragOver}
      onDrop={dropHandlers.onDrop}
    >
      <FieldSightPlane
        sight={sight}
        handlers={sightHandlers}
        boardSize={boardSize}
      >
        <WiringLayer boardSize={boardSize} wires={wires} />
        <div className="relative h-full" style={{ border: "solid 2px #ccc8" }}>
          {unitItems.map((item) => {
            if (item.unitId === "builtInKeyboard") {
              return (
                <KeyboardSystemPortBox
                  key={item.unitId}
                  unit={item}
                  notes={notes}
                />
              );
            } else if (item.unitId === "builtInPreOutput") {
              return <SpeakerSystemPortBox key={item.unitId} unit={item} />;
            } else {
              return <SlotCardBox key={item.unitId} unit={item} />;
            }
          })}
        </div>
      </FieldSightPlane>
      <InfoButton />
    </div>
  );
};
