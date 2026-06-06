import { seqNumbers } from "mofur/ax";
import { npx } from "mofur/ax-ui";

const configs = {
  defaultKeyWidth: 17,
  defaultKeyHeight: 70,
  blackKeyWidthRatio: 0.8,
  blackKeyHeightRatio: 0.55,
};

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
              className="border border-[#666] cursor-pointer"
              style={{
                background: active ? "#8f8" : "#fff",
                width: npx(keyWidth),
                height: npx(keyHeight),
              }}
              onPointerDown={() => noteOn(noteNumber)}
              onPointerUp={() => noteOff(noteNumber)}
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
              className="border border-[#666] cursor-pointer"
              style={{
                visibility: k === 2 ? "hidden" : "visible",
                background: active ? "#8f8" : "#888",
                width: npx(blackKeyWidth),
                height: npx(blackKeyHeight),
              }}
              onPointerDown={() => noteOn(noteNumber)}
              onPointerUp={() => noteOff(noteNumber)}
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
              className={`border border-[#666] cursor-pointer`}
              style={{
                background: active ? "#8f8" : "#fff",
                width: npx(keyWidth),
                height: npx(keyHeight),
              }}
              onPointerDown={() => noteOn(noteNumber)}
              onPointerUp={() => noteOff(noteNumber)}
            />
          );
        })}
      </div>
    </div>
  );
};
