function toAbsolutePath(path: string): string {
  return new URL(path, import.meta.url).pathname;
}

function getUnitSourceUrls() {
  if (0) {
    //release
    const waferUnitsBase = `https://cdn.jsdelivr.net/gh/yahiro07/wafer-units@r16`;
    const waferCustomUnitsBase = `https://cdn.jsdelivr.net/gh/yahiro07/wafer-custom-units@r16`;
    return [
      `${waferUnitsBase}/graphite-drum-machine/`,

      `${waferCustomUnitsBase}/shiny-drum-machine/`,
      `${waferCustomUnitsBase}/webaudio-tinysynth-mini/`,
      `${waferCustomUnitsBase}/super-oscillator/`,
      `${waferCustomUnitsBase}/midi-synth/`,
      `${waferCustomUnitsBase}/webaudio-synth-v2/`,
      `${waferCustomUnitsBase}/wasyn-1/`,
      `${waferCustomUnitsBase}/syntho/`,
      `${waferCustomUnitsBase}/simple-synth/`,
      `${waferCustomUnitsBase}/model-1/`,
      `${waferCustomUnitsBase}/react-synth/`,
      `${waferCustomUnitsBase}/poly-synth/`,
      `${waferCustomUnitsBase}/sk-synth/`,
      `${waferCustomUnitsBase}/additive/`,
      `${waferCustomUnitsBase}/cadence/`,
      `${waferCustomUnitsBase}/bl-synth-modular/`,
      `${waferCustomUnitsBase}/beatmaker/`,

      `${waferUnitsBase}/wavicle/`,
      `${waferUnitsBase}/techno-beat-machine/`,

      `${waferCustomUnitsBase}/web-audio-mixer/`,
      `${waferCustomUnitsBase}/vue-audio-mixer/`,
      `${waferCustomUnitsBase}/hm-step-sequencer/`,
      `${waferCustomUnitsBase}/d3-synth-scale/`,
      `${waferCustomUnitsBase}/webaudio-spectrum/`,
      `${waferCustomUnitsBase}/audio-input-effects/`,
      `${waferCustomUnitsBase}/darkwave/`,
      `${waferCustomUnitsBase}/circular-audio-wave/`,
      `${waferCustomUnitsBase}/vissonance/`,
      `${waferCustomUnitsBase}/threejs-audio-reactive-visual/`,

      `${waferUnitsBase}/bseq1/`,
      `${waferUnitsBase}/bseq2/`,
      `${waferUnitsBase}/lseq1/`,
      `${waferUnitsBase}/tonerio-sequencer/`,
      `${waferUnitsBase}/fluorite-piano-roll/`,
      `${waferUnitsBase}/partex/`,
      `${waferUnitsBase}/root-prog/`,
      `${waferUnitsBase}/rtfr/`,
      `${waferUnitsBase}/rtfs1/`,
      `${waferUnitsBase}/rtfs2/`,
      `${waferUnitsBase}/rtfs-p/`,
      // `${waferUnitsBase}/recoru/`,
      `${waferUnitsBase}/drum-loop-player/`,
      `${waferUnitsBase}/timing-checker/`,
      `${waferUnitsBase}/multi-lfo/`,
      `${waferUnitsBase}/step-automator/`,

      `${waferUnitsBase}/sunset-delay/`,
      `${waferUnitsBase}/sunset-chorus-mini/`,
      `${waferUnitsBase}/crusher/`,
      `${waferUnitsBase}/channel-strip/`,
      `${waferUnitsBase}/noise-mix/`,
      `${waferUnitsBase}/lofi2/`,

      `${waferUnitsBase}/bs03/`,
      `${waferUnitsBase}/s7/`,
      `${waferUnitsBase}/mop2/`,
      `${waferUnitsBase}/mpd1/`,
      `${waferUnitsBase}/tone-wheel/`,
      `${waferUnitsBase}/proto-engine-ptm-osc/`,
      `${waferUnitsBase}/proto-engine-pd-fm/`,
      `${waferUnitsBase}/mini-synth/`,
      `${waferUnitsBase}/mini-synth-ge/`,
      `${waferUnitsBase}/mini-synth-gp/`,
    ];
  } else {
    //local debug
    const unitsDevDistDir = toAbsolutePath(
      "../../webaudio-unit-system/unit-examples/dist",
    );
    const waferUnitsLocalDistDir = toAbsolutePath("../../wafer-units/dist");
    const waferCustomUnitsLocalDir = toAbsolutePath("../../wafer-custom-units");
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

      // `file://${waferUnitsLocalDistDir}/perseq/`,
      // `file://${waferUnitsLocalDistDir}/chord-caster/`,
      // `file://${waferUnitsLocalDistDir}/piano-roll/`,
      `file://${waferUnitsLocalDistDir}/specbar/`,

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
  }
}

export const unitSourceUrls = getUnitSourceUrls();
