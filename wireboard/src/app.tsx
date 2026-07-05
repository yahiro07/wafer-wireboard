import { mountAppRoot } from "mofur/ax-react";
import { mapKnobGainDb } from "mofur/mo-audio";
import { useEffect, useMemo } from "react";
import {
  HostAppProvider,
  useSequencerTickDriverRunner,
} from "wafer-host/react";
import { hostSystem, sequencerTickDriver } from "@/model/host-system-instance";
import { prepareProject } from "@/model/project/project-setup";
import { store } from "@/model/store";
import { setupDynamicClockingSupport } from "@/periphery/dynamic-clocking-support";
import { setupHmrHandler } from "@/periphery/hmr-handler";
import { setupMidiInputHandling } from "@/periphery/midi-input-handling";
import { PageRoot } from "@/views/page-root";

const projectLifecycleFn = prepareProject(true);

const App = () => {
  const { playing, bpm, masterVolume } = store.useSnapshot();
  const masterGain = useMemo(
    () => mapKnobGainDb(masterVolume, 0.5),
    [masterVolume],
  );
  useEffect(setupMidiInputHandling, []);
  useEffect(projectLifecycleFn, []);
  useSequencerTickDriverRunner({ sequencerTickDriver, playing, bpm });
  useEffect(setupDynamicClockingSupport, []);
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
