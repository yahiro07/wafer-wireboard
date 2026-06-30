import clsx from "clsx";
import { Icons } from "@/base/icons";

type Props = {
  url: string;
  side: "left" | "right";
};
export const GithubBadge = ({ url, side }: Props) => {
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer noopener"
      aria-label="GitHub repository"
      className={clsx(
        "block h-20 w-20 bg-[#f5a623] text-black transition-colors hover:bg-[#ffb12a]",
        side === "left" && "[clip-path:polygon(0_0,100%_0,0_100%)]",
        side === "right" && "[clip-path:polygon(100%_0,0_0,100%_100%)]",
      )}
    >
      <Icons.Github
        size={30}
        className={clsx(
          "absolute top-3 drop-shadow-sm",
          side === "right" && "right-3",
          side === "left" && "left-3",
        )}
      />
    </a>
  );
};
