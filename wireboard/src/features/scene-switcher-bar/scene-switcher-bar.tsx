import { Button } from "mofur-components/mono2";

export const SceneSwitcherBar = () => {
  return (
    <div className="absolute top-0 left-0 h-full p-1 flex-c pointer-events-none">
      <div className="bg-gray-500 flex-vc gap-2 p-2 pointer-events-auto">
        <Button asr={1.4}>1</Button>
        <Button asr={1.4}>2</Button>
        <Button asr={1.4}>3</Button>
        <Button asr={1.4}>4</Button>
      </div>
    </div>
  );
};
