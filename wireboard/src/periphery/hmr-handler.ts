import { CatalogKey } from "@/base/showcase-entries";
import { store } from "@/model/store";

const hmrActions = {
  handleUnitSourceUpdate(catalogKey: CatalogKey) {
    const targetUnitIds: string[] = [];
    store.produceUnitItems((draft) => {
      for (const item of draft) {
        if (item.catalogKey === catalogKey) {
          item.hmrRevision ??= 0;
          item.hmrRevision++;
          targetUnitIds.push(item.unitId);
        }
      }
    });
    store.produceWireItems((draft) => {
      for (const wire of draft) {
        if (
          targetUnitIds.includes(wire.sourceUnitId) ||
          targetUnitIds.includes(wire.destinationUnitId)
        ) {
          wire.hmrRevision ??= 0;
          wire.hmrRevision++;
        }
      }
    });
  },
};

export function setupHmrHandler() {
  if (import.meta.hot) {
    import.meta.hot.on("custom:unit-source-changed", (data) => {
      const { catalogKey } = data;
      if (catalogKey) {
        console.log("unit source changed", catalogKey);
        hmrActions.handleUnitSourceUpdate(catalogKey);
      }
    });
  }
}
