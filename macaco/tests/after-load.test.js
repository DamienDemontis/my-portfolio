import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { afterLoad } from '../src/lib/afterLoad.js';

function setReady(state) {
  Object.defineProperty(document, 'readyState', { configurable: true, get: () => state });
}

describe('afterLoad', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    setReady('loading');
  });
  afterEach(() => {
    vi.useRealTimers();
    delete document.readyState;
  });

  it("n'appelle pas avant load", () => {
    const cb = vi.fn();
    afterLoad(cb);
    vi.advanceTimersByTime(5000);
    expect(cb).not.toHaveBeenCalled();
  });

  it('appelle après load et le délai (repli setTimeout)', () => {
    const cb = vi.fn();
    afterLoad(cb);
    window.dispatchEvent(new Event('load'));
    expect(cb).not.toHaveBeenCalled();
    vi.advanceTimersByTime(200);
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it('utilise requestIdleCallback avec le timeout quand il existe', () => {
    const ric = vi.fn((fn) => { setTimeout(fn, 0); return 7; });
    vi.stubGlobal('requestIdleCallback', ric);
    vi.stubGlobal('cancelIdleCallback', vi.fn());
    const cb = vi.fn();
    afterLoad(cb, { timeout: 1234 });
    window.dispatchEvent(new Event('load'));
    expect(ric).toHaveBeenCalledWith(expect.any(Function), { timeout: 1234 });
    vi.advanceTimersByTime(1);
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it('cancel() avant load empêche l’appel', () => {
    const cb = vi.fn();
    const cancel = afterLoad(cb);
    cancel();
    window.dispatchEvent(new Event('load'));
    vi.advanceTimersByTime(5000);
    expect(cb).not.toHaveBeenCalled();
  });

  it('cancel() après load, avant le délai, empêche l’appel', () => {
    const cb = vi.fn();
    const cancel = afterLoad(cb);
    window.dispatchEvent(new Event('load'));
    cancel();
    vi.advanceTimersByTime(5000);
    expect(cb).not.toHaveBeenCalled();
  });

  it('cancel() annule le idle callback en attente', () => {
    const cic = vi.fn();
    vi.stubGlobal('requestIdleCallback', vi.fn(() => 42));
    vi.stubGlobal('cancelIdleCallback', cic);
    const cancel = afterLoad(vi.fn());
    window.dispatchEvent(new Event('load'));
    cancel();
    expect(cic).toHaveBeenCalledWith(42);
  });

  it('n’attend pas load si readyState vaut complete', () => {
    setReady('complete');
    const cb = vi.fn();
    afterLoad(cb);
    vi.advanceTimersByTime(200);
    expect(cb).toHaveBeenCalledTimes(1);
  });
});
