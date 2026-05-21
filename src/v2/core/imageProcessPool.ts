/**
 * Singleton worker manager for MetallicSurface.processImage.
 *
 * One Worker handles all incoming image-processing requests. Requests are
 * matched to responses by an incrementing id. Failures fall back to a
 * synchronous in-thread implementation so the caller is never blocked.
 *
 * Why one worker (not a pool): the SOR computation is CPU-bound and the
 * page typically processes <12 images total over its lifetime (one per
 * title + cursor mask). A single worker is sufficient and avoids the
 * memory cost of spawning multiple threads.
 */

type AnyResponse =
  | { type: 'done'; id: number; depthBuf: ArrayBuffer }
  | { type: 'error'; id: number; error: string };

interface PendingRequest {
  resolve: (result: ImageData) => void;
  reject: (err: Error) => void;
  width: number;
  height: number;
}

let _worker: Worker | null = null;
let _workerBroken = false;
let _nextId = 1;
const _pending = new Map<number, PendingRequest>();

function ensureWorker(): Worker | null {
  if (_workerBroken) return null;
  if (_worker) return _worker;
  if (typeof Worker === 'undefined') {
    _workerBroken = true;
    return null;
  }
  try {
    _worker = new Worker(new URL('./imageProcess.worker.ts', import.meta.url), { type: 'module' });
    _worker.onmessage = (e: MessageEvent<AnyResponse>) => {
      const msg = e.data;
      const pending = _pending.get(msg.id);
      if (!pending) return;
      _pending.delete(msg.id);
      if (msg.type === 'done') {
        const out = new Uint8ClampedArray(msg.depthBuf);
        pending.resolve(new ImageData(out, pending.width, pending.height));
      } else {
        pending.reject(new Error(msg.error));
      }
    };
    _worker.onerror = (err) => {
      // eslint-disable-next-line no-console
      console.warn('[imageProcessPool] worker error, falling back to main-thread', err);
      _workerBroken = true;
      _worker?.terminate();
      _worker = null;
      // Reject any pending requests so callers fall back.
      for (const [id, p] of _pending) {
        p.reject(new Error('worker died'));
        _pending.delete(id);
      }
    };
    return _worker;
  } catch (e) {
    _workerBroken = true;
    return null;
  }
}

/**
 * Off-thread processImage. Resolves with a packed ImageData ready to upload.
 * Rejects on worker failure — caller should fall back to its in-thread
 * implementation in that case.
 */
export function processImageInWorker(
  width: number,
  height: number,
  alpha: Float32Array,
  shape: Uint8Array,
  iterations: number,
  c: number,
  omega: number,
): Promise<ImageData> {
  const worker = ensureWorker();
  if (!worker) return Promise.reject(new Error('no worker'));

  const id = _nextId++;
  return new Promise<ImageData>((resolve, reject) => {
    _pending.set(id, { resolve, reject, width, height });

    // Transfer the underlying buffers — zero-copy. Important for big images.
    // Note: after transfer, the caller's view of alpha/shape becomes empty.
    // We don't reuse them anyway so this is fine.
    worker.postMessage(
      {
        type: 'process',
        id,
        width,
        height,
        alphaBuf: alpha.buffer,
        shapeBuf: shape.buffer,
        iterations,
        c,
        omega,
      },
      [alpha.buffer, shape.buffer],
    );
  });
}
