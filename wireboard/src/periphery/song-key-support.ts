import { useEffect } from "react";
import { hostSystem } from "@/model/host-system-instance";
import { store } from "@/model/store";

export function useSetupSongKeySupport() {
  useEffect(() => {
    return hostSystem.eventPort.subscribe((ev) => {
      if (ev.type === "unitAdded") {
        const { songKey } = store.state;
        const unit = ev.unitInstance;
        unit.hostCallbacks?.setKey?.(songKey);
      }
    });
  }, []);

  const { songKey } = store.useSnapshot();
  useEffect(() => {
    hostSystem.getAllUnits().forEach((unit) => {
      unit.hostCallbacks?.setKey?.(songKey);
    });
  }, [songKey]);
}
