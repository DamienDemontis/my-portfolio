/* eslint-disable react/no-unknown-property */
import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, extend, useFrame } from '@react-three/fiber';
import { useGLTF, useTexture, Environment, Lightformer } from '@react-three/drei';
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
} from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import * as THREE from 'three';

extend({ MeshLineGeometry, MeshLineMaterial });

interface LanyardProps {
  position?: [number, number, number];
  gravity?: [number, number, number];
  fov?: number;
  transparent?: boolean;
}

export default function Lanyard({
  position = [0, 0, 30],
  gravity = [0, -40, 0],
  fov = 20,
  transparent = true,
}: LanyardProps) {
  const [isMobile, setIsMobile] = useState<boolean>(
    () => typeof window !== 'undefined' && window.innerWidth < 768
  );

  useEffect(() => {
    const handleResize = (): void => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'visible' }}>
      <Canvas
        camera={{ position, fov }}
        dpr={[1, isMobile ? 1.5 : 2]}
        gl={{ alpha: transparent }}
        style={{
          position: 'absolute',
          top: 0,
          left: '-100%',
          width: '300%',
          height: '100%',
        }}
        onCreated={({ gl }) => gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1)}
      >
        <ambientLight intensity={Math.PI} />
        <Physics gravity={gravity} timeStep={isMobile ? 1 / 30 : 1 / 60}>
          <Band isMobile={isMobile} />
        </Physics>
        <Environment background={false} blur={0.75}>
          <Lightformer intensity={2} color="white" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={3} color="white" position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={3} color="white" position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={10} color="white" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
        </Environment>
      </Canvas>
    </div>
  );
}

interface BandProps {
  maxSpeed?: number;
  minSpeed?: number;
  isMobile?: boolean;
}

function Band({ maxSpeed = 50, minSpeed = 0, isMobile = false }: BandProps) {
  const band = useRef<any>(null);
  const fixed = useRef<any>(null);
  const j1 = useRef<any>(null);
  const j2 = useRef<any>(null);
  const j3 = useRef<any>(null);
  const card = useRef<any>(null);

  const vec = new THREE.Vector3();
  const ang = new THREE.Vector3();
  const rot = new THREE.Vector3();
  const dir = new THREE.Vector3();

  const segmentProps = {
    type: 'dynamic' as const,
    canSleep: true,
    colliders: false as const,
    angularDamping: 4,
    linearDamping: 4,
  };

  const { nodes, materials } = useGLTF('/card.glb') as any;
  const texture = useTexture('/lanyard-band.png');
  const cardTexture = useMemo(() => {
    const w = 1024;
    const h = 1024;
    const fw = w / 2; // each face is 512px wide
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d')!;

    // Helper: brushed metal noise pattern
    const drawNoise = (ox: number, oy: number, w2: number, h2: number, alpha: number) => {
      for (let y = oy; y < oy + h2; y += 3) {
        const a = (Math.random() * 0.5 + 0.5) * alpha;
        ctx.fillStyle = `rgba(255,255,255,${a})`;
        ctx.fillRect(ox, y, w2, 1);
      }
    };

    // ============================================
    // FRONT FACE (x: 0→512, y: 0→1024)
    // ============================================
    const drawFront = (ox: number) => {
      // Base: pure black like site
      ctx.fillStyle = '#050505';
      ctx.fillRect(ox, 0, fw, h);

      // Subtle vertical gradient (like metal surface)
      const bg = ctx.createLinearGradient(ox, 0, ox, h);
      bg.addColorStop(0, 'rgba(255,255,255,0.02)');
      bg.addColorStop(0.3, 'rgba(255,255,255,0)');
      bg.addColorStop(0.7, 'rgba(255,255,255,0.01)');
      bg.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = bg;
      ctx.fillRect(ox, 0, fw, h);

      // Brushed metal texture
      drawNoise(ox, 0, fw, h, 0.012);

      // Chrome accent line top
      const chrome = ctx.createLinearGradient(ox, 0, ox + fw, 0);
      chrome.addColorStop(0, 'transparent');
      chrome.addColorStop(0.3, 'rgba(255,255,255,0.3)');
      chrome.addColorStop(0.5, 'rgba(255,255,255,0.6)');
      chrome.addColorStop(0.7, 'rgba(255,255,255,0.3)');
      chrome.addColorStop(1, 'transparent');
      ctx.fillStyle = chrome;
      ctx.fillRect(ox, 0, fw, 2);

      // Content below clip hole
      const px = ox + 30;
      const top = 60;

      // ACCESS GRANTED - warm peach like hero title
      ctx.fillStyle = '#ffe8d6';
      ctx.font = 'bold 34px monospace';
      ctx.textAlign = 'left';
      ctx.fillText('ACCESS', px, top);
      ctx.fillText('GRANTED', px, top + 40);

      // Chrome separator
      const sepGrad = ctx.createLinearGradient(px, 0, ox + fw - 30, 0);
      sepGrad.addColorStop(0, 'rgba(255,255,255,0.15)');
      sepGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = sepGrad;
      ctx.fillRect(px, top + 54, fw - 60, 1);

      // Classification - dim text
      ctx.fillStyle = '#525252';
      ctx.font = 'bold 24px monospace';
      ctx.fillText('MAXIMUM CLEARANCE', px, top + 82);

      // Name - bright white like --metal-text-bright
      ctx.fillStyle = '#fafafa';
      ctx.font = 'bold 80px monospace';
      ctx.fillText('DAMIEN', px, top + 195);
      ctx.font = 'bold 56px monospace';
      ctx.fillText('DEMONTIS', px, top + 265);

      // Role - silver chrome gradient
      const roleGrad = ctx.createLinearGradient(px, top + 300, px, top + 370);
      roleGrad.addColorStop(0, '#d4d4d4');
      roleGrad.addColorStop(1, '#737373');
      ctx.fillStyle = roleGrad;
      ctx.font = 'bold 30px monospace';
      ctx.fillText('FULL STACK', px, top + 325);
      ctx.fillText('DEVELOPER', px, top + 362);

      // Divider - subtle white
      ctx.fillStyle = 'rgba(255,255,255,0.06)';
      ctx.fillRect(px, top + 388, fw - 60, 1);

      // Info - proper contrast hierarchy
      ctx.font = '22px monospace';
      const infoY = top + 425;
      const labels = [
        ['ID', 'EPT-2025-0042'],
        ['ORG', 'EPITECH'],
        ['GPA', '3.7 / 4.0'],
      ];
      labels.forEach(([label, value], i) => {
        const y = infoY + i * 40;
        ctx.fillStyle = '#525252';
        ctx.fillText(label, px, y);
        ctx.fillStyle = '#a3a3a3';
        ctx.fillText(value, px + 75, y);
      });

      // Status
      const stsY = infoY + labels.length * 40 + 16;
      ctx.fillStyle = '#525252';
      ctx.font = '22px monospace';
      ctx.fillText('STS', px, stsY);
      ctx.fillStyle = '#d4d4d4';
      ctx.beginPath();
      ctx.arc(px + 82, stsY - 5, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.font = 'bold 22px monospace';
      ctx.fillStyle = '#d4d4d4';
      ctx.fillText('ACTIVE', px + 96, stsY);

      // Barcode
      const barcodeY = 660;
      for (let i = 0; i < 28; i++) {
        const bw = Math.random() > 0.5 ? 5 : 2;
        ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.15 + 0.1})`;
        ctx.fillRect(px + i * 14, barcodeY, bw, 30);
      }
      ctx.fillStyle = '#737373';
      ctx.font = '20px monospace';
      ctx.fillText('eW91J3JlIHRvbyBjdXJpb3Vz', px, barcodeY + 50);
    };

    // ============================================
    // BACK FACE (x: 512→1024, y: 0→1024)
    // ============================================
    const drawBack = (ox: number) => {
      ctx.fillStyle = '#050505';
      ctx.fillRect(ox, 0, fw, h);

      // Metal texture
      drawNoise(ox, 0, fw, h, 0.01);

      // Subtle warm glow in center
      const glow = ctx.createRadialGradient(ox + fw / 2, h / 2, 0, ox + fw / 2, h / 2, 300);
      glow.addColorStop(0, 'rgba(255,232,214,0.03)');
      glow.addColorStop(1, 'transparent');
      ctx.fillStyle = glow;
      ctx.fillRect(ox, 0, fw, h);

      // Chrome line top
      const chrome = ctx.createLinearGradient(ox, 0, ox + fw, 0);
      chrome.addColorStop(0, 'transparent');
      chrome.addColorStop(0.5, 'rgba(255,255,255,0.2)');
      chrome.addColorStop(1, 'transparent');
      ctx.fillStyle = chrome;
      ctx.fillRect(ox, 0, fw, 1);

      const cx = ox + fw / 2;

      // CLASSIFIED - warm peach accent
      ctx.textAlign = 'center';
      ctx.fillStyle = '#ffe8d6';
      ctx.font = 'bold 48px monospace';
      ctx.fillText('CLASSI-', cx, 280);
      ctx.fillText('FIED', cx, 334);

      // Separator
      ctx.fillStyle = 'rgba(255,232,214,0.1)';
      ctx.fillRect(ox + 60, 354, fw - 120, 1);

      // Easter egg - secondary text color
      ctx.fillStyle = '#d4d4d4';
      ctx.font = 'bold 36px monospace';
      ctx.fillText('i hacked', cx, 430);
      ctx.fillText('nasa,', cx, 474);
      ctx.font = '36px monospace';
      ctx.fillStyle = '#8a8a8a';
      ctx.fillText("don't tell", cx, 540);
      ctx.fillText('my mom pls', cx, 584);

      // Terminal block
      ctx.fillStyle = 'rgba(255,255,255,0.03)';
      ctx.fillRect(ox + 30, 630, fw - 60, 70);
      ctx.strokeStyle = 'rgba(255,255,255,0.06)';
      ctx.lineWidth = 1;
      ctx.strokeRect(ox + 30, 630, fw - 60, 70);
      ctx.fillStyle = '#525252';
      ctx.font = '18px monospace';
      ctx.fillText('$ ssh root@nasa', cx, 658);
      ctx.fillStyle = '#a3a3a3';
      ctx.fillText('connected ✓', cx, 684);

      ctx.textAlign = 'left';
    };

    drawFront(0);
    drawBack(fw);

    const tex = new THREE.CanvasTexture(canvas);
    tex.flipY = false;
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);
  const [curve] = useState(
    () => new THREE.CatmullRomCurve3([
      new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(),
    ])
  );
  const [dragged, drag] = useState<false | THREE.Vector3>(false);
  const [hovered, hover] = useState(false);

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3, card, [
    [0, 0, 0],
    [0, 1.45, 0],
  ]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab';
      return () => {
        document.body.style.cursor = 'auto';
      };
    }
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    if (dragged && typeof dragged !== 'boolean') {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());
      card.current?.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z,
      });
    }
    if (fixed.current) {
      [j1, j2].forEach((ref) => {
        if (!ref.current.lerped) ref.current.lerped = new THREE.Vector3().copy(ref.current.translation());
        const clampedDistance = Math.max(0.1, Math.min(1, ref.current.lerped.distanceTo(ref.current.translation())));
        ref.current.lerped.lerp(
          ref.current.translation(),
          delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed))
        );
      });
      curve.points[0].copy(j3.current.translation());
      curve.points[1].copy(j2.current.lerped);
      curve.points[2].copy(j1.current.lerped);
      curve.points[3].copy(fixed.current.translation());
      band.current.geometry.setPoints(curve.getPoints(isMobile ? 16 : 32));
      ang.copy(card.current.angvel());
      rot.copy(card.current.rotation());
      card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z });
    }
  });

  curve.curveType = 'chordal';
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

  return (
    <>
      <group position={[0, 4.5, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[2, 0, 0]}
          ref={card}
          {...segmentProps}
          type={dragged ? 'kinematicPosition' : 'dynamic'}
        >
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            scale={2.25}
            position={[0, -1.2, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e: any) => {
              e.target.releasePointerCapture(e.pointerId);
              drag(false);
            }}
            onPointerDown={(e: any) => {
              e.target.setPointerCapture(e.pointerId);
              drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation())));
            }}
          >
            <mesh geometry={nodes.card.geometry}>
              <meshPhysicalMaterial
                map={cardTexture}
                map-anisotropy={16}
                clearcoat={isMobile ? 0 : 1}
                clearcoatRoughness={0.15}
                roughness={0.9}
                metalness={0.8}
              />
            </mesh>
            <mesh geometry={nodes.clip.geometry} material={materials.metal} material-roughness={0.3} />
            <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
          </group>
        </RigidBody>
      </group>
      <mesh ref={band}>
        {/* @ts-ignore */}
        <meshLineGeometry />
        {/* @ts-ignore */}
        <meshLineMaterial
          color="white"
          depthTest={false}
          resolution={isMobile ? [1000, 2000] : [1000, 1000]}
          useMap
          map={texture}
          repeat={[-3, 1.5]}
          lineWidth={0.06}
        />
      </mesh>
    </>
  );
}
