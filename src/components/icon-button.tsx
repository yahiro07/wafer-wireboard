import clsx from "clsx";
import { FC } from "react";

type Props = {
  icon: FC;
  onClick: () => void;
  small?: boolean;
  rotation?: number;
};

export const IconButton = ({ icon: Icon, onClick, small, rotation }: Props) => {
  const size = small ? "20px" : "30px";
  return (
    <button
      className={clsx(
        "text-white/80 flex-c p-1 cursor-pointer",
        "hover:opacity-80",
      )}
      style={{
        fontSize: size,
        transform: rotation ? `rotate(${rotation}deg)` : undefined,
        transformOrigin: "center",
      }}
      onClick={onClick}
    >
      <Icon />
    </button>
  );
};
