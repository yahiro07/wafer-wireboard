import { useEffect, useMemo, useRef } from "react";
import {
  FrameSizeInput,
  mergeStyleWithFrameSize,
} from "@/host-system/react/frame-size";
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
  style?: React.CSSProperties;
  frameSize?: FrameSizeInput;
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
  frameSize,
}: Props) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const model = useMemo(
    () => createUnitFrameModel(hostSystem, unitId),
    [hostSystem, unitId],
  );
  useEffect(() => {
    const iframe = iframeRef.current!;
    return model.handleIframeMounted(iframe);
  }, [model]);
  model.feedAttributes({ destUnitId, hostBpm, hostPlaying, inputNotes });

  const mergedStyle = useMemo(
    () => mergeStyleWithFrameSize(style, frameSize),
    [style, frameSize],
  );

  return (
    <iframe
      className={className}
      style={mergedStyle}
      ref={iframeRef}
      src={pageUrl}
      title="unit"
    />
  );
};
