// Correctif de poids du manteau pour les auto-rigs Tripo/Mixamo.
// L'auto-rig colle le bas du manteau aux os des mains : on retire l'influence
// des os du bras sur les sommets éloignés de la chaîne du bras.

const TRUNK_FALLBACK = ['Hips', 'Spine', 'Spine1', 'Spine2', 'LeftUpLeg', 'RightUpLeg'];

/** Retire le préfixe `mixamorig:` ou `mixamorig`. */
export function normalizeJointName(name) {
  return name.replace(/^mixamorig:?/, '');
}

function isArmBone(name) {
  return /Arm|Hand/.test(name) && !name.includes('Shoulder');
}

function dist(a, b) {
  return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
}

// Distance du point (x, y, z) au segment [a, b].
function distToSegment(x, y, z, a, b) {
  const abx = b[0] - a[0];
  const aby = b[1] - a[1];
  const abz = b[2] - a[2];
  const len2 = abx * abx + aby * aby + abz * abz;
  let t = len2 === 0 ? 0 : ((x - a[0]) * abx + (y - a[1]) * aby + (z - a[2]) * abz) / len2;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(x - (a[0] + t * abx), y - (a[1] + t * aby), z - (a[2] + t * abz));
}

/**
 * @returns {{ joints, weights, changed }} copies ; `changed` = nombre de sommets modifiés.
 */
export function stripArmInfluence({ positions, joints, weights, jointNames, jointPositions, radiusFactor }) {
  const pos = new Map();
  const index = new Map();
  jointNames.forEach((raw, i) => {
    const n = normalizeJointName(raw);
    pos.set(n, jointPositions[i]);
    index.set(n, i);
  });

  if (!pos.has('Hips') || !pos.has('Head')) {
    throw new Error('squelette Mixamo incomplet : os Hips et Head requis');
  }
  const R = radiusFactor * dist(pos.get('Hips'), pos.get('Head'));

  // Segments de la chaîne de chaque bras
  const segments = [];
  for (const side of ['Left', 'Right']) {
    const chain = [`${side}Arm`, `${side}ForeArm`, `${side}Hand`];
    chain.push(pos.has(`${side}HandMiddle4`) ? `${side}HandMiddle4` : null);
    const pts = chain.filter((n) => n && pos.has(n)).map((n) => pos.get(n));
    for (let i = 0; i + 1 < pts.length; i++) segments.push([pts[i], pts[i + 1]]);
  }

  const armJoint = jointNames.map((raw) => isArmBone(normalizeJointName(raw)));
  const fallback = TRUNK_FALLBACK.filter((n) => index.has(n));

  const outJoints = joints.slice();
  const outWeights = weights.slice();
  const count = positions.length / 3;
  let changed = 0;

  for (let v = 0; v < count; v++) {
    const base = v * 4;
    let hasArm = false;
    for (let k = 0; k < 4; k++) {
      if (outWeights[base + k] > 0 && armJoint[outJoints[base + k]]) hasArm = true;
    }
    if (!hasArm) continue;

    const x = positions[v * 3];
    const y = positions[v * 3 + 1];
    const z = positions[v * 3 + 2];
    let nearest = Infinity;
    for (const [a, b] of segments) nearest = Math.min(nearest, distToSegment(x, y, z, a, b));
    if (nearest <= R) continue;

    let kept = 0;
    for (let k = 0; k < 4; k++) {
      if (armJoint[outJoints[base + k]]) outWeights[base + k] = 0;
      else kept += outWeights[base + k];
    }

    if (kept > 0) {
      for (let k = 0; k < 4; k++) outWeights[base + k] /= kept;
    } else {
      // Plus aucune influence : tout sur l'os du tronc ou de la jambe le plus proche
      let best = fallback[0];
      let bestD = Infinity;
      for (const n of fallback) {
        const d = dist([x, y, z], pos.get(n));
        if (d < bestD) {
          bestD = d;
          best = n;
        }
      }
      outJoints[base] = index.get(best);
      outWeights[base] = 1;
      for (let k = 1; k < 4; k++) outWeights[base + k] = 0;
    }
    changed++;
  }

  return { joints: outJoints, weights: outWeights, changed };
}
