import { mountAppRoot } from "mofur/ax-react";
import { mapKnobGainDb } from "mofur/mo-audio";
import { setupMidiKeyboardInput } from "mofur/mx-audio";
import { useEffect, useMemo } from "react";
import {
  HostAppProvider,
  useSequencerTickDriverRunner,
} from "wafer-host/react";
import { actions } from "@/model/actions";
import { hostSystem, sequencerTickDriver } from "@/model/host-system-instance";
import { prepareProject } from "@/model/project/project-setup";
import { store } from "@/model/store";
import { setupHmrHandler } from "@/presenter/hmr-handler";
import { PageRoot } from "@/views/page-root";

const projectLifecycleFn = prepareProject();

const App = () => {
  const { playing, bpm, masterVolume } = store.useSnapshot();
  const masterGain = useMemo(
    () => mapKnobGainDb(masterVolume, 0.5),
    [masterVolume],
  );
  useEffect(
    () =>
      setupMidiKeyboardInput({
        noteOn: actions.midiInNoteOn,
        noteOff: actions.midiInNoteOff,
      }),
    [],
  );
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
