import { useEffect } from "react";
import { SongKeySpec } from "wafer-host/unit-types";
import { hostSystem } from "@/model/host-system-instance";
import { store } from "@/model/store";

const rootMap = {
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
};

function getSongKeySpec(songKey: string): SongKeySpec {
  const mode = songKey.includes("m") ? "minor" : "major";
  const root = rootMap[songKey.replace("m", "") as keyof typeof rootMap] ?? 0;
  const keyTranspose = root + (mode === "minor" ? 3 : 0);
  return { root, mode, keyTranspose };
}

export function useSetupSongKeySupport() {
  useEffect(() => {
    return hostSystem.eventPort.subscribe((ev) => {
      if (ev.type === "unitAdded") {
        const { songKey, bpm } = store.state;
        const unit = ev.unitInstance;
        const songKeySpec = getSongKeySpec(songKey);
        unit.hostCallbacks?.setKey?.(songKeySpec);
        unit.hostCallbacks?.setBpm?.(bpm);
      }
    });
  }, []);

  const { songKey } = store.useSnapshot();
  useEffect(() => {
    const songKeySpec = getSongKeySpec(songKey);
    hostSystem.getAllUnits().forEach((unit) => {
      unit.hostCallbacks?.setKey?.(songKeySpec);
    });
  }, [songKey]);
}
