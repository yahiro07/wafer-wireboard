import { mountAppRoot } from "mofur/ax-react";
import { mapKnobGainDb } from "mofur/mo-audio";
import { useEffect, useMemo } from "react";
import {
  HostAppProvider,
  useSequencerTickDriverRunner,
} from "wafer-host/react";
import { hostSystem, sequencerTickDriver } from "@/model/host-system-instance";
import { store } from "@/model/store";
import { setupDynamicClockingSupport } from "@/periphery/dynamic-clocking-support";
import { setupHmrHandler } from "@/periphery/hmr-handler";
import { setupMidiInputHandling } from "@/periphery/midi-input-handling";
import { createPartialPlaybackSupport } from "@/periphery/partial-playback-support";
import { projectsModel } from "@/project/projects-model";
import { PageRoot } from "@/views/page-root";

projectsModel.prepareProject(true);

const partialPlaybackSupport = createPartialPlaybackSupport();

const App = () => {
  const { bpm, playing, masterVolume } = store.useSnapshot();
  const masterGain = useMemo(
    () => mapKnobGainDb(masterVolume, 0.5),
    [masterVolume],
  );
  useEffect(setupMidiInputHandling, []);
  useEffect(projectsModel.setupLifecycle, []);
  useSequencerTickDriverRunner({ sequencerTickDriver, playing, bpm });
  useEffect(() => {
    if (0) {
      return setupDynamicClockingSupport(); //unstable so far
    }
  }, []);
  partialPlaybackSupport.useSetup();
  return (
    <HostAppProvider
      hostSystem={hostSystem}
      playing={playing}
      bpm={bpm}
      masterGain={masterGain}
    >
      <PageRoot />
    </HostAppProvider>
  );
};

mountAppRoot(<App />);

setupHmrHandler();
