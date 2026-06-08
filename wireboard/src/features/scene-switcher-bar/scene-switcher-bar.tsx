import { Button } from "mofur-components/mono2";
import { store } from "@/store/store";

export const SceneSwitcherBar = () => {
  const { scenes, currentSceneId } = store.useSnapshot();
  return (
    <div className="absolute top-0 left-0 h-full p-1 flex-c pointer-events-none">
      <div className="bg-gray-500 flex-vc gap-2 p-2 pointer-events-auto">
        {scenes.map((scene, i) => (
          <Button
            key={scene.sceneId}
            asr={1.4}
            active={scene.sceneId === currentSceneId}
            onClick={() => store.setCurrentSceneId(scene.sceneId)}
          >
            {i + 1}
          </Button>
        ))}
      </div>
    </div>
  );
};
