import "./page.css";
import "beams/ax-ui/utility-classes.css";
//
import { mountAppRoot } from "beams/ax-react/mount-app-root";
import { mapKnobGainDb } from "beams/mo-audio/map-knob-gain-db";
import { setupMidiKeyboardInput } from "beams/mx-audio/midi-keyboard-input";
import { useEffect, useMemo } from "react";
import { HostAppProvider } from "wus-host/react";
import { PickerColumn } from "@/features/picker/picker-column";
import { hostSystem, store } from "@/store/store";
import { InformationPanel } from "./features/information-panel";
import { MainEditArea } from "./features/main-edit-area/main-edit-area";
import { actions } from "./store/actions";

const PageRoot = () => {
  const { infoPanelVisible } = store.useSnapshot();
  return (
    <div className="w-dvw h-dvh bg-[hsl(216,22%,18%)] flex-h">
      <PickerColumn />
      <MainEditArea />
      {infoPanelVisible && <InformationPanel />}
    </div>
  );
};

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
