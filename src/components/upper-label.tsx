import { npx } from "@/auxiliaries/helpers";
import { ReactNode } from "react";
import { tx } from "@twind/core";

export const UpperLabel = ({
  label,
  children,
  yOffset = 0,
  className,
}: {
  label: string;
  children: ReactNode;
  yOffset?: number;
  className?: string;
}) => {
  return (
    <div className={tx("relative", className)}>
      {children}
      <div
        className="absolute left-0 w-full flex-c text-[9px] font-bold"
        style={{ top: npx(yOffset - 13) }}
      >
        {label}
      </div>
    </div>
  );
};
