// @vitest-environment node
// Décors CC0 : catalogue, fichiers servis, manifeste, budget par section, récupération.
import { describe, it, expect, afterEach, vi } from 'vitest';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { existsSync, statSync, readFileSync, mkdtempSync, readdirSync } from 'node:fs';
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder } from 'meshoptimizer';
import sharp from 'sharp';
import { PROPS } from '../scripts/props/catalog.mjs';
import { fetchProp } from '../scripts/props/fetch.mjs';
import { buildCharacter } from '../scripts/character/build.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const dir = join(root, 'public/props');
const manifestPath = join(dir, 'manifest.json');
const manifest = () => JSON.parse(readFileSync(manifestPath, 'utf8'));
const BUDGET = 1_500_000;

afterEach(() => vi.unstubAllGlobals());

describe('props catalog', () => {
  it('lists the models the storyboard needs', () => {
    const ids = PROPS.map((p) => p.id);
    for (const id of [
      'filmstrip_projector_8mm', 'boombox', 'modular_urban_apartments_facade', 'rollershutter_door',
      'exterior_aircon_unit', 'modular_electricity_poles', 'street_lamp_01', 'covered_car', 'water_manhole_cover',
      'root_cluster_01', 'tree_stump_01', 'rock_moss_set_01', 'flower_gazania', 'dandelion_01', 'dead_tree_trunk',
      'standing_chalkboard_01', 'SchoolDesk_01', 'SchoolChair_01', 'large_iron_gate',
    ]) expect(ids).toContain(id);
  });

  it('every catalog entry is served', () => {
    const listed = manifest();
    for (const p of PROPS) {
      expect(existsSync(join(dir, `${p.id}.glb`)), p.id).toBe(true);
      expect(listed.find((m) => m.id === p.id), p.id).toBeTruthy();
    }
  });

  it('licenses are CC0 from Poly Haven', () => {
    for (const m of manifest()) {
      expect(m.license).toBe('CC0');
      expect(m.source).toBe('Poly Haven');
      expect(m.url).toBe(`https://polyhaven.com/a/${m.id}`);
      expect(m.file).toBe(`/props/${m.id}.glb`);
      expect(m.bytes).toBe(statSync(join(dir, `${m.id}.glb`)).size);
    }
  });

  it('each section stays within 1.5 MB', () => {
    const totals = {};
    for (const m of manifest()) totals[m.section] = (totals[m.section] ?? 0) + m.bytes;
    expect(Object.keys(totals).length).toBeGreaterThan(0);
    for (const [section, total] of Object.entries(totals)) expect(total, section).toBeLessThanOrEqual(BUDGET);
  });

  it('props use meshopt and webp, textures <= 1024 px', async () => {
    await MeshoptDecoder.ready;
    const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder });
    for (const p of PROPS) {
      const doc = await io.read(join(dir, `${p.id}.glb`));
      const used = doc.getRoot().listExtensionsUsed().map((e) => e.extensionName);
      expect(used, p.id).toContain('EXT_meshopt_compression');
      for (const tex of doc.getRoot().listTextures()) {
        expect(tex.getMimeType(), p.id).toBe('image/webp');
        const meta = await sharp(Buffer.from(tex.getImage())).metadata();
        expect(Math.max(meta.width, meta.height), p.id).toBeLessThanOrEqual(1024);
      }
    }
  }, 60_000);

  it('the retired mecha is gone', () => {
    expect(existsSync(join(root, 'public/intro/Mecha_Full.glb'))).toBe(false);
  });
});

describe('fetchProp', () => {
  it('fails clearly on an unknown id', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: false, status: 404, json: async () => ({}) })));
    const tmp = mkdtempSync(join(tmpdir(), 'props-test-'));
    await expect(fetchProp('no_such_prop', tmp)).rejects.toThrow(/no_such_prop/);
    expect(readdirSync(tmp)).toEqual([]);
  });

  it('fails clearly on an unexpected API shape', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: true, status: 200, json: async () => ({ Diffuse: {} }) })));
    const tmp = mkdtempSync(join(tmpdir(), 'props-test-'));
    await expect(fetchProp('odd_prop', tmp)).rejects.toThrow(/odd_prop/);
  });

  it('fails clearly on a network error and names the id', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => { throw new Error('ECONNRESET'); }));
    const tmp = mkdtempSync(join(tmpdir(), 'props-test-'));
    await expect(fetchProp('flaky_prop', tmp)).rejects.toThrow(/flaky_prop/);
  });

  it('downloads the gltf and its includes with a neutral user agent', async () => {
    const calls = [];
    vi.stubGlobal('fetch', vi.fn(async (url, opts) => {
      calls.push([String(url), opts?.headers?.['User-Agent']]);
      if (String(url).startsWith('https://api.polyhaven.com/files/')) {
        return { ok: true, status: 200, json: async () => ({ gltf: { '1k': { gltf: {
          url: 'https://dl.example/x/x.gltf', size: 3,
          include: { 'x.bin': { url: 'https://dl.example/x/x.bin', size: 3 }, 'textures/a.jpg': { url: 'https://dl.example/x/a.jpg', size: 3 } },
        } } } }) };
      }
      return { ok: true, status: 200, arrayBuffer: async () => new Uint8Array([1, 2, 3]).buffer };
    }));
    const tmp = mkdtempSync(join(tmpdir(), 'props-test-'));
    const path = await fetchProp('x', tmp);
    expect(path.endsWith('x.gltf')).toBe(true);
    expect(existsSync(path)).toBe(true);
    expect(existsSync(join(tmp, 'x', 'x.bin'))).toBe(true);
    expect(existsSync(join(tmp, 'x', 'textures', 'a.jpg'))).toBe(true);
    for (const [, ua] of calls) expect(ua).toBe('portfolio-props-builder');
  });
});

describe('character build refactor', () => {
  it('the character build is unchanged by the refactor', async () => {
    const out = join(tmpdir(), `damien-props-test-${process.pid}.glb`);
    const r = await buildCharacter({ input: join(root, 'assets-src/character/damien-tripo.glb'), output: out });
    expect(r.triangles).toBe(14623);
    expect(r.joints).toBe(65);
    expect(r.changed).toBe(953);
    expect(Math.abs(r.bytes - 576_240) / 576_240).toBeLessThanOrEqual(0.02);
  }, 120_000);
});
