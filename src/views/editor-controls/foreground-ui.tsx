import { Icons } from "@/common/icons";
import { GithubBadge } from "@/components/github-badge";
import { IconButton } from "@/components/icon-button";
import { store } from "@/model/store";
import clsx from "clsx";

export const InfoButton = () => {
  return (
    <div className="absolute top-0 left-0">
      <IconButton icon={Icons.Info} onClick={store.toggleInfoPanelVisible} />
    </div>
  );
};

export const CornerGithubBadge = ({ side }: { side: "left" | "right" }) => {
  return (
    <div
      className={clsx("absolute top-0", side === "left" ? "left-0" : "right-0")}
    >
      <GithubBadge
        url="https://github.com/yahiro07/wafer-wireboard"
        side={side}
      />
    </div>
  );
};
