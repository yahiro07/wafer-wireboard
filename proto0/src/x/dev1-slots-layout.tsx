import clsx from "clsx";
import { useEffect } from "react";
import { createStore } from "snap-store";
import { useWindowSize } from "@/hooks/use-window-size";
import { createHostSystem } from "@/host-system/host";
import { UnitFrame } from "@/host-system/react";
import { setupMidiKeyboardInput } from "@/utils/midi-keyboard-input";
import { mountAppRoot } from "@/utils/mount-app-root";
import catalog from "../unit-inventories.json";

catalog;

type StoreState = {
  bpm: number;
  playing: boolean;
  notes: number[];
};

const audioContext = new AudioContext();
const hostSystem = createHostSystem(audioContext);
const store = createStore<StoreState>({
  bpm: 120,
  playing: false,
  notes: [],
});

const actions = {
  noteOn(noteNumber: number) {
    store.setNotes((prev) => [...prev, noteNumber]);
  },
  noteOff(noteNumber: number) {
    store.setNotes((prev) => prev.filter((p) => p !== noteNumber));
  },
  togglePlayState() {
    store.setPlaying((prev) => !prev);
  },
  setBpm(bpm: number) {
    store.setBpm(bpm);
  },
};

const UnitsSolid = () => {
  const state = store.useSnapshot();
  return (
    <>
      <UnitFrame
        unitId="uf_effect"
        pageUrl={catalog.mu5_visualizer.loaderPageUrl}
        destUnitId="$output"
        hostSystem={hostSystem}
      />
      <UnitFrame
        unitId="uf_instrument"
        pageUrl={catalog.mini_synth_ge.loaderPageUrl}
        // pageUrl={catalog.mini_synth_ge.loaderPageUrl}
        // className="w-[640px] h-[320px]"
        frameSize={catalog.mini_synth_ge.preferredSize}
        destUnitId="uf_effect"
        hostSystem={hostSystem}
        hostBpm={state.bpm}
        hostPlaying={state.playing}
      />
      <UnitFrame
        unitId="uf_keyboard"
        pageUrl={catalog.mu4_keyboard.loaderPageUrl}
        destUnitId="uf_instrument"
        hostSystem={hostSystem}
        inputNotes={state.notes}
      />
    </>
  );
};

const PartSlot = () => {
  return (
    <div className="w-[1800px] h-[400px] flex-h gap-4">
      <div className="grow h-full bg-gray-200" />
      <div className="w-[600px] h-full bg-gray-200" />
    </div>
  );
};

const PageRoot = () => {
  const windowSize = useWindowSize();
  const isVertical = windowSize.height > windowSize.width;

  return (
    <div className="w-dvw h-dvh flex-vc">
      <div style={{ zoom: 0.3 }}>
        <div
          className={clsx("gap-4 flex-wrap", isVertical ? "flex-v" : "flex-h")}
        >
          <div className="flex-v gap-4">
            <PartSlot />
            <PartSlot />
            <PartSlot />
            <PartSlot />
          </div>
          <div className="flex-v gap-4">
            <PartSlot />
            <PartSlot />
            <PartSlot />
            <PartSlot />
          </div>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  useEffect(() =>
    setupMidiKeyboardInput({
      noteOn: actions.noteOn,
      noteOff: actions.noteOff,
    }),
  );
  return <PageRoot />;
};

mountAppRoot(<App />);
