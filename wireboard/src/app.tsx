import { mountAppRoot } from "mofur/ax-react";
import { mapKnobGainDb } from "mofur/mo-audio";
import { setupMidiKeyboardInput } from "mofur/mx-audio";
import { useEffect, useMemo } from "react";
import { HostAppProvider } from "wafer-host/react";
import { hostSystem } from "@/central/host-system-instance";
import { store } from "@/central/store";
import { actions } from "./central/actions";
import { PageRoot } from "./features/page-root";
import { setupHmrHandler } from "./handlers/hmr-handler";

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
