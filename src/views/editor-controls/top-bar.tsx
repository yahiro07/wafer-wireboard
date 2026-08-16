import { Icons } from "@/common/icons";
import { IconButton } from "@/components/icon-button";
import { actions } from "@/model/actions";
import { store } from "@/model/store";
import { MidiInButtonWrapper } from "@/views/editor-controls/midi-in-button";
import { TopControlBar } from "@/views/editor-controls/top-control-bar";

const InfoButton = () => {
  return (
    <IconButton icon={Icons.Info} onClick={store.toggleInfoPanelVisible} />
  );
};

const ShareButton = () => {
  return (
    <IconButton
      icon={Icons.Share}
      onClick={() => actions.toggleModalPanel("share")}
    />
  );
};

export const TopBar = () => {
  return (
    <div className="w-full bg-[#68c] flex-ha justify-between px-1">
      <h1 className="text-white text-lg font-bold pl-2">Wafer Wireboard</h1>
      <TopControlBar />
      <div className="flex-ha gap-1">
        <MidiInButtonWrapper />
        <ShareButton />
        <InfoButton />
      </div>
    </div>
  );
};
