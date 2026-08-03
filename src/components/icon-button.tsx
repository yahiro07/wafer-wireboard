import { FC } from "react";

type Props = {
  icon: FC;
  onClick: () => void;
};

export const IconButton = ({ icon: Icon, onClick }: Props) => {
  return (
    <button
      className="text-white/80 m-2 text-[30px] cursor-pointer"
      onClick={onClick}
    >
      <Icon />
    </button>
  );
};
