// Debug utilities for performance testing

/**
 * Global animation toggle for debugging
 */
let DISABLE_ANIMATIONS = false;

export const setAnimationsEnabled = (enabled: boolean) => {
  DISABLE_ANIMATIONS = !enabled;
  
  // Add/remove CSS that disables all animations
  const styleId = 'debug-disable-animations';
  let style = document.getElementById(styleId);
  
  if (!enabled) {
    if (!style) {
      style = document.createElement('style');
      style.id = styleId;
      style.innerHTML = `
        *, *::before, *::after {
          animation-duration: 0.01ms !important;
          animation-delay: 0ms !important;
          transition-duration: 0.01ms !important;
          transition-delay: 0ms !important;
          scroll-behavior: auto !important;
        }
      `;
      document.head.appendChild(style);
    }
  } else {
    if (style) {
      style.remove();
    }
  }
  
  console.log(`🎭 Animations ${enabled ? 'enabled' : 'disabled'}`);
};

export const getAnimationsEnabled = () => !DISABLE_ANIMATIONS;

/**
 * Force reduced motion for testing
 */
export const forceReducedMotion = (force: boolean) => {
  const mediaQuery = '(prefers-reduced-motion: reduce)';
  
  if (force) {
    // Override the media query
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: (query: string) => ({
        matches: query === mediaQuery,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => true,
      }),
    });
  } else {
    // Restore original matchMedia (refresh required)
    location.reload();
  }
  
  console.log(`🎭 Reduced motion ${force ? 'forced' : 'restored'}`);
};

/**
 * Add debug controls to the page
 */
export const addDebugControls = () => {
  if (document.getElementById('debug-controls')) return; // Already added
  
  const controls = document.createElement('div');
  controls.id = 'debug-controls';
  controls.style.cssText = `
    position: fixed;
    top: 8px;
    right: 320px;
    z-index: 99998;
    background: rgba(0,0,0,0.8);
    color: white;
    padding: 12px;
    border-radius: 8px;
    font: 12px monospace;
    display: flex;
    flex-direction: column;
    gap: 6px;
  `;
  
  const title = document.createElement('div');
  title.textContent = '🐛 Debug Controls';
  title.style.cssText = 'font-weight: bold; margin-bottom: 6px;';
  controls.appendChild(title);
  
  // Animation toggle
  const animToggle = document.createElement('button');
  animToggle.textContent = '🎭 Disable Animations';
  animToggle.style.cssText = `
    padding: 4px 8px;
    font-size: 11px;
    background: #dc2626;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  `;
  
  let animationsEnabled = true;
  animToggle.onclick = () => {
    animationsEnabled = !animationsEnabled;
    setAnimationsEnabled(animationsEnabled);
    animToggle.textContent = animationsEnabled ? '🎭 Disable Animations' : '🎭 Enable Animations';
    animToggle.style.background = animationsEnabled ? '#dc2626' : '#059669';
  };
  controls.appendChild(animToggle);
  
  // Reduced motion toggle
  const motionToggle = document.createElement('button');
  motionToggle.textContent = '🎭 Force Reduced Motion';
  motionToggle.style.cssText = `
    padding: 4px 8px;
    font-size: 11px;
    background: #2563eb;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  `;
  
  motionToggle.onclick = () => {
    forceReducedMotion(true);
  };
  controls.appendChild(motionToggle);
  
  // Add URL parameters for quick testing
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('noAnimations') === '1') {
    setAnimationsEnabled(false);
    animToggle.textContent = '🎭 Enable Animations';
    animToggle.style.background = '#059669';
  }
  
  if (urlParams.get('reducedMotion') === '1') {
    forceReducedMotion(true);
  }
  
  document.body.appendChild(controls);
};

// Auto-add debug controls in development
if (process.env.NODE_ENV === 'development') {
  // Add controls after a short delay to ensure DOM is ready
  setTimeout(addDebugControls, 1000);
}