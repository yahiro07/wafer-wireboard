import { mountAppRoot } from "mofur/ax-react";
import { mapKnobGainDb } from "mofur/mo-audio";
import { setupMidiKeyboardInput } from "mofur/mx-audio";
import { useEffect, useMemo } from "react";
import { HostAppProvider } from "wafer-host/react";
import { PickerColumn } from "@/features/picker/picker-column";
import { hostSystem } from "@/store/host-system-instance";
import { store } from "@/store/store";
import { InformationPanel } from "./features/information-panel";
import { MainEditArea } from "./features/main-edit-area/main-edit-area";
import { actions } from "./store/actions";

const PageRoot = () => {
  const { infoPanelVisible } = store.useSnapshot();
  return (
    <div className="w-dvw h-dvh bg-[hsl(216,22%,18%)] flex-h">
      <MainEditArea />
      <PickerColumn />
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

if (import.meta.hot) {
  import.meta.hot.on("custom:unit-source-changed", (data) => {
    const { catalogKey } = data;
    if (catalogKey) {
      console.log("unit source changed", catalogKey);
      actions.handleUnitSourceUpdate(catalogKey);
    }
  });
}
