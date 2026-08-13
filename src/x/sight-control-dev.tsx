import {
  createFieldSightHandlers,
  FieldSight,
  FieldSightPlane,
} from "@/components/field-sight-plane";
import { Knob } from "@/components/knob";
import {
  CatalogKey,
  getCatalogTarget,
} from "@/main-definitions/showcase-entries";
import clsx from "clsx";
import { mountAppRoot } from "mofur/ax-react";
import { Point, startDragSession } from "mofur/ax-ui";
import { useState } from "react";
import { createStore } from "snap-store";
import { createHostSystem, HsUnitInstance } from "wafer-host/core";
import {
  HostAppProvider,
  UnitDestinationSpec,
  UnitFrameScaled,
} from "wafer-host/react";

const boardSize = { width: 800, height: 600 };

type OperationMode = "edit" | "view";

type StoreState = {
  sight: FieldSight;
  operationMode: OperationMode;
  infoPanelVisible: boolean;
};

const store = createStore<StoreState>({
  sight: { eyeScaling: 1, eyeOffset: { x: 0, y: 0 } },
  operationMode: "edit",
  infoPanelVisible: false,
});

const sightHandlers = createFieldSightHandlers(
  () => store.state.sight,
  (attrs) => store.patchSight(attrs),
  { minScaling: 0.125, maxScaling: 4 },
);

const actions = {
  setOperationMode(mode: OperationMode) {
    store.setOperationMode(mode);
  },
  toggleInfoPanel() {
    store.toggleInfoPanelVisible();
  },
};

const UnitFrameEx = ({
  unitId,
  destSpec,
  catalogKey,
  onUnitInstanceLoaded,
}: {
  unitId: string;
  destSpec?: UnitDestinationSpec;
  catalogKey: CatalogKey;
  onUnitInstanceLoaded?: (unitInstance: HsUnitInstance) => void;
}) => {
  const catalogTarget = getCatalogTarget(catalogKey);
  if (catalogTarget?.type === "catalog") {
    return (
      <UnitFrameScaled
        unitId={unitId}
        destSpec={destSpec}
        unitUrl={catalogTarget.UnitInventorySpec.loaderPageUrl}
        onUnitInstanceLoaded={onUnitInstanceLoaded}
      />
    );
  }
  return null;
};

const OperationModeContainer = () => {
  const { operationMode } = store.useSnapshot();
  return (
    <div
      className={clsx(
        "absolute top-0 left-1/2 -translate-x-1/2",
        "flex-ha gap-2 mt-2",
      )}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        className={clsx(
          "cursor-pointer",
          operationMode === "edit" ? "opacity-100" : "opacity-50",
        )}
        onClick={() => store.setOperationMode("edit")}
      >
        edit
      </button>
      <button
        className={clsx(
          "cursor-pointer",
          operationMode === "view" ? "opacity-100" : "opacity-50",
        )}
        onClick={() => store.setOperationMode("view")}
      >
        view
      </button>
    </div>
  );
};

const handleGripPointerDown = (
  e0: React.PointerEvent,
  position: Point,
  setPosition: (position: Point) => void,
) => {
  const originalPosition = { ...position };
  startDragSession(
    e0.nativeEvent,
    {
      onMove(e) {
        const delta = {
          x: e.position.x - e.originalPosition.x,
          y: e.position.y - e.originalPosition.y,
        };
        const sc = store.state.sight.eyeScaling;
        let newPosition = {
          x: originalPosition.x + delta.x / sc,
          y: originalPosition.y + delta.y / sc,
        };
        setPosition(newPosition);
      },
    },
    { coordinate: "screen" },
  );
};

const UnitPanel = ({
  id,
  posX,
  posY,
}: {
  id: string;
  posX: number;
  posY: number;
}) => {
  const { operationMode } = store.useSnapshot();
  const [pitch, setPitch] = useState(0.5);
  const [position, setPosition] = useState({ x: posX, y: posY });
  return (
    <div className="absolute" style={{ top: position.y, left: position.x }}>
      <div
        className="relative"
        onClick={(e) => {
          actions.setOperationMode("edit");
          e.stopPropagation();
        }}
      >
        <div
          className="bg-gray-500 h-[30px] flex-ha pl-1"
          onPointerDown={(e) => handleGripPointerDown(e, position, setPosition)}
        >
          {id}
        </div>
        <div className="w-[240px] h-[160px] bg-gray-300 flex-v p-2 text-gray-800 ">
          <div>pitch</div>
          <Knob value={pitch} onChange={setPitch} />
          <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit</div>
        </div>
        {operationMode === "view" && (
          <div className="absolute-full bg-black/20" />
        )}
      </div>
    </div>
  );
};

const IframeUnitPanel = ({
  id,
  catalogKey,
  posX,
  posY,
}: {
  id: string;
  catalogKey: CatalogKey;
  posX: number;
  posY: number;
}) => {
  const { operationMode } = store.useSnapshot();
  const [position, setPosition] = useState({ x: posX, y: posY });
  return (
    <div className="absolute" style={{ top: position.y, left: position.x }}>
      <div
        className="relative"
        onClick={(e) => {
          actions.setOperationMode("edit");
          e.stopPropagation();
        }}
      >
        <div
          className="bg-gray-500 h-[30px] flex-ha pl-1"
          onPointerDown={(e) => handleGripPointerDown(e, position, setPosition)}
        >
          {id}
        </div>
        <div className="w-[240px] h-[160px] bg-gray-300">
          <UnitFrameEx unitId={id} catalogKey={catalogKey} />
        </div>
        {operationMode === "view" && (
          <div className="absolute-full bg-black/20" />
        )}
      </div>
    </div>
  );
};

const InfoPanel = ({ posX, posY }: { posX: number; posY: number }) => {
  return (
    <div
      className={clsx("w-[240px] h-[160px] bg-gray-300 absolute")}
      style={{ top: posY, left: posX }}
      onClick={(e) => {
        actions.setOperationMode("edit");
        e.stopPropagation();
      }}
    >
      <div className="p-2 text-gray-800 select-text flex-v gap-2">
        <div>info</div>
        <div>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, this text is
          selectable
        </div>
      </div>
    </div>
  );
};

const MainEditArea = () => {
  const { sight, infoPanelVisible } = store.useSnapshot();
  return (
    <div
      className="grow relative"
      onPointerDown={(e) => sightHandlers.onPointerDown(e.nativeEvent)}
      onWheel={(e) => sightHandlers.onWheel(e.nativeEvent)}
      onClick={() => actions.setOperationMode("view")}
    >
      <FieldSightPlane sight={sight} boardSize={boardSize}>
        <div className="w-full h-full bg-gray-600 flex-c">
          <UnitPanel id="unit1" posX={100} posY={100} />
          <UnitPanel id="unit2" posX={400} posY={100} />
          {infoPanelVisible && <InfoPanel posX={100} posY={300} />}
          <IframeUnitPanel
            id="unit3"
            catalogKey="sunsetChorusMini"
            posX={400}
            posY={300}
          />
        </div>
      </FieldSightPlane>
      <OperationModeContainer />
    </div>
  );
};

const TopBar = () => {
  return (
    <div className="h-[40px] bg-cyan-600 flex-ha justify-between px-2">
      <h1 className="text-lg font-bold">Sight Control Dev</h1>
      <button onClick={actions.toggleInfoPanel}>info</button>
    </div>
  );
};

const hostSystem = createHostSystem(new AudioContext());

const App = () => {
  return (
    <HostAppProvider hostSystem={hostSystem}>
      <div className="bg-gray-800 h-dvh text-white flex-v">
        <TopBar />
        <MainEditArea />
      </div>
    </HostAppProvider>
  );
};
mountAppRoot(<App />);
