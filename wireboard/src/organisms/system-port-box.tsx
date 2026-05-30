import { Point } from "beams/ax-ui/common-types";
import { npx } from "beams/ax-ui/styling-utils";
import clsx from "clsx";
import { ReactNode } from "react";
import { Icons } from "@/components/icons";
import { store } from "@/store/store";

const SystemPortBox = ({
  position,
  children,
}: {
  position: Point;
  children: ReactNode;
}) => {
  return (
    <div
      className={clsx(
        "absolute w-[120px] h-[120px] bg-gray-500 text-gray-300",
        "-translate-x-1/2 -translate-y-1/2 flex-c",
      )}
      style={{ left: npx(position.x), top: npx(position.y) }}
    >
      {children}
    </div>
  );
};

export const KeyboardSystemPortBox = () => {
  const { keyboardPortPos } = store.useSnapshot();
  return (
    <SystemPortBox position={keyboardPortPos}>
      <Icons.Piano size={100} />
    </SystemPortBox>
  );
};

export const SpeakerSystemPortBox = () => {
  const { speakerPortPos } = store.useSnapshot();
  return (
    <SystemPortBox position={speakerPortPos}>
      <Icons.Speaker size={90} />
    </SystemPortBox>
  );
};
