import clsx from "clsx";
import { clampValue, seqNumbers } from "mofur/ax";
import { IconsEx } from "@/common/icons";

const ShiftButton = ({
  side,
  onClick,
  disabled,
}: {
  side: "left" | "right";
  onClick(): void;
  disabled: boolean;
}) => {
  return (
    <button
      className={clsx(
        "w-5 h-4 bg-gray-300 text-white text-[11px] flex-c cursor-pointer",
        disabled && "opacity-50 cursor-default",
      )}
      onClick={onClick}
    >
      {side === "left" && <IconsEx.KeyboardOctaveShiftL />}
      {side === "right" && <IconsEx.KeyboardOctaveShiftR />}
    </button>
  );
};

const IndicatorLed = ({
  active,
  onClick,
}: {
  active: boolean;
  onClick: () => void;
}) => {
  return (
    <button
      className={clsx(
        "w-3 h-3 bg-gray-300 rounded-full cursor-pointer",
        active && "bg-cyan-500!",
      )}
      onClick={onClick}
    />
  );
};

export const OctaveShifter = ({
  octave,
  setOctave,
}: {
  octave: number;
  setOctave: (octave: number) => void;
}) => {
  const canShiftDown = octave > -2;
  const canShiftUp = octave < 2;

  const shiftOctave = (dir: number) => {
    const newOctave = clampValue(octave + dir, -2, 2);
    setOctave(newOctave);
  };

  return (
    <div className="flex-ha gap-1.5">
      <ShiftButton
        side="left"
        onClick={() => shiftOctave(-1)}
        disabled={!canShiftDown}
      />
      <div className="flex-ha gap-[4px]">
        {seqNumbers(5).map((k) => {
          const octaveValue = k - 2;
          return (
            <IndicatorLed
              key={k}
              active={octave === octaveValue}
              onClick={() => setOctave(octaveValue)}
            />
          );
        })}
      </div>
      <ShiftButton
        side="right"
        onClick={() => shiftOctave(1)}
        disabled={!canShiftUp}
      />
    </div>
  );
};
