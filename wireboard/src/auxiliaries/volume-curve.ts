export function mapVolumeCurveCenterUnity(value: number) {
  if (value > 0.5) {
    return 1 + ((value - 0.5) / 0.5) * 1.5;
  } else {
    return (value / 0.5) ** 2.5;
  }
}
