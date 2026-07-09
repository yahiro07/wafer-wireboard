import { Point, Size } from "mofur/ax-ui";
import { WiringLayerWire } from "@/views/editor/wiring-layer-wire-items";
import { bgSpecs } from "@/common/theme";

type Props = {
  boardSize: Size;
  wires: WiringLayerWire[];
};

const middle = (a: number, b: number) => (a + b) / 2;

function getAngledPoints(p1: Point, p2: Point): Point[] {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  if (Math.abs(dx) < Math.abs(dy)) {
    return [p1, p2];
  }
  const mps = [
    { x: p1.x + (Math.sign(dx) * Math.abs(dy)) / 2, y: middle(p1.y, p2.y) },
    { x: p2.x - (Math.sign(dx) * Math.abs(dy)) / 2, y: middle(p1.y, p2.y) },
  ];
  return [p1, ...mps, p2];
}

function getAngledPoints2(p1: Point, p2: Point): Point[] {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  if (Math.abs(dx) < Math.abs(dy)) {
    return [p1, p2];
  }
  const mps = [{ x: p1.x + Math.sign(dx) * Math.abs(dy), y: p2.y }];
  return [p1, ...mps, p2];
}

function getWirePoints(wire: WiringLayerWire): Point[] {
  if (wire.routeType === "diagonal") {
    return getAngledPoints(wire.p1, wire.p2);
  } else if (wire.routeType === "diagonal2") {
    return getAngledPoints2(wire.p1, wire.p2);
  } else {
    return [wire.p1, wire.p2];
  }
}

const WireLine = ({ wire }: { wire: WiringLayerWire }) => {
  const points = getWirePoints(wire);
  return (
    <polyline
      points={points.map((p) => `${p.x},${p.y}`).join(" ")}
      stroke={bgSpecs.wireColor}
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
