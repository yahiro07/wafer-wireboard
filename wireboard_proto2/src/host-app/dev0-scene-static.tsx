import { mountAppRoot } from "beams/ax-react/mount-app-root";
import { UnitFrameEx } from "@/host-app/unit-frame-ex/unit-frame-ex";
import { reactUnitFactories } from "@/units/react";

const App = () => {
  const uf = reactUnitFactories;
  return (
    <div className="flex-vc gap-4">
      <div className="flex-h gap-4">
        <UnitFrameEx
          unitId="mixer1"
          unitTemplateFn={uf.mixer}
          destSpec="$output"
        />
      </div>
      <div className="flex-h gap-4">
        <UnitFrameEx
          unitId="osc1"
          pageUrl="/units/osc/index.html"
          destSpec="mixer1.port0"
        />
        <UnitFrameEx
          unitId="osc2"
          unitTemplateFn={uf.osc}
          destSpec="mixer1.port1"
        />
        <UnitFrameEx
          unitId="cvGateOsc1"
          unitTemplateFn={uf.cvGateOsc}
          destSpec="mixer1.port2"
        />
      </div>
      <div className="flex-h gap-4">
        <UnitFrameEx
          unitId="keyboard1"
          unitTemplateFn={uf.keyboard}
          destSpec="osc1"
        />
        <UnitFrameEx
          unitId="keyboard2"
          unitTemplateFn={uf.keyboard}
          destSpec="osc2"
        />
        <UnitFrameEx
          unitId="keyboard3"
          unitTemplateFn={uf.keyboard}
          destSpec="cvGateOsc1"
        />
        <UnitFrameEx
          unitId="stateSwitcher1"
          unitTemplateFn={uf.stateSwitcher}
          destSpec="osc2"
        />
      </div>
      <div className="flex-ha gap-4">
        <UnitFrameEx
          unitId="twoPortsKeyboard1"
          unitTemplateFn={uf.twoPortsKeyboard}
          destSpec={["osc1", "osc2"]}
        />
        <UnitFrameEx
          unitId="paramController1"
          unitTemplateFn={uf.parametersController}
          destSpec="osc2"
        />
        <UnitFrameEx
          unitId="cvGateStepSequencer1"
          unitTemplateFn={uf.cvGateStepSequencer}
          destSpec="cvGateOsc1"
        />
      </div>

      <div className="flex-ha gap-4">
        <UnitFrameEx
          unitId="masterClock1"
          unitTemplateFn={uf.masterClock}
          destSpec="clockDivider1"
        />
        <UnitFrameEx
          unitId="keyboard4"
          unitTemplateFn={uf.keyboard}
          destSpec={["osc1", "osc2"]}
        />
        <UnitFrameEx
          unitId="clockDivider1"
          unitTemplateFn={uf.clockDivider}
          destSpec="cvGateStepSequencer1"
        />
      </div>
    </div>
  );
};

mountAppRoot(<App />);
