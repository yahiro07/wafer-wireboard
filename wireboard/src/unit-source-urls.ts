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
    const wusCustomUnitsLocalDistDir = toAbsolutePath(
      "../../../wus-custom-units/dist",
    );
    return [
      `file://${wusUnitsLocalDistDir}/wavicle/`,
      `file://${wusUnitsLocalDistDir}/specbar/`,
      `file://${wusUnitsLocalDistDir}/proto-engine-ptm-osc/`,
      `file://${wusUnitsLocalDistDir}/proto-engine-pd-fm/`,
      `file://${wusUnitsLocalDistDir}/mini-synth/`,
      `file://${wusUnitsLocalDistDir}/mini-synth-ge/`,
      `file://${wusUnitsLocalDistDir}/mini-synth-gp/`,
      `file://${wusUnitsLocalDistDir}/bseq1/`,
      `file://${wusUnitsLocalDistDir}/lseq1/`,
      `file://${wusUnitsLocalDistDir}/chord-caster/`,
      `file://${wusUnitsLocalDistDir}/rtfr/`,
      `file://${wusUnitsLocalDistDir}/rtfs1/`,
      //
      `file://${wusCustomUnitsLocalDistDir}/additive/`,
      `file://${wusCustomUnitsLocalDistDir}/drum-machine/`,
      `file://${wusCustomUnitsLocalDistDir}/wasyn-1/`,
      `file://${wusCustomUnitsLocalDistDir}/webaudio-tinysynth-simple/`,
      `file://${wusCustomUnitsLocalDistDir}/bc-010/`,
      `file://${wusCustomUnitsLocalDistDir}/koodori/`,
      `file://${wusCustomUnitsLocalDistDir}/webaudio-synth-v2/`,
      //
      `file://${homeDir}/wus-units/my-drum-machine/`,
      `file://${homeDir}/wus-units/twsq1/`,
      //
      `file://${unitsDevDistDir}/mu1-instrument/`,
      `file://${unitsDevDistDir}/mu2-sequencer/`,
      `file://${unitsDevDistDir}/mu3-effect/`,
      `file://${unitsDevDistDir}/mu4-keyboard/`,
      `file://${unitsDevDistDir}/mu5-visualizer/`,
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
      "https://cdn.jsdelivr.net/gh/yahiro07/wus-custom-units@r14/drum-machine/",
      "https://cdn.jsdelivr.net/gh/yahiro07/wus-custom-units@r14/wasyn-1/",
      "https://cdn.jsdelivr.net/gh/yahiro07/wus-custom-units@r14/webaudio-tinysynth-simple/",
      "https://cdn.jsdelivr.net/gh/yahiro07/wus-custom-units@r14/bc-010/",
      "https://cdn.jsdelivr.net/gh/yahiro07/wus-custom-units@r14/koodori/",
      "https://cdn.jsdelivr.net/gh/yahiro07/wus-custom-units@r14/webaudio-synth-v2/",
      //
      // "https://cdn.jsdelivr.net/gh/yahiro07/webaudio-unit-system@r1/unit-examples/dist/mu1-instrument/",
      // "https://cdn.jsdelivr.net/gh/yahiro07/webaudio-unit-system@r1/unit-examples/dist/mu2-sequencer/",
      // "https://cdn.jsdelivr.net/gh/yahiro07/webaudio-unit-system@r1/unit-examples/dist/mu3-effect/",
      // "https://cdn.jsdelivr.net/gh/yahiro07/webaudio-unit-system@r1/unit-examples/dist/mu4-keyboard/",
      // "https://cdn.jsdelivr.net/gh/yahiro07/webaudio-unit-system@r1/unit-examples/dist/mu5-visualizer/",
    ];
  }
}

export const unitSourceUrls = getUnitSourceUrls();
