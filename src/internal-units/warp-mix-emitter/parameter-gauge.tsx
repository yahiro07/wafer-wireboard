import { KnobFrame } from "@/components/knob-frame";
import clsx from "clsx";

export const ParameterGauge = ({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) => {
  return (
    <KnobFrame value={value} min={0} max={1} step={0.01} onChange={onChange}>
      <div
        className={clsx(
          "w-[36px] h-[160px] flex-v justify-end items-center",
          "bg-[#777]",
        )}
      >
        <div
          className="w-full h-[50px] bg-[#49d] items-center"
          style={{ height: `${value * 100}%` }}
        />
      </div>
    </KnobFrame>
  );
};
