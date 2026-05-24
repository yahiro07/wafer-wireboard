import { CSSProperties, useEffect, useRef } from "react";
import { arrayExclude } from "@/utils/array-utils";
import { usePrevious } from "@/utils/helper-hooks";
import { HostInterface } from "../contract";
import {
  HostSystem,
  hostSystem_createHostInterfaceForUnit,
  hostSystem_wrapAddUnitAgent,
  hostSystem_wrapConnectUnits,
  UnitAgentInHostSide,
} from "../host";

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
  const unitAgentRef = useRef<UnitAgentInHostSide | undefined>(undefined);

  // biome-ignore lint/correctness/useExhaustiveDependencies: for initialization
  useEffect(() => {
    const win = iframeRef.current?.contentWindow as {
      hostInterface?: HostInterface;
    };
    if (win) {
      win.hostInterface = hostSystem_createHostInterfaceForUnit(
        hostSystem,
        unitId,
        (unitAgent) => {
          unitAgentRef.current = unitAgent;
          hostSystem_wrapAddUnitAgent(hostSystem, unitAgent);
          console.log(`unitAgent loaded for ${unitId}`);
          if (destUnitId) {
            hostSystem_wrapConnectUnits(hostSystem, unitId, destUnitId);
          }
          if (hostBpm !== undefined) {
            unitAgent.setBpm?.(hostBpm);
          }
          if (hostPlaying !== undefined) {
            unitAgent.setPlayState?.(hostPlaying);
          }
        },
      );
    }
  }, []);
  useEffect(() => {
    if (hostBpm !== undefined) {
      unitAgentRef.current?.setBpm?.(hostBpm);
    }
  }, [hostBpm]);
  useEffect(() => {
    if (hostPlaying !== undefined) {
      unitAgentRef.current?.setPlayState?.(hostPlaying);
    }
  }, [hostPlaying]);

  const currentNotes = usePrevious(inputNotes);
  useEffect(() => {
    const agent = unitAgentRef.current;
    if (!(agent && inputNotes && currentNotes)) return;
    const notesAdded = arrayExclude(inputNotes, currentNotes);
    const notesRemoved = arrayExclude(currentNotes, inputNotes);
    for (const note of notesAdded) {
      agent.noteInput?.noteOn?.(note, 1.0);
    }
    for (const note of notesRemoved) {
      agent.noteInput?.noteOff?.(note);
    }
  }, [inputNotes, currentNotes]);

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
