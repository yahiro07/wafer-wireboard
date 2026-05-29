import { mountAppRoot } from "beams/ax-react/mount-app-root";
import { npx } from "beams/ax-ui/styling-utils";
import { ScalerBoxAutoSized } from "beams/mo-react/components/scaler-box-auto-sized";
import { useEffect } from "react";
import { createStore } from "snap-store";
import { createHostSystem } from "wus-host/host";
import { UnitFrame } from "wus-host/react";
import { Icons } from "@/components/icons";
import catalog from "../unit-inventories.json";

type CatalogKey = keyof typeof catalog;

type ShowcaseEntry = {
  name: string;
  catalogKey: CatalogKey;
  thumbnailUrl?: string;
};
const showcaseEntries: ShowcaseEntry[] = [
  ...Object.values(catalog)
    .filter((item) => item.originalPageUrl.startsWith("https://"))
    .map((item) => ({
      name: item.name,
      catalogKey: item.catalogKey as CatalogKey,
      thumbnailUrl: item.originalPageUrl.replace(
        "/index.html",
        "/unit-thumbnail.png",
      ),
    })),
  ...Object.values(catalog)
    .filter((item) => item.originalPageUrl.startsWith("file://"))
    .map((item) => ({
      name: item.name,
      catalogKey: item.catalogKey as CatalogKey,
    })),
];

type UnitItem = {
  unitId: string;
  destUnitId?: string;
  catalogKey: CatalogKey;
  position: { x: number; y: number };
};

type StoreState = {
  unitItems: UnitItem[];
};

const audioContext = new AudioContext();
const hostSystem = createHostSystem(audioContext);
const store = createStore<StoreState>({
  unitItems: [],
});
function buildDefaultScene() {
  const unitItems: UnitItem[] = [
    {
      unitId: "unit1",
      catalogKey: "miniSynth",
      position: { x: 100, y: 100 },
    },
    {
      unitId: "unit2",
      destUnitId: "unit1",
      catalogKey: "lseq1",
      position: { x: 150, y: 360 },
    },
    {
      unitId: "unit3",
      destUnitId: "unit2",
      catalogKey: "mu4Keyboard",
      position: { x: 180, y: 620 },
    },
  ];
  store.setUnitItems(unitItems);
}
buildDefaultScene();

const PickerColumn = () => {
  return (
    <div className="flex-v gap-2 p-2 w-[160px] h-full overflow-y-auto bg-gray-800">
      {showcaseEntries.map((entry) => (
        <div
          key={entry.catalogKey}
          className="flex-vc bg-gray-700 text-gray-300 py-1 cursor-pointer"
        >
          <div className="w-[100px] aspect-[1.5]">
            {entry.thumbnailUrl ? (
              <img
                src={entry.thumbnailUrl}
                alt={entry.catalogKey}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full flex-c bg-gray-500 text-xs text-gray-700">
                No Thumbnail
              </div>
            )}
          </div>
          <div className="text-[11px]">{entry.name}</div>
        </div>
      ))}
    </div>
  );
};

const UnitFrameEx = ({
  unitId,
  destUnitId,
  catalogKey,
}: {
  unitId: string;
  destUnitId: string;
  catalogKey: CatalogKey;
}) => {
  // const state = store.useSnapshot();
  // const onIframeMounted = useCallback((iframe: HTMLIFrameElement) => {
  //   const win = iframe.contentWindow as Window;
  //   win.addEventListener("wheel", sightHandlers.onWheel);
  //   win.addEventListener("pointerdown", sightHandlers.onPointerDown, {
  //     capture: true,
  //   });
  //   return () => {
  //     win.removeEventListener("wheel", sightHandlers.onWheel);
  //     win.removeEventListener("pointerdown", sightHandlers.onPointerDown, {
  //       capture: true,
  //     });
  //   };
  // }, []);
  const frameSize = catalog[catalogKey].preferredSize;
  return (
    <ScalerBoxAutoSized>
      <UnitFrame
        unitId={unitId}
        destUnitId={destUnitId}
        pageUrl={catalog[catalogKey].loaderPageUrl}
        frameSize={frameSize}
        hostSystem={hostSystem}
        // hostBpm={state.bpm}
        // hostPlaying={state.playing}
        // onIframeMounted={onIframeMounted}
      />
    </ScalerBoxAutoSized>
  );
};

const PortCell = () => {
  return <div className="w-[30px] h-[30px] bg-gray-400 cursor-pointer"></div>;
};

const SlotCardBox = ({ unit }: { unit: UnitItem }) => {
  return (
    <div
      className="absolute w-[400px] h-[180px] flex-h"
      style={{ left: npx(unit.position.x), top: npx(unit.position.y) }}
    >
      <div className="w-[40px] bg-gray-500 flex-v justify-between items-center p-2">
        <PortCell />
        <PortCell />
      </div>
      <div className="grow bg-gray-600">
        <UnitFrameEx
          unitId={unit.unitId}
          destUnitId={unit.unitId}
          catalogKey={unit.catalogKey}
        />
      </div>
      <div className="w-[40px] bg-gray-500 flex-c text-white text-[24px] cursor-pointer">
        <Icons.Grip />
      </div>
    </div>
  );
};

const EditField = () => {
  const { unitItems } = store.useSnapshot();
  return (
    <div className="relative">
      {unitItems.map((item) => (
        <SlotCardBox key={item.unitId} unit={item} />
      ))}
    </div>
  );
};

const PageRoot = () => {
  return (
    <div className="w-dvw h-dvh bg-gray-700 flex-h">
      <PickerColumn />
      <EditField />
    </div>
  );
};

const App = () => {
  useEffect(hostSystem.setupLifecycle, []);
  return <PageRoot />;
};

mountAppRoot(<App />);
