function toAbsolutePath(path: string): string {
  return new URL(path, import.meta.url).pathname;
}

function getUnitSourceUrls() {
  if (1) {
    const unitsDevDistDir = toAbsolutePath(
      "../../../webaudio-unit-system/unit-examples/dist",
    );
    const waferUnitsLocalDistDir = toAbsolutePath("../../../wafer-units/dist");
    const waferCustomUnitsLocalDir = toAbsolutePath(
      "../../../wafer-custom-units",
    );
    return [
      `file://${waferUnitsLocalDistDir}/graphite-drum-machine/`,
      `file://${waferCustomUnitsLocalDir}/js/shiny-drum-machine/`,

      `file://${waferCustomUnitsLocalDir}/js/webaudio-tinysynth-mini/`,
      `file://${waferCustomUnitsLocalDir}/ts/dist/super-oscillator/`,
      `file://${waferUnitsLocalDistDir}/wavicle/`,

      `file://${waferCustomUnitsLocalDir}/js/midi-synth/`,
      `file://${waferCustomUnitsLocalDir}/js/webaudio-synth-v2/`,
      `file://${waferCustomUnitsLocalDir}/js/wasyn-1/`,
      `file://${waferCustomUnitsLocalDir}/ts/dist/syntho/`,
      `file://${waferCustomUnitsLocalDir}/js/simple-synth/`,
      `file://${waferCustomUnitsLocalDir}/ts/dist/model-1/`,
      `file://${waferCustomUnitsLocalDir}/ts/dist/react-synth/`,
      `file://${waferCustomUnitsLocalDir}/ts/dist/poly-synth/`,
      `file://${waferCustomUnitsLocalDir}/ts/dist/sk-synth/`,
      `file://${waferCustomUnitsLocalDir}/js/additive/`,
      `file://${waferCustomUnitsLocalDir}/ts/dist/cadence/`,
      `file://${waferCustomUnitsLocalDir}/js/bl-synth-modular/`,

      `file://${waferCustomUnitsLocalDir}/ts/dist/beatmaker/`,
      `file://${waferUnitsLocalDistDir}/techno-beat-machine/`,

      `file://${waferCustomUnitsLocalDir}/js/web-audio-mixer/`,
      `file://${waferCustomUnitsLocalDir}/ts/dist/vue-audio-mixer/`,

      `file://${waferCustomUnitsLocalDir}/ts/dist/hm-step-sequencer/`,
      `file://${waferCustomUnitsLocalDir}/js/d3-synth-scale/`,

      `file://${waferCustomUnitsLocalDir}/js/webaudio-spectrum/`,
      `file://${waferCustomUnitsLocalDir}/js/audio-input-effects/`,
      `file://${waferCustomUnitsLocalDir}/js/darkwave/`,

      `file://${waferCustomUnitsLocalDir}/js/circular-audio-wave/`,
      `file://${waferCustomUnitsLocalDir}/js/vissonance/`,
      `file://${waferCustomUnitsLocalDir}/ts/dist/threejs-audio-reactive-visual/`,

      `file://${waferUnitsLocalDistDir}/bseq1/`,
      `file://${waferUnitsLocalDistDir}/bseq2/`,
      `file://${waferUnitsLocalDistDir}/lseq1/`,
      `file://${waferUnitsLocalDistDir}/tonerio-sequencer/`,
      `file://${waferUnitsLocalDistDir}/fluorite-piano-roll/`,
      `file://${waferUnitsLocalDistDir}/partex/`,
      `file://${waferUnitsLocalDistDir}/root-prog/`,
      `file://${waferUnitsLocalDistDir}/rtfr/`,
      `file://${waferUnitsLocalDistDir}/rtfs1/`,
      `file://${waferUnitsLocalDistDir}/rtfs2/`,
      `file://${waferUnitsLocalDistDir}/rtfs-p/`,
      `file://${waferUnitsLocalDistDir}/recoru/`,
      `file://${waferUnitsLocalDistDir}/drum-loop-player/`,
      `file://${waferUnitsLocalDistDir}/timing-checker/`,

      // `file://${wusUnitsLocalDistDir}/perseq/`,
      // `file://${wusUnitsLocalDistDir}/chord-caster/`,
      // `file://${wusUnitsLocalDistDir}/piano-roll/`,

      `file://${waferUnitsLocalDistDir}/multi-lfo/`,
      `file://${waferUnitsLocalDistDir}/step-automator/`,

      `file://${waferUnitsLocalDistDir}/sunset-delay/`,
      `file://${waferUnitsLocalDistDir}/sunset-chorus-mini/`,
      `file://${waferUnitsLocalDistDir}/crusher/`,
      `file://${waferUnitsLocalDistDir}/channel-strip/`,
      `file://${waferUnitsLocalDistDir}/noise-mix/`,
      `file://${waferUnitsLocalDistDir}/lofi2/`,

      `file://${waferUnitsLocalDistDir}/bs03/`,
      `file://${waferUnitsLocalDistDir}/s7/`,
      `file://${waferUnitsLocalDistDir}/mop2/`,
      `file://${waferUnitsLocalDistDir}/mpd1/`,

      `file://${unitsDevDistDir}/mu4-keyboard/`,
      `file://${waferUnitsLocalDistDir}/tone-wheel/`,

      `file://${waferUnitsLocalDistDir}/proto-engine-ptm-osc/`,
      `file://${waferUnitsLocalDistDir}/proto-engine-pd-fm/`,
      `file://${waferUnitsLocalDistDir}/mini-synth/`,
      `file://${waferUnitsLocalDistDir}/mini-synth-ge/`,
      `file://${waferUnitsLocalDistDir}/mini-synth-gp/`,
    ];
  } else {
    return [
      "https://cdn.jsdelivr.net/gh/yahiro07/wus-units@r14/wavicle/",
      "https://cdn.jsdelivr.net/gh/yahiro07/wus-units@r14/mini-synth/",
      "https://cdn.jsdelivr.net/gh/yahiro07/wus-units@r14/bseq1/",
      "https://cdn.jsdelivr.net/gh/yahiro07/wus-units@r14/lseq1/",
      //
      "https://cdn.jsdelivr.net/gh/yahiro07/wus-units@r14/specbar/",
      "https://cdn.jsdelivr.net/gh/yahiro07/wus-units@r14/proto-engine-ptm-osc/",
      "https://cdn.jsdelivr.net/gh/yahiro07/wus-units@r14/proto-engine-pd-fm/",
      "https://cdn.jsdelivr.net/gh/yahiro07/wus-units@r14/mini-synth-ge/",
      "https://cdn.jsdelivr.net/gh/yahiro07/wus-units@r14/mini-synth-gp/",

      //
      "https://cdn.jsdelivr.net/gh/yahiro07/wus-custom-units@r14/additive/",
      "https://cdn.jsdelivr.net/gh/yahiro07/wus-custom-units@r14/wasyn-1/",
      "https://cdn.jsdelivr.net/gh/yahiro07/wus-custom-units@r14/webaudio-tinysynth-simple/",
      "https://cdn.jsdelivr.net/gh/yahiro07/wus-custom-units@r14/webaudio-synth-v2/",
    ];
  }
}

export const unitSourceUrls = getUnitSourceUrls();
