import clsx from "clsx";
import { seqNumbers } from "mofur/ax";
import { npx } from "mofur/ax-ui";
import { createSequencerTickDriver } from "mofur/mx-audio";
import {
  createPlainSelectorOptions,
  GeneralSelector,
} from "mofur-components/mono2";
import { useEffect, useMemo } from "react";
import { createStore } from "snap-store";
import { ReactUnitTemplateFn } from "wus-host/react";
import { UnitInterface } from "wus-unit-types";
import { LabeledRow } from "@/components/labeled-row";
import { makeStepSchedulingSource } from "@/units/common/step-scheduling-source";

type DynamicPatternInput = {
  key?: string; //"C", "Am", etc.
  chordRootNote?: number; //in midi note number
};
type DynamicPatternMeta = {
  dynamicPatternInput?: DynamicPatternInput;
};

const noteRangeValues = [
  "R",
  "RR",
  "RRR",
  "RF",
  "RFR",
  "RFRF",
  "RFRFR",
  "RTF",
  "RTFR",
  "RTFRT",
  "RTFRTF",
  "RTFRTFR",
];
type NoteRange = (typeof noteRangeValues)[number];

const noteRangeOptions = createPlainSelectorOptions(noteRangeValues);

type NoteDuration = "/16" | "/8" | "/4" | "/2" | "1";
const noteDurationValues: NoteDuration[] = ["/16", "/8", "/4", "/2", "1"];

const noteDurationOptions =
  createPlainSelectorOptions<NoteDuration>(noteDurationValues);

type DirectionMode = "up" | "upDown";
const directionModeValues: DirectionMode[] = ["up", "upDown"];
const directionModeOptions =
  createPlainSelectorOptions<DirectionMode>(directionModeValues);

type WrappingMode = "bottom" | "bottom1" | "top1" | "top";
const wrappingModeValues: WrappingMode[] = ["bottom", "bottom1", "top1", "top"];
const wrappingModeOptions =
  createPlainSelectorOptions<WrappingMode>(wrappingModeValues);

function generateNoteIndexSeries(noteRange: NoteRange): number[] {
  const indices: number[] = [];
  let octave = 0;
  for (let i = 0; i < noteRange.length; i++) {
    const code = noteRange[i];
    if (code === "R") {
      if (indices.length === 0) {
      } else {
        octave++;
      }
      indices.push(octave * 3);
    } else if (code === "T") {
      indices.push(octave * 3 + 1);
    } else if (code === "F") {
      indices.push(octave * 3 + 2);
    }
  }
  return indices;
}

function generatePattern(
  noteRange: NoteRange,
  directionMode: DirectionMode,
  wrappingMode: WrappingMode,
  stepCount: number,
): number[] {
  const noteIndices = generateNoteIndexSeries(noteRange);
  let pos = 0;
  let dir = 1;
  return seqNumbers(stepCount).map((i) => {
    const note = noteIndices[pos];
    pos += dir;
    if (pos >= noteIndices.length) {
      if (directionMode === "upDown") {
        dir = -dir;
        pos -= 2;
      } else {
        const restCount = stepCount - i;
        // console.log({ restCount, len: noteIndices.length });
        if (restCount <= noteIndices.length) {
          if (wrappingMode === "bottom") {
            pos = 0;
          } else if (wrappingMode === "bottom1") {
            pos = 1;
          } else if (wrappingMode === "top1") {
            pos = noteIndices.length - restCount;
          } else if (wrappingMode === "top") {
            pos = noteIndices.length - restCount + 1;
          }
        } else {
          pos = 0;
        }
      }
    } else if (pos === 0) {
      dir = 1;
    }
    return note;
  });
}

const degreeTexts = ["R", "T", "F", "R", "T", "F", "R"];

const PatternView = ({ pattern }: { pattern: number[] }) => {
  return (
    <div className="flex-h gap-2">
      {pattern.map((y, i) => {
        return (
          <div
            key={i}
            className="rounded-full bg-gray-300"
            style={{
              paddingTop: npx((6 - y) * 10),
            }}
          >
            <div
              className={clsx(
                "text-[8px] w-[18px] h-[18px] rounded-full flex-c text-white border",
                y % 3 === 0 && "bg-orange-400 border-orange-500",
                y % 3 !== 0 && "bg-yellow-300 border-yellow-400",
              )}
            >
              {degreeTexts[y]}
            </div>
          </div>
        );
      })}
    </div>
  );
};

type SongKey = "Am" | "C" | "Dm" | "Em" | "F" | "G" | "B";

function checkKeyValid(key: string): SongKey | undefined {
  const valid = ["Am", "B", "C", "Dm", "Em", "F", "G"].includes(key as SongKey);
  return valid ? (key as SongKey) : undefined;
}

function getKeyRootNoteIndex(key: SongKey): number {
  const noteName = key.replace("m", "") as
    | "A"
    | "B"
    | "C"
    | "D"
    | "E"
    | "F"
    | "G";
  return {
    C: 0,
    D: 2,
    E: 4,
    F: 5,
    G: 7,
    A: 9,
    B: 11,
  }[noteName];
}

function checkIsMinorChord(key: SongKey, chordRootNote: number): boolean {
  const isKeyMinor = key.endsWith("m");
  const keyRootNoteIndex = getKeyRootNoteIndex(key);
  const chordRootNoteIndex = chordRootNote % 12;
  const relativeIndex = (chordRootNoteIndex - keyRootNoteIndex + 12) % 12;
  if (!isKeyMinor) {
    //major key
    return [0, 2, 4, 9, 11].includes(relativeIndex);
  } else {
    //minor key
    return [0, 2, 5, 7].includes(relativeIndex);
  }
}

function applyDynamicNoteShift(
  rtfNote: number, //0 for root, 1 for third, 2 for fifth, 3 for root in next octave, etc.
  key: SongKey, //C, Am, etc.
  chordRootNote: number, //MIDI note number of the chord root
  octaveShift: number, // octave shift
): number {
  const isMinor = checkIsMinorChord(key, chordRootNote);
  const intervals = isMinor ? [0, 3, 7] : [0, 4, 7];
  const rtfOctave = Math.floor(rtfNote / 3);
  return (
    chordRootNote + intervals[rtfNote % 3] + (octaveShift + rtfOctave) * 12
  );
}

function createSequencer(unitInterface: UnitInterface) {
  const state = {
    pattern: seqNumbers(8).map(() => 0),
    key: "Am",
    chordRootNote: 60 as number | undefined,
    octaveShift: 0,
    noteDuty: 0.9,
    bpm: 120,
    isClockInputActive: false,
    isInternalTickRunning: false,
  };

  const noteOutput = unitInterface.primaryOutputPort.noteOutput;

  const sequencerTickDriver = createSequencerTickDriver();

  const core = {
    processClock(
      startTime: number,
      ppqFrom: number,
      ppqTo: number,
      bpm: number,
    ) {
      const { pattern } = state;
      const sss = makeStepSchedulingSource(startTime, ppqFrom, ppqTo, bpm);
      sss.stepPoints.forEach(({ time, stepIndex }) => {
        const rtfNote = pattern[stepIndex % pattern.length];
        const songKey = checkKeyValid(state.key);
        if (
          songKey &&
          rtfNote !== undefined &&
          state.chordRootNote !== undefined
        ) {
          const noteNumber = applyDynamicNoteShift(
            rtfNote,
            songKey,
            state.chordRootNote,
            state.octaveShift,
          );
          const endTime = time + sss.stepDuration * state.noteDuty;
          console.log("output", noteNumber, time, endTime);
          noteOutput.noteOn(noteNumber, time, 1);
          noteOutput.noteOff(noteNumber, endTime);
        }
      });
    },
  };

  unitInterface.completeSetup({
    unitAspects: {
      unitType: "sequencer",
      outputs: ["note"],
      inputs: ["clock", "note"],
    },
    primaryInputPortHandlers: {
      noteInput: {
        noteOn(note, _timeAt, _velocity) {
          // noteOutput.noteOn(note, timeAt, velocity);
          state.chordRootNote = note;
          if (!state.isClockInputActive) {
            sequencerTickDriver.setBpm(state.bpm);
            const startTime = unitInterface.audioContext.currentTime;
            console.log({ startTime });
            sequencerTickDriver.start({
              processTickRange(ppqFrom, ppqTo) {
                core.processClock(startTime, ppqFrom, ppqTo, state.bpm);
              },
            });
            state.isInternalTickRunning = true;
          }
        },
        noteOff(_note, _timeAt) {
          state.chordRootNote = undefined;
          // noteOutput.noteOff(note, timeAt);
          if (state.isInternalTickRunning) {
            sequencerTickDriver.stop();
            state.isInternalTickRunning = false;
          }
        },
      },
      clockInput: {
        start() {
          state.isClockInputActive = true;
          if (state.isInternalTickRunning) {
            sequencerTickDriver.stop();
            state.isInternalTickRunning = false;
          }
          console.log("start clock");
          const stt = unitInterface.audioContext.currentTime;
          console.log({ stt });
        },
        stop() {
          state.isClockInputActive = false;
          state.chordRootNote = undefined;
        },
        processScheduling(startTime, ppqFrom, ppqTo, bpm) {
          console.log("processScheduling", ppqFrom, ppqTo, bpm);
          core.processClock(startTime, ppqFrom, ppqTo, bpm);
        },
      },
    },
    hostCallbacks: {
      setBpm(bpm) {
        state.bpm = bpm;
      },
      setMetaAttributes(attrs: DynamicPatternMeta) {
        if (attrs.dynamicPatternInput) {
          const { key, chordRootNote } = attrs.dynamicPatternInput;
          if (key !== undefined) {
            state.key = key;
          }
          if (chordRootNote !== undefined) {
            state.chordRootNote = chordRootNote;
          }
        }
      },
    },
  });

  return {
    setPattern(newPattern: number[]) {
      state.pattern = newPattern;
    },
    setOctaveShift(octaveShift: number) {
      state.octaveShift = octaveShift;
    },
    setNoteDuty(noteDuty: number) {
      state.noteDuty = noteDuty;
    },
  };
}

export const createRtfrUnit: ReactUnitTemplateFn = (unitInterface) => {
  const sequencer = createSequencer(unitInterface);

  const store = createStore<{
    noteRange: NoteRange;
    noteDuration: NoteDuration;
    directionMode: DirectionMode;
    wrappingMode: WrappingMode;
    octaveShift: number;
    noteDuty: number;
  }>({
    noteRange: "RTF",
    noteDuration: "/8",
    directionMode: "up",
    wrappingMode: "bottom",
    octaveShift: 0,
    noteDuty: 1,
  });

  return {
    RenderUi() {
      const st = store.useSnapshot();
      const pattern = useMemo(
        () =>
          generatePattern(st.noteRange, st.directionMode, st.wrappingMode, 8),
        [st.noteRange, st.directionMode, st.wrappingMode],
      );
      useEffect(() => {
        sequencer.setPattern(pattern);
      }, [pattern, sequencer]);
      return (
        <div className="w-[400px] h-[200px] bg-[#eee] p-2">
          <div>RTFR</div>
          <div className="flex-h gap-4">
            <LabeledRow label="note range">
              <GeneralSelector
                options={noteRangeOptions}
                value={st.noteRange}
                onChange={store.setNoteRange}
              />
            </LabeledRow>
            <LabeledRow label="note duration">
              <GeneralSelector
                options={noteDurationOptions}
                value={st.noteDuration}
                onChange={store.setNoteDuration}
              />
            </LabeledRow>
          </div>
          <div className="flex-h gap-4">
            <LabeledRow label="direction">
              <GeneralSelector
                options={directionModeOptions}
                value={st.directionMode}
                onChange={store.setDirectionMode}
              />
            </LabeledRow>
            <LabeledRow label="wrapping">
              <GeneralSelector
                options={wrappingModeOptions}
                value={st.wrappingMode}
                onChange={store.setWrappingMode}
              />
            </LabeledRow>
          </div>
          <div>pattern: {pattern}</div>
          <div className="flex-c">
            <PatternView pattern={pattern} />
          </div>
        </div>
      );
    },
  };
};
