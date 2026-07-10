export function dispatchPartialAttrs<T extends Record<string, any>>(
  attrs: Partial<T>,
  receiver: { [K in keyof T]?: (value: T[K]) => void },
) {
  for (const key in attrs) {
    const value = attrs[key];
    if (value !== undefined && key in receiver) {
      receiver[key]?.(value as T[Extract<keyof T, string>]);
    }
  }
}
