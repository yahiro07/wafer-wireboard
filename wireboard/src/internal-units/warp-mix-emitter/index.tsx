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
import { hmrActions } from "@/periphery/hmr-handler";

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
  localPlaybackFlags: Record<string, boolean>;
  localPlaybackBackupFlags: Record<string, boolean> | null;
  // isLocalPlaybackMultiple: boolean;
  soloStripId: string | null;
  firstOperatedStripId: string | null;
};

const moduleStore = createStore<StoreState>({
  strips: {},
  localPlaybackFlags: {},
  localPlaybackBackupFlags: null,
  // isLocalPlaybackMultiple: true,
  soloStripId: null,
  firstOperatedStripId: null,
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
    patchStripState(attrs: Partial<ChannelStripState>) {
      moduleStore.setStrips((prev) => ({
        ...prev,
        [stripId]: { ...prev[stripId], ...attrs },
      }));
    },
    patchLocalPlaybackFlags(active: boolean) {
      moduleStore.setLocalPlaybackFlags((prev) => ({
        ...prev,
        [stripId]: active,
      }));
    },
    setParameter<K extends keyof ChannelStripEffectParameters>(
      key: K,
      value: ChannelStripEffectParameters[K],
    ) {
      engine.applyParameters({ [key]: value });
      actions.patchStripState({ [key]: value });
    },
    // stopLocalPlaybacksAll() {
    //   const flags = moduleStore.state.localPlaybackFlags;
    //   moduleStore.assign({
    //     localPlaybackBackupFlags: flags,
    //     localPlaybackFlags: {},
    //   });
    // },
    // restartLocalPlaybacksAll() {
    //   const flags = moduleStore.state.localPlaybackBackupFlags;
    //   if (flags) {
    //     moduleStore.assign({
    //       localPlaybackFlags: flags,
    //       localPlaybackBackupFlags: null,
    //     });
    //   }
    // },
    // toggleMultipleMode() {
    //   const numPlayings = Object.values(
    //     moduleStore.state.localPlaybackFlags,
    //   ).filter(Boolean).length;
    //   if (numPlayings >= 2) {
    //     // moduleStore.setLocalPlaybackFlags({ [stripId]: true });
    //     moduleStore.assign({ localPlaybackFlags: {} });
    //   } else {
    //     moduleStore.toggleIsLocalPlaybackMultiple();
    //   }
    // },
    handlePlayButton() {
      const st = moduleStore.state;
      const currentPlayingAny =
        Object.values(st.localPlaybackFlags).filter(Boolean).length > 0;
      // if (!currentPlayingAny && st.localPlaybackBackupFlags) {
      //   moduleStore.setLocalPlaybackBackupFlags(null);
      //   moduleStore.assign({
      //     localPlaybackBackupFlags: null,
      //     // isLocalPlaybackMultiple: false,
      //   });
      // }
      // if (!currentPlayingAny) {
      //   moduleStore.setFirstOperatedStripId(stripId);
      // }
      if (
        currentPlayingAny &&
        st.soloStripId !== null &&
        st.soloStripId !== stripId
      ) {
        moduleStore.assign({
          soloStripId: null,
        });
      }
      const nextLocalPlaying = !st.localPlaybackFlags[stripId];

      // if (nextLocalPlaying && !st.isLocalPlaybackMultiple) {
      //   moduleStore.setLocalPlaybackFlags({ [stripId]: true });
      // } else {
      //   actions.patchLocalPlaybackFlags(nextLocalPlaying);
      // }
      actions.patchLocalPlaybackFlags(nextLocalPlaying);
    },
    handleSoloButton() {
      const isSoloTarget = moduleStore.state.soloStripId === stripId;
      const anySoloTarget = moduleStore.state.soloStripId !== null;
      const numPlayings = Object.values(
        moduleStore.state.localPlaybackFlags,
      ).filter(Boolean).length;
      const anyPlaying = numPlayings > 0;
      if (anyPlaying && !anySoloTarget && numPlayings > 1) {
        moduleStore.assign({
          localPlaybackBackupFlags: moduleStore.state.localPlaybackFlags,
        });
      }

      if (!isSoloTarget) {
        moduleStore.assign({
          localPlaybackFlags: { [stripId]: true },
          soloStripId: stripId,
        });
        // moduleStore.setLocalPlaybackFlags({ [stripId]: true });
        // moduleStore.setSoloStripId(stripId);
      } else {
        moduleStore.assign({
          localPlaybackFlags: moduleStore.state.localPlaybackBackupFlags ?? {},
          // localPlaybackBackupFlags: null,
          soloStripId: null,
        });
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
    useAffectLocalPlaybackStateToHost(localPlaying: boolean) {
      useEffect(() => {
        if (localPlaying) {
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
      }, [localPlaying, unitInterface]);
    },
  };

  return {
    RenderUi() {
      const {
        strips,
        localPlaybackFlags,
        localPlaybackBackupFlags,
        soloStripId,
        // isLocalPlaybackMultiple,
        firstOperatedStripId,
      } = moduleStore.useSnapshot();
      const st = strips[stripId];
      useEffect(internal.setupSynchronization, []);
      const localPlaying = localPlaybackFlags[stripId];
      internal.useAffectLocalPlaybackStateToHost(localPlaying);
      const numPlayings =
        Object.values(localPlaybackFlags).filter(Boolean).length;
      const isPlayingOne = numPlayings === 1;
      const isPlayingMoreThanOne = numPlayings > 1;
      const isPlayingAny = numPlayings > 0;
      const isFirstOperated = firstOperatedStripId === stripId;
      const isSoloTarget = soloStripId === stripId;

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
                  <div className="flex-ha gap-3">
                    <Button
                      asr={1.2}
                      text="play"
                      active={localPlaying}
                      onClick={actions.handlePlayButton}
                    />
                    {/* {false && (
                      <>
                        {isPlayingMoreThanOne && isFirstOperated && (
                          <div onClick={actions.stopLocalPlaybacksAll}>
                            <Icons.Pause />
                          </div>
                        )}
                        {localPlaybackBackupFlags && isFirstOperated && (
                          <div onClick={actions.restartLocalPlaybacksAll}>
                            <Icons.Restart />
                          </div>
                        )}
                      </>
                    )}
                    {false && isPlayingOne && localPlaying && (
                      <div
                        onClick={actions.toggleMultipleMode}
                        style={{
                          opacity: isLocalPlaybackMultiple === false ? 1 : 0.35,
                        }}
                      >
                        s
                      </div>
                    )}
                    {false && isPlayingAny && isFirstOperated && (
                      <div
                        onClick={actions.toggleMultipleMode}
                        style={{
                          opacity: isLocalPlaybackMultiple ? 1 : 0.35,
                        }}
                      >
                        <Icons.ServerStack size={13} />
                      </div>
                    )}
                    {false && isPlayingAny && isFirstOperated && (
                      <div
                        onClick={actions.toggleMultipleMode}
                        // style={{
                        //   opacity: isLocalPlaybackMultiple ? 1 : 0.35,
                        // }}
                      >
                        {isLocalPlaybackMultiple ? (
                          <Icons.ServerStack size={13} />
                        ) : (
                          <div>s</div>
                        )}
                      </div>
                    )} */}
                    {true && (isPlayingAny || isSoloTarget) && localPlaying && (
                      <div
                        onClick={actions.handleSoloButton}
                        style={{
                          opacity: isSoloTarget ? 1 : 0.35,
                        }}
                      >
                        s
                      </div>
                    )}
                  </div>
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
        <div className="absolute top-0 right-[-80px] z-100">
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

import.meta.hot?.on("vite:afterUpdate", () => {
  hmrActions.handleUnitSourceUpdate("warpMixEmitter");
});
