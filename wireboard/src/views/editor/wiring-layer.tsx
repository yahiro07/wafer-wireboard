import { Size } from "mofur/ax-ui";
import { useMemo } from "react";
import { bgSpecs } from "@/common/theme";
import { WiringLayerWire } from "@/views/editor/wiring-layer-wire-items";

type Props = {
  boardSize: Size;
  wires: WiringLayerWire[];
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function pointsToCurvePath(wire: WiringLayerWire): string {
  const { p1, p2 } = wire;
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const distance = Math.hypot(dx, dy);
  const isBacktracking = dx < 0;
  const curvature = isBacktracking ? 0.58 : 0.42;
  const maxHandleLength = isBacktracking ? 260 : 180;
  const handleLength = clamp(distance * curvature, 40, maxHandleLength);
  const baseTangent = isBacktracking
    ? Math.max(Math.abs(dx) * 0.5, Math.abs(dy) * 0.45)
    : Math.abs(dx) * 0.5;
  const minTangent = isBacktracking ? 72 : 24;
  const tangent = clamp(baseTangent, minTangent, handleLength);
  const c1x = p1.x + tangent;
  const c2x = p2.x - tangent;
  const c1y = p1.y;
  const c2y = p2.y;

  return `M ${p1.x},${p1.y} C ${c1x},${c1y} ${c2x},${c2y} ${p2.x},${p2.y}`;
}

const WireLine = ({ wire }: { wire: WiringLayerWire }) => {
  const path = useMemo(() => pointsToCurvePath(wire), [wire]);
  return (
    <path
      d={path}
      stroke={bgSpecs.wireColor}
      strokeWidth={8}
      strokeLinecap="round"
      strokeLinejoin="round"
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
