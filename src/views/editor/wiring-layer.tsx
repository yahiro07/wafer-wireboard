import { Size } from "@/auxiliaries/common-types";
import { useMemo } from "react";
import { signalColors } from "@/main-definitions/constants";
import { WiringLayerWire } from "@/views/editor/wiring-layer-wire-items";

type Props = {
  boardSize: Size;
  wires: WiringLayerWire[];
  wireVertical: boolean;
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function pointsToCurvePath(
  wire: WiringLayerWire,
  wireVertical: boolean,
): string {
  const { p1, p2 } = wire;
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const distance = Math.hypot(dx, dy);
  // Horizontal: left→right. Vertical: bottom→top (screen Y grows downward).
  const isBacktracking = wireVertical ? dy > 0 : dx < 0;
  const curvature = isBacktracking ? 0.58 : 0.42;
  const maxHandleLength = isBacktracking ? 260 : 180;
  const handleLength = clamp(distance * curvature, 40, maxHandleLength);
  const primary = wireVertical ? Math.abs(dy) : Math.abs(dx);
  const secondary = wireVertical ? Math.abs(dx) : Math.abs(dy);
  const baseTangent = isBacktracking
    ? Math.max(primary * 0.5, secondary * 0.45)
    : primary * 0.5;
  const minTangent = isBacktracking ? 72 : 24;
  const tangent = clamp(baseTangent, minTangent, handleLength);
  const c1x = wireVertical ? p1.x : p1.x + tangent;
  const c2x = wireVertical ? p2.x : p2.x - tangent;
  const c1y = wireVertical ? p1.y - tangent : p1.y;
  const c2y = wireVertical ? p2.y + tangent : p2.y;

  return `M ${p1.x},${p1.y} C ${c1x},${c1y} ${c2x},${c2y} ${p2.x},${p2.y}`;
}

const WireLine = ({
  wire,
  wireVertical,
}: {
  wire: WiringLayerWire;
  wireVertical: boolean;
}) => {
  const path = useMemo(
    () => pointsToCurvePath(wire, wireVertical),
    [wire, wireVertical],
  );
  const color = signalColors[wire.signalType];
  return (
    <path
      d={path}
      stroke={color}
      strokeWidth={6}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      opacity={wire.weaken ? 0.1 : 0.8}
    />
  );
};

export const WiringLayer = ({ boardSize, wires, wireVertical }: Props) => {
  return (
    <svg
      className="absolute left-0 top-0 pointer-events-none"
      width={boardSize.width}
      height={boardSize.height}
    >
      {wires.map((wire) => (
        <WireLine key={wire.id} wire={wire} wireVertical={wireVertical} />
      ))}
    </svg>
  );
};
