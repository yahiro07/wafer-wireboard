import { mountAppRoot } from "mofur/ax-react";
import { mapKnobGainDb } from "mofur/mo-audio";
import { setupMidiKeyboardInput } from "mofur/mx-audio";
import { useEffect, useMemo } from "react";
import {
  HostAppProvider,
  useSequencerTickDriverRunner,
} from "wafer-host/react";
import { hostSystem, sequencerTickDriver } from "@/model/host-system-instance";
import { prepareProject } from "@/model/project/project-setup";
import { store } from "@/model/store";
import { setupHmrHandler } from "@/presenter/hmr-handler";
import { PageRoot } from "@/views/page-root";

const projectLifecycleFn = prepareProject();

function setupMidiInHandling() {
  const destUnitId = "builtInKeyboard";
  return setupMidiKeyboardInput({
    noteOn(noteNumber) {
      hostSystem.deliverNote({ destUnitId, noteNumber, isOn: true });
    },
    noteOff(noteNumber) {
      hostSystem.deliverNote({ destUnitId, noteNumber, isOn: false });
    },
  });
}

const App = () => {
  const { playing, bpm, masterVolume } = store.useSnapshot();
  const masterGain = useMemo(
    () => mapKnobGainDb(masterVolume, 0.5),
    [masterVolume],
  );
  useEffect(setupMidiInHandling, []);
  useEffect(projectLifecycleFn, []);
  useSequencerTickDriverRunner({ sequencerTickDriver, playing, bpm });
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
