import { CSSProperties, useEffect, useMemo, useRef } from "react";
import { createUnitFrameModel } from "@/host-system/react/unit-frame-model";
import { HostSystem } from "../host";

type Props = {
  unitId: string;
  pageUrl?: string;
  destUnitId?: string;
  hostBpm?: number;
  hostPlaying?: boolean;
  inputNotes?: number[];
  hostSystem: HostSystem;
  className?: string;
  style?: CSSProperties;
  // frameSize?: FrameSizeInput;
  // iframeAttrs?: Omit<JSX.IntrinsicElements["iframe"], "src" | "title" | "ref">;
  // onIframeMounted?(iframe: HTMLIFrameElement): void;
};

export const UnitFrame = ({
  unitId,
  pageUrl,
  destUnitId,
  hostBpm,
  hostPlaying,
  inputNotes,
  hostSystem,
  className,
  style,
}: Props) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  // biome-ignore lint/correctness/useExhaustiveDependencies: for initialization
  const model = useMemo(() => createUnitFrameModel(hostSystem, unitId), []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: for initialization
  useEffect(() => {
    const iframe = iframeRef.current!;
    return model.handleIframeMounted(iframe);
  }, []);

  model.feedAttributes({ destUnitId, hostBpm, hostPlaying, inputNotes });

  return (
    <iframe
      className={className}
      style={style}
      ref={iframeRef}
      src={pageUrl}
      title="unit"
    />
  );
};
