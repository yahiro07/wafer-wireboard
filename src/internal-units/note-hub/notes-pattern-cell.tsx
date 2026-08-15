import { seqNumbers } from "@/auxiliaries/helpers";

type Props = {
  notes: number[] | undefined;
};

export const NotesPatternCell = ({ notes }: Props) => {
  return (
    <div
      className="w-[28px] h-[28px] p-px"
      style={{
        display: "grid",
        gridTemplateRows: "repeat(3, 1fr)",
        gridTemplateColumns: "repeat(4, 1fr)",
        transform: "scaleY(-1)",
        background: !notes ? "#ccc" : "#fff",
        border: "solid 1px #8af",
      }}
    >
      {notes &&
        seqNumbers(12).map((i) => {
          const hasNote = notes ? notes.some((note) => note % 12 === i) : false;
          return (
            <div
              key={i}
              style={{
                backgroundColor: hasNote ? "#8af" : "#fff",
              }}
            />
          );
        })}
    </div>
  );
};
