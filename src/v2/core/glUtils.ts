/**
 * Shared WebGL helpers.
 *
 * Most importantly: a non-blocking shader/program link path using
 * `KHR_parallel_shader_compile`. Without this extension, `linkProgram` is
 * effectively a sync call — Chrome and Firefox stall the main thread for
 * the entire link, which on a complex fragment shader (MetallicSurface,
 * Dither, SoftAurora) can mean 30–80ms of jank during page load.
 *
 * With the extension, linking happens on the GPU compiler thread, and we
 * poll `COMPLETION_STATUS_KHR` from rAF until ready.
 *
 * Spec: https://registry.khronos.org/webgl/extensions/KHR_parallel_shader_compile/
 *
 * The fallback (no extension) is the legacy sync linkProgram + getProgramParameter
 * combo — exactly what the codebase already did.
 */

export interface ParallelCompileExt {
  COMPLETION_STATUS_KHR: number;
}

let _extCache = new WeakMap<WebGL2RenderingContext, ParallelCompileExt | null>();

export function getParallelCompileExt(
  gl: WebGL2RenderingContext,
): ParallelCompileExt | null {
  if (_extCache.has(gl)) return _extCache.get(gl) ?? null;
  const ext = gl.getExtension('KHR_parallel_shader_compile') as ParallelCompileExt | null;
  _extCache.set(gl, ext);
  return ext;
}

/**
 * Compile a shader. Synchronous (compile is always non-blocking under the hood,
 * the GPU driver pipelines it); only linking truly stalls.
 */
export function compileShader(
  gl: WebGL2RenderingContext,
  type: number,
  src: string,
): WebGLShader | null {
  const s = gl.createShader(type);
  if (!s) return null;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  return s;
}

/**
 * Link a program asynchronously when KHR_parallel_shader_compile is available.
 *
 * Returns a Promise that resolves with the linked program (or null on failure).
 * Caller is responsible for cleaning up shaders/program on failure.
 *
 * Behaviour:
 *  - If extension is supported, polls COMPLETION_STATUS_KHR each rAF until
 *    it returns true, then calls getProgramParameter(LINK_STATUS) only once.
 *  - If extension is NOT supported, falls back to the synchronous path
 *    (single link + immediate status check) — identical to a normal linkProgram.
 *
 * Note: this MUST be called BEFORE any GL state that depends on the program
 * being linked. Useful pattern: prepare buffers/attributes against a placeholder
 * VAO while waiting for the link, then bind on resolve.
 */
export function linkProgramAsync(
  gl: WebGL2RenderingContext,
  vs: WebGLShader,
  fs: WebGLShader,
): Promise<WebGLProgram | null> {
  const prog = gl.createProgram();
  if (!prog) return Promise.resolve(null);
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);

  const ext = getParallelCompileExt(gl);
  if (!ext) {
    // Sync fallback. linkProgram has already executed; just check status.
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      // Surface the log so the caller can debug.
      // eslint-disable-next-line no-console
      console.error('[gl] program link failed:', gl.getProgramInfoLog(prog));
      gl.deleteProgram(prog);
      return Promise.resolve(null);
    }
    // Also verify shader compile status — driver may have deferred until link.
    if (
      !gl.getShaderParameter(vs, gl.COMPILE_STATUS) ||
      !gl.getShaderParameter(fs, gl.COMPILE_STATUS)
    ) {
      // eslint-disable-next-line no-console
      console.error(
        '[gl] shader compile failed:',
        gl.getShaderInfoLog(vs),
        gl.getShaderInfoLog(fs),
      );
      gl.deleteProgram(prog);
      return Promise.resolve(null);
    }
    return Promise.resolve(prog);
  }

  // Async path. Poll COMPLETION_STATUS_KHR with back-off.
  //
  // We previously polled every rAF, but each getProgramParameter(COMPLETION_…)
  // call costs ~6ms in this Chromium build (probably because some drivers
  // implicitly flush GL commands when the extension query is made). At ~60Hz
  // polling that's ~360ms/sec of wasted main-thread time per program.
  //
  // The link itself takes 20–80ms on a complex shader. So: wait 30ms first
  // (most links done by then), then poll every 100ms with a back-off cap.
  return new Promise<WebGLProgram | null>((resolve) => {
    const startedAt = performance.now();
    const TIMEOUT_MS = 5000;
    let nextWait = 30; // ms

    const check = () => {
      if (gl.isContextLost()) {
        resolve(null);
        return;
      }
      const ready = gl.getProgramParameter(prog, ext.COMPLETION_STATUS_KHR);
      if (ready) {
        if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
          // eslint-disable-next-line no-console
          console.error('[gl] program link failed:', gl.getProgramInfoLog(prog));
          gl.deleteProgram(prog);
          resolve(null);
          return;
        }
        resolve(prog);
        return;
      }
      if (performance.now() - startedAt > TIMEOUT_MS) {
        // eslint-disable-next-line no-console
        console.warn('[gl] linkProgramAsync timed out, falling back to sync read');
        if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
          gl.deleteProgram(prog);
          resolve(null);
          return;
        }
        resolve(prog);
        return;
      }
      // Exponential-ish back-off, capped at 200ms.
      const wait = nextWait;
      nextWait = Math.min(200, Math.round(nextWait * 1.5));
      setTimeout(check, wait);
    };
    setTimeout(check, nextWait);
  });
}

/* ── Live WebGL context counter (cheap, no perf dependency) ─────────────── */

let _liveContexts = 0;
const _ctxListeners = new Set<(n: number) => void>();
export function incContext(): void {
  _liveContexts += 1;
  for (const fn of _ctxListeners) fn(_liveContexts);
}
export function decContext(): void {
  _liveContexts = Math.max(0, _liveContexts - 1);
  for (const fn of _ctxListeners) fn(_liveContexts);
}
export function getLiveContextCount(): number {
  return _liveContexts;
}
