import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Skill forge — hierarchical machined plates.
 * Only category plates show at rest. Hovering a category tilts it and its
 * children "peek" out from behind; clicking makes them spring out into the
 * graph (click again to fold them back). No bubbles — brushed plates only.
 */

type Tier = 'core' | 'active' | 'exploring';

interface SkillNode {
  id: string;
  label: string;
  tier: Tier;
  links?: string[]; // cross-links between children (both must be visible)
}

interface Category {
  id: string;
  label: string;
  children: SkillNode[];
}

const CATEGORIES: Category[] = [
  {
    id: 'frontend',
    label: 'Frontend',
    children: [
      { id: 'ts', label: 'TypeScript', tier: 'core', links: ['react', 'vue'] },
      { id: 'react', label: 'React / Next.js', tier: 'core', links: ['tailwind', 'rn'] },
      { id: 'vue', label: 'Vue / Nuxt', tier: 'core', links: ['vite'] },
      { id: 'vite', label: 'Vite', tier: 'core' },
      { id: 'css', label: 'HTML / CSS', tier: 'core', links: ['tailwind'] },
      { id: 'vuex', label: 'Vuex / Pinia', tier: 'active', links: ['vue'] },
      { id: 'tailwind', label: 'Tailwind', tier: 'active' },
      { id: 'rn', label: 'React Native', tier: 'active' },
      { id: 'webgl', label: 'WebGL / Shaders', tier: 'active' },
    ],
  },
  {
    id: 'backend',
    label: 'Backend',
    children: [
      { id: 'node', label: 'Node.js', tier: 'core', links: ['fastify', 'rest'] },
      { id: 'fastify', label: 'Fastify', tier: 'core' },
      { id: 'rest', label: 'REST APIs', tier: 'core', links: ['ws'] },
      { id: 'express', label: 'Express / NestJS', tier: 'active', links: ['node'] },
      { id: 'prisma', label: 'Prisma', tier: 'active' },
      { id: 'stripe', label: 'Stripe', tier: 'active' },
      { id: 'puppeteer', label: 'Puppeteer', tier: 'active' },
      { id: 'ws', label: 'WebSockets', tier: 'active' },
      { id: 'llm', label: 'LLM / RAG', tier: 'active', links: ['python', 'mcp'] },
      { id: 'mcp', label: 'MCP', tier: 'active' },
      { id: 'python', label: 'Python', tier: 'active', links: ['django'] },
      { id: 'django', label: 'Django', tier: 'exploring' },
      { id: 'php', label: 'PHP / WordPress', tier: 'exploring' },
    ],
  },
  {
    id: 'data',
    label: 'Data & Messaging',
    children: [
      { id: 'mongo', label: 'MongoDB', tier: 'active' },
      { id: 'pg', label: 'PostgreSQL', tier: 'active' },
      { id: 'mysql', label: 'MySQL', tier: 'active' },
      { id: 'redis', label: 'Redis', tier: 'active', links: ['bullmq'] },
      { id: 'rabbitmq', label: 'RabbitMQ', tier: 'active' },
      { id: 'bullmq', label: 'BullMQ', tier: 'active' },
      { id: 'firebase', label: 'Firebase', tier: 'active' },
    ],
  },
  {
    id: 'devops',
    label: 'DevOps & Cloud',
    children: [
      { id: 'docker', label: 'Docker', tier: 'active', links: ['cicd', 'ansible'] },
      { id: 'gitlab', label: 'GitLab', tier: 'active', links: ['cicd'] },
      { id: 'cicd', label: 'CI/CD', tier: 'active' },
      { id: 'ansible', label: 'Ansible', tier: 'active' },
      { id: 'linux', label: 'Linux / Bash', tier: 'active' },
      { id: 'k8s', label: 'Kubernetes', tier: 'exploring' },
      { id: 'nomad', label: 'Nomad', tier: 'exploring' },
      { id: 'cloud', label: 'AWS / GCP / Azure', tier: 'exploring' },
    ],
  },
  {
    id: 'craft',
    label: 'Game & Craft',
    children: [
      // Unity runs C# — linked to csharp, NOT to C/C++.
      { id: 'unity', label: 'Unity', tier: 'exploring', links: ['csharp'] },
      { id: 'csharp', label: 'C#', tier: 'active' },
      { id: 'cpp', label: 'C / C++', tier: 'active' },
      { id: 'git', label: 'Git', tier: 'core' },
      { id: 'tests', label: 'Jest / Cypress', tier: 'active' },
      { id: 'pytorch', label: 'PyTorch', tier: 'exploring', links: ['opencv'] },
      { id: 'opencv', label: 'OpenCV', tier: 'active' },
      { id: 'figma', label: 'Figma', tier: 'exploring' },
    ],
  },
];

const LOGO_SLUGS: Record<string, string> = {
  ts: 'typescript', react: 'react', vue: 'vuedotjs', vite: 'vite', css: 'html5',
  tailwind: 'tailwindcss', rn: 'react', webgl: 'webgl',
  node: 'nodedotjs', fastify: 'fastify', rest: 'openapiinitiative', prisma: 'prisma',
  stripe: 'stripe', puppeteer: 'puppeteer', llm: 'langchain', python: 'python',
  mongo: 'mongodb', pg: 'postgresql', redis: 'redis', rabbitmq: 'rabbitmq', firebase: 'firebase',
  docker: 'docker', gitlab: 'gitlab', cicd: 'githubactions', ansible: 'ansible',
  linux: 'linux', k8s: 'kubernetes', nomad: 'nomad', cloud: 'googlecloud',
  unity: 'unity', csharp: 'dotnet', cpp: 'cplusplus', git: 'git', tests: 'jest',
  pytorch: 'pytorch', figma: 'figma',
  vuex: 'pinia', express: 'express', ws: 'socketdotio', django: 'django',
  php: 'wordpress', mysql: 'mysql', opencv: 'opencv',
  // mcp has no simpleicons entry — engraved "M" fallback.
};

const CHILD_H: Record<Tier, number> = { core: 38, active: 34, exploring: 30 };
const CHILD_FONT: Record<Tier, number> = { core: 10, active: 9.5, exploring: 9 };
const CAT_H = 56;
const CAT_FONT = 13;

interface Body {
  id: string;
  label: string;
  tier: Tier | 'category';
  cat: string; // category id ('' for the category itself)
  x: number;
  y: number;
  vx: number;
  vy: number;
  w: number;
  h: number;
  hoverAmt: number; // 0..1 animated
  scale: number; // spawn animation for children
}

export default function SkillConstellation() {
  const { t } = useTranslation();
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoverLabel, setHoverLabel] = useState<string | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let W = 0;
    let H = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const expanded = new Set<string>();

    const measure = (label: string, font: number) => {
      ctx.font = `500 ${font}px 'JetBrains Mono', monospace`;
      return ctx.measureText(label.toUpperCase()).width;
    };

    // Category plates: seeded on a wide arc.
    const cats: Body[] = CATEGORIES.map((c, i) => {
      const fr = (i + 0.5) / CATEGORIES.length;
      const w = Math.ceil(16 + (CAT_H - 20) + 10 + measure(c.label, CAT_FONT) + 34);
      return {
        id: c.id,
        label: c.label,
        tier: 'category',
        cat: '',
        x: 0.12 + fr * 0.76,
        y: 0.5 + Math.sin(fr * Math.PI * 2 + 0.8) * 0.16,
        vx: 0,
        vy: 0,
        w,
        h: CAT_H,
        hoverAmt: 0,
        scale: 1,
      };
    });

    const childBodies: Body[] = CATEGORIES.flatMap((c) =>
      c.children.map((n, k) => {
        const h = CHILD_H[n.tier];
        const w = Math.ceil(12 + (h - 14) + 8 + measure(n.label, CHILD_FONT[n.tier]) + 12);
        const parent = cats.find((p) => p.id === c.id)!;
        const angle = (k / c.children.length) * Math.PI * 2;
        return {
          id: n.id,
          label: n.label,
          tier: n.tier,
          cat: c.id,
          x: parent.x + Math.cos(angle) * 0.001,
          y: parent.y + Math.sin(angle) * 0.001,
          vx: 0,
          vy: 0,
          w,
          h,
          hoverAmt: 0,
          scale: 0,
        };
      }),
    );

    const bodies = [...cats, ...childBodies];
    const byId = new Map(bodies.map((b) => [b.id, b]));
    const tierOf = new Map<string, Tier>();
    const crossLinks: Array<[string, string]> = [];
    CATEGORIES.forEach((c) =>
      c.children.forEach((n) => {
        tierOf.set(n.id, n.tier);
        n.links?.forEach((to) => crossLinks.push([n.id, to]));
      }),
    );

    const isVisible = (b: Body) => b.tier === 'category' || expanded.has(b.cat);

    let dragging: Body | null = null;
    let hovered: Body | null = null;
    let rafId: number | null = null;
    let running = false;

    const logos = new Map<string, HTMLImageElement>();
    Object.entries(LOGO_SLUGS).forEach(([id, slug]) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        logos.set(id, img);
        if (!running) draw();
      };
      img.src = `https://cdn.simpleicons.org/${slug}/c9ccd1`;
    });

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
    };

    const step = () => {
      const visible = bodies.filter(isVisible);
      // Hover/scale easing.
      bodies.forEach((b) => {
        const target = b === hovered ? 1 : 0;
        b.hoverAmt += (target - b.hoverAmt) * 0.18;
        const sTarget = isVisible(b) ? 1 : 0;
        b.scale += (sTarget - b.scale) * 0.16;
        // Collapsed children ride their parent.
        if (!isVisible(b) && b.cat) {
          const p = byId.get(b.cat)!;
          b.x += (p.x - b.x) * 0.3;
          b.y += (p.y - b.y) * 0.3;
          b.vx = 0;
          b.vy = 0;
        }
      });

      for (let i = 0; i < visible.length; i++) {
        const a = visible[i];
        if (a === dragging) continue;
        let fx = 0;
        let fy = 0;
        for (let j = 0; j < visible.length; j++) {
          if (i === j) continue;
          const b = visible[j];
          const dx = a.x * W - b.x * W;
          const dy = (a.y * H - b.y * H) * 1.8;
          const d2 = dx * dx + dy * dy;
          const min = (a.w + b.w) / 2 * 1.3;
          if (d2 < min * min && d2 > 0.01) {
            const d = Math.sqrt(d2);
            const push = (min - d) / min;
            fx += (dx / d) * push * 0.7;
            fy += (dy / d) * push * 0.7;
          }
        }
        // Children orbit their parent via a spring.
        if (a.cat) {
          const p = byId.get(a.cat)!;
          const dx = p.x * W - a.x * W;
          const dy = p.y * H - a.y * H;
          const d = Math.max(1, Math.hypot(dx, dy));
          const rest = (p.w + a.w) / 2 + 60;
          const f = ((d - rest) / d) * 0.016;
          fx += dx * f;
          fy += dy * f;
        }
        const mx = a.w / 2 + 14;
        const my = a.h / 2 + 20;
        const px = a.x * W;
        const py = a.y * H;
        if (px < mx) fx += (mx - px) * 0.02;
        if (px > W - mx) fx -= (px - (W - mx)) * 0.02;
        if (py < my) fy += (my - py) * 0.02;
        if (py > H - my) fy -= (py - (H - my)) * 0.02;
        a.vx = (a.vx + fx) * 0.86;
        a.vy = (a.vy + fy) * 0.86;
      }
      visible.forEach((b) => {
        if (b === dragging) return;
        b.x += b.vx / Math.max(1, W);
        b.y += b.vy / Math.max(1, H);
      });
    };

    const roundRect = (x: number, y: number, w: number, h: number, r: number) => {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
    };

    const plateFace = (x: number, y: number, w: number, h: number, hover: number, gold: boolean) => {
      const rad = 5;
      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.55)';
      ctx.shadowBlur = 14;
      ctx.shadowOffsetY = 4;
      const face = ctx.createLinearGradient(x, y, x, y + h);
      face.addColorStop(0, hover > 0.5 ? '#2e3136' : '#26292d');
      face.addColorStop(0.5, hover > 0.5 ? '#1d2024' : '#17191c');
      face.addColorStop(1, hover > 0.5 ? '#26292e' : '#1f2226');
      roundRect(x, y, w, h, rad);
      ctx.fillStyle = face;
      ctx.fill();
      ctx.restore();

      const sheen = ctx.createLinearGradient(x, y, x + w, y + h);
      sheen.addColorStop(0, 'rgba(255,255,255,0)');
      sheen.addColorStop(0.5, `rgba(255,255,255,${0.05 + hover * 0.06})`);
      sheen.addColorStop(1, 'rgba(255,255,255,0)');
      roundRect(x, y, w, h, rad);
      ctx.fillStyle = sheen;
      ctx.fill();

      const rim = ctx.createLinearGradient(x, y, x, y + h);
      rim.addColorStop(0, 'rgba(255,255,255,0.35)');
      rim.addColorStop(0.25, 'rgba(255,255,255,0.1)');
      rim.addColorStop(1, 'rgba(0,0,0,0.6)');
      roundRect(x + 0.5, y + 0.5, w - 1, h - 1, rad);
      ctx.lineWidth = 1;
      ctx.strokeStyle = rim;
      ctx.stroke();

      if (gold) {
        const spine = ctx.createLinearGradient(x, y, x, y + h);
        spine.addColorStop(0, 'rgba(212,162,78,0.95)');
        spine.addColorStop(1, 'rgba(138,107,52,0.7)');
        ctx.fillStyle = spine;
        ctx.fillRect(x + 1, y + 3, 2, h - 6);
      }
      if (hover > 0.4) {
        roundRect(x - 1, y - 1, w + 2, h + 2, rad + 1);
        ctx.lineWidth = 1;
        ctx.strokeStyle = `rgba(212,162,78,${hover * 0.8})`;
        ctx.stroke();
      }
    };

    const engrave = (text: string, tx: number, ty: number, font: number, color: string) => {
      ctx.font = `500 ${font}px 'JetBrains Mono', monospace`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = 'rgba(0,0,0,0.8)';
      ctx.fillText(text, tx, ty + 1);
      ctx.fillStyle = color;
      ctx.fillText(text, tx, ty);
      ctx.textBaseline = 'alphabetic';
    };

    const drawChild = (b: Body) => {
      if (b.scale < 0.02) return;
      const cx = b.x * W;
      const cy = b.y * H;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(b.scale, b.scale);
      ctx.globalAlpha = Math.min(1, b.scale * 1.4);
      const x = -b.w / 2;
      const y = -b.h / 2;
      plateFace(x, y, b.w, b.h, b.hoverAmt, b.tier === 'core');
      const logoS = b.h - 14;
      const logo = logos.get(b.id);
      if (logo) ctx.drawImage(logo, x + 12, y + 7, logoS, logoS);
      else {
        ctx.font = `700 ${Math.round(logoS * 0.6)}px 'Syne', sans-serif`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#9a9ea3';
        ctx.fillText(b.label[0].toUpperCase(), x + 12, 1);
        ctx.textBaseline = 'alphabetic';
      }
      const font = CHILD_FONT[b.tier as Tier];
      engrave(b.label.toUpperCase(), x + 12 + logoS + 8, 1, font, b.hoverAmt > 0.4 ? '#f0f0f0' : '#c9c9c9');
      ctx.restore();
    };

    const drawCategory = (b: Body) => {
      const cx = b.x * W;
      const cy = b.y * H;
      const isOpen = expanded.has(b.id);
      const count = CATEGORIES.find((c) => c.id === b.id)!.children.length;

      ctx.save();
      ctx.translate(cx, cy);
      // Tilt on hover — the plate leans, revealing the stack behind.
      ctx.rotate(-b.hoverAmt * 0.05);

      // Peek stack: children hint behind the plate (only while closed).
      if (!isOpen) {
        const peek = 4 + b.hoverAmt * 14;
        for (let i = 2; i >= 0; i--) {
          const off = peek * (i + 1) * 0.55;
          ctx.save();
          ctx.rotate(b.hoverAmt * 0.04 * (i + 1));
          ctx.globalAlpha = 0.5 - i * 0.13;
          const w = b.w * (0.9 - i * 0.06);
          const h = b.h * (0.82 - i * 0.06);
          const face = ctx.createLinearGradient(0, -h / 2 + off, 0, h / 2 + off);
          face.addColorStop(0, '#202327');
          face.addColorStop(1, '#121417');
          roundRect(-w / 2 + off * 0.7, -h / 2 - off * 0.35, w, h, 4);
          ctx.fillStyle = face;
          ctx.fill();
          ctx.strokeStyle = 'rgba(255,255,255,0.12)';
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.restore();
        }
      }

      const x = -b.w / 2;
      const y = -b.h / 2;
      plateFace(x, y, b.w, b.h, b.hoverAmt, true);

      // Engraved category label + child count chip.
      engrave(b.label.toUpperCase(), x + 16, isOpen ? 1 : 1, CAT_FONT, b.hoverAmt > 0.4 ? '#ffffff' : '#e2e2e2');
      const chipX = x + b.w - 26;
      ctx.beginPath();
      ctx.arc(chipX + 8, 0, 10, 0, Math.PI * 2);
      ctx.fillStyle = isOpen ? 'rgba(212,162,78,0.16)' : 'rgba(255,255,255,0.06)';
      ctx.fill();
      ctx.strokeStyle = isOpen ? 'rgba(212,162,78,0.6)' : 'rgba(255,255,255,0.15)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.font = `600 9px 'JetBrains Mono', monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = isOpen ? '#d4a24e' : '#b9b9b9';
      ctx.fillText(isOpen ? '×' : String(count), chipX + 8, 0.5);
      ctx.textBaseline = 'alphabetic';
      ctx.restore();
    };

    const draw = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      // Rods: parent→child for open categories, + cross links when both visible.
      const rod = (a: Body, b: Body, lit: boolean, alpha = 1) => {
        const lg = ctx.createLinearGradient(a.x * W, a.y * H, b.x * W, b.y * H);
        if (lit) {
          lg.addColorStop(0, `rgba(212,162,78,${0.65 * alpha})`);
          lg.addColorStop(0.5, `rgba(255,230,180,${0.35 * alpha})`);
          lg.addColorStop(1, `rgba(212,162,78,${0.65 * alpha})`);
        } else {
          lg.addColorStop(0, `rgba(255,255,255,${0.16 * alpha})`);
          lg.addColorStop(0.5, `rgba(255,255,255,${0.04 * alpha})`);
          lg.addColorStop(1, `rgba(255,255,255,${0.16 * alpha})`);
        }
        ctx.strokeStyle = lg;
        ctx.lineWidth = lit ? 1.4 : 1;
        ctx.beginPath();
        ctx.moveTo(a.x * W, a.y * H);
        ctx.lineTo(b.x * W, b.y * H);
        ctx.stroke();
      };

      childBodies.forEach((b) => {
        if (!expanded.has(b.cat) || b.scale < 0.05) return;
        const p = byId.get(b.cat)!;
        rod(p, b, hovered === b || hovered === p, Math.min(1, b.scale));
      });
      crossLinks.forEach(([ai, bi]) => {
        const a = byId.get(ai);
        const b = byId.get(bi);
        if (!a || !b || !isVisible(a) || !isVisible(b) || a.scale < 0.5 || b.scale < 0.5) return;
        rod(a, b, hovered === a || hovered === b, 0.8);
      });

      childBodies.forEach((b) => {
        if (expanded.has(b.cat) || b.scale > 0.02) drawChild(b);
      });
      cats.forEach(drawCategory);
    };

    const frame = () => {
      step();
      draw();
      rafId = running ? requestAnimationFrame(frame) : null;
    };
    const start = () => {
      if (running) return;
      running = true;
      rafId = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = null;
    };

    const pick = (cx: number, cy: number): Body | null => {
      // Categories on top, then visible children.
      for (const b of cats) {
        if (Math.abs(cx - b.x * W) <= b.w / 2 + 4 && Math.abs(cy - b.y * H) <= b.h / 2 + 4) return b;
      }
      for (const b of childBodies) {
        if (!isVisible(b) || b.scale < 0.6) continue;
        if (Math.abs(cx - b.x * W) <= b.w / 2 + 4 && Math.abs(cy - b.y * H) <= b.h / 2 + 4) return b;
      }
      return null;
    };

    const toLocal = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    let downAt = { x: 0, y: 0 };
    const onDown = (e: PointerEvent) => {
      const p = toLocal(e);
      downAt = p;
      const b = pick(p.x, p.y);
      if (b) {
        dragging = b;
        canvas.setPointerCapture(e.pointerId);
      }
    };
    const onMove = (e: PointerEvent) => {
      const p = toLocal(e);
      if (dragging) {
        dragging.x = p.x / W;
        dragging.y = p.y / H;
        dragging.vx = 0;
        dragging.vy = 0;
      } else {
        const h = pick(p.x, p.y);
        if (h !== hovered) {
          hovered = h;
          setHoverLabel(h ? h.label : null);
          canvas.style.cursor = h ? (h.tier === 'category' ? 'pointer' : 'grab') : '';
        }
      }
    };
    const onUp = (e: PointerEvent) => {
      const p = toLocal(e);
      const moved = Math.hypot(p.x - downAt.x, p.y - downAt.y);
      // A click (not a drag) on a category toggles it open/closed.
      if (dragging && dragging.tier === 'category' && moved < 6) {
        const id = dragging.id;
        if (expanded.has(id)) expanded.delete(id);
        else {
          expanded.add(id);
          // Seed children just off the parent so the springs unfold them.
          childBodies.filter((c) => c.cat === id).forEach((c, k, arr) => {
            const angle = (k / arr.length) * Math.PI * 2 - Math.PI / 2;
            const parent = byId.get(id)!;
            c.x = parent.x + (Math.cos(angle) * 30) / Math.max(1, W);
            c.y = parent.y + (Math.sin(angle) * 30) / Math.max(1, H);
          });
        }
      }
      dragging = null;
      try {
        canvas.releasePointerCapture(e.pointerId);
      } catch {
        /* already released */
      }
    };

    resize();
    if (reduced) {
      // Static: all categories open, settled, one frame.
      CATEGORIES.forEach((c) => expanded.add(c.id));
      bodies.forEach((b) => {
        b.scale = 1;
      });
      for (let i = 0; i < 300; i++) step();
      draw();
      const ro = new ResizeObserver(() => {
        resize();
        draw();
      });
      ro.observe(wrap);
      return () => ro.disconnect();
    }

    const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()), {
      rootMargin: '100px',
    });
    io.observe(wrap);
    canvas.addEventListener('pointerdown', onDown);
    canvas.addEventListener('pointermove', onMove);
    canvas.addEventListener('pointerup', onUp);
    canvas.addEventListener('pointercancel', onUp);
    const ro = new ResizeObserver(() => {
      resize();
      draw();
    });
    ro.observe(wrap);
    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerup', onUp);
      canvas.removeEventListener('pointercancel', onUp);
    };
  }, []);

  return (
    <div ref={wrapRef} className="relative w-full" style={{ height: 'min(78vh, 700px)', touchAction: 'none' }}>
      <canvas ref={canvasRef} aria-label={hoverLabel ?? undefined} />
      <div
        className="pointer-events-none absolute bottom-0 right-0 uppercase"
        style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.22em', color: '#5a5a5a' }}
      >
        {t('skills.openHint')}
      </div>
    </div>
  );
}
