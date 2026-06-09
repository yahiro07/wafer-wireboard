import { seqNumbers } from "mofur/ax";
import {
  createPlainSelectorOptions,
  GeneralSelector,
} from "mofur-components/mono2";
import { createStore } from "snap-store";
import { ReactUnitTemplateFn } from "wus-host/react";
import { LabeledRow } from "@/components/labeled-row";

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

export const createRtfrUnit: ReactUnitTemplateFn = (unitInterface) => {
  const noteOutput = unitInterface.primaryOutputPort.noteOutput;
  unitInterface.completeSetup({
    unitAspects: {
      unitType: "sequencer",
      inputs: ["clock", "note"],
    },
    primaryInputPortHandlers: {
      noteInput: {
        noteOn(note, timeAt, velocity) {
          noteOutput.noteOn(note, timeAt, velocity);
        },
        noteOff(note, timeAt) {
          noteOutput.noteOff(note, timeAt);
        },
      },
    },
  });

  const store = createStore<{
    noteRange: NoteRange;
    noteDuration: NoteDuration;
    directionMode: DirectionMode;
    wrappingMode: WrappingMode;
  }>({
    noteRange: "RTF",
    noteDuration: "/8",
    directionMode: "up",
    wrappingMode: "bottom",
  });

  return {
    RenderUi() {
      const st = store.useSnapshot();
      const pattern = generatePattern(
        st.noteRange,
        st.directionMode,
        st.wrappingMode,
        8,
      );
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
        </div>
      );
    },
  };
};
