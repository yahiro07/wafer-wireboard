import { Point } from "beams/ax-ui/common-types";
import { store } from "@/store/store";

export const actions = {
  setUnitPosition(unitId: string, position: Point) {
    store.setUnitItems(
      store.state.unitItems.map((item) =>
        item.unitId === unitId ? { ...item, position } : item,
      ),
    );
  },
};
