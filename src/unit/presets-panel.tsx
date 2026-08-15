import { GeneralSelector } from "@/components/general-selector";
import { SelectorOption } from "@/components/selector-option";
import { useMemo, useState } from "react";
import { PresetProvider } from "wafer-host/unit-types";

type PresetsViewModel = {
  presetOptions: SelectorOption<string>[];
  selectPreset(presetName: string): void;
  shiftPreset(dir: -1 | 1): void;
  commandNames: string[];
  applyCommand(commandName: string): void;
  currentPresetName: string;
};

function usePresetsViewModel(presetProvider: PresetProvider): PresetsViewModel {
  const { presetNames, presetOptions, commandNames } = useMemo(() => {
    const presetNames = presetProvider.getPresetNames?.() ?? [];
    const commandNames = presetProvider.getCommandNames?.() ?? [];
    const presetOptions: SelectorOption<string>[] = [
      { label: "--", value: "--" },
      ...presetNames.map((it) => ({ label: it, value: it })),
    ];
    return { presetNames, presetOptions, commandNames };
  }, [presetProvider]);

  const [currentPresetIndex, setCurrentPresetIndex] = useState(-1);
  const currentPresetName = presetNames[currentPresetIndex] ?? "--";

  const handlers = {
    selectPresetByIndex(index: number) {
      if (0 <= index && index < presetNames.length) {
        presetProvider.applyPreset?.(presetNames[index]);
        setCurrentPresetIndex(index);
      } else {
        setCurrentPresetIndex(-1);
      }
    },
    selectPreset: (presetName: string) => {
      const index = presetNames.indexOf(presetName);
      handlers.selectPresetByIndex(index);
    },
    shiftPreset: (dir: -1 | 1) => {
      const nextIndex =
        currentPresetIndex === -1
          ? 0
          : (currentPresetIndex + dir + presetNames.length) %
            presetNames.length;
      handlers.selectPresetByIndex(nextIndex);
    },
    applyCommand: (commandName: string) => {
      if (!commandNames.includes(commandName)) return;
      const shouldResetSelection = presetProvider.applyCommand?.(commandName);
      if (shouldResetSelection) {
        handlers.selectPresetByIndex(-1);
      }
    },
  };

  return {
    presetOptions,
    selectPreset: handlers.selectPreset,
    shiftPreset: handlers.shiftPreset,
    commandNames,
    applyCommand: handlers.applyCommand,
    currentPresetName,
  };
}

export const PresetsPanel = ({
  presetProvider,
}: {
  presetProvider: PresetProvider;
}) => {
  const vm = usePresetsViewModel(presetProvider);
  return (
    <div className="absolute top-0 left-0 p-2 w-full h-[75%]">
      <div className="flex-vc bg-white/70 gap-3 w-full h-full">
        {vm.presetOptions.length > 1 && (
          <div className="flex-ha gap-0.5">
            <button
              className="cursor-pointer bg-gray-500/90 text-white w-[30px] h-[28px] hover:opacity-90"
              onClick={() => vm.shiftPreset(-1)}
            >
              ◀
            </button>
            <div className="w-[120px] h-[32px] border border-gray-400 bg-white flex-c hover:opacity-90">
              <GeneralSelector
                className="w-full h-full text-center border-none outline-none appearance-none cursor-pointer hover:opacity-90"
                options={vm.presetOptions}
                value={vm.currentPresetName}
                onChange={vm.selectPreset}
              />
            </div>
            <button
              className="cursor-pointer bg-gray-500/90 text-white w-[30px] h-[28px] hover:opacity-90"
              onClick={() => vm.shiftPreset(1)}
            >
              ▶
            </button>
          </div>
        )}
        <div className="flex-h gap-3">
          {vm.commandNames.map((commandName) => (
            <button
              key={commandName}
              className="cursor-pointer bg-gray-500/90 text-white px-2 h-[30px] hover:opacity-90"
              onClick={() => vm.applyCommand(commandName)}
            >
              {commandName}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
