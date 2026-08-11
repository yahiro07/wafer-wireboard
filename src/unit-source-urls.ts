function toAbsolutePath(path: string): string {
  return new URL(path, import.meta.url).pathname;
}

function getUnitSourceUrls() {
  if (0) {
    //release
    const waferUnitsBase = `https://cdn.jsdelivr.net/gh/yahiro07/wafer-units@r17`;
    const waferCustomUnitsBase = `https://cdn.jsdelivr.net/gh/yahiro07/wafer-custom-units@r17`;

    return [
      `${waferUnitsBase}/graphite-drum-machine/`,
      `${waferCustomUnitsBase}/webaudio-tinysynth-mini/`,
      `${waferCustomUnitsBase}/super-oscillator/`,
      `${waferUnitsBase}/mini-synth-2/`,
      `${waferUnitsBase}/proto-engine-pd-fm/`,

      `${waferUnitsBase}/techno-beat-machine/`,
      `${waferCustomUnitsBase}/shiny-drum-machine/`,

      `${waferUnitsBase}/bseq2/`,
      `${waferUnitsBase}/tonerio-sequencer/`,
      `${waferUnitsBase}/fluorite-piano-roll/`,
      `${waferUnitsBase}/partex/`,
      `${waferUnitsBase}/root-prog/`,

      `${waferCustomUnitsBase}/webaudio-spectrum/`,
      `${waferCustomUnitsBase}/web-audio-mixer/`,
      `${waferCustomUnitsBase}/vue-audio-mixer/`,

      `${waferCustomUnitsBase}/beatmaker/`,
      `${waferUnitsBase}/sunset-delay/`,
      `${waferUnitsBase}/sunset-chorus-mini/`,
      `${waferUnitsBase}/lofi2/`,
      `${waferCustomUnitsBase}/darkwave/`,
      `${waferCustomUnitsBase}/d3-synth-scale/`,

      `${waferCustomUnitsBase}/syntho/`,
      `${waferCustomUnitsBase}/additive/`,
      `${waferCustomUnitsBase}/bl-synth-modular/`,
      `${waferCustomUnitsBase}/cadence/`,

      `${waferCustomUnitsBase}/react-synth/`,
      `${waferCustomUnitsBase}/poly-synth/`,
      `${waferCustomUnitsBase}/model-1/`,
      `${waferUnitsBase}/wavicle/`,

      `${waferCustomUnitsBase}/webaudio-synth-v2/`,
      `${waferCustomUnitsBase}/midi-synth/`,
      `${waferCustomUnitsBase}/wasyn-1/`,
      `${waferCustomUnitsBase}/simple-synth/`,
      `${waferCustomUnitsBase}/sk-synth/`,

      `${waferUnitsBase}/drum-loop-player/`,
      `${waferUnitsBase}/lseq1/`,
      `${waferUnitsBase}/rtfs-p/`,
      `${waferUnitsBase}/timing-checker/`,
      `${waferUnitsBase}/step-automator/`,
      `${waferUnitsBase}/multi-lfo/`,
      `${waferUnitsBase}/tone-wheel/`,

      `${waferCustomUnitsBase}/circular-audio-wave/`,
      `${waferCustomUnitsBase}/vissonance/`,
      `${waferCustomUnitsBase}/threejs-audio-reactive-visual/`,

      // `${waferUnitsBase}/bseq1/`,

      // `${waferCustomUnitsBase}/hm-step-sequencer/`,
      // `${waferCustomUnitsBase}/audio-input-effects/`,

      // `${waferUnitsBase}/rtfr/`,
      // `${waferUnitsBase}/rtfs1/`,
      // `${waferUnitsBase}/rtfs2/`,
      // `${waferUnitsBase}/recoru/`,

      // `${waferUnitsBase}/crusher/`,
      // `${waferUnitsBase}/channel-strip/`,
      // `${waferUnitsBase}/noise-mix/`,

      // `${waferUnitsBase}/bs03/`,
      // `${waferUnitsBase}/s7/`,
      // `${waferUnitsBase}/mop2/`,
      // `${waferUnitsBase}/mpd1/`,

      // `${waferUnitsBase}/proto-engine-ptm-osc/`,
      // `${waferUnitsBase}/mini-synth/`,
      // `${waferUnitsBase}/mini-synth-ge/`,
      // `${waferUnitsBase}/mini-synth-gp/`,
    ];
  } else {
    //local debug
    // const unitsDevDistDir = toAbsolutePath(
    //   "../../webaudio-unit-system/unit-examples/dist",
    // );
    const waferUnitsLocalDistDir = toAbsolutePath("../../wafer-units/dist");
    const waferCustomUnitsLocalDir = toAbsolutePath("../../wafer-custom-units");
    return [
      `file://${waferUnitsLocalDistDir}/graphite-drum-machine/`,
      `file://${waferCustomUnitsLocalDir}/js/webaudio-tinysynth-mini/`,
      `file://${waferCustomUnitsLocalDir}/ts/dist/super-oscillator/`,
      `file://${waferUnitsLocalDistDir}/mini-synth-2/`,
      `file://${waferUnitsLocalDistDir}/orion/`,

      `file://${waferUnitsLocalDistDir}/techno-beat-machine/`,
      `file://${waferCustomUnitsLocalDir}/js/shiny-drum-machine/`,

      `file://${waferUnitsLocalDistDir}/bseq2/`,
      `file://${waferUnitsLocalDistDir}/tonerio-sequencer/`,
      `file://${waferUnitsLocalDistDir}/fluorite-piano-roll/`,
      `file://${waferUnitsLocalDistDir}/partex/`,
      `file://${waferUnitsLocalDistDir}/root-prog/`,
      `file://${waferUnitsLocalDistDir}/drum-fill-machine/`,

      `file://${waferCustomUnitsLocalDir}/js/webaudio-spectrum/`,
      `file://${waferCustomUnitsLocalDir}/js/web-audio-mixer/`,
      `file://${waferCustomUnitsLocalDir}/ts/dist/vue-audio-mixer/`,

      `file://${waferCustomUnitsLocalDir}/ts/dist/beatmaker/`,
      `file://${waferUnitsLocalDistDir}/sunset-delay/`,
      `file://${waferUnitsLocalDistDir}/sunset-chorus-mini/`,
      `file://${waferUnitsLocalDistDir}/lofi2/`,
      `file://${waferCustomUnitsLocalDir}/js/darkwave/`,
      `file://${waferCustomUnitsLocalDir}/js/d3-synth-scale/`,

      `file://${waferCustomUnitsLocalDir}/ts/dist/syntho/`,
      `file://${waferCustomUnitsLocalDir}/js/additive/`,
      `file://${waferCustomUnitsLocalDir}/js/bl-synth-modular/`,
      `file://${waferCustomUnitsLocalDir}/ts/dist/cadence/`,

      `file://${waferCustomUnitsLocalDir}/ts/dist/react-synth/`,
      `file://${waferCustomUnitsLocalDir}/ts/dist/poly-synth/`,
      `file://${waferCustomUnitsLocalDir}/ts/dist/model-1/`,
      `file://${waferUnitsLocalDistDir}/wavicle/`,

      `file://${waferCustomUnitsLocalDir}/js/webaudio-synth-v2/`,
      `file://${waferCustomUnitsLocalDir}/js/midi-synth/`,
      `file://${waferCustomUnitsLocalDir}/js/wasyn-1/`,
      `file://${waferCustomUnitsLocalDir}/js/simple-synth/`,
      `file://${waferCustomUnitsLocalDir}/ts/dist/sk-synth/`,

      `file://${waferUnitsLocalDistDir}/drum-loop-player/`,
      `file://${waferUnitsLocalDistDir}/lseq1/`,
      `file://${waferUnitsLocalDistDir}/rtfs-p/`,
      `file://${waferUnitsLocalDistDir}/timing-checker/`,
      `file://${waferUnitsLocalDistDir}/parameters-checker/`,
      `file://${waferUnitsLocalDistDir}/step-automator/`,
      `file://${waferUnitsLocalDistDir}/multi-lfo/`,
      `file://${waferUnitsLocalDistDir}/tone-wheel/`,

      `file://${waferCustomUnitsLocalDir}/js/circular-audio-wave/`,
      `file://${waferCustomUnitsLocalDir}/js/vissonance/`,
      `file://${waferCustomUnitsLocalDir}/ts/dist/threejs-audio-reactive-visual/`,

      //
      //

      `file://${waferCustomUnitsLocalDir}/ts/dist/hm-step-sequencer/`,
      `file://${waferCustomUnitsLocalDir}/js/audio-input-effects/`,

      `file://${waferUnitsLocalDistDir}/bseq1/`,
      `file://${waferUnitsLocalDistDir}/rtfr/`,
      `file://${waferUnitsLocalDistDir}/rtfs1/`,
      `file://${waferUnitsLocalDistDir}/rtfs2/`,
      `file://${waferUnitsLocalDistDir}/recoru/`,
      // `file://${waferUnitsLocalDistDir}/perseq/`,
      // `file://${waferUnitsLocalDistDir}/chord-caster/`,
      // `file://${waferUnitsLocalDistDir}/piano-roll/`,

      `file://${waferUnitsLocalDistDir}/specbar/`,
      `file://${waferUnitsLocalDistDir}/crusher/`,
      `file://${waferUnitsLocalDistDir}/channel-strip/`,
      `file://${waferUnitsLocalDistDir}/noise-mix/`,

      `file://${waferUnitsLocalDistDir}/bs03/`,
      `file://${waferUnitsLocalDistDir}/s7/`,
      `file://${waferUnitsLocalDistDir}/mop2/`,
      `file://${waferUnitsLocalDistDir}/mpd1/`,

      // `file://${unitsDevDistDir}/mu4-keyboard/`,

      `file://${waferUnitsLocalDistDir}/proto-engine-ptm-osc/`,
      `file://${waferUnitsLocalDistDir}/mini-synth/`,
      `file://${waferUnitsLocalDistDir}/mini-synth-ge/`,
      `file://${waferUnitsLocalDistDir}/mini-synth-gp/`,
    ];
  }
}

export const unitSourceUrls = getUnitSourceUrls();
