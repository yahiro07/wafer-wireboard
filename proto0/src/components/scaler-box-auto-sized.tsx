import { ReactNode, useMemo, useRef } from "react";
import { useDomElementSize } from "@/hooks/use-dom-element-size";

export function ScalerBoxAutoSized(props: { children: ReactNode }) {
  const baseDivRef = useRef<HTMLDivElement>(null);
  const innerDivRef = useRef<HTMLDivElement>(null);

  const outerSize = useDomElementSize(baseDivRef);
  const innerSize = useDomElementSize(innerDivRef);

  const scale = useMemo(() => {
    if (!outerSize || !innerSize) return 1;
    if (innerSize.width === 0 || innerSize.height === 0) return 1;
    return Math.min(
      outerSize.width / innerSize.width,
      outerSize.height / innerSize.height,
    );
  }, [outerSize, innerSize]);

  const isReady = outerSize && innerSize && innerSize.width > 0;

  return (
    <div ref={baseDivRef} className="relative w-full h-full overflow-hidden">
      <div
        ref={innerDivRef}
        className="absolute top-1/2 left-1/2"
        style={{
          transform: `translate(-50%, -50%) scale(${scale})`,
          visibility: isReady ? "visible" : "hidden",
        }}
      >
        {props.children}
      </div>
    </div>
  );
}
