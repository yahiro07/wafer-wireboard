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

type SightMode = "free" | "scene";

type StoreState = {
  bpm: number;
  playing: boolean;
  notes: number[];
  wholeSlotsVisible: boolean;
  sightMode: SightMode;
};

const audioContext = new AudioContext();
const hostSystem = createHostSystem(audioContext);
const store = createStore<StoreState>({
  bpm: 120,
  playing: false,
  notes: [],
  wholeSlotsVisible: false,
  sightMode: "free",
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
  setSightMode(sightMode: SightMode) {
    store.setSightMode(sightMode);
  },
};

const PartSlot = ({ id, visible }: { id: string; visible: boolean }) => {
  if (!visible) return null;
  return (
    <div className="w-[1400px] h-[400px] flex-h gap-4">
      <div className="grow h-full bg-gray-200 flex-c text-[40px]">{id}a</div>
      <div className="w-[600px] h-full bg-gray-200 flex-c text-[40px]">
        {id}b
      </div>
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
        <div className="flex-h gap-3">
          <Button
            text="expand"
            active={state.wholeSlotsVisible}
            onClick={() =>
              actions.setWholeSlotsVisible(!state.wholeSlotsVisible)
            }
          />
          <div className="flex-h gap-1">
            <Button
              text="free"
              active={state.sightMode === "free"}
              onClick={() => actions.setSightMode("free")}
            />
            <Button
              text="scene"
              active={state.sightMode === "scene"}
              onClick={() => actions.setSightMode("scene")}
            />
          </div>
        </div>
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
              <PartSlot id="1" visible={true} />
              <PartSlot id="2" visible={true} />
              <PartSlot id="3" visible={state.wholeSlotsVisible} />
            </div>
            <div className="flex-v gap-4">
              <PartSlot id="4" visible={true} />
              <PartSlot id="5" visible={true} />
              <PartSlot id="6" visible={state.wholeSlotsVisible} />
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
