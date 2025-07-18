/**
 * Flag emoji detector and fallback utility
 * Detects if flag emojis are supported and provides fallbacks for Windows
 */

// Test if flag emojis are properly supported
export function supportsCountryFlagEmojis(): boolean {
  // Create a canvas to test emoji rendering
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) return false;
  
  // Set canvas size
  canvas.width = 20;
  canvas.height = 20;
  
  // Try to render a flag emoji (France)
  ctx.textBaseline = 'top';
  ctx.font = '18px Arial';
  ctx.fillText('🇫🇷', 0, 0);
  
  // Get the image data
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  
  // Check if any pixels were rendered (if flag emoji is supported, pixels will be non-zero)
  for (let i = 0; i < data.length; i += 4) {
    if (data[i] !== 0 || data[i + 1] !== 0 || data[i + 2] !== 0) {
      return true;
    }
  }
  
  return false;
}

// Check if we're on Windows
export function isWindows(): boolean {
  return /Win/.test(navigator.platform) || /Win/.test(navigator.userAgent);
}

// Map country codes to flag emoji
export function getFlagEmoji(countryCode: string): string {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

// Get high-resolution flag image URL (SVG for scalability)
export function getFlagImageUrl(countryCode: string): string {
  // Use flagcdn.com with higher resolution - 256x192 PNG for crisp display
  return `https://flagcdn.com/256x192/${countryCode.toLowerCase()}.png`;
}

// Alternative high-resolution source
export function getFlagImageUrlAlt(countryCode: string): string {
  // Use flagpedia.net as fallback - provides high-quality SVG flags
  return `https://flagpedia.net/data/flags/w580/${countryCode.toLowerCase()}.png`;
}

// Third fallback option - REST Countries API
export function getFlagImageUrlThird(countryCode: string): string {
  // Use flagcdn.com with even higher resolution as final fallback
  return `https://flagcdn.com/w320/${countryCode.toLowerCase()}.png`;
}

// Check if flag emoji support is working
let flagEmojiSupport: boolean | null = null;

export function checkFlagEmojiSupport(): boolean {
  if (flagEmojiSupport === null) {
    flagEmojiSupport = supportsCountryFlagEmojis();
  }
  return flagEmojiSupport;
}

// Get appropriate flag representation with high-quality fallbacks
export function getFlag(countryCode: string): { 
  type: 'emoji' | 'image'; 
  content: string; 
  alt: string; 
  fallbacks: string[];
} {
  const alt = `${countryCode.toUpperCase()} flag`;
  
  if (checkFlagEmojiSupport()) {
    return {
      type: 'emoji',
      content: getFlagEmoji(countryCode),
      alt,
      fallbacks: []
    };
  } else {
    return {
      type: 'image',
      content: getFlagImageUrl(countryCode),
      alt,
      fallbacks: [
        getFlagImageUrlAlt(countryCode),
        getFlagImageUrlThird(countryCode)
      ]
    };
  }
} 