/**
 * MetallicSurface image-processing worker.
 *
 * Runs the SOR (Successive Over-Relaxation) diffusion that builds the
 * depth-field texture from a source image. On the main thread this was
 * costing ~190ms per title (40 iterations × ~512×512 pixels) and was the
 * #4 cause of saccades in the perf trace. Moving it to a worker eliminates
 * that stall from the main thread entirely.
 *
 * Protocol:
 *   in:  { type: 'process', id, width, height, alphaBuf: ArrayBuffer, shapeBuf: ArrayBuffer, iterations, c, omega }
 *   out: { type: 'done', id, depthBuf: ArrayBuffer (uint8 grayscale * 4, width*height*4) }
 *
 * Note: the main thread does the cheap RGBA → alpha/shape extraction
 * (also a tight pixel loop, but only one pass over the image). We only ship
 * the two derived Uint8 buffers + dimensions, then ship back a packed RGBA
 * buffer suitable for direct upload via texImage2D.
 *
 * Why we ship buffers instead of full ImageData: ImageData is structurally
 * cloneable but ArrayBuffer is *transferable* — zero-copy. We use transfer
 * lists on both sides so postMessage is constant-time regardless of image
 * size.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

interface ProcessRequest {
  type: 'process';
  id: number;
  width: number;
  height: number;
  alphaBuf: ArrayBuffer;   // Float32Array length width*height — alpha 0..1
  shapeBuf: ArrayBuffer;   // Uint8Array length width*height — 0/1
  iterations: number;
  c: number;
  omega: number;
}

interface DoneResponse {
  type: 'done';
  id: number;
  depthBuf: ArrayBuffer;   // Uint8Array length width*height*4 (RGBA grayscale)
}

interface ErrorResponse {
  type: 'error';
  id: number;
  error: string;
}

(self as any).onmessage = (e: MessageEvent<ProcessRequest>) => {
  const msg = e.data;
  if (msg.type !== 'process') return;
  try {
    const { id, width, height, iterations, c, omega } = msg;
    const alpha = new Float32Array(msg.alphaBuf);
    const shape = new Uint8Array(msg.shapeBuf);

    // Compute boundary mask: any shape cell at a hole edge or grid edge.
    const boundary = new Uint8Array(width * height);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = y * width + x;
        if (!shape[idx]) continue;
        if (
          x === 0 || x === width - 1 || y === 0 || y === height - 1 ||
          !shape[idx - 1] || !shape[idx + 1] ||
          !shape[idx - width] || !shape[idx + width]
        ) {
          boundary[idx] = 1;
        }
      }
    }

    // SOR Poisson solver.
    const u = new Float32Array(width * height);
    for (let iter = 0; iter < iterations; iter++) {
      for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
          const idx = y * width + x;
          if (!shape[idx] || boundary[idx]) continue;
          const sum =
            (shape[idx + 1] ? u[idx + 1] : 0) +
            (shape[idx - 1] ? u[idx - 1] : 0) +
            (shape[idx + width] ? u[idx + width] : 0) +
            (shape[idx - width] ? u[idx - width] : 0);
          const newVal = (c + sum) / 4;
          u[idx] = omega * newVal + (1 - omega) * u[idx];
        }
      }
    }

    // Normalize and pack to RGBA.
    let maxVal = 0;
    const size = width * height;
    for (let i = 0; i < size; i++) if (u[i] > maxVal) maxVal = u[i];
    if (maxVal === 0) maxVal = 1;

    const out = new Uint8Array(size * 4);
    for (let i = 0; i < size; i++) {
      const px = i * 4;
      const depth = u[i] / maxVal;
      const gray = Math.round(255 * (1 - depth * depth));
      out[px] = out[px + 1] = out[px + 2] = gray;
      out[px + 3] = Math.round(alpha[i] * 255);
    }

    const resp: DoneResponse = { type: 'done', id, depthBuf: out.buffer };
    (self as any).postMessage(resp, [out.buffer]);
  } catch (err: any) {
    const resp: ErrorResponse = { type: 'error', id: msg.id, error: String(err?.message || err) };
    (self as any).postMessage(resp);
  }
};
