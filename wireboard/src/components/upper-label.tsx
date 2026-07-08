import clsx from "clsx";
import { npx } from "mofur/ax-ui";
import { ReactNode } from "react";

export const UpperLabel = ({
  label,
  children,
  yOffset = 0,
  className,
  textColor = "white",
}: {
  label: string;
  children: ReactNode;
  yOffset?: number;
  className?: string;
  textColor?: string;
}) => {
  return (
    <div className={clsx("relative", className)}>
      {children}
      <div
        className="absolute left-0 w-full flex-c text-[9px] font-bold"
        style={{ top: npx(yOffset - 13), color: textColor }}
      >
        {label}
      </div>
    </div>
  );
};
