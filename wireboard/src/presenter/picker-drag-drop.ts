import { appConfigs, boardSize } from "@/base/constants";
import { unitCatalogKeyDragMime } from "@/base/drag-drop-key";
import { ShowcaseEntry, showcaseEntries } from "@/base/showcase-entries";
import { actions } from "@/model/actions";
import { snapUnitCoordToGrid } from "@/model/helpers/snapping";
import { store } from "@/model/store";

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
      if (appConfigs.snapUnitCoordToGrid) {
        position = snapUnitCoordToGrid(position);
      }
      actions.addUnit(
        showcaseEntry.catalogKey,
        position,
        showcaseEntry.templateFn,
        showcaseEntry.moduleUrl,
      );
    },
  };
}
