import { mountAppRoot } from "beams/ax-react/mount-app-root";
import { Size } from "beams/mo-react/hooks/common-types";
import { setupMidiKeyboardInput } from "beams/mx-audio/midi-keyboard-input";
import { useCallback, useEffect, useMemo } from "react";
import { createStore } from "snap-store";
import { createHostSystem, createSequenceTickDriver } from "wus-host/host";
import { UnitFrame } from "wus-host/react";
import { normalizeFrameSize } from "wus-host/react/frame-size";
import { Button } from "@/components/button";
import { Icons } from "@/components/icons";
import { NumberSliderBox } from "@/components/number-slider-box";
import {
  createFieldSightHandlers,
  FieldSight,
  FieldSightPlane,
} from "@/components-ex/field-sight-plane";
import { UnitFrameScaler } from "@/components-ex/unit-frame-scaler";
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
const sequenceTickDriver = createSequenceTickDriver(hostSystem);

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
    if (store.state.playing) {
      sequenceTickDriver.start();
    } else {
      sequenceTickDriver.stop();
    }
  },
  setBpm(bpm: number) {
    store.setBpm(bpm);
    sequenceTickDriver.setBpm(bpm);
  },
  setWholeSlotsVisible(wholeSlotsVisible: boolean) {
    store.setWholeSlotsVisible(wholeSlotsVisible);
  },
  setSightMode(sightMode: SightMode) {
    store.setSightMode(sightMode);
  },
};

const TopBar = () => {
  const state = store.useSnapshot();
  return (
    <div className="flex-h justify-between bg-gray-300 p-2">
      <div className="flex-ha gap-2">
        <Button active={state.playing} onClick={actions.togglePlayState}>
          <Icons.Play />
        </Button>
        <NumberSliderBox
          value={state.bpm}
          min={80}
          max={150}
          step={1}
          fracDigits={0}
          onChange={actions.setBpm}
          label="BPM"
        />
      </div>
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

const UnitFrameEx = ({
  unitId,
  destUnitId,
  catalogKey,
  containerSize,
  frameSizeOverride,
}: {
  unitId: string;
  destUnitId: string;
  catalogKey: CatalogKey;
  containerSize: Size;
  frameSizeOverride?: Size;
}) => {
  const state = store.useSnapshot();
  const onIframeMounted = useCallback((iframe: HTMLIFrameElement) => {
    const win = iframe.contentWindow as Window;
    win.addEventListener("wheel", sightHandlers.onWheel);
    win.addEventListener("pointerdown", sightHandlers.onPointerDown, {
      capture: true,
    });
    return () => {
      win.removeEventListener("wheel", sightHandlers.onWheel);
      win.removeEventListener("pointerdown", sightHandlers.onPointerDown, {
        capture: true,
      });
    };
  }, []);
  const frameSize = useMemo(
    () =>
      frameSizeOverride ??
      normalizeFrameSize(catalog[catalogKey].preferredSize)!,
    [catalogKey, frameSizeOverride],
  );
  return (
    <UnitFrameScaler containerSize={containerSize} unitFrameSize={frameSize}>
      <UnitFrame
        unitId={unitId}
        destUnitId={destUnitId}
        pageUrl={catalog[catalogKey].loaderPageUrl}
        frameSize={frameSize}
        hostSystem={hostSystem}
        hostBpm={state.bpm}
        hostPlaying={state.playing}
        onIframeMounted={onIframeMounted}
      />
    </UnitFrameScaler>
  );
};

const PartSlot = ({
  partSlotId,
  instrumentUnitKey,
  sequencerUnitKey,
}: {
  partSlotId: string;
  instrumentUnitKey?: CatalogKey;
  sequencerUnitKey?: CatalogKey;
}) => {
  // const effectCatalogKey = "mu5_visualizer";
  const effectCatalogKey = "specbar";
  const instrumentUnitId = `${partSlotId}_${instrumentUnitKey}`;
  const sequencerUnitId = `${partSlotId}_${sequencerUnitKey}`;
  const effectUnitId = `${partSlotId}_${effectCatalogKey}`;
  const containerSize = { width: 700, height: 400 };
  const containerSizeForEffect = { width: 700, height: 110 };

  return (
    <div className="w-[700px] flex-v gap-4">
      <div className="bg-gray-300 flex-c h-[110px]">
        {instrumentUnitKey && (
          <UnitFrameEx
            unitId={effectUnitId}
            destUnitId="$output"
            catalogKey={effectCatalogKey}
            containerSize={containerSizeForEffect}
            frameSizeOverride={containerSizeForEffect}
          />
        )}
      </div>
      <div className="bg-gray-300 flex-c h-[400px]">
        {instrumentUnitKey && (
          <UnitFrameEx
            unitId={instrumentUnitId}
            destUnitId={effectUnitId}
            catalogKey={instrumentUnitKey}
            containerSize={containerSize}
          />
        )}
      </div>
      <div className="bg-gray-300 flex-c h-[400px]">
        {sequencerUnitKey && (
          <UnitFrameEx
            unitId={sequencerUnitId}
            destUnitId={instrumentUnitId}
            catalogKey={sequencerUnitKey}
            containerSize={containerSize}
          />
        )}
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
          <div className="w-full h-full flex-vc gap-6">
            <div className="flex-h gap-6">
              <PartSlot partSlotId="ps1" instrumentUnitKey="myDrumMachine" />
              <PartSlot
                partSlotId="ps2"
                instrumentUnitKey="miniSynthGe"
                sequencerUnitKey="useq"
              />
              <PartSlot
                partSlotId="ps3"
                // instrumentUnitKey="wavicle"
                // instrumentUnitKey="protoEnginePtmOsc"
                instrumentUnitKey="protoEnginePdFm"
                // sequencerUnitKey="mu4Keyboard"
                // sequencerUnitKey="twsq1"
                sequencerUnitKey="lseq1"
              />
              <PartSlot partSlotId="ps4" />
            </div>
          </div>
        </FieldSightPlane>
      </div>
    </div>
  );
};

const PageRoot2 = () => {
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
          <div className="w-full h-full flex-vc gap-6">
            <div className="flex-h gap-6">
              <PartSlot partSlotId="ps1" instrumentUnitKey="myDrumMachine" />
              <PartSlot
                partSlotId="ps2"
                instrumentUnitKey="miniSynthGe"
                sequencerUnitKey="useq"
              />
              <PartSlot
                partSlotId="ps3"
                instrumentUnitKey="protoEnginePdFm"
                sequencerUnitKey="lseq1"
              />
              <PartSlot
                partSlotId="ps4"
                instrumentUnitKey="wavicle"
                sequencerUnitKey="lseq1"
              />
            </div>
            <div className="flex-h gap-6">
              <PartSlot partSlotId="ps1a" instrumentUnitKey="koodori" />
              <PartSlot
                partSlotId="ps2a"
                instrumentUnitKey="bc010"
                sequencerUnitKey="lseq1"
              />
              <PartSlot
                partSlotId="ps3a"
                instrumentUnitKey="webaudioSynthV2"
                sequencerUnitKey="mu4Keyboard"
              />
              <PartSlot
                partSlotId="ps4a"
                instrumentUnitKey="wasyn1"
                sequencerUnitKey="mu4Keyboard"
              />
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
