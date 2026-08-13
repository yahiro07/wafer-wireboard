import {
  createFieldSightHandlers,
  FieldSight,
  FieldSightPlane,
} from "@/components/field-sight-plane";
import { Knob } from "@/components/knob";
import clsx from "clsx";
import { mountAppRoot } from "mofur/ax-react";
import { useState } from "react";
import { createStore } from "snap-store";

const boardSize = { width: 800, height: 600 };

type StoreState = {
  sight: FieldSight;
};

const store = createStore<StoreState>({
  sight: { eyeScaling: 1, eyeOffset: { x: 0, y: 0 } },
});

const sightHandlers = createFieldSightHandlers(
  () => store.state.sight,
  (attrs) => store.patchSight(attrs),
  { minScaling: 0.125, maxScaling: 4 },
);

const UnitPanel1 = () => {
  const [pitch, setPitch] = useState(0.5);
  return (
    <div
      className={clsx(
        "w-[240px] h-[160px] bg-gray-300 flex-v",
        "absolute top-[100px] left-[100px]",
      )}
    >
      <div className="bg-gray-500 h-[30px] flex-ha pl-1">unit1</div>
      <div className="p-2 text-gray-800">
        <div>pitch</div>
        <Knob value={pitch} onChange={setPitch} />
      </div>
    </div>
  );
};

const MainEditArea = () => {
  const { sight } = store.useSnapshot();
  return (
    <div
      className="grow relative"
      onPointerDown={(e) => sightHandlers.onPointerDown(e.nativeEvent)}
      onWheel={(e) => sightHandlers.onWheel(e.nativeEvent)}
    >
      <FieldSightPlane sight={sight} boardSize={boardSize}>
        <div className="w-full h-full bg-gray-600 flex-c">
          <UnitPanel1 />
        </div>
      </FieldSightPlane>
    </div>
  );
};

const App = () => {
  return (
    <div className="bg-gray-800 h-dvh text-white flex-v">
      <div className="h-[40px] bg-cyan-600 flex-ha text-lg pl-1">
        Sight Control Dev
      </div>
      <MainEditArea />
    </div>
  );
};
mountAppRoot(<App />);
