import { describe, it, expect } from 'vitest';
import { lookAngles, breathing, motionPolicy } from '../src/three/character/motion.js';

const deg = (d) => (d * Math.PI) / 180;

describe('lookAngles', () => {
  it('(0,0) donne zéro', () => {
    expect(lookAngles(0, 0)).toEqual({ yaw: 0, pitch: 0 });
  });
  it('(1,1) donne les maxima par défaut', () => {
    const a = lookAngles(1, 1);
    expect(a.yaw).toBeCloseTo(deg(25), 9);
    expect(a.pitch).toBeCloseTo(deg(15), 9);
  });
  it('borne les entrées', () => {
    const a = lookAngles(5, -5);
    expect(a.yaw).toBeCloseTo(deg(25), 9);
    expect(a.pitch).toBeCloseTo(-deg(15), 9);
  });
  it('une valeur non finie compte pour 0', () => {
    expect(lookAngles(NaN, Infinity)).toEqual({ yaw: 0, pitch: 0 });
  });
  it('accepte des maxima personnalisés', () => {
    const a = lookAngles(1, 1, { maxYaw: 10, maxPitch: 5 });
    expect(a.yaw).toBeCloseTo(deg(10), 9);
    expect(a.pitch).toBeCloseTo(deg(5), 9);
  });
});

describe('breathing', () => {
  it('reste dans 0,6°', () => {
    for (let i = 0; i < 100; i++) {
      expect(Math.abs(breathing(i * 0.137))).toBeLessThanOrEqual(deg(0.6) + 1e-9);
    }
  });
  it('période de 4 s', () => {
    expect(Math.abs(breathing(0) - breathing(4))).toBeLessThan(1e-9);
    expect(breathing(1)).toBeCloseTo(deg(0.6), 9);
  });
});

describe('motionPolicy', () => {
  it('par défaut', () => {
    expect(motionPolicy({})).toEqual({ idle: true, lookAt: true, blend: 'smooth', frameloop: 'always' });
    expect(motionPolicy()).toEqual({ idle: true, lookAt: true, blend: 'smooth', frameloop: 'always' });
  });
  it('reducedMotion', () => {
    expect(motionPolicy({ reducedMotion: true })).toEqual({ idle: false, lookAt: false, blend: 'snap', frameloop: 'demand' });
  });
  // Ruling R10 : écran tactile = moins d'effets et de batterie, ni respiration ni rendu continu.
  it('coarsePointer', () => {
    expect(motionPolicy({ coarsePointer: true })).toEqual({ idle: false, lookAt: false, blend: 'smooth', frameloop: 'demand' });
    expect(motionPolicy({ coarsePointer: true, frozen: true })).toEqual({ idle: false, lookAt: false, blend: 'smooth', frameloop: 'demand' });
  });
  it('frozen', () => {
    expect(motionPolicy({ frozen: true })).toEqual({ idle: false, lookAt: false, blend: 'smooth', frameloop: 'demand' });
  });
  it('reducedMotion gagne sur tout', () => {
    expect(motionPolicy({ reducedMotion: true, coarsePointer: true, frozen: true })).toEqual({
      idle: false, lookAt: false, blend: 'snap', frameloop: 'demand',
    });
  });
});
