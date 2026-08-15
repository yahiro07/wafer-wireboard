import { Button } from "@/components/button";
import { appConfig } from "@/main-definitions/app-config";
import { store } from "@/model/store";
import { exampleProjects } from "@/project/example-projects";
import { projectsModel } from "@/project/projects-model";

export const SecondControlBar = () => {
  return (
    <div className="flex-ha gap-8 p-1 bg-gray-500">
      <div className="flex-ha gap-2">
        <Button
          text="techno"
          onClick={() =>
            projectsModel.loadProjectFromDataText(exampleProjects.techno)
          }
        />
        <Button
          text="trance"
          onClick={() =>
            projectsModel.loadProjectFromDataText(exampleProjects.trance)
          }
        />
        <Button
          text="dance"
          onClick={() =>
            projectsModel.loadProjectFromDataText(exampleProjects.happy)
          }
        />
      </div>
      <div className="flex-ha gap-2">
        <Button text="Import" onClick={projectsModel.importProject} />
        <Button text="Export" onClick={projectsModel.exportProject} />
        {appConfig.isDevelopment && (
          <Button text="dump" onClick={projectsModel.dumpProjectDataText} />
        )}
      </div>
    </div>
  );
};

export const SecondControlBarWrapper = () => {
  const { secondControlBarVisible } = store.useSnapshot();
  if (!secondControlBarVisible) return;
  return (
    <div className="absolute top-0 left-[calc(50%-40px)] transform -translate-x-1/2">
      <SecondControlBar />
    </div>
  );
};
