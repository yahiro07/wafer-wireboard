import { seqNumbers } from "@/auxiliaries/helpers";
import { npx } from "@/auxiliaries/helpers";
import { startDragSession } from "@/auxiliaries/drag-session";

const configs = {
  defaultKeyWidth: 17,
  defaultKeyHeight: 64,
  blackKeyWidthRatio: 0.8,
  blackKeyHeightRatio: 0.55,
};

function handleKeyPointerDown(
  e: React.PointerEvent,
  initialNote: number,
  noteOn: (noteNumber: number) => void,
  noteOff: (noteNumber: number) => void,
) {
  const keyboardRoot = e.currentTarget.closest("[data-keyboard-root]");
  let currentNote: number | undefined;
  const switchNote = (nextNote: number | undefined) => {
    if (nextNote === currentNote) return;
    if (currentNote !== undefined) {
      noteOff(currentNote);
    }
    currentNote = nextNote;
    if (currentNote !== undefined) {
      noteOn(currentNote);
    }
  };
  const getNoteAtPoint = (x: number, y: number) => {
    const key = document
      .elementFromPoint(x, y)
      ?.closest<HTMLElement>("[data-keyboard-note]");
    if (!key || !keyboardRoot?.contains(key)) {
      return undefined;
    }
    const note = Number(key.dataset.keyboardNote);
    return Number.isFinite(note) ? note : undefined;
  };
  switchNote(initialNote);
  startDragSession(e.nativeEvent, {
    onMove({ position }) {
      switchNote(getNoteAtPoint(position.x, position.y));
    },
    onUpOrCancel() {
      switchNote(undefined);
    },
  });
  e.preventDefault();
}

export const KeyboardOctaveBlock = ({
  baseNoteNumber,
  activeNotes,
  noteOn,
  noteOff,
  keyWidth = configs.defaultKeyWidth,
  keyHeight = configs.defaultKeyHeight,
}: {
  baseNoteNumber: number;
  activeNotes: number[];
  noteOn(noteNumber: number): void;
  noteOff(noteNumber: number): void;
  keyWidth?: number;
  keyHeight?: number;
}) => {
  const blackKeyWidth = keyWidth * configs.blackKeyWidthRatio;
  const blackKeyHeight = keyHeight * configs.blackKeyHeightRatio;
  return (
    <div className="relative">
      <div className="flex-h">
        {seqNumbers(7).map((k) => {
          const relatives = [0, 2, 4, 5, 7, 9, 11];
          const noteNumber = baseNoteNumber + relatives[k];
          const active = activeNotes.includes(noteNumber);
          return (
            <div
              key={k}
              data-keyboard-note={noteNumber}
              className="border border-[#666] cursor-pointer"
              style={{
                background: active ? "#8f8" : "#fff",
                width: npx(keyWidth),
                height: npx(keyHeight),
              }}
              onPointerDown={(e) =>
                handleKeyPointerDown(e, noteNumber, noteOn, noteOff)
              }
            />
          );
        })}
      </div>
      <div
        className="absolute top-0 left-0 flex-h"
        style={{ paddingLeft: npx(keyWidth * 0.6), gap: npx(keyWidth * 0.2) }}
      >
        {seqNumbers(6).map((k) => {
          const relatives = [1, 3, -1, 6, 8, 10];
          const noteNumber = baseNoteNumber + relatives[k];
          const active = activeNotes.includes(noteNumber);
          return (
            <div
              key={k}
              data-keyboard-note={noteNumber}
              className="border border-[#666] cursor-pointer"
              style={{
                visibility: k === 2 ? "hidden" : "visible",
                background: active ? "#8f8" : "#888",
                width: npx(blackKeyWidth),
                height: npx(blackKeyHeight),
              }}
              onPointerDown={(e) =>
                handleKeyPointerDown(e, noteNumber, noteOn, noteOff)
              }
            />
          );
        })}
      </div>
    </div>
  );
};

export const KeyboardTopKey = ({
  noteNumber,
  activeNotes,
  noteOn,
  noteOff,
  keyWidth = configs.defaultKeyWidth,
  keyHeight = configs.defaultKeyHeight,
}: {
  noteNumber: number;
  activeNotes: number[];
  noteOn(noteNumber: number): void;
  noteOff(noteNumber: number): void;
  keyWidth?: number;
  keyHeight?: number;
}) => {
  return (
    <div className="relative">
      <div className="flex-h">
        {seqNumbers(1).map((k) => {
          const active = activeNotes.includes(noteNumber);
          return (
            <div
              key={k}
              data-keyboard-note={noteNumber}
              className={`border border-[#666] cursor-pointer`}
              style={{
                background: active ? "#8f8" : "#fff",
                width: npx(keyWidth),
                height: npx(keyHeight),
              }}
              onPointerDown={(e) =>
                handleKeyPointerDown(e, noteNumber, noteOn, noteOff)
              }
            />
          );
        })}
      </div>
    </div>
  );
};
