import clsx from "clsx";
import { seqNumbers } from "mofur/ax";
import { IconsEx } from "@/base/icons";

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
    <div
      className={clsx(
        "w-5 h-4 bg-gray-300 text-white text-[11px] flex-c cursor-pointer",
        disabled && "opacity-50 cursor-default",
      )}
      onClick={onClick}
    >
      {side === "left" && <IconsEx.KeyboardOctaveShiftL />}
      {side === "right" && <IconsEx.KeyboardOctaveShiftR />}
    </div>
  );
};

const IndicatorLed = ({ active }: { active: boolean }) => {
  return (
    <div
      className={clsx(
        "w-3 h-3 bg-gray-300 rounded-full",
        active && "bg-cyan-500!",
      )}
    />
  );
};

export const OctaveShifter = ({
  octave,
  shiftOctave,
}: {
  octave: number;
  shiftOctave: (dir: number) => void;
}) => {
  const canShiftDown = octave > -2;
  const canShiftUp = octave < 2;
  return (
    <div className="flex-ha gap-1.5">
      <ShiftButton
        side="left"
        onClick={() => shiftOctave(-1)}
        disabled={!canShiftDown}
      />
      <div className="flex-ha gap-[4px]">
        {seqNumbers(5).map((k) => (
          <IndicatorLed key={k} active={octave === k - 2} />
        ))}
      </div>
      <ShiftButton
        side="right"
        onClick={() => shiftOctave(1)}
        disabled={!canShiftUp}
      />
    </div>
  );
};
