//value: 0~1, pivot: 0~1 (typically 0.5~0.8)
export function mapVolumeCurve(
  value: number,
  configs: {
    pivot: number; //value for unity gain
    topGain: number;
    lowerCurveExponent: number;
  },
) {
  const { pivot, topGain, lowerCurveExponent } = configs;
  if (value > pivot) {
    const pos = (value - pivot) / (1 - pivot); //0~1
    return 1 + pos * (topGain - 1);
  } else {
    const pos = value / pivot; //0~1
    return pos ** lowerCurveExponent;
  }
}

export function mapVolumeCurveCenterUnity(value: number) {
  return mapVolumeCurve(value, {
    pivot: 0.5,
    topGain: 1.5,
    lowerCurveExponent: 2.5,
  });
}
