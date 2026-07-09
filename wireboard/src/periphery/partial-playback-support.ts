import { useEffect, useMemo } from "react";
import { hostSystem } from "@/model/host-system-instance";
import { store } from "@/model/store";
import { createPartialPlaybackSupportCore } from "@/periphery/partial-playback-support-core";

type MessageFromUnits = {
  type: "partialPlaybackRequest";
  playing: boolean;
};

export function createPartialPlaybackSupport() {
  function setupUnitMessageReceiver() {
    return hostSystem.subscribeMessageFromUnits(
      (_message: any, senderUnitId) => {
        const message = _message as MessageFromUnits;
        if (message.type === "partialPlaybackRequest") {
          const { playing } = message;
          if (playing) {
            store.setPartialPlayTargetUnitIds((prev) => [
              ...prev,
              senderUnitId,
            ]);
          } else {
            store.setPartialPlayTargetUnitIds((prev) =>
              prev.filter((id) => id !== senderUnitId),
            );
          }
        }
      },
    );
  }

  function usePartialPlaybackDriver() {
    const partialPlaybackSupportCore = useMemo(
      createPartialPlaybackSupportCore,
      [],
    );
    const { playing, partialPlayTargetUnitIds } = store.useSnapshot();
    const targetUnitIds =
      (!playing &&
        partialPlayTargetUnitIds.length > 0 &&
        partialPlayTargetUnitIds) ||
      null;
    useEffect(() => {
      partialPlaybackSupportCore.updatePartialPlayback(targetUnitIds);
    }, [targetUnitIds, partialPlaybackSupportCore]);
  }

  return {
    useSetup() {
      useEffect(setupUnitMessageReceiver, []);
      usePartialPlaybackDriver();
    },
  };
}
