import { mapUnaryFrom, mapUnaryTo } from "@/auxiliaries/helpers";

export function renderSpectrum(
  canvas: HTMLCanvasElement,
  fftData: Float32Array,
) {
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < fftData.length; i++) {
    const pp = i / (fftData.length - 1);
    const value = mapUnaryFrom(fftData[i], -120, 0, true);
    const px = pp * canvas.width;
    const py = mapUnaryTo(value, canvas.height, 0);
    ctx.strokeStyle = "#0f0";
    ctx.beginPath();
    ctx.moveTo(px, canvas.height);
    ctx.lineTo(px, py);
    ctx.stroke();
  }
}
