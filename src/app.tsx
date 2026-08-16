import { mapKnobGainDb } from "@/auxiliaries/volume-curve";
import { useEffect, useMemo } from "react";
import {
  HostAppProvider,
  useSequencerTickDriverRunner,
} from "wafer-host/react";
import {
  hostSystem,
  partialSequencerTickDriver,
  sequencerTickDriver,
} from "@/model/host-system-instance";
import { store } from "@/model/store";
import { setupDynamicClockingSupport } from "@/periphery/dynamic-clocking-support";
import { setupHmrHandler } from "@/periphery/hmr-handler";
import { useMidiInputHandling } from "@/periphery/midi-input-handling";
import { createPartialPlaybackSupport } from "@/periphery/partial-playback-support";
import { useSetupSongKeySupport } from "@/periphery/song-key-support";
import { projectsModel } from "@/project/projects-model";
import { PageRoot } from "@/views/page-root";
import { appEnvs, appEnvsInit } from "@/common/app-envs";
import { productionFix } from "@/periphery/production-fix-wrapper";

import * as mobileDragDrop from "mobile-drag-drop";
import { scrollBehaviourDragImageTranslateOverride } from "mobile-drag-drop/scroll-behaviour";
import { mountAppRoot } from "@/auxiliaries/mount-app-root";

mobileDragDrop.polyfill({
  dragImageTranslateOverride: scrollBehaviourDragImageTranslateOverride,
});

const partialPlaybackSupport = createPartialPlaybackSupport();

const GlobalHooks = () => {
  useMidiInputHandling();
  useEffect(projectsModel.setupLifecycle, []);
  useEffect(setupDynamicClockingSupport, []);
  partialPlaybackSupport.useSetup();
  useSetupSongKeySupport();
  return null;
};

const App = () => {
  const { bpm, playing, masterVolume } = store.useSnapshot();
  const masterGain = useMemo(
    () => mapKnobGainDb(masterVolume, 0.5),
    [masterVolume],
  );
  useSequencerTickDriverRunner({ sequencerTickDriver, playing, bpm });
  useEffect(() => {
    partialSequencerTickDriver.setBpm(bpm);
  }, [bpm]);
  return (
    <HostAppProvider
      hostSystem={hostSystem}
      playing={playing}
      bpm={bpm}
      masterGain={masterGain}
      manualClocking
    >
      <GlobalHooks />
      <PageRoot />
    </HostAppProvider>
  );
};

function start() {
  appEnvsInit();

  if (appEnvs.isProduction && productionFix?.isFullyDisabled) {
    alert("this version is disabled dut to a potential crash risk.");
    return;
  }
  projectsModel.prepareProject(true);

  mountAppRoot(<App />);
  if (1) {
    setupHmrHandler();
  }
}

start();
