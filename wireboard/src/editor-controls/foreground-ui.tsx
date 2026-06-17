import { Icons } from "@/base/icons";
import { store } from "@/central/store";
import { GithubBadge } from "@/components/github-badge";
import { IconButton } from "@/components/icon-button";

export const InfoButton = () => {
  return (
    <div className="absolute top-0 left-0">
      <IconButton icon={Icons.Info} onClick={store.toggleInfoPanelVisible} />
    </div>
  );
};

export const CornerGithubBadge = () => {
  return (
    <div className="absolute top-0 right-0">
      <GithubBadge url="https://github.com/yahiro07/mini-groove" />
    </div>
  );
};
