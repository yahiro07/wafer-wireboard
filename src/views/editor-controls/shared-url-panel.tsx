import { useMemo } from "react";
import { Button } from "@/components/button";
import { actions } from "@/model/actions";
import { projectsModel } from "@/project/projects-model";

export const SharedUrlPanel = () => {
  const url = useMemo(projectsModel.emitSharedUrl, []);

  const closePanel = () => actions.hideModalPanel();

  const handleOpen = () => {
    window.open(url, "_blank");
    closePanel();
  };
  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    window.alert("Copied to clipboard");
    closePanel();
  };

  // const sizeText = `${(url.length / 1024).toFixed(1)} KB`;
  const sizeText = `${url.length} bytes`;

  return (
    <div className="absolute-full z-10 flex-v items-end" onClick={closePanel}>
      <div
        className="w-[600px] bg-gray-100 m-4 p-4 py-6"
        onClick={(e) => e.stopPropagation()}
        onWheel={(e) => e.stopPropagation()}
      >
        <div className="flex-v gap-2">
          <div className="flex-ha justify-between">
            <h3>Shared URL</h3>
            <div className="flex-ha gap-2">
              <Button onClick={handleCopy}>Copy</Button>
              <Button onClick={handleOpen}>Open</Button>
            </div>
          </div>
          <textarea
            className="w-full border border-gray-300 p-2 break-all bg-white"
            value={url}
            readOnly
            rows={4}
          />
          <div className="flex-ha min-h-[30px]">
            <div className="text-sm text-gray-500 ">size: {sizeText}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
