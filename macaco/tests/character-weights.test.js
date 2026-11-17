// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { stripArmInfluence, normalizeJointName } from '../scripts/character/weights.mjs';

const SKELETON = {
  Hips: [0, 1, 0],
  Spine: [0, 1.15, 0],
  Spine1: [0, 1.3, 0],
  Spine2: [0, 1.45, 0],
  Head: [0, 1.7, 0],
  LeftArm: [0.2, 1.45, 0],
  LeftForeArm: [0.45, 1.2, 0],
  LeftHand: [0.6, 1.0, 0],
  LeftHandMiddle4: [0.68, 0.9, 0],
  RightArm: [-0.2, 1.45, 0],
  RightForeArm: [-0.45, 1.2, 0],
  RightHand: [-0.6, 1.0, 0],
  RightHandMiddle4: [-0.68, 0.9, 0],
  LeftUpLeg: [0.1, 0.95, 0],
  RightUpLeg: [-0.1, 0.95, 0],
};

function build(prefix = '') {
  const names = Object.keys(SKELETON);
  return {
    jointNames: names.map((n) => prefix + n),
    jointPositions: names.map((n) => SKELETON[n]),
    idx: (n) => names.indexOf(n),
  };
}

// Un sommet : [x,y,z], et une liste [nomOs, poids] (jusqu'à 4)
function makeMesh(sk, vertices) {
  const n = vertices.length;
  const positions = new Float32Array(n * 3);
  const joints = new Uint16Array(n * 4);
  const weights = new Float32Array(n * 4);
  vertices.forEach(([p, infl], i) => {
    positions.set(p, i * 3);
    infl.forEach(([name, w], k) => {
      joints[i * 4 + k] = sk.idx(name);
      weights[i * 4 + k] = w;
    });
  });
  return { positions, joints, weights };
}

const run = (sk, mesh) =>
  stripArmInfluence({
    ...mesh,
    jointNames: sk.jointNames,
    jointPositions: sk.jointPositions,
    radiusFactor: 0.18,
  });

const weightOf = (sk, res, v, name) => {
  let s = 0;
  for (let k = 0; k < 4; k++) if (res.joints[v * 4 + k] === sk.idx(name)) s += res.weights[v * 4 + k];
  return s;
};

describe('stripArmInfluence', () => {
  it('keeps a sleeve vertex', () => {
    const sk = build();
    const mesh = makeMesh(sk, [[[0.5, 1.15, 0], [['LeftForeArm', 1]]]]);
    const res = run(sk, mesh);
    expect(res.changed).toBe(0);
    expect(weightOf(sk, res, 0, 'LeftForeArm')).toBe(1);
  });

  it('drops hand influence on a coat vertex', () => {
    const sk = build();
    const mesh = makeMesh(sk, [[[0.3, 0.75, 0], [['LeftHand', 0.6], ['Hips', 0.4]]]]);
    const res = run(sk, mesh);
    expect(res.changed).toBe(1);
    expect(weightOf(sk, res, 0, 'LeftHand')).toBe(0);
    expect(weightOf(sk, res, 0, 'Hips')).toBeCloseTo(1, 6);
  });

  it('falls back to the nearest trunk or leg bone', () => {
    const sk = build();
    const mesh = makeMesh(sk, [[[0.12, 0.8, 0], [['LeftHand', 1]]]]);
    const res = run(sk, mesh);
    expect(res.changed).toBe(1);
    expect(weightOf(sk, res, 0, 'LeftUpLeg')).toBeCloseTo(1, 6);
    expect(weightOf(sk, res, 0, 'LeftHand')).toBe(0);
  });

  it('leaves vertices without arm influence untouched', () => {
    const sk = build();
    const mesh = makeMesh(sk, [[[0.3, 0.75, 0], [['Hips', 0.7], ['Spine', 0.3]]]]);
    const res = run(sk, mesh);
    expect(res.changed).toBe(0);
    expect(Array.from(res.weights)).toEqual(Array.from(mesh.weights));
    expect(Array.from(res.joints)).toEqual(Array.from(mesh.joints));
  });

  it('weights still sum to one', () => {
    const sk = build();
    let seed = 12345;
    const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
    const names = Object.keys(SKELETON);
    const vertices = [];
    for (let i = 0; i < 200; i++) {
      const a = names[Math.floor(rnd() * names.length)];
      const b = names[Math.floor(rnd() * names.length)];
      const wa = 0.2 + rnd() * 0.6;
      vertices.push([
        [rnd() * 1.4 - 0.7, rnd() * 1.2 + 0.4, rnd() * 0.2 - 0.1],
        a === b ? [[a, 1]] : [[a, wa], [b, 1 - wa]],
      ]);
    }
    const res = run(sk, makeMesh(sk, vertices));
    for (let v = 0; v < 200; v++) {
      let s = 0;
      for (let k = 0; k < 4; k++) s += res.weights[v * 4 + k];
      expect(Math.abs(s - 1)).toBeLessThan(1e-6);
    }
  });

  it('does not mutate its inputs', () => {
    const sk = build();
    const mesh = makeMesh(sk, [[[0.3, 0.75, 0], [['LeftHand', 0.6], ['Hips', 0.4]]]]);
    const before = {
      p: Array.from(mesh.positions),
      j: Array.from(mesh.joints),
      w: Array.from(mesh.weights),
    };
    const res = run(sk, mesh);
    expect(res.joints).not.toBe(mesh.joints);
    expect(res.weights).not.toBe(mesh.weights);
    expect(Array.from(mesh.positions)).toEqual(before.p);
    expect(Array.from(mesh.joints)).toEqual(before.j);
    expect(Array.from(mesh.weights)).toEqual(before.w);
  });

  it('accepts mixamorig: and mixamorig prefixes', () => {
    for (const prefix of ['mixamorig:', 'mixamorig']) {
      const sk = build(prefix);
      const mesh = makeMesh(sk, [[[0.3, 0.75, 0], [['LeftHand', 0.6], ['Hips', 0.4]]]]);
      const res = run(sk, mesh);
      expect(res.changed).toBe(1);
      expect(weightOf(sk, res, 0, 'LeftHand')).toBe(0);
    }
  });

  it('fails clearly without Hips or Head', () => {
    const sk = build();
    const names = sk.jointNames.filter((n) => n !== 'Head');
    const pos = sk.jointPositions.filter((_, i) => sk.jointNames[i] !== 'Head');
    expect(() =>
      stripArmInfluence({
        positions: new Float32Array(3),
        joints: new Uint16Array(4),
        weights: new Float32Array(4),
        jointNames: names,
        jointPositions: pos,
        radiusFactor: 0.18,
      }),
    ).toThrow(/Hips.*Head|squelette Mixamo/);
  });
});

describe('normalizeJointName', () => {
  it('strips the mixamorig prefix', () => {
    expect(normalizeJointName('mixamorig:Hips')).toBe('Hips');
    expect(normalizeJointName('mixamorigHips')).toBe('Hips');
    expect(normalizeJointName('Hips')).toBe('Hips');
  });
});
