import React from 'react';

export type FlagCode = 'FR' | 'GB' | 'IT' | 'KR';

const FLAGS: Record<FlagCode, React.ReactNode> = {
  GB: (
    <svg width="22" height="16" viewBox="0 0 640 480" aria-hidden="true">
      <path fill="#012169" d="M0 0h640v480H0z" />
      <path
        fill="#FFF"
        d="m75 0 244 181L562 0h78v62L400 241l240 178v61h-80L320 301 81 480H0v-60l239-178L0 64V0z"
      />
      <path
        fill="#C8102E"
        d="m424 281 216 159v40L369 281zm-184 20 6 35L54 480H0zM640 0v3L391 191l2-44L590 0zM0 0l239 176h-60L0 42z"
      />
      <path fill="#FFF" d="M241 0v480h160V0zM0 160v160h640V160z" />
      <path fill="#C8102E" d="M0 193v96h640v-96zM273 0v480h96V0z" />
    </svg>
  ),
  FR: (
    <svg width="22" height="16" viewBox="0 0 640 480" aria-hidden="true">
      <path fill="#000091" d="M0 0h213.3v480H0z" />
      <path fill="#fff" d="M213.3 0h213.4v480H213.3z" />
      <path fill="#e1000f" d="M426.7 0H640v480H426.7z" />
    </svg>
  ),
  IT: (
    <svg width="22" height="16" viewBox="0 0 640 480" aria-hidden="true">
      <path fill="#009246" d="M0 0h213.3v480H0z" />
      <path fill="#fff" d="M213.3 0h213.4v480H213.3z" />
      <path fill="#ce2b37" d="M426.7 0H640v480H426.7z" />
    </svg>
  ),
  KR: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width="22"
      height="16"
      viewBox="0 0 640 480"
      aria-hidden="true"
    >
      <defs>
        <clipPath id="kr-a">
          <path fillOpacity=".7" d="M-95.8-.4h682.7v512H-95.8z" />
        </clipPath>
      </defs>
      <g fillRule="evenodd" clipPath="url(#kr-a)" transform="translate(89.8 .4)scale(.9375)">
        <path fill="#fff" d="M-95.8-.4H587v512H-95.8Z" />
        <g transform="rotate(-56.3 361.6 -101.3)scale(10.66667)">
          <g id="kr-c">
            <path id="kr-b" fill="#000001" d="M-6-26H6v2H-6Zm0 3H6v2H-6Zm0 3H6v2H-6Z" />
            <use xlinkHref="#kr-b" width="100%" height="100%" y="44" />
          </g>
          <path stroke="#fff" d="M0 17v10" />
          <path fill="#cd2e3a" d="M0-12a12 12 0 0 1 0 24Z" />
          <path fill="#0047a0" d="M0-12a12 12 0 0 0 0 24A6 6 0 0 0 0 0Z" />
          <circle cy="-6" r="6" fill="#cd2e3a" />
        </g>
        <g transform="rotate(-123.7 191.2 62.2)scale(10.66667)">
          <use xlinkHref="#kr-c" width="100%" height="100%" />
          <path stroke="#fff" d="M0-23.5v3M0 17v3.5m0 3v3" />
        </g>
      </g>
    </svg>
  ),
};

export function FlagSVG({ code }: { code: string }) {
  const svg = FLAGS[code as FlagCode];
  if (!svg) return null;
  return <>{svg}</>;
}

export default FLAGS;
