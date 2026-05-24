import clsx from "clsx";
import { useEffect } from "react";
import { createStore } from "snap-store";
import { Button } from "@/components/button";
import { createHostSystem } from "@/host-system/host";
import { UnitFrame } from "@/host-system/react";
import { setupMidiKeyboardInput } from "@/utils/midi-keyboard-input";
import { mountAppRoot } from "@/utils/mount-app-root";
import {
  createFieldSightHandlers,
  FieldSight,
  FieldSightPlane,
} from "@/x/field-sight";
import catalog from "../unit-inventories.json";

catalog;

type CatalogKey = keyof typeof catalog;

type SightMode = "free" | "scene";

type StoreState = {
  bpm: number;
  playing: boolean;
  notes: number[];
  wholeSlotsVisible: boolean;
  sight: FieldSight;
  sightMode: SightMode;
};

const audioContext = new AudioContext();
const hostSystem = createHostSystem(audioContext);
const store = createStore<StoreState>({
  bpm: 120,
  playing: false,
  notes: [],
  wholeSlotsVisible: true,
  sight: { zoom: -1, eyeOffset: { x: 0, y: 0 } },
  sightMode: "free",
});

const sightHandlers = createFieldSightHandlers(
  () => store.state.sight,
  (attrs) => store.patchSight(attrs),
  { minZoom: -2, maxZoom: 2 },
);

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

const PartSlot = ({
  partSlotId,
  altSide,
  instrumentUnitKey,
  sequencerUnitKey,
}: {
  partSlotId: string;
  altSide?: boolean;
  instrumentUnitKey?: CatalogKey;
  sequencerUnitKey?: CatalogKey;
}) => {
  const instrumentUnitId = `${partSlotId}_${instrumentUnitKey}`;
  const sequencerUnitId = `${partSlotId}_${sequencerUnitKey}`;
  return (
    <div
      className="w-[1400px] h-[400px] flex-h gap-4"
      style={{ flexDirection: altSide ? "row-reverse" : undefined }}
    >
      <div className="grow h-full bg-gray-200 flex-c text-[40px]">
        {sequencerUnitKey && (
          <UnitFrame
            unitId={sequencerUnitId}
            destUnitId={instrumentUnitId}
            pageUrl={catalog[sequencerUnitKey].loaderPageUrl}
            frameSize={catalog[sequencerUnitKey].preferredSize}
            hostSystem={hostSystem}
          />
        )}
      </div>
      <div className="w-[600px] h-full bg-gray-200 flex-c text-[40px]">
        {instrumentUnitKey && (
          <UnitFrame
            unitId={instrumentUnitId}
            destUnitId="$output"
            pageUrl={catalog[instrumentUnitKey].loaderPageUrl}
            frameSize={catalog[instrumentUnitKey].preferredSize}
            hostSystem={hostSystem}
          />
        )}
      </div>
    </div>
  );
};

const TopBar = () => {
  const state = store.useSnapshot();
  return (
    <div className="flex-h justify-between bg-gray-300 p-2">
      <div />
      <div className="flex-h gap-3">
        <div>zoom: {state.sight.zoom.toFixed(2)}</div>
        <Button
          text="expand"
          active={state.wholeSlotsVisible}
          onClick={() => actions.setWholeSlotsVisible(!state.wholeSlotsVisible)}
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
  );
};

const boardSize = { width: 3000, height: 2000 };

const PageRoot = () => {
  const state = store.useSnapshot();
  return (
    <div className="w-dvw h-dvh flex-v">
      <TopBar />
      <div className="grow">
        <FieldSightPlane
          sight={state.sight}
          handlers={sightHandlers}
          boardSize={boardSize}
        >
          <div className="w-full h-full flex-c">
            <div className={clsx("flex-h gap-6")}>
              <div className="flex-v gap-4">
                <PartSlot
                  partSlotId="ps1"
                  instrumentUnitKey="my_drum_machine"
                />
                <PartSlot
                  partSlotId="ps2"
                  instrumentUnitKey="mini_synth_ge"
                  sequencerUnitKey="mu4_keyboard"
                />
                <PartSlot partSlotId="ps3" instrumentUnitKey="mu4_keyboard" />
                <PartSlot partSlotId="ps4" />
              </div>
              <div className="flex-v gap-4">
                <PartSlot
                  partSlotId="ps5"
                  sequencerUnitKey="mu2_sequencer"
                  instrumentUnitKey="wavicle"
                />
                <PartSlot partSlotId="ps6" />
                <PartSlot partSlotId="ps7" />
                <PartSlot partSlotId="ps8" />
              </div>
            </div>
          </div>
        </FieldSightPlane>
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
