import "./page.css";
import "beams/ax-ui/utility-classes.css";
//
import { mountAppRoot } from "beams/ax-react/mount-app-root";
import { setupMidiKeyboardInput } from "beams/mx-audio/midi-keyboard-input";
import { useEffect } from "react";
import { CreditsPanel } from "@/sections/credits-panel";
import { PickerColumn } from "@/sections/picker-column";
import { hostSystem } from "@/store/store";
import { EditArea } from "./sections/edit-area";
import { actions } from "./store/actions";

const PageRoot = () => {
  return (
    <div className="w-dvw h-dvh bg-gray-700 flex-h">
      <PickerColumn />
      <EditArea />
      {false && <CreditsPanel />}
    </div>
  );
};

const App = () => {
  useEffect(hostSystem.setupLifecycle, []);
  useEffect(
    () =>
      setupMidiKeyboardInput({
        noteOn: actions.midiInNoteOn,
        noteOff: actions.midiInNoteOff,
      }),
    [],
  );
  return <PageRoot />;
};

mountAppRoot(<App />);
