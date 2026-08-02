export function findItemMappedMinimum<T>(
  items: T[],
  mapper: (item: T) => number,
): T | undefined {
  let resItem: T | undefined;
  let minValue = Infinity;
  for (const item of items) {
    const value = mapper(item);
    if (value < minValue) {
      minValue = value;
      resItem = item;
    }
  }
  return resItem;
}
