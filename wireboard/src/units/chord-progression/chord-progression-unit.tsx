import {
  createPlainSelectorOptions,
  createSelectorOptions,
  GeneralSelector,
  SelectorOption,
} from "mofur-components/mono2";
import { createStore } from "snap-store";
import { ReactUnitTemplateFn } from "wus-host/react";
import { ClockInputPort, UnitInterface } from "wus-unit-types/v02";

type DynamicPatternInput = {
  key?: string; //"C", "Am", etc.
  chordRootNote?: number; //in midi note number
};

type ProgressionState = {
  key: string;
  loopBars: number;
  relatives: number[];
};

const keyToNoteNumberMap = {
  Am: 57,
  B: 59,
  C: 60,
  Dm: 62,
  Em: 64,
  F: 65,
  G: 67,
};

type SongKey = "Am" | "C" | "Dm" | "Em" | "F" | "G" | "B";

const allSongKeys: SongKey[] = ["Am", "B", "C", "Dm", "Em", "F", "G"];
const songKeyOptions = createPlainSelectorOptions(allSongKeys);
songKeyOptions.reverse();

const loopBarOptions: SelectorOption<number>[] = createSelectorOptions([
  [4, "4"],
  [8, "8"],
]);

const noteNames = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
];

function isMinorChord(key: string, relative: number) {
  const semitoneFromTonic = ((relative % 12) + 12) % 12;
  if (key.endsWith("m")) {
    return [0, 5, 7].includes(semitoneFromTonic);
  }
  return [2, 4, 9].includes(semitoneFromTonic);
}

function getChordRootNote(key: string, relative: number) {
  const center =
    keyToNoteNumberMap[key as keyof typeof keyToNoteNumberMap] ?? 60;
  return center + relative;
}

function getChordName(key: string, relative: number) {
  const noteNumber = getChordRootNote(key, relative);
  const chordName = noteNames[((noteNumber % 12) + 12) % 12];
  return isMinorChord(key, relative) ? `${chordName}m` : chordName;
}

function getRelNoteValues(key: string) {
  const type = key.endsWith("m") ? "minor" : "major";
  if (type === "major") {
    return [-7, -5, -3, -1, 0, 2, 4, 5, 7, 9];
  } else {
    return [-7, -5, -4, -2, 0, 2, 3, 5, 7, 8];
  }
}

function getRelativeOptions(key: string): SelectorOption<number>[] {
  const relNotes = getRelNoteValues(key).reverse();
  return createSelectorOptions(relNotes.map((i) => [i, getChordName(key, i)]));
}

function createProgressionCore(
  defaultState: ProgressionState,
  unitInterface: UnitInterface,
) {
  const state = defaultState;

  function emitPatternInput(data: DynamicPatternInput) {
    // console.log("emitting", data.key, data.chordRootNote);
    unitInterface.emitMetaAttributes({ dynamicPatternInput: data });
  }

  function emitPatternInputFromState(index: number, withKey?: boolean) {
    const { key, relatives } = state;
    const chordRootNote = getChordRootNote(key, relatives[index]);
    emitPatternInput({ key: withKey ? key : undefined, chordRootNote });
  }

  let prevIndex = -1;

  const clockInput: ClockInputPort = {
    start() {
      emitPatternInputFromState(0, true);
      prevIndex = 0;
    },
    stop() {},
    processScheduling(_startTime, _ppqFrom, ppqTo, _bpm) {
      //480ppq
      const currentBar = Math.floor((ppqTo / (480 * 4)) % state.loopBars);
      const currentIndex = currentBar >>> (state.loopBars === 8 ? 1 : 0);
      if (currentIndex !== prevIndex) {
        emitPatternInputFromState(currentIndex);
      }
      prevIndex = currentIndex;
    },
  };

  return {
    setState(attrs: Partial<ProgressionState>) {
      Object.assign(state, attrs);
      if (attrs.key) {
        unitInterface.emitMetaAttributes({ key: attrs.key });
      }
    },
    clockInput,
  };
}

export const createChordProgressionUnit: ReactUnitTemplateFn = (
  unitInterface,
) => {
  const initialProgressionState: ProgressionState = {
    key: "Am",
    loopBars: 4,
    relatives: [0, -5, -4, -2], //Am-Em-F-G
  };
  const core = createProgressionCore(initialProgressionState, unitInterface);

  const store = createStore<ProgressionState>(initialProgressionState);
  store.subscribe(core.setState);

  const actions = {
    setRelative(index: number, relative: number) {
      store.setState({
        relatives: store.state.relatives.map((r, i) =>
          i === index ? relative : r,
        ),
      });
    },
  };

  unitInterface.completeSetup({
    unitAspects: {
      unitType: "sequencer",
      inputs: ["clock", "state"],
    },
    primaryInputPortHandlers: {
      clockInput: core.clockInput,
      stateInput: {
        emitState() {
          return { ...store.state };
        },
        applyState(state) {
          store.setState(state);
        },
      },
    },
  });

  return {
    RenderUi() {
      const { key, loopBars, relatives } = store.useSnapshot();
      const options = getRelativeOptions(key);

      return (
        <div className="w-[300px] h-[150px] bg-gray-100 flex-c">
          <div className="flex-v gap-2">
            <div>chord progression</div>
            <div className="flex-ha gap-4">
              <div className="flex-ha gap-2">
                <div>key</div>
                <GeneralSelector
                  options={songKeyOptions}
                  value={key}
                  onChange={store.setKey}
                />
              </div>
              <div className="flex-ha gap-2">
                <div>bars</div>
                <GeneralSelector
                  options={loopBarOptions}
                  value={loopBars}
                  onChange={store.setLoopBars}
                />
              </div>
            </div>
            <div className="flex-ha gap-2">
              <div>chord</div>
              {relatives.map((relative, i) => {
                return (
                  <GeneralSelector<number>
                    key={i}
                    options={options}
                    value={relative}
                    onChange={(value) => actions.setRelative(i, value)}
                  />
                );
              })}
            </div>
          </div>
        </div>
      );
    },
  };
};
