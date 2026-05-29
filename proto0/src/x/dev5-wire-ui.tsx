import { mountAppRoot } from "beams/ax-react/mount-app-root";
import { npx } from "beams/ax-ui/styling-utils";
import { useEffect } from "react";
import { createStore } from "snap-store";
import { createHostSystem } from "wus-host/host";
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

type StoreState = {};

const audioContext = new AudioContext();
const hostSystem = createHostSystem(audioContext);
const store = createStore<StoreState>({});

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

const PortCell = () => {
  return <div className="w-[30px] h-[30px] bg-gray-400"></div>;
};

const SlotCardBox = ({ x, y }: { x: number; y: number }) => {
  return (
    <div
      className="absolute w-[400px] h-[200px] flex-h"
      style={{ left: npx(x), top: npx(y) }}
    >
      <div className="w-[40px] bg-gray-500 flex-v justify-between items-center p-2">
        <PortCell />
        <PortCell />
      </div>
      <div className="grow bg-gray-600"></div>
      <div className="w-[40px] bg-gray-500 flex-c text-white text-[24px] cursor-pointer">
        <Icons.Grip />
      </div>
    </div>
  );
};

const EditField = () => {
  return (
    <div className="relative">
      <SlotCardBox x={100} y={100} />
      <SlotCardBox x={100} y={400} />
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
