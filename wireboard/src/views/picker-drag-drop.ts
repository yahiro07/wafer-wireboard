import { appConfig } from "@/main-definitions/app-config";
import { boardSize } from "@/main-definitions/constants";
import {
  ShowcaseEntry,
  showcaseEntries,
} from "@/main-definitions/showcase-entries";
import { actions } from "@/model/actions";
import { store } from "@/model/store";
import { applyWarpMixInitialWiring_onUnitAdded } from "@/periphery/warp-mix-initial-wiring";
import { snapUnitCoordToGrid } from "@/unit/snapping";

const unitCatalogKeyDragMime = "application/x-wireboard-unit-catalog-key";

export const handlePickerItemDragStart = (
  e: React.DragEvent<HTMLDivElement>,
  entry: ShowcaseEntry,
) => {
  e.dataTransfer.effectAllowed = "copy";
  e.dataTransfer.setData(unitCatalogKeyDragMime, entry.catalogKey);
  e.dataTransfer.setData("text/plain", entry.catalogKey);
};

export function useMainAreaDropHandlers() {
  return {
    onDragOver(e: React.DragEvent<HTMLDivElement>) {
      if (e.dataTransfer.types.includes(unitCatalogKeyDragMime)) {
        e.preventDefault();
        e.dataTransfer.dropEffect = "copy";
      }
    },
    onDrop(e: React.DragEvent<HTMLDivElement>) {
      const catalogKey = e.dataTransfer.getData(unitCatalogKeyDragMime);

      const showcaseEntry = showcaseEntries.find(
        (it) => it.catalogKey === catalogKey,
      );
      if (!showcaseEntry) return;

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
      if (appConfig.snapUnitCoordToGrid) {
        position = snapUnitCoordToGrid(position);
      }
      const unitId = actions.addUnit(showcaseEntry, position);
      applyWarpMixInitialWiring_onUnitAdded(unitId);
    },
  };
}
