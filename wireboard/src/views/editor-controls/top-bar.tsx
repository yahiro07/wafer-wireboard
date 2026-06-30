import { Icons } from "@/base/icons";
import { IconButton } from "@/components/icon-button";
import { store } from "@/model/store";
import { TopControlBar } from "@/views/editor-controls/top-control-bar";

const _GithubLinkButton = () => {
  return (
    <a
      href="https://github.com/yahiro07/mini-groove"
      target="_blank"
      rel="noreferrer noopener"
      aria-label="GitHub repository"
      className="text-white cursor-pointer"
    >
      <Icons.Github size={30} />
    </a>
  );
};

const InfoButton = () => {
  return (
    <IconButton icon={Icons.Info} onClick={store.toggleInfoPanelVisible} />
  );
};

export const TopBar = () => {
  return (
    <div className="w-full h-12 bg-[#68c] flex-ha justify-between">
      <h1 className="text-white text-xl font-bold pl-2">Wafer Wireboard</h1>
      <TopControlBar />
      <div className="flex-ha gap-2">
        <InfoButton />
      </div>
    </div>
  );
};
