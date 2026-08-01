const homeDir = process.env.HOME;

function toAbsolutePath(path: string): string {
  return new URL(path, import.meta.url).pathname;
}

function getUnitSourceUrls() {
  if (1) {
    const unitsDevDistDir = toAbsolutePath(
      "../../../webaudio-unit-system/unit-examples/dist",
    );
    const wusUnitsLocalDistDir = toAbsolutePath("../../../wus-units/dist");
    const wusCustomUnitsLocalDir = toAbsolutePath("../../../wus-custom-units");
    return [
      `file://${wusUnitsLocalDistDir}/graphite-drum-machine/`,
      `file://${wusCustomUnitsLocalDir}/js/shiny-drum-machine/`,

      `file://${wusCustomUnitsLocalDir}/js/webaudio-tinysynth-mini/`,
      `file://${wusCustomUnitsLocalDir}/ts/dist/super-oscillator/`,
      `file://${wusUnitsLocalDistDir}/wavicle/`,

      `file://${wusCustomUnitsLocalDir}/js/midi-synth/`,
      `file://${wusCustomUnitsLocalDir}/js/webaudio-synth-v2/`,
      `file://${wusCustomUnitsLocalDir}/js/wasyn-1/`,
      `file://${wusCustomUnitsLocalDir}/ts/dist/syntho/`,
      `file://${wusCustomUnitsLocalDir}/js/simple-synth/`,
      `file://${wusCustomUnitsLocalDir}/ts/dist/model-1/`,
      `file://${wusCustomUnitsLocalDir}/ts/dist/react-synth/`,
      `file://${wusCustomUnitsLocalDir}/ts/dist/poly-synth/`,
      `file://${wusCustomUnitsLocalDir}/ts/dist/sk-synth/`,
      `file://${wusCustomUnitsLocalDir}/js/additive/`,
      `file://${wusCustomUnitsLocalDir}/ts/dist/cadence/`,
      `file://${wusCustomUnitsLocalDir}/js/bl-synth-modular/`,

      `file://${wusCustomUnitsLocalDir}/ts/dist/beatmaker/`,
      `file://${wusUnitsLocalDistDir}/techno-beat-machine/`,

      `file://${wusCustomUnitsLocalDir}/js/web-audio-mixer/`,
      `file://${wusCustomUnitsLocalDir}/ts/dist/vue-audio-mixer/`,

      `file://${wusCustomUnitsLocalDir}/ts/dist/hm-step-sequencer/`,
      `file://${wusCustomUnitsLocalDir}/js/d3-synth-scale/`,

      `file://${wusCustomUnitsLocalDir}/js/webaudio-spectrum/`,
      `file://${wusCustomUnitsLocalDir}/js/audio-input-effects/`,
      `file://${wusCustomUnitsLocalDir}/js/darkwave/`,

      `file://${wusCustomUnitsLocalDir}/js/circular-audio-wave/`,
      `file://${wusCustomUnitsLocalDir}/js/vissonance/`,
      `file://${wusCustomUnitsLocalDir}/ts/dist/threejs-audio-reactive-visual/`,

      `file://${wusUnitsLocalDistDir}/bseq1/`,
      `file://${wusUnitsLocalDistDir}/bseq2/`,
      `file://${wusUnitsLocalDistDir}/lseq1/`,
      `file://${wusUnitsLocalDistDir}/tonerio-sequencer/`,
      `file://${wusUnitsLocalDistDir}/fluorite-piano-roll/`,
      `file://${wusUnitsLocalDistDir}/partex/`,
      `file://${wusUnitsLocalDistDir}/root-prog/`,
      `file://${wusUnitsLocalDistDir}/rtfr/`,
      `file://${wusUnitsLocalDistDir}/rtfs1/`,
      `file://${wusUnitsLocalDistDir}/rtfs2/`,
      `file://${wusUnitsLocalDistDir}/rtfs-p/`,
      // `file://${wusUnitsLocalDistDir}/perseq/`,
      `file://${wusUnitsLocalDistDir}/recoru/`,
      `file://${wusUnitsLocalDistDir}/drum-loop-player/`,
      `file://${wusUnitsLocalDistDir}/timing-checker/`,

      `file://${wusUnitsLocalDistDir}/multi-lfo/`,
      `file://${wusUnitsLocalDistDir}/step-automator/`,

      `file://${wusUnitsLocalDistDir}/sunset-delay/`,
      `file://${wusUnitsLocalDistDir}/sunset-chorus-mini/`,
      `file://${wusUnitsLocalDistDir}/crusher/`,
      `file://${wusUnitsLocalDistDir}/channel-strip/`,
      `file://${wusUnitsLocalDistDir}/noise-mix/`,
      `file://${wusUnitsLocalDistDir}/lofi2/`,

      `file://${wusUnitsLocalDistDir}/bs03/`,
      `file://${wusUnitsLocalDistDir}/s7/`,
      `file://${wusUnitsLocalDistDir}/mop2/`,
      `file://${wusUnitsLocalDistDir}/mpd1/`,

      `file://${unitsDevDistDir}/mu4-keyboard/`,
      `file://${homeDir}/wus-units/twsq1/`,

      `file://${wusUnitsLocalDistDir}/proto-engine-ptm-osc/`,
      `file://${wusUnitsLocalDistDir}/proto-engine-pd-fm/`,
      `file://${wusUnitsLocalDistDir}/mini-synth/`,
      `file://${wusUnitsLocalDistDir}/mini-synth-ge/`,
      `file://${wusUnitsLocalDistDir}/mini-synth-gp/`,
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
