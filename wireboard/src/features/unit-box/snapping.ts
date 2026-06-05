import { Point } from "mofur/ax-ui";

export function snapUnitCoordToGrid(pos: Point): Point {
  const gridSize = 20;
  return {
    x: Math.round(pos.x / gridSize) * gridSize,
    y: Math.round(pos.y / gridSize) * gridSize,
  };
}
