import { mountAppRoot } from "mofur/ax-react";
import { setupMidiKeyboardInput } from "mofur/mx-audio";
import { useEffect } from "react";
import { createStore } from "snap-store";
import { createHostSystem } from "wus-host/host";
import { HostAppProvider, ReactUnitFrame } from "wus-host/react";
import { createTestOscUnit } from "./units/test-osc";
import { createUnit1 } from "./units/unit1";

const audioContext = new AudioContext();
const hostSystem = createHostSystem(audioContext);

export type StoreState = {
  notes: number[];
  bpm: number;
  playing: boolean;
  feedNotesToSequencer: boolean;
};

export const store = createStore<StoreState>({
  notes: [],
  bpm: 120,
  playing: false,
  feedNotesToSequencer: false,
});
const actions = {
  midiInNoteOn(noteNumber: number) {
    if (!store.state.notes.includes(noteNumber)) {
      store.setNotes((prev) => [...prev, noteNumber]);
    }
  },
  midiInNoteOff(noteNumber: number) {
    store.setNotes((prev) => prev.filter((item) => item !== noteNumber));
  },
};

const App = () => {
  const { playing, bpm, notes } = store.useSnapshot();
  useEffect(
    () =>
      setupMidiKeyboardInput({
        noteOn: actions.midiInNoteOn,
        noteOff: actions.midiInNoteOff,
      }),
    [],
  );

  return (
    <HostAppProvider hostSystem={hostSystem} playing={playing} bpm={bpm}>
      <div className="w-dvw h-dvh flex-c">
        <div className="flex-v gap-2">
          <ReactUnitFrame
            unitId="testOsc1"
            destSpec="$output"
            unitTemplateFn={createTestOscUnit}
            inputNotes={notes}
          />
          <ReactUnitFrame unitId="unit1" unitTemplateFn={createUnit1} />
        </div>
      </div>
    </HostAppProvider>
  );
};

mountAppRoot(<App />);
