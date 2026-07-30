import { useEffect } from "react";
import { hostSystem } from "@/model/host-system-instance";
import { store } from "@/model/store";

const keyTransposeMap = {
  G: -5,
  "G#": -4,
  Ab: -4,
  A: -3,
  "A#": -2,
  Bb: -2,
  B: -1,
  C: 0,
  "C#": 1,
  Db: 1,
  D: 2,
  "D#": 3,
  Eb: 3,
  E: 4,
  F: 5,
  "F#": 6,
  Gb: 6,
  //
  Em: -5,
  Fm: -4,
  "F#m": -3,
  Gbm: -3,
  Gm: -2,
  "G#m": -1,
  Abm: -1,
  Am: 0,
  "A#m": 1,
  Bbm: 1,
  Bm: 2,
  Cm: 3,
  "C#m": 4,
  Dbm: 4,
  Dm: 5,
  "D#m": 6,
  Ebm: 6,
};

function getKeyTranspose(songKey: string) {
  return keyTransposeMap[songKey as keyof typeof keyTransposeMap] ?? 0;
}

export function useSetupSongKeySupport() {
  useEffect(() => {
    return hostSystem.eventPort.subscribe((ev) => {
      if (ev.type === "unitAdded") {
        const { songKey, bpm } = store.state;
        const unit = ev.unitInstance;
        const keyTranspose = getKeyTranspose(songKey);
        unit.hostCallbacks?.setKey?.(songKey);
        unit.hostCallbacks?.setKeyTranspose?.(keyTranspose);
        unit.hostCallbacks?.setBpm?.(bpm);
      }
    });
  }, []);

  const { songKey } = store.useSnapshot();
  useEffect(() => {
    hostSystem.getAllUnits().forEach((unit) => {
      const keyTranspose = getKeyTranspose(songKey);
      unit.hostCallbacks?.setKey?.(songKey);
      unit.hostCallbacks?.setKeyTranspose?.(keyTranspose);
    });
  }, [songKey]);
}
