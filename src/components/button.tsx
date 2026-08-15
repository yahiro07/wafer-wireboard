import { npx } from "@/auxiliaries/helpers";
import { ReactNode } from "react";
import { tx } from "@twind/core";

export const Button = ({
  active,
  text,
  children,
  onClick,
  disabled,
  asr = 1.8,
}: {
  active?: boolean;
  text?: string;
  children?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  asr?: number;
}) => {
  const height = 32;
  const width = height * asr;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={tx(
        "flex-c bg-gray-400 text-white border border-gray-600/80 text-sm",
        active && "bg-sky-600",
      )}
      style={{
        width: npx(width),
        height: npx(height),
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {text && <span>{text}</span>}
      {children}
    </button>
  );
};
