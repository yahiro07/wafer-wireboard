import { useEffect, useRef } from "react";
import { hostSystem } from "@/framework/host/host-system";
import { HsUnitInstance } from "@/framework/host/host-types";
import { createUnitInterface } from "@/framework/host/unit-interface-impl";
import { extractArray } from "@/framework/unit-frame/helper";

function createUnitFrameModel(
  unitId: string,
  loadedCallback?: (unitInstance: HsUnitInstance) => void,
) {
  // const unitAdapter = createUnitAdapter(unitId);
  // let unitInstance: HsUnitInstance | undefined;

  return {
    onIframeMounted(iframe: HTMLIFrameElement) {
      // const unregisterUnitAdapter =
      //   hostSystem.registerUnitInstance(unitAdapter);
      // let unmountUnit: (() => void) | null = null;

      const win = iframe.contentWindow;
      (win as any).unitInterface = createUnitInterface(
        unitId,
        (unitInstance) => {
          // unmountUnit = unitAdapter.mountUnitInstance(unitInstance);
          hostSystem.addUnitInstance(unitInstance);
          loadedCallback?.(unitInstance);
        },
      );
      return () => {
        // unregisterUnitAdapter();
        // unmountUnit?.();
      };
    },
    // setDestSpec(destSpec?: string | string[]) {
    //   if (destSpec) {
    //     return connectUnitToDestination(unitAdapter, destSpec);
    //   }
    // },
    dispose() {},
  };
}

export const UnitFrame = ({
  unitId,
  pageUrl,
  destSpec,
  loadedCallback,
}: {
  unitId: string;
  pageUrl: string;
  destSpec?: string | string[];
  loadedCallback?(unitInstance: HsUnitInstance): void;
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: variable length deps
  useEffect(() => {
    hostSystem.reserveConnectionChange(unitId, destSpec);
  }, [unitId, ...extractArray(destSpec)]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: add pageUrl to deps
  useEffect(() => {
    const iframe = iframeRef.current!;
    const win = iframe.contentWindow;
    const unitInstantiationPromise = new Promise<HsUnitInstance>((resolve) => {
      (win as any).unitInterface = createUnitInterface(
        unitId,
        (unitInstance) => {
          // unmountUnit = unitAdapter.mountUnitInstance(unitInstance);
          // hostSystem.addUnitInstance(unitInstance);
          loadedCallback?.(unitInstance);
          resolve(unitInstance);
        },
      );
    });
    hostSystem.addPendingUnitInstancePromise(unitId, unitInstantiationPromise);
  }, [pageUrl]);
  return (
    <iframe
      ref={iframeRef}
      src={pageUrl}
      width="200"
      height="100"
      title={unitId}
    />
  );
};
