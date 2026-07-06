import { Point, Size } from "mofur/ax-ui";
import { WiringLayerWire } from "@/views/editor/wiring-layer-wire-items";

type Props = {
  boardSize: Size;
  wires: WiringLayerWire[];
};

function getAngledPoints(p1: Point, p2: Point): Point[] {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  if (Math.abs(dx) < Math.abs(dy)) {
    return [p1, p2];
  }
  const mp = { x: p1.x - Math.sign(dx) * dy, y: p2.y };
  return [p1, mp, p2];
}

const WireLine = ({ wire }: { wire: WiringLayerWire }) => {
  const points = wire.rightAngled
    ? getAngledPoints(wire.p1, wire.p2)
    : [wire.p1, wire.p2];
  return (
    <polyline
      points={points.map((p) => `${p.x},${p.y}`).join(" ")}
      stroke="#888"
      strokeWidth={10}
      fill="none"
    />
  );
};

export const WiringLayer = ({ boardSize, wires }: Props) => {
  return (
    <svg
      className="absolute left-0 top-0 pointer-events-none"
      width={boardSize.width}
      height={boardSize.height}
    >
      {wires.map((wire) => (
        <WireLine key={wire.id} wire={wire} />
      ))}
    </svg>
  );
};
