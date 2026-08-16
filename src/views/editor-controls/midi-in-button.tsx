import { Icons } from "@/common/icons";

export const MidiInButton = () => {
  return (
    <button className="flex-vc text-white">
      <Icons.Piano size={22} />
      <div className="text-[10px] mt-[-3px]">MIDI</div>
    </button>
  );
};
