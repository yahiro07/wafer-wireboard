import { boardSize } from "@/main-definitions/constants";

export const BoardBackgroundLayer = () => {
  const color = "#6676";
  const lineWidth = 1;
  const gridPitch = 50;
  const strokeDasharray = "6 6";
  return (
    <div
      className="absolute top-0 left-0 z-[-1]"
      style={{
        width: boardSize.width,
        height: boardSize.height,
        border: `solid  1px ${color}`,
      }}
    >
      <svg viewBox={`0 0 ${boardSize.width} ${boardSize.height}`}>
        <g>
          {Array.from({ length: boardSize.width / gridPitch }).map((_, i) => (
            <line
              key={i}
              x1={i * gridPitch}
              y1={0}
              x2={i * gridPitch}
              y2={boardSize.height}
              stroke={color}
              strokeWidth={lineWidth}
              strokeDasharray={strokeDasharray}
            />
          ))}
        </g>
        <g>
          {Array.from({ length: boardSize.height / gridPitch }).map((_, i) => (
            <line
              key={i}
              x1={0}
              y1={i * gridPitch}
              x2={boardSize.width}
              y2={i * gridPitch}
              stroke={color}
              strokeWidth={lineWidth}
              strokeDasharray={strokeDasharray}
            />
          ))}
        </g>
      </svg>
    </div>
  );
};
