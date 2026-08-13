import {
  createFieldSightHandlers,
  FieldSightPlane,
} from "@/components/field-sight-plane";
import { mountAppRoot } from "mofur/ax-react";
import { createStore } from "snap-store";

const boardSize = { width: 800, height: 600 };

const store = createStore({
  sight: { eyeScaling: 1, eyeOffset: { x: 0, y: 0 } },
});

const sightHandlers = createFieldSightHandlers(
  () => store.state.sight,
  (attrs) => store.patchSight(attrs),
  { minScaling: 0.125, maxScaling: 4 },
);

const MainEditArea = () => {
  const { sight } = store.useSnapshot();
  return (
    <div
      className="grow relative"
      onPointerDown={(e) => sightHandlers.onPointerDown(e.nativeEvent)}
      onWheel={(e) => sightHandlers.onWheel(e.nativeEvent)}
    >
      <FieldSightPlane sight={sight} boardSize={boardSize}>
        <div className="w-full h-full bg-gray-600 flex-c">hello</div>
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
