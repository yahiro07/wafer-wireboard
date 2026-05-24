import { useEffect, useRef } from "react";

export function usePrevious<T>(val: T) {
  const ref = useRef<T>(val);
  useEffect(() => {
    ref.current = val;
  }, [val]);
  return ref.current;
}
