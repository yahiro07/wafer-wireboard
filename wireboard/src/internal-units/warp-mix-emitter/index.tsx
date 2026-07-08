import { useEffect } from "react";
import { createStore } from "snap-store";
import { ReactUnitTemplateFn } from "wafer-host/react";
import { Button } from "@/components/button";
import { UpperLabel } from "@/components/upper-label";
import {
  ChannelStripEffectParameters,
  channelStripEffectConfigs,
  createChannelStripEffectEngine,
} from "@/internal-units/warp-mix-emitter/channel-strip-effect";
import { FdKnob } from "@/internal-units/warp-mix-emitter/knob";
import { ParameterGauge } from "@/internal-units/warp-mix-emitter/parameter-gauge";

type ChannelStripState = ChannelStripEffectParameters & {};

function createChannelStripState(): ChannelStripState {
  return {
    mainVolume: 0.5,
    auxVolume: 0,
    faderVolume: channelStripEffectConfigs.faderPivot,
    pan: 0,
    eqLow: 0.5,
    eqMid: 0.5,
    eqHigh: 0.5,
    stereoSpread: 0,
    outputEnabled: true,
  };
}

type StoreState = {
  strips: Record<string, ChannelStripState>;
  soloStripId: string | null;
  localPlayingStripId: string | null;
};

const moduleStore = createStore<StoreState>({
  strips: {},
  soloStripId: null,
  localPlayingStripId: null,
});

let instanceIdCounter = 0;

export const createWarpMixEmitterUnit: ReactUnitTemplateFn = (
  unitInterface,
) => {
  const engine = createChannelStripEffectEngine(unitInterface);

  unitInterface.completeSetup({
    unitAspects: {
      unitType: "effect",
      outputs: ["audio"],
      inputs: ["audio"],
    },
    cleanup: engine.cleanup,
  });

  const initialState = createChannelStripState();
  engine.applyParameters(initialState);

  const stripId = `cs${instanceIdCounter++}`;
  moduleStore.patchStrips({ [stripId]: initialState });

  const actions = {
    setParameter<K extends keyof ChannelStripEffectParameters>(
      key: K,
      value: ChannelStripEffectParameters[K],
    ) {
      engine.applyParameters({ [key]: value });
      moduleStore.setStrips((prev) => ({
        ...prev,
        [stripId]: { ...prev[stripId], [key]: value },
      }));
    },
    toggleLocalPlaying() {
      if (moduleStore.state.localPlayingStripId === stripId) {
        moduleStore.setLocalPlayingStripId(null);
      } else {
        moduleStore.setLocalPlayingStripId(stripId);
      }
    },
    toggleOutputSolo() {
      if (moduleStore.state.soloStripId === stripId) {
        moduleStore.setSoloStripId(null);
      } else {
        moduleStore.setSoloStripId(stripId);
      }
    },
  };

  const internal = {
    setupSynchronization() {
      return () => {
        moduleStore.produceStrips((draft) => {
          delete draft[stripId];
        });
      };
    },
    useAffectLocalPlaybackStateToHost(localPlayingStripId: string | null) {
      useEffect(() => {
        if (localPlayingStripId === stripId) {
          unitInterface.sendMessageToHost({
            type: "partialPlaybackRequest",
            playing: true,
          });
          return () => {
            unitInterface.sendMessageToHost({
              type: "partialPlaybackRequest",
              playing: false,
            });
          };
        }
      }, [localPlayingStripId, stripId, unitInterface]);
    },
  };

  return {
    RenderUi() {
      const { strips, localPlayingStripId } = moduleStore.useSnapshot();
      const st = strips[stripId];
      useEffect(internal.setupSynchronization, []);
      internal.useAffectLocalPlaybackStateToHost(localPlayingStripId);
      const localPlaying = localPlayingStripId === stripId;

      const panelMainContent = (
        <div className="flex-v h-full">
          <div className="grow flex-c text-[#444]">
            <div className="flex-v gap-3">
              <div>warp mix emitter</div>
              <div className="flex-v gap-6">
                <div className="flex-ha gap-4">
                  <Button
                    asr={1.2}
                    text="on"
                    active={st.outputEnabled}
                    onClick={() =>
                      actions.setParameter("outputEnabled", !st.outputEnabled)
                    }
                  />
                  <UpperLabel label="aux">
                    <FdKnob
                      value={st.auxVolume}
                      onChange={(v) => actions.setParameter("auxVolume", v)}
                    />
                  </UpperLabel>
                  <UpperLabel label="stereo">
                    <FdKnob
                      value={st.stereoSpread}
                      onChange={(v) => actions.setParameter("stereoSpread", v)}
                    />
                  </UpperLabel>
                  <UpperLabel label="pan">
                    <FdKnob
                      value={st.pan}
                      min={-1}
                      max={1}
                      onChange={(v) => actions.setParameter("pan", v)}
                    />
                  </UpperLabel>
                  <UpperLabel label="main">
                    <FdKnob
                      value={st.mainVolume}
                      onChange={(v) => actions.setParameter("mainVolume", v)}
                    />
                  </UpperLabel>
                </div>
                <div className="flex-ha justify-between">
                  <Button
                    asr={1.2}
                    text="play"
                    active={localPlaying}
                    onClick={actions.toggleLocalPlaying}
                  />
                  <div className="flex-ha gap-4">
                    <UpperLabel label="low">
                      <FdKnob
                        value={st.eqLow}
                        onChange={(v) => actions.setParameter("eqLow", v)}
                      />
                    </UpperLabel>
                    <UpperLabel label="mid">
                      <FdKnob
                        value={st.eqMid}
                        onChange={(v) => actions.setParameter("eqMid", v)}
                      />
                    </UpperLabel>
                    <UpperLabel label="high">
                      <FdKnob
                        value={st.eqHigh}
                        onChange={(v) => actions.setParameter("eqHigh", v)}
                      />
                    </UpperLabel>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
      const extraFaderPart = (
        <div className="absolute top-0 right-[-92px] z-100">
          <ParameterGauge
            value={st.faderVolume}
            onChange={(v) => actions.setParameter("faderVolume", v)}
          />
        </div>
      );
      return (
        <div className="relative w-[300px] h-[160px] bg-indigo-200 p-1">
          {panelMainContent}
          {extraFaderPart}
        </div>
      );
    },
  };
};
