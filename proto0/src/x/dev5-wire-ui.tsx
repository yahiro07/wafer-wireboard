import { mountAppRoot } from "beams/ax-react/mount-app-root";
import { useEffect } from "react";
import { createStore } from "snap-store";
import { createHostSystem } from "wus-host/host";
import catalog from "../unit-inventories.json";

type CatalogKey = keyof typeof catalog;

const catalogItems = Object.values(catalog);

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

const PageRoot = () => {
  return (
    <div className="w-dvw h-dvh bg-gray-600 flex-vl">
      <PickerColumn />
    </div>
  );
};

const App = () => {
  useEffect(hostSystem.setupLifecycle, []);
  return <PageRoot />;
};

mountAppRoot(<App />);
