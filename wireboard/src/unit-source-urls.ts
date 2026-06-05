const homeDir = process.env.HOME;

// function toAbsolutePath(path: string): string {
//   return new URL(path, import.meta.url).pathname;
// }

// const unitsDevDistDir = toAbsolutePath(
//   "../../../webaudio-unit-system/unit-examples/dist",
// );

// const wusUnitsLocalDistDir = toAbsolutePath("../../../../wus-units/dist");

export const unitSourceUrls = [
  "https://cdn.jsdelivr.net/gh/yahiro07/wus-units@r11/wavicle/",
  "https://cdn.jsdelivr.net/gh/yahiro07/wus-units@r11/specbar/",
  "https://cdn.jsdelivr.net/gh/yahiro07/wus-units@r11/proto-engine-ptm-osc/",
  "https://cdn.jsdelivr.net/gh/yahiro07/wus-units@r11/proto-engine-pd-fm/",
  "https://cdn.jsdelivr.net/gh/yahiro07/wus-units@r11/mini-synth/",
  "https://cdn.jsdelivr.net/gh/yahiro07/wus-units@r11/mini-synth-ge/",
  "https://cdn.jsdelivr.net/gh/yahiro07/wus-units@r11/mini-synth-gp/",
  "https://cdn.jsdelivr.net/gh/yahiro07/wus-units@r11/useq/",
  "https://cdn.jsdelivr.net/gh/yahiro07/wus-units@r11/lseq1/",

  "https://cdn.jsdelivr.net/gh/yahiro07/wus-custom-units@r11/additive/",
  "https://cdn.jsdelivr.net/gh/yahiro07/wus-custom-units@r11/drum-machine/",
  "https://cdn.jsdelivr.net/gh/yahiro07/wus-custom-units@r11/wasyn-1/",
  "https://cdn.jsdelivr.net/gh/yahiro07/wus-custom-units@r11/webaudio-tinysynth-simple/",
  "https://cdn.jsdelivr.net/gh/yahiro07/wus-custom-units@r11/bc-010/",
  "https://cdn.jsdelivr.net/gh/yahiro07/wus-custom-units@r11/koodori/",
  "https://cdn.jsdelivr.net/gh/yahiro07/wus-custom-units@r11/webaudio-synth-v2/",
  `file://${homeDir}/wus-units/my-drum-machine/`,
  // `file://${homeDir}/wus-units/twsq1/`,
  // `file://${unitsDevDistDir}/mu1-instrument/`,
  // `file://${unitsDevDistDir}/mu2-sequencer/`,
  // `file://${unitsDevDistDir}/mu3-effect/`,
  // `file://${unitsDevDistDir}/mu4-keyboard/`,
  // `file://${unitsDevDistDir}/mu5-visualizer/`,
  "https://cdn.jsdelivr.net/gh/yahiro07/webaudio-unit-system@r0/unit-examples/dist/mu1-instrument/",
  "https://cdn.jsdelivr.net/gh/yahiro07/webaudio-unit-system@r0/unit-examples/dist/mu2-sequencer/",
  "https://cdn.jsdelivr.net/gh/yahiro07/webaudio-unit-system@r0/unit-examples/dist/mu3-effect/",
  "https://cdn.jsdelivr.net/gh/yahiro07/webaudio-unit-system@r0/unit-examples/dist/mu4-keyboard/",
  "https://cdn.jsdelivr.net/gh/yahiro07/webaudio-unit-system@r0/unit-examples/dist/mu5-visualizer/",
];
