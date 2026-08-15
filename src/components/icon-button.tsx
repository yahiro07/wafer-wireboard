import { tx } from "@twind/core";
import { FC } from "react";

type Props = {
  icon: FC;
  onClick: () => void;
};

export const IconButton = ({ icon: Icon, onClick }: Props) => {
  return (
    <button
      className={tx(
        "text-white/80 m-2 text-[30px] cursor-pointer",
        "hover:opacity-80",
      )}
      onClick={onClick}
    >
      <Icon />
    </button>
  );
};
