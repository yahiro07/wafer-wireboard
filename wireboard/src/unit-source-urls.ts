const homeDir = process.env.HOME;

function toAbsolutePath(path: string): string {
  return new URL(path, import.meta.url).pathname;
}

const unitsDevDistDir = toAbsolutePath(
  "../../../webaudio-unit-system/framework/packages/units-dev/dist",
);

// const wusUnitsLocalDistDir = toAbsolutePath("../../../../wus-units/dist");

export const unitSourceUrls = [
  "https://cdn.jsdelivr.net/gh/yahiro07/wus-units@r9/wavicle/",
  "https://cdn.jsdelivr.net/gh/yahiro07/wus-units@r9/specbar/",
  "https://cdn.jsdelivr.net/gh/yahiro07/wus-units@r9/proto-engine-ptm-osc/",
  "https://cdn.jsdelivr.net/gh/yahiro07/wus-units@r9/proto-engine-pd-fm/",
  "https://cdn.jsdelivr.net/gh/yahiro07/wus-units@r9/mini-synth/",
  "https://cdn.jsdelivr.net/gh/yahiro07/wus-units@r9/mini-synth-ge/",
  "https://cdn.jsdelivr.net/gh/yahiro07/wus-units@r9/mini-synth-gp/",
  "https://cdn.jsdelivr.net/gh/yahiro07/wus-units@r9/useq/",
  "https://cdn.jsdelivr.net/gh/yahiro07/wus-units@r9/lseq1/",

  "https://cdn.jsdelivr.net/gh/yahiro07/wus-custom-units@r9/additive/",
  "https://cdn.jsdelivr.net/gh/yahiro07/wus-custom-units@r9/drum-machine/",
  "https://cdn.jsdelivr.net/gh/yahiro07/wus-custom-units@r9/wasyn-1/",
  "https://cdn.jsdelivr.net/gh/yahiro07/wus-custom-units@r9/webaudio-tinysynth-simple/",
  "https://cdn.jsdelivr.net/gh/yahiro07/wus-custom-units@r9/bc-010/",
  "https://cdn.jsdelivr.net/gh/yahiro07/wus-custom-units@r9/koodori/",
  "https://cdn.jsdelivr.net/gh/yahiro07/wus-custom-units@r9/webaudio-synth-v2/",
  `file://${homeDir}/wus-units/my-drum-machine/`,
  // `file://${homeDir}/wus-units/twsq1/`,
  `file://${unitsDevDistDir}/mu1-instrument/`,
  `file://${unitsDevDistDir}/mu2-sequencer/`,
  `file://${unitsDevDistDir}/mu3-effect/`,
  `file://${unitsDevDistDir}/mu4-keyboard/`,
  `file://${unitsDevDistDir}/mu5-visualizer/`,
];
