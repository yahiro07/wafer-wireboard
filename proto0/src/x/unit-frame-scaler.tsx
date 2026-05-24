import { ReactNode } from "react";
import { Size } from "@/hooks/common-types";

export const UnitFrameScaler = ({
  containerSize,
  unitFrameSize,
  children,
}: {
  containerSize: Size;
  unitFrameSize: Size;
  children: ReactNode;
}) => {
  const scale = Math.min(
    containerSize.width / unitFrameSize.width,
    containerSize.height / unitFrameSize.height,
  );
  const outputWidth = unitFrameSize.width * scale;
  const outputHeight = unitFrameSize.height * scale;
  return (
    <div
      style={{
        width: outputWidth,
        height: outputHeight,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          width: unitFrameSize.width,
          height: unitFrameSize.height,
        }}
      >
        {children}
      </div>
    </div>
  );
};
