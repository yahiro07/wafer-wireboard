import { tx } from "@twind/core";

export const TabButton = ({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) => {
  return (
    <button
      type="button"
      className={tx(
        "px-3 py-1 font-bold border border-white/20 cursor-pointer",
        isActive
          ? "bg-white text-gray-800"
          : "bg-gray-700 text-white/70 hover:text-white",
      )}
      aria-pressed={isActive}
      onClick={onClick}
    >
      {label}
    </button>
  );
};
