import { actions } from "@/central/actions";

export function setupHmrHandler() {
  if (import.meta.hot) {
    import.meta.hot.on("custom:unit-source-changed", (data) => {
      const { catalogKey } = data;
      if (catalogKey) {
        console.log("unit source changed", catalogKey);
        actions.handleUnitSourceUpdate(catalogKey);
      }
    });
  }
}
