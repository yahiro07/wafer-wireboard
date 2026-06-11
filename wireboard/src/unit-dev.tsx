import { mountAppRoot } from "mofur/ax-react";
import { setupMidiKeyboardInput } from "mofur/mx-audio";
import { Button } from "mofur-components/mono2";
import { useEffect } from "react";
import { createStore } from "snap-store";
import { HostAppProvider } from "wus-host/react";
import { CatalogKey } from "@/base/showcase-entries";
import { UnitFrameEx } from "@/features/unit-box/unit-frame-ex";
import { hostSystem } from "@/store/host-system-instance";
import { createChordProgressionUnit } from "@/units/chord-progression/chord-progression-unit";
import { createRtfrUnit } from "@/units/rtfr/rtfr";

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
  const { playing, bpm, notes, feedNotesToSequencer } = store.useSnapshot();
  useEffect(
    () =>
      setupMidiKeyboardInput({
        noteOn: actions.midiInNoteOn,
        noteOff: actions.midiInNoteOff,
      }),
    [],
  );
  const synthCategoryKey: CatalogKey = "webaudioTinysynthSimple";
  // const synthCategoryKey: CatalogKey = "wavicle";

  return (
    <HostAppProvider hostSystem={hostSystem} playing={playing} bpm={bpm}>
      <div className="w-dvw h-dvh flex-c">
        <div className="flex-ha gap-4">
          <div className="flex-v w-[500px] h-[500px]">
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
            <UnitFrameEx
              templateFn={createChordProgressionUnit}
              unitId="chordProgression"
            />
          </div>
          <div className="flex-v w-[500px] h-[500px]">
            <UnitFrameEx
              unitId="synth"
              destUnitId="$output"
              catalogKey={synthCategoryKey}
              notes={!feedNotesToSequencer ? notes : undefined}
            />
            <UnitFrameEx
              unitId="sequencer"
              destUnitId="synth"
              templateFn={createRtfrUnit}
              notes={feedNotesToSequencer ? notes : undefined}
            />
          </div>
        </div>
      </div>
    </HostAppProvider>
  );
};

mountAppRoot(<App />);
