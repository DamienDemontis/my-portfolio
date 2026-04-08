import { useState, useCallback, useEffect, lazy, Suspense, Profiler, useMemo } from 'react';
import type { ProfilerOnRenderCallback } from 'react';
import { I18nextProvider, useTranslation } from 'react-i18next';
import v2i18n from './i18n/config';
import './core/metal-theme.css';
import { initAnimatedFavicon } from './core/animatedFavicon';

import MetalCursor from './components/MetalCursor';
import MetalLoadingScreen from './components/MetalLoadingScreen';
import MetalNavbar from './components/MetalNavbar';
import Dither from './components/Dither';
import ErrorBoundary from './components/ErrorBoundary';

import V2Hero from './sections/V2Hero';

// ── Perf profiler (dev only) ──
const onRender: ProfilerOnRenderCallback = process.env.NODE_ENV === 'development'
  ? (id, phase, actualDuration) => {
      if (phase === 'mount') {
        const style = actualDuration > 100
          ? 'color: red; font-weight: bold'
          : actualDuration > 30
            ? 'color: orange'
            : 'color: green';
        console.log(`%c[PERF] ${id} mounted in ${actualDuration.toFixed(1)}ms`, style);
      }
    }
  : () => {};

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

// Stable reference — avoids Dither useEffect re-running on every render
const DITHER_COLOR: [number, number, number] = [0.5, 0.5, 0.5];

const NAV_KEYS = [
  { key: 'about', href: '#about' },
  { key: 'experience', href: '#experience' },
  { key: 'skills', href: '#skills' },
  { key: 'projects', href: '#projects' },
  { key: 'education', href: '#education' },
  { key: 'certifications', href: '#certifications' },
  { key: 'languages', href: '#languages' },
  { key: 'interests', href: '#interests' },
  { key: 'photography', href: '#photography' },
  { key: 'contact', href: '#contact' },
];

function useNavItems() {
  const { t } = useTranslation();
  return useMemo(
    () => NAV_KEYS.map(({ key, href }) => ({ label: t(`nav.${key}`), href })),
    [t]
  );
}

function V2PortfolioInner() {
  const navItems = useNavItems();
  const [loaded, setLoaded] = useState(false);
  const [restReady, setRestReady] = useState(false);

  const handleLoadingComplete = useCallback(() => {
    setLoaded(true);
  }, []);

  useEffect(() => {
    const id = setTimeout(() => {
      setRestReady(true);
    }, 800);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    html.classList.add('metal-active');
    return () => { html.classList.remove('metal-active'); };
  }, []);

  useEffect(() => { initAnimatedFavicon(); }, []);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    if (!loaded) {
      html.style.overflow = 'hidden';
      body.style.overflow = 'hidden';
    } else {
      html.style.overflow = '';
      body.style.overflow = '';
    }
    return () => { html.style.overflow = ''; body.style.overflow = ''; };
  }, [loaded]);

  return (
    <div
      className="metal-page metal-scrollbar metal-noise-overlay metal-vignette"
      style={!loaded ? { maxHeight: '100vh', overflow: 'hidden' } : undefined}
    >
      <div className="fixed inset-0" style={{ zIndex: 0 }}>
        <Dither
          waveSpeed={0.05}
          waveFrequency={3}
          waveAmplitude={0.3}
          waveColor={DITHER_COLOR}
          colorNum={4}
          pixelSize={2}
          enableMouseInteraction={true}
          mouseRadius={1}
        />
      </div>
      <MetalCursor />

      {!loaded && <MetalLoadingScreen onComplete={handleLoadingComplete} duration={2200} />}

      <MetalNavbar items={navItems} logo="DD" />
      <main className="relative" style={{ zIndex: 1 }}>
        <Profiler id="Hero" onRender={onRender}><V2Hero /></Profiler>
        <div style={{ background: '#000000' }}>
          {restReady && (
            <ErrorBoundary sectionName="Portfolio">
              <Suspense fallback={null}>
                <div className="metal-separator" />
                <ErrorBoundary sectionName="About">
                  <Profiler id="About" onRender={onRender}><V2About /></Profiler>
                </ErrorBoundary>
                <div className="metal-separator" />
                <ErrorBoundary sectionName="Experience">
                  <Profiler id="Experience" onRender={onRender}><V2Experience /></Profiler>
                </ErrorBoundary>
                <div className="metal-separator" />
                <ErrorBoundary sectionName="Skills">
                  <Profiler id="Skills" onRender={onRender}><V2Skills /></Profiler>
                </ErrorBoundary>
                <div className="metal-separator" />
                <ErrorBoundary sectionName="Projects">
                  <Profiler id="Projects" onRender={onRender}><V2Projects /></Profiler>
                </ErrorBoundary>
                <div className="metal-separator" />
                <ErrorBoundary sectionName="Education">
                  <Profiler id="Education" onRender={onRender}><V2Education /></Profiler>
                </ErrorBoundary>
                <div className="metal-separator" />
                <ErrorBoundary sectionName="Certifications">
                  <Profiler id="Certifications" onRender={onRender}><V2Certifications /></Profiler>
                </ErrorBoundary>
                <div className="metal-separator" />
                <ErrorBoundary sectionName="Languages">
                  <Profiler id="Languages" onRender={onRender}><V2Languages /></Profiler>
                </ErrorBoundary>
                <div className="metal-separator" />
                <ErrorBoundary sectionName="Interests">
                  <Profiler id="Interests" onRender={onRender}><V2Interests /></Profiler>
                </ErrorBoundary>
                <div className="metal-separator" />
                <ErrorBoundary sectionName="Photography">
                  <Profiler id="Photography" onRender={onRender}><V2Photography /></Profiler>
                </ErrorBoundary>
                <div className="metal-separator" />
                <ErrorBoundary sectionName="Contact">
                  <Profiler id="Contact" onRender={onRender}><V2Contact /></Profiler>
                </ErrorBoundary>
                <ErrorBoundary sectionName="Footer">
                  <Profiler id="Footer" onRender={onRender}><V2Footer /></Profiler>
                </ErrorBoundary>
              </Suspense>
            </ErrorBoundary>
          )}
        </div>
      </main>
    </div>
  );
}

export default function V2Portfolio() {
  return (
    <I18nextProvider i18n={v2i18n}>
      <V2PortfolioInner />
    </I18nextProvider>
  );
}
