export function clampValue(value: number, lo: number, hi: number) {
  if (value < lo) return lo;
  if (value > hi) return hi;
  return value;
}

export function mapUnaryTo(value: number, d0: number, d1: number) {
  return d0 + (d1 - d0) * value;
}

export function mapUnaryFrom(
  val: number,
  lo: number,
  hi: number,
  clamp?: boolean,
) {
  if (hi === lo) return lo;
  const v = (val - lo) / (hi - lo);
  if (clamp) {
    return clampValue(v, 0, 1);
  }
  return v;
}

export function linearInterpolate(
  value: number,
  s0: number,
  s1: number,
  d0: number,
  d1: number,
  clamp?: boolean,
) {
  if (s1 === s0) return d0;
  const v = ((value - s0) / (s1 - s0)) * (d1 - d0) + d0;
  if (clamp) {
    const lo = Math.min(d0, d1);
    const hi = Math.max(d0, d1);
    return clampValue(v, lo, hi);
  }
  return v;
}

export function seqNumbers(n: number): number[] {
  return Array(n)
    .fill(0)
    .map((_, i) => i);
}

export function uniqueArrayItems<T>(items: T[]): T[] {
  return Array.from(new Set(items));
}

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

export function shallowEqual<T extends object>(
  a: T | undefined,
  b: T,
): boolean {
  if (a === undefined) return false;
  const keys = Object.keys(b) as (keyof T)[];
  return keys.every((key) => Object.is(a[key], b[key]));
}

export function pickObjectMembers<T extends {}, K extends keyof T>(
  obj: T,
  keys: K[] | Record<K, 1 | true>,
): Pick<T, K> {
  const fieldNames = Array.isArray(keys) ? keys : (Object.keys(keys) as K[]);
  return Object.fromEntries(
    fieldNames.map((fieldName) => [fieldName, obj[fieldName]]),
  ) as Pick<T, K>;
}

export function iife<T>(fn: () => T) {
  return fn();
}

export async function delayMs(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function npx(value: number) {
  return `${value}px`;
}
