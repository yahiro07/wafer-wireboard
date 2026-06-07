export const slotCardDimensions = {
  width: 400,
  height: 180,
  outputPort: { x: 20, y: 23 },
  inputPort: { x: 20, y: 157 },
};

export const systemPortCardDimensions = {
  width: 560,
  height: 120,
  outputPort: { x: 40, y: 17 },
  inputPort: { x: 40, y: 103 },
};

export function getUnitCardDimensions(unitId: string) {
  return unitId.startsWith("builtIn")
    ? systemPortCardDimensions
    : slotCardDimensions;
}
