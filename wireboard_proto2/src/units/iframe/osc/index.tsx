import "../../../page.css";
import "mofur/ax-ui/utility-classes.css";
import { mountAppRoot } from "mofur/ax-react";
import { UnitInterface } from "wus-unit-types";
import { createOscillatorUnitCore } from "@/units/common/oscillator-unit-core";

const unitInterface = (window as any).unitInterface as
  | UnitInterface
  | undefined;

const audioContext = unitInterface?.audioContext ?? new AudioContext();
const destNode =
  unitInterface?.primaryOutputPort.audioOutput.node ?? audioContext.destination;

const oscillatorCore = createOscillatorUnitCore(audioContext, destNode);

unitInterface?.completeSetupWithAttributes({
  unitFeatures: {
    unitType: "instrument",
    outputs: ["audio"],
    inputs: ["note"],
  },
  primaryInputPortHandlers: {
    noteInput: {
      noteOn: oscillatorCore.noteOn,
      noteOff: oscillatorCore.noteOff,
    },
  },
});

const App = () => {
  return (
    <div className="flex-vc gap-4">
      <div className="bg-violet-100 w-[200px] h-[100px] flex-c">iframe osc</div>
    </div>
  );
};

mountAppRoot(<App />);
