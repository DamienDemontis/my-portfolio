import { useState } from 'react';
import '../v2/core/metal-theme.css';

import MetallicSurface from './core/MetallicSurface';
import MetalButton from './components/MetalButton';
import MetalCard from './components/MetalCard';
import MetalText from './components/MetalText';
import MetalDivider from './components/MetalDivider';
import MetalBadge from './components/MetalBadge';
import MetalInput from './components/MetalInput';
import MetalToggle from './components/MetalToggle';
import MetalIconButton from './components/MetalIconButton';
import MetalSectionHeader from './components/MetalSectionHeader';
import MetalTimeline from './components/MetalTimeline';
import MetalAccordion from './components/MetalAccordion';
import MetalProjectCard from './components/MetalProjectCard';
import MetalSkillBar from './components/MetalSkillBar';
import MetalFloatingOrb from './components/MetalFloatingOrb';
import MetalScrollReveal from './components/MetalScrollReveal';
import MetalStatCard from './components/MetalStatCard';
import MetalTooltip from './components/MetalTooltip';
import MetalAvatar from './components/MetalAvatar';
import MetalProgressRing from './components/MetalProgressRing';
import MetalParticleField from './components/MetalParticleField';
import MetalCursor from './components/MetalCursor';
import MetalGallery from './components/MetalGallery';

function Section({ title, children, id }: { title: string; children: React.ReactNode; id: string }) {
  return (
    <section id={id} className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <MetalSectionHeader title={title} number={`// ${id}`} />
        {children}
      </div>
    </section>
  );
}

export default function ComponentShowcase() {
  const [toggleA, setToggleA] = useState(false);
  const [toggleB, setToggleB] = useState(true);
  const [inputVal, setInputVal] = useState('');

  return (
    <div className="metal-page metal-scrollbar metal-noise-overlay">
      <MetalCursor />

      <div className="fixed top-4 right-4 z-50">
        <a
          href="/"
          className="text-[10px] uppercase tracking-[0.2em] text-[#444] hover:text-white transition-colors px-4 py-2 border border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.15)]"
          style={{ borderRadius: 2, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)' }}
        >
          Back to v1
        </a>
      </div>

      <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        <MetalParticleField count={40} speed={0.2} />
        <div className="absolute top-20 left-10 opacity-30">
          <MetalFloatingOrb size={120} seed={7} speed={0.1} pattern="radial" />
        </div>
        <div className="absolute bottom-20 right-16 opacity-20">
          <MetalFloatingOrb size={180} seed={42} speed={0.08} pattern="wave" brightness={1.5} />
        </div>
        <div className="relative z-10 text-center px-6">
          <MetalText as="h1" variant="liquid" className="mb-4">
            Metal UI
          </MetalText>
          <MetalText as="p" variant="dim" className="text-lg tracking-[0.1em] max-w-md mx-auto">
            A component library forged in chrome and shadow
          </MetalText>
          <MetalDivider variant="gradient" className="my-8 max-w-xs mx-auto" />
          <div className="flex items-center justify-center gap-4">
            <MetalButton variant="solid" size="lg">Explore</MetalButton>
            <MetalButton variant="outline" size="lg">Source</MetalButton>
          </div>
        </div>
      </div>

      <Section title="Metallic Surface Shader" id="shader">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(['edge', 'radial', 'noise', 'wave', 'diagonal', 'flat'] as const).map((p) => (
            <MetalScrollReveal key={p} delay={0.05}>
              <div className="relative overflow-hidden" style={{ borderRadius: 4, height: 200, border: '1px solid rgba(255,255,255,0.05)' }}>
                <MetallicSurface
                  mode="procedural"
                  pattern={p}
                  seed={42}
                  speed={0.2}
                  brightness={2}
                  contrast={0.5}
                  scale={4}
                  liquid={0.1}
                  edgeFade={p === 'flat' ? 0 : 0.5}
                  lightColor="#ffffff"
                  darkColor="#000000"
                  tintColor="#ffffff"
                  style={{ width: '100%', height: '100%' }}
                />
                <div className="absolute bottom-3 left-3 z-10">
                  <MetalBadge variant="chrome">{p}</MetalBadge>
                </div>
              </div>
            </MetalScrollReveal>
          ))}
        </div>
      </Section>

      <Section title="Typography" id="typography">
        <div className="space-y-8">
          <MetalText as="h1" variant="chrome">Chrome Heading H1</MetalText>
          <MetalText as="h2" variant="liquid">Liquid Metal H2</MetalText>
          <MetalText as="h3" variant="bright">Bright Heading H3</MetalText>
          <MetalText as="h4" variant="silver">Silver Heading H4</MetalText>
          <MetalDivider variant="thin" className="my-6" />
          <MetalText as="p" variant="bright">
            This is body text in bright variant. Clean and legible against the dark metallic background.
            Every element is designed with precision, like machined metal parts fitting together perfectly.
          </MetalText>
          <MetalText as="p" variant="dim">
            Dim variant for secondary text. Subtle but still readable, like etched markings on brushed steel.
          </MetalText>
        </div>
      </Section>

      <Section title="Buttons" id="buttons">
        <div className="space-y-8">
          <div>
            <MetalText as="p" variant="dim" className="mb-4 text-xs uppercase tracking-[0.15em]">Solid Variant</MetalText>
            <div className="flex flex-wrap items-center gap-4">
              <MetalButton size="sm">Small</MetalButton>
              <MetalButton size="md">Medium</MetalButton>
              <MetalButton size="lg">Large</MetalButton>
              <MetalButton disabled>Disabled</MetalButton>
              <MetalButton loading>Loading</MetalButton>
            </div>
          </div>
          <div>
            <MetalText as="p" variant="dim" className="mb-4 text-xs uppercase tracking-[0.15em]">Outline Variant</MetalText>
            <div className="flex flex-wrap items-center gap-4">
              <MetalButton variant="outline" size="sm">Small</MetalButton>
              <MetalButton variant="outline" size="md">Medium</MetalButton>
              <MetalButton variant="outline" size="lg">Large</MetalButton>
            </div>
          </div>
          <div>
            <MetalText as="p" variant="dim" className="mb-4 text-xs uppercase tracking-[0.15em]">Ghost Variant</MetalText>
            <div className="flex flex-wrap items-center gap-4">
              <MetalButton variant="ghost" size="sm">Small</MetalButton>
              <MetalButton variant="ghost" size="md">Medium</MetalButton>
              <MetalButton variant="ghost" size="lg">Large</MetalButton>
            </div>
          </div>
          <div>
            <MetalText as="p" variant="dim" className="mb-4 text-xs uppercase tracking-[0.15em]">Icon Buttons</MetalText>
            <div className="flex items-center gap-3">
              <MetalIconButton size="sm" icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>} />
              <MetalIconButton size="md" icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>} />
              <MetalIconButton size="lg" icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>} />
              <MetalIconButton variant="outline" icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>} />
              <MetalIconButton variant="ghost" icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>} />
            </div>
          </div>
        </div>
      </Section>

      <Section title="Cards" id="cards">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetalScrollReveal>
            <MetalCard>
              <MetalText as="h4" variant="bright" className="mb-2">Standard Card</MetalText>
              <MetalText as="p" variant="dim" className="text-sm">
                A basic card with brushed metal texture and subtle hover animation.
              </MetalText>
            </MetalCard>
          </MetalScrollReveal>
          <MetalScrollReveal delay={0.1}>
            <MetalCard glow>
              <MetalText as="h4" variant="bright" className="mb-2">Glow Card</MetalText>
              <MetalText as="p" variant="dim" className="text-sm">
                Enhanced with a subtle ambient glow effect around the borders.
              </MetalText>
            </MetalCard>
          </MetalScrollReveal>
          <MetalScrollReveal delay={0.2}>
            <MetalCard hover={false} padding="lg">
              <MetalText as="h4" variant="chrome" className="mb-2">Static Card</MetalText>
              <MetalText as="p" variant="dim" className="text-sm">
                No hover animation. Large padding. Chrome text heading.
              </MetalText>
            </MetalCard>
          </MetalScrollReveal>
        </div>

        <div className="mt-8">
          <MetalScrollReveal>
            <MetalCard padding="lg" className="relative overflow-hidden">
              <MetallicSurface
                mode="procedural"
                pattern="diagonal"
                speed={0.1}
                brightness={1.5}
                contrast={0.4}
                scale={3}
                liquid={0.05}
                edgeFade={0}
                lightColor="#ffffff"
                darkColor="#000000"
                tintColor="#ffffff"
                className="absolute inset-0 opacity-30"
                style={{ width: '100%', height: '100%' }}
              />
              <div className="relative z-10">
                <MetalText as="h3" variant="chrome" className="mb-3">Card with Shader Background</MetalText>
                <MetalText as="p" variant="silver">
                  This card combines the metallic paint shader as a subtle background overlay.
                  The effect creates a living, breathing surface that reacts to time.
                </MetalText>
              </div>
            </MetalCard>
          </MetalScrollReveal>
        </div>
      </Section>

      <Section title="Badges" id="badges">
        <div className="flex flex-wrap items-center gap-3">
          <MetalBadge>Default</MetalBadge>
          <MetalBadge variant="outline">Outline</MetalBadge>
          <MetalBadge variant="chrome">Chrome</MetalBadge>
          <MetalBadge size="md">Medium</MetalBadge>
          <MetalBadge variant="outline" size="md">React</MetalBadge>
          <MetalBadge variant="chrome" size="md">TypeScript</MetalBadge>
          <MetalBadge variant="outline" size="md">WebGL</MetalBadge>
          <MetalBadge size="md">Three.js</MetalBadge>
        </div>
      </Section>

      <Section title="Dividers" id="dividers">
        <div className="space-y-10">
          <div>
            <MetalText as="p" variant="dim" className="mb-4 text-xs uppercase tracking-[0.15em]">Gradient</MetalText>
            <MetalDivider variant="gradient" />
          </div>
          <div>
            <MetalText as="p" variant="dim" className="mb-4 text-xs uppercase tracking-[0.15em]">Thin</MetalText>
            <MetalDivider variant="thin" />
          </div>
          <div>
            <MetalText as="p" variant="dim" className="mb-4 text-xs uppercase tracking-[0.15em]">Thick</MetalText>
            <MetalDivider variant="thick" />
          </div>
          <div>
            <MetalText as="p" variant="dim" className="mb-4 text-xs uppercase tracking-[0.15em]">With Ornament</MetalText>
            <MetalDivider variant="gradient" ornament />
          </div>
          <div>
            <MetalText as="p" variant="dim" className="mb-4 text-xs uppercase tracking-[0.15em]">Dashed</MetalText>
            <MetalDivider variant="dashed" />
          </div>
        </div>
      </Section>

      <Section title="Form Controls" id="forms">
        <div className="max-w-md space-y-6">
          <MetalInput
            label="Name"
            placeholder="Enter your name"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
          />
          <MetalInput
            label="Email"
            type="email"
            placeholder="your@email.com"
            size="lg"
          />
          <MetalInput
            label="With Error"
            placeholder="Something wrong here"
            error="This field is required"
          />
          <MetalInput
            label="Message"
            multiline
            rows={3}
            placeholder="Write something..."
          />
          <MetalDivider variant="gradient" className="my-8" />
          <div className="space-y-4">
            <MetalToggle checked={toggleA} onChange={setToggleA} label="Enable animations" />
            <MetalToggle checked={toggleB} onChange={setToggleB} label="Dark mode" />
            <MetalToggle disabled label="Disabled toggle" />
          </div>
        </div>
      </Section>

      <Section title="Tooltips" id="tooltips">
        <div className="flex items-center gap-6">
          <MetalTooltip content="This is a tooltip">
            <MetalButton variant="outline" size="sm">Hover me</MetalButton>
          </MetalTooltip>
          <MetalTooltip content="Another tooltip" position="bottom">
            <MetalBadge variant="chrome" size="md">Bottom tooltip</MetalBadge>
          </MetalTooltip>
          <MetalTooltip content="Icon tooltip">
            <MetalIconButton icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>} />
          </MetalTooltip>
        </div>
      </Section>

      <Section title="Avatar" id="avatar">
        <div className="flex items-end gap-6">
          <MetalAvatar src="https://i.pravatar.cc/200?img=3" size="sm" alt="User" />
          <MetalAvatar src="https://i.pravatar.cc/200?img=5" size="md" alt="User" />
          <MetalAvatar src="https://i.pravatar.cc/200?img=8" size="lg" alt="User" />
          <MetalAvatar src="https://i.pravatar.cc/200?img=12" size="xl" alt="User" />
          <MetalAvatar src="https://i.pravatar.cc/200?img=15" size="lg" ring={false} alt="No ring" />
        </div>
      </Section>

      <Section title="Statistics" id="stats">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetalStatCard value={7} label="Years Experience" suffix="+" />
          <MetalStatCard value={42} label="Projects Completed" />
          <MetalStatCard value={99.9} label="Uptime" suffix="%" decimals={1} />
          <MetalStatCard value={15} label="Technologies" suffix="+" />
        </div>
      </Section>

      <Section title="Progress Rings" id="progress-rings">
        <div className="flex flex-wrap items-center justify-center gap-8">
          <MetalProgressRing value={92} label="React" />
          <MetalProgressRing value={85} label="TypeScript" size={120} />
          <MetalProgressRing value={78} label="Node.js" />
          <MetalProgressRing value={65} label="WebGL" size={80} strokeWidth={2} />
        </div>
      </Section>

      <Section title="Skill Bars" id="skill-bars">
        <div className="max-w-lg space-y-5">
          <MetalSkillBar label="React / Next.js" level={95} />
          <MetalSkillBar label="TypeScript" level={90} />
          <MetalSkillBar label="Node.js" level={85} />
          <MetalSkillBar label="WebGL / Shaders" level={75} />
          <MetalSkillBar label="Python" level={70} />
          <MetalSkillBar label="Rust" level={45} />
        </div>
      </Section>

      <Section title="Timeline" id="timeline">
        <MetalTimeline
          items={[
            {
              title: 'Senior Developer',
              subtitle: 'Tech Corp',
              period: '2023 — Present',
              content: 'Leading frontend architecture and implementing advanced WebGL experiences.',
            },
            {
              title: 'Full Stack Developer',
              subtitle: 'Startup Inc',
              period: '2021 — 2023',
              content: 'Built scalable applications with React, Node.js, and PostgreSQL.',
            },
            {
              title: 'Junior Developer',
              subtitle: 'Agency Co',
              period: '2019 — 2021',
              content: 'Developed responsive websites and interactive web applications.',
            },
          ]}
        />
      </Section>

      <Section title="Accordion" id="accordion">
        <div className="max-w-2xl">
          <MetalAccordion
            items={[
              {
                title: 'What technologies do you use?',
                badge: 'FAQ',
                content: 'React, TypeScript, Three.js, WebGL, Node.js, and many more. I focus on modern, performant web technologies.',
              },
              {
                title: 'Are you available for freelance work?',
                content: 'Yes, I am available for select projects. Feel free to reach out through the contact form.',
              },
              {
                title: 'How does the metallic shader work?',
                badge: 'Technical',
                content: 'The metallic effect uses WebGL2 fragment shaders with procedural noise generation, Fresnel equations, and chromatic aberration to simulate a realistic liquid metal surface.',
              },
            ]}
          />
        </div>
      </Section>

      <Section title="Project Cards" id="project-cards">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <MetalProjectCard
            title="Neural Renderer"
            description="Real-time neural radiance field renderer built with WebGPU and custom WGSL shaders."
            tags={['WebGPU', 'WGSL', 'ML']}
            featured
            links={[
              { label: 'View', href: '#' },
              { label: 'Source', href: '#' },
            ]}
          />
          <MetalProjectCard
            title="Shader Playground"
            description="Interactive GLSL shader editor with live preview and sharing capabilities."
            tags={['WebGL', 'GLSL', 'React']}
            links={[{ label: 'Demo', href: '#' }]}
          />
          <MetalProjectCard
            title="Type Engine"
            description="High-performance TypeScript type inference engine for real-time code analysis."
            tags={['TypeScript', 'Rust', 'WASM']}
            links={[{ label: 'Source', href: '#' }]}
          />
          <MetalProjectCard
            title="Liquid UI"
            description="Component library with fluid animations and metallic design language."
            tags={['React', 'Framer Motion', 'CSS']}
            links={[
              { label: 'Docs', href: '#' },
              { label: 'NPM', href: '#' },
            ]}
          />
        </div>
      </Section>

      <Section title="Gallery" id="gallery">
        <MetalGallery
          images={[
            { src: 'https://picsum.photos/seed/m1/600/400', alt: 'Photo 1', caption: 'Urban geometry' },
            { src: 'https://picsum.photos/seed/m2/600/400', alt: 'Photo 2', caption: 'Steel reflections' },
            { src: 'https://picsum.photos/seed/m3/600/400', alt: 'Photo 3', caption: 'Night architecture' },
            { src: 'https://picsum.photos/seed/m4/600/400', alt: 'Photo 4', caption: 'Industrial forms' },
            { src: 'https://picsum.photos/seed/m5/600/400', alt: 'Photo 5', caption: 'Metal textures' },
            { src: 'https://picsum.photos/seed/m6/600/400', alt: 'Photo 6', caption: 'Chrome surfaces' },
          ]}
          columns={3}
        />
      </Section>

      <Section title="Scroll Reveal" id="scroll-reveal">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <MetalScrollReveal direction="up" delay={0}>
            <MetalCard><MetalText as="p" variant="silver" className="text-center text-sm">Up</MetalText></MetalCard>
          </MetalScrollReveal>
          <MetalScrollReveal direction="down" delay={0.1}>
            <MetalCard><MetalText as="p" variant="silver" className="text-center text-sm">Down</MetalText></MetalCard>
          </MetalScrollReveal>
          <MetalScrollReveal direction="left" delay={0.2}>
            <MetalCard><MetalText as="p" variant="silver" className="text-center text-sm">Left</MetalText></MetalCard>
          </MetalScrollReveal>
          <MetalScrollReveal direction="right" delay={0.3}>
            <MetalCard><MetalText as="p" variant="silver" className="text-center text-sm">Right</MetalText></MetalCard>
          </MetalScrollReveal>
        </div>
      </Section>

      <section className="py-32 px-6 text-center">
        <MetalDivider variant="gradient" ornament className="max-w-xs mx-auto mb-16" />
        <MetalText as="h2" variant="chrome" className="mb-4">
          Forged in Code
        </MetalText>
        <MetalText as="p" variant="dim" className="max-w-md mx-auto mb-8">
          Every component hand-crafted with WebGL shaders, Framer Motion, and Tailwind CSS.
        </MetalText>
        <MetalButton size="lg">Get Started</MetalButton>
        <div className="mt-16 flex items-center justify-center gap-6">
          <MetalBadge variant="outline" size="md">React</MetalBadge>
          <MetalBadge variant="outline" size="md">WebGL2</MetalBadge>
          <MetalBadge variant="outline" size="md">Framer Motion</MetalBadge>
          <MetalBadge variant="outline" size="md">Tailwind</MetalBadge>
        </div>
        <div className="mt-8 text-[10px] uppercase tracking-[0.3em] text-[#333]">
          Metal UI Component Library
        </div>
      </section>
    </div>
  );
}
