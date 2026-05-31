import "./page.css";
import "beams/ax-ui/utility-classes.css";
//
import { mountAppRoot } from "beams/ax-react/mount-app-root";
import { mapKnobGainDb } from "beams/mo-audio/map-knob-gain-db";
import { setupMidiKeyboardInput } from "beams/mx-audio/midi-keyboard-input";
import { useEffect, useMemo } from "react";
import { HostAppProvider } from "wus-host/react";
import { CreditsPanel } from "@/sections/credits-panel";
import { PickerColumn } from "@/sections/picker-column";
import { hostSystem, store } from "@/store/store";
import { EditArea } from "./sections/edit-area";
import { actions } from "./store/actions";

const PageRoot = () => {
  const { infoPanelVisible } = store.useSnapshot();
  return (
    <div className="w-dvw h-dvh bg-gray-700 flex-h">
      <PickerColumn />
      <EditArea />
      {infoPanelVisible && <CreditsPanel />}
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
