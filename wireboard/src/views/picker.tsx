import { showcaseEntries } from "@/main-definitions/showcase-entries";
import { handlePickerItemDragStart } from "@/views/picker-drag-drop";

export const PickerColumn = () => {
  return (
    <div
      className="w-[160px] h-full overflow-y-auto bg-gray-800"
      style={{ direction: "rtl" }}
    >
      <div className="flex-v gap-2 p-2" style={{ direction: "ltr" }}>
        {showcaseEntries.map((entry) => (
          <div
            key={entry.catalogKey}
            draggable
            onDragStart={(e) => handlePickerItemDragStart(e, entry)}
            className="flex-vc bg-gray-700/50 text-gray-300 py-1 cursor-pointer relative"
          >
            <div className="h-[67px] aspect-[1.5]">
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
            {entry.isBeta && (
              <div className="absolute top-[26px] left-0 text-[#ccc] text-[10px] m-[3px]">
                β
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
