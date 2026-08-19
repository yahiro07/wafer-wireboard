import { Icons } from "@/common/icons";
import { actions } from "@/model/actions";
import { store } from "@/model/store";
import clsx from "clsx";

const MidiInButton = ({
  active,
  onClick,
}: {
  active: boolean;
  onClick: () => void;
}) => {
  return (
    <button
      className={clsx(
        "flex-vc text-white",
        active ? "hover:opacity-90" : "opacity-50 hover:opacity-40",
      )}
      onClick={onClick}
    >
      <Icons.Piano size={22} />
      <div className="text-[10px] mt-[-3px]">MIDI</div>
    </button>
  );
};

export const MidiInButtonWrapper = () => {
  const { midiInEnabled } = store.useSnapshot();
  if (typeof navigator.requestMIDIAccess !== "function") return;
  return (
    <div className="mr-1.5 mt-1">
      <MidiInButton
        active={midiInEnabled}
        onClick={actions.toggleMidiInEnabled}
      />
    </div>
  );
};
