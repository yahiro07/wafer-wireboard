import { mountAppRoot } from "mofur/ax-react";
import { setupMidiKeyboardInput } from "mofur/mx-audio";
import { useEffect } from "react";
import { HostAppProvider } from "wus-host/react";
import { CatalogKey } from "@/base/showcase-entries";
import { UnitFrameEx } from "@/features/unit-box/unit-frame-ex";
import { hostSystem } from "@/store/host-system-instance";
import { store } from "@/store/store";
import { createRtfrUnit } from "@/units/rtfr/rtfr";
import { actions } from "./store/actions";

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
  const synthCategoryKey: CatalogKey = "miniSynthGe";
  return (
    <HostAppProvider hostSystem={hostSystem} playing={playing} bpm={bpm}>
      <div className="w-dvw h-dvh flex-vc p-4 gap-4">
        <UnitFrameEx
          unitId="synth"
          destUnitId="$output"
          catalogKey={synthCategoryKey}
        />
        <UnitFrameEx
          unitId="sequencer"
          destUnitId="synth"
          templateFn={createRtfrUnit}
          notes={notes}
        />
      </div>
    </HostAppProvider>
  );
};

mountAppRoot(<App />);
