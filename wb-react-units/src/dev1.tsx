import { mountAppRoot } from "mofur/ax-react";
import { setupMidiKeyboardInput } from "mofur/mx-audio";
import { Button } from "mofur-components/mono2";
import { useEffect } from "react";
import { createStore } from "snap-store";
import { createHostSystem } from "wus-host/host";
import { HostAppProvider, ReactUnitFrame } from "wus-host/react";
import { createMetronomeUnit } from "./units/metronome";
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
  bpm: 110,
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
  const { playing, bpm, notes, feedNotesToSequencer } = store.useSnapshot();
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
          <div className="flex-ha gap-2">
            <Button active={playing} onClick={store.togglePlaying}>
              play
            </Button>
            <Button
              active={feedNotesToSequencer}
              onClick={store.toggleFeedNotesToSequencer}
            >
              feed
            </Button>
          </div>
          <ReactUnitFrame
            unitId="metronome"
            destSpec="$output"
            unitTemplateFn={createMetronomeUnit}
          />
          <ReactUnitFrame
            unitId="testOsc1"
            destSpec="$output"
            unitTemplateFn={createTestOscUnit}
          />
          <ReactUnitFrame
            unitId="unit1"
            destSpec="testOsc1"
            unitTemplateFn={createUnit1}
            inputNotes={notes}
          />
        </div>
      </div>
    </HostAppProvider>
  );
};

mountAppRoot(<App />);
