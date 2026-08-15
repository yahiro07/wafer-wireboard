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
        "flex-c text-white text-sm bd-clControlEdge",
        "hover:opacity-90",
        active ? "bg-clButtonActive" : "bg-clControlBg",
        disabled && "opacity-50",
        !disabled && "cursor-pointer",
      )}
      style={{ width, height }}
    >
      {text && <span>{text}</span>}
      {children}
    </button>
  );
};
