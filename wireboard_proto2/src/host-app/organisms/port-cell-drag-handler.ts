export function handlePortCellDragging(
  e: React.PointerEvent,
  unitId: string,
  isOutput: boolean,
  portIndex?: number,
) {
  e.stopPropagation();
}
