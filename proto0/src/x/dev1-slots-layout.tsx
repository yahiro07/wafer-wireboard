import clsx from "clsx";
import { useEffect } from "react";
import { createStore } from "snap-store";
import { Button } from "@/components/button";
import { useWindowSize } from "@/hooks/use-window-size";
import { createHostSystem } from "@/host-system/host";
import { setupMidiKeyboardInput } from "@/utils/midi-keyboard-input";
import { mountAppRoot } from "@/utils/mount-app-root";
import catalog from "../unit-inventories.json";

catalog;

type StoreState = {
  bpm: number;
  playing: boolean;
  notes: number[];
  wholeSlotsVisible: boolean;
};

const audioContext = new AudioContext();
const hostSystem = createHostSystem(audioContext);
const store = createStore<StoreState>({
  bpm: 120,
  playing: false,
  notes: [],
  wholeSlotsVisible: false,
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
  setWholeSlotsVisible(wholeSlotsVisible: boolean) {
    store.setWholeSlotsVisible(wholeSlotsVisible);
  },
};

const PartSlot = (props: { visible: boolean }) => {
  if (!props.visible) return null;
  return (
    <div className="w-[1400px] h-[400px] flex-h gap-4">
      <div className="grow h-full bg-gray-200" />
      <div className="w-[600px] h-full bg-gray-200" />
    </div>
  );
};

const PageRoot = () => {
  const windowSize = useWindowSize();
  const isVertical = windowSize.height > windowSize.width;

  const state = store.useSnapshot();
  return (
    <div className="w-dvw h-dvh flex-v">
      <div className="flex-h justify-between bg-gray-300 p-2">
        <div />
        <Button
          text="full"
          active={state.wholeSlotsVisible}
          onClick={() => actions.setWholeSlotsVisible(!state.wholeSlotsVisible)}
        />
      </div>
      <div className="grow flex-c">
        <div style={{ zoom: 0.4 }}>
          <div
            className={clsx(
              "flex-wrap",
              isVertical ? "flex-v gap-4 " : "flex-h gap-6",
            )}
          >
            <div className="flex-v gap-4">
              <PartSlot visible={true} />
              <PartSlot visible={true} />
              <PartSlot visible={state.wholeSlotsVisible} />
            </div>
            <div className="flex-v gap-4">
              <PartSlot visible={true} />
              <PartSlot visible={true} />
              <PartSlot visible={state.wholeSlotsVisible} />
            </div>
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
