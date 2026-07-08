import { useEffect } from "react";
import { hostSystem } from "@/model/host-system-instance";
import { store } from "@/model/store";
import { startPartialPlayback } from "@/periphery/partial-playback-core";

type MessageFromUnits = {
  type: "partialPlaybackRequest";
  playing: boolean;
};

function setupUnitMessageReceiver() {
  return hostSystem.subscribeMessageFromUnits((_message: any, senderUnitId) => {
    const message = _message as MessageFromUnits;
    if (message.type === "partialPlaybackRequest") {
      const { playing } = message;
      store.setPartialPlayTargetUnitId(playing ? senderUnitId : null);
    }
  });
}

function usePartialPlaybackDriver() {
  const { playing, partialPlayTargetUnitId } = store.useSnapshot();
  const targetUnitId = !playing && partialPlayTargetUnitId;
  useEffect(() => {
    if (targetUnitId) {
      return startPartialPlayback(targetUnitId);
    }
  }, [targetUnitId]);
}

export function useSetupPartialGraphPlaybackSupport() {
  useEffect(setupUnitMessageReceiver, []);
  usePartialPlaybackDriver();
}
