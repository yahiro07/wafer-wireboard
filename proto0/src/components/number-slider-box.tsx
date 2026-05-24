import { mergeReactProps } from "@/utils/merge-react-props";
import { KnobFrame } from "./knob-frame";

export function NumberSliderBoxView(props: {
  value: number;
  fracDigits?: number;
}) {
  return (
    <div className="border border-[#444] w-[60px] h-[34px] flex-c">
      {props.value.toFixed(props.fracDigits ?? 2)}
    </div>
  );
}

export function FeNumberSliderBox(inputProps: {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  fracDigits?: number;
  onChange: (value: number) => void;
}) {
  const props = mergeReactProps(
    { min: 0, max: 1, step: 0.01, fracDigits: 2 },
    inputProps,
  );
  return (
    <KnobFrame
      value={props.value}
      min={props.min}
      max={props.max}
      step={props.step}
      onChange={props.onChange}
    >
      <NumberSliderBoxView value={props.value} fracDigits={props.fracDigits} />
    </KnobFrame>
  );
}
