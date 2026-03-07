import { useState, useCallback } from 'react';
import { I18nextProvider } from 'react-i18next';
import v2i18n from './i18n/config';
import './core/metal-theme.css';

import MetalCursor from './components/MetalCursor';
import MetalLoadingScreen from './components/MetalLoadingScreen';
import MetalNavbar from './components/MetalNavbar';

import V2Hero from './sections/V2Hero';
import V2About from './sections/V2About';
import V2Experience from './sections/V2Experience';
import V2Skills from './sections/V2Skills';
import V2Projects from './sections/V2Projects';
import V2Education from './sections/V2Education';
import V2Certifications from './sections/V2Certifications';
import V2Languages from './sections/V2Languages';
import V2Interests from './sections/V2Interests';
import V2Photography from './sections/V2Photography';
import V2Contact from './sections/V2Contact';
import V2Footer from './sections/V2Footer';

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

  const handleLoadingComplete = useCallback(() => {
    setLoaded(true);
  }, []);

  return (
    <I18nextProvider i18n={v2i18n}>
      <div className="metal-page metal-scrollbar metal-noise-overlay metal-vignette">
        <MetalCursor />

        {!loaded && <MetalLoadingScreen onComplete={handleLoadingComplete} duration={2200} />}

        {loaded && (
          <>
            <MetalNavbar items={navItems} logo="DD" />
            <main>
              <V2Hero />
              <div className="metal-separator" />
              <V2About />
              <div className="metal-separator" />
              <V2Experience />
              <div className="metal-separator" />
              <V2Skills />
              <div className="metal-separator" />
              <V2Projects />
              <div className="metal-separator" />
              <V2Education />
              <div className="metal-separator" />
              <V2Certifications />
              <div className="metal-separator" />
              <V2Languages />
              <div className="metal-separator" />
              <V2Interests />
              <div className="metal-separator" />
              <V2Photography />
              <div className="metal-separator" />
              <V2Contact />
              <V2Footer />
            </main>
          </>
        )}
      </div>
    </I18nextProvider>
  );
}
