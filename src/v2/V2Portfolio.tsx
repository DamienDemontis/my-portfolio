import { useState, useCallback, useEffect, lazy, Suspense, Profiler } from 'react';
import type { ProfilerOnRenderCallback } from 'react';
import { I18nextProvider } from 'react-i18next';
import v2i18n from './i18n/config';
import './core/metal-theme.css';

import MetalCursor from './components/MetalCursor';
import MetalLoadingScreen from './components/MetalLoadingScreen';
import MetalNavbar from './components/MetalNavbar';
import Dither from './components/Dither';

import V2Hero from './sections/V2Hero';

// ── Perf profiler (check console after page loads) ──
const onRender: ProfilerOnRenderCallback = (id, phase, actualDuration) => {
  if (phase === 'mount') {
    const style = actualDuration > 100
      ? 'color: red; font-weight: bold'
      : actualDuration > 30
        ? 'color: orange'
        : 'color: green';
    console.log(`%c[PERF] ${id} mounted in ${actualDuration.toFixed(1)}ms`, style);
  }
};

// Lazy-load below-fold sections so they don't block the first paint
const V2About = lazy(() => import('./sections/V2About'));
const V2Experience = lazy(() => import('./sections/V2Experience'));
const V2Skills = lazy(() => import('./sections/V2Skills'));
const V2Projects = lazy(() => import('./sections/V2Projects'));
const V2Education = lazy(() => import('./sections/V2Education'));
const V2Certifications = lazy(() => import('./sections/V2Certifications'));
const V2Languages = lazy(() => import('./sections/V2Languages'));
const V2Interests = lazy(() => import('./sections/V2Interests'));
const V2Photography = lazy(() => import('./sections/V2Photography'));
const V2Contact = lazy(() => import('./sections/V2Contact'));
const V2Footer = lazy(() => import('./sections/V2Footer'));

const navItems = [
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Education', href: '#education' },
  { label: 'Certifications', href: '#certifications' },
  { label: 'Languages', href: '#languages' },
  { label: 'Interests', href: '#interests' },
  { label: 'Photography', href: '#photography' },
  { label: 'Contact', href: '#contact' },
];

export default function V2Portfolio() {
  const [loaded, setLoaded] = useState(false);
  const [restReady, setRestReady] = useState(false);

  const handleLoadingComplete = useCallback(() => {
    setLoaded(true);
  }, []);

  // After hero renders and paints, mount the remaining sections
  useEffect(() => {
    if (!loaded) return;
    // Give the hero one frame to paint, then mount the rest
    const id = requestAnimationFrame(() => {
      setRestReady(true);
    });
    return () => cancelAnimationFrame(id);
  }, [loaded]);

  return (
    <I18nextProvider i18n={v2i18n}>
      <div className="metal-page metal-scrollbar metal-noise-overlay metal-vignette">
        <div className="fixed inset-0" style={{ zIndex: 0 }}>
          <Dither
            waveSpeed={0.05}
            waveFrequency={3}
            waveAmplitude={0.3}
            waveColor={[0.5, 0.5, 0.5]}
            colorNum={4}
            pixelSize={2}
            enableMouseInteraction={true}
            mouseRadius={1}
          />
        </div>
        <MetalCursor />

        {!loaded && <MetalLoadingScreen onComplete={handleLoadingComplete} duration={2200} />}

        {loaded && (
          <>
            <MetalNavbar items={navItems} logo="DD" />
            <main className="relative" style={{ zIndex: 1 }}>
              <Profiler id="Hero" onRender={onRender}><V2Hero /></Profiler>
              <div style={{ background: '#000000' }}>
                {restReady && (
                  <Suspense fallback={null}>
                    <div className="metal-separator" />
                    <Profiler id="About" onRender={onRender}><V2About /></Profiler>
                    <div className="metal-separator" />
                    <Profiler id="Experience" onRender={onRender}><V2Experience /></Profiler>
                    <div className="metal-separator" />
                    <Profiler id="Skills" onRender={onRender}><V2Skills /></Profiler>
                    <div className="metal-separator" />
                    <Profiler id="Projects" onRender={onRender}><V2Projects /></Profiler>
                    <div className="metal-separator" />
                    <Profiler id="Education" onRender={onRender}><V2Education /></Profiler>
                    <div className="metal-separator" />
                    <Profiler id="Certifications" onRender={onRender}><V2Certifications /></Profiler>
                    <div className="metal-separator" />
                    <Profiler id="Languages" onRender={onRender}><V2Languages /></Profiler>
                    <div className="metal-separator" />
                    <Profiler id="Interests" onRender={onRender}><V2Interests /></Profiler>
                    <div className="metal-separator" />
                    <Profiler id="Photography" onRender={onRender}><V2Photography /></Profiler>
                    <div className="metal-separator" />
                    <Profiler id="Contact" onRender={onRender}><V2Contact /></Profiler>
                    <Profiler id="Footer" onRender={onRender}><V2Footer /></Profiler>
                  </Suspense>
                )}
              </div>
            </main>
          </>
        )}
      </div>
    </I18nextProvider>
  );
}
