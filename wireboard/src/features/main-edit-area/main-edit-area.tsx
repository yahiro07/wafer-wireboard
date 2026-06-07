import { appConfigs } from "@/base/constants";
import { unitCatalogKeyDragMime } from "@/base/drag-drop-key";
import { catalog } from "@/base/showcase-entries";
import { InfoButton } from "@/features/foreground-ui/floating-icons";
import { GithubBadge } from "@/features/foreground-ui/github-badge";
import { FieldSightPlane } from "@/features/main-edit-area/field-sight-plane";
import { useKeyboardAutoTarget } from "@/features/system-port/keyboard-auto-target";
import {
  KeyboardSystemPortBox,
  SpeakerSystemPortBox,
} from "@/features/system-port/system-port-box";
import { TopControlBar } from "@/features/top-control-bar/top-control-bar";
import { SlotCardBox } from "@/features/unit-box/slot-card-box";
import { snapUnitCoordToGrid } from "@/features/unit-box/snapping";
import { useWireItems } from "@/features/wiring/use-wire-items";
import { WiringLayer } from "@/features/wiring/wiring-layer";
import { actions } from "@/store/actions";
import { sightHandlers, store } from "@/store/store";

const boardSize = { width: 9000, height: 6000 };

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
      if (!catalog[catalogKey]) return;

      e.preventDefault();
      const rect = e.currentTarget.getBoundingClientRect();
      const sight = store.state.sight;
      const scale = sight.eyeScaling;
      let position = {
        x:
          (e.clientX - rect.left - rect.width / 2 - sight.eyeOffset.x) / scale +
          boardSize.width / 2,
        y:
          (e.clientY - rect.top - rect.height / 2 - sight.eyeOffset.y) / scale +
          boardSize.height / 2,
      };
      if (appConfigs.snapUnitCoordToGrid) {
        position = snapUnitCoordToGrid(position);
      }
      actions.addUnit(catalogKey, position);
    },
  };
}

export const MainEditArea = () => {
  const { unitItems, sight, notes } = store.useSnapshot();
  const wires = useWireItems();
  const dropHandlers = useDropHandlers();
  useKeyboardAutoTarget();
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
      <GithubBadge />
      <TopControlBar />
    </div>
  );
};
