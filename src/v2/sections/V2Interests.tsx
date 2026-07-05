import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import MetalShaderTitle from '../components/MetalShaderTitle';
import MetalScrollReveal from '../components/MetalScrollReveal';
import DecryptedText from '../components/DecryptedText';
import { MusicPlayerProvider } from '../contexts/MusicPlayerContext';
import MusicCarousel from '../components/MusicCarousel';
import ScrollStack, { ScrollStackItem } from '../components/ScrollStack';

function SubtitleBar({ children }: { children: React.ReactNode }) {
  return (
    <h3
      className="mb-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#d0d0d0] font-heading"
      style={{ textShadow: '0 1px 0 rgba(0,0,0,0.8)' }}
    >
      <span aria-hidden className="h-px w-5" style={{ background: 'var(--metal-accent)' }} />
      {children}
    </h3>
  );
}

/**
 * YouTube facade: engraved-monochrome thumbnail + metal play button.
 * The real iframe (and its red/white chrome + third-party JS) loads only on
 * click, with autoplay so one click still starts the video.
 */
function YouTubeEmbed({ videoId, title }: { videoId: string; title: string }) {
  const [active, setActive] = useState(false);
  return (
    <div
      className="group/yt"
      style={{
        position: 'relative',
        paddingBottom: '56.25%',
        height: 0,
        overflow: 'hidden',
        borderRadius: 14,
        border: '1px solid rgba(255,255,255,0.06)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)',
        background: '#000',
      }}
    >
      {active ? (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&autoplay=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
        />
      ) : (
        <button
          onClick={() => setActive(true)}
          aria-label={`▶ ${title}`}
          className="absolute inset-0 h-full w-full cursor-pointer"
          style={{ padding: 0, border: 'none', background: 'none' }}
        >
          <img
            src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
            alt={title}
            loading="lazy"
            className="metal-project-img h-full w-full object-cover"
          />
          <span className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.65) 100%)' }} />
          <span
            className="absolute bottom-3 left-3 max-w-[80%] truncate text-left"
            style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.12em', color: '#c4c4c4' }}
          >
            {title}
          </span>
          <span
            className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center transition-transform duration-300 group-hover/yt:scale-110"
            style={{
              width: 58,
              height: 58,
              borderRadius: '50%',
              background: 'radial-gradient(circle at 35% 30%, #3a3a3a, #141414 70%)',
              border: '1px solid var(--metal-accent-dim)',
              boxShadow: '0 6px 18px rgba(0,0,0,0.6), 0 0 22px var(--metal-accent-glow)',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--metal-accent)" style={{ marginLeft: 3 }}>
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </span>
        </button>
      )}
    </div>
  );
}

/** Machined plate — same material language as the rest of the site.
 *  (accentColor kept for API compat; the plate is monochrome metal now.) */
function SectionCard({
  children,
}: {
  children: React.ReactNode;
  accentColor?: string;
}) {
  return (
    <div
      className="relative overflow-hidden p-5 sm:p-7 md:p-9"
      style={{
        background: 'linear-gradient(175deg, #1b1d21 0%, #101214 55%, #16181c 100%)',
        border: '1px solid rgba(255,255,255,0.09)',
        borderRadius: 6,
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.09), 0 16px 44px rgba(0,0,0,0.5)',
      }}
    >
      {/* Diagonal chrome sheen */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'linear-gradient(120deg, transparent 35%, rgba(255,255,255,0.04) 48%, transparent 62%)',
        }}
      />
      {/* Molten spine */}
      <div
        aria-hidden
        className="absolute left-0 top-3 bottom-3 w-[2px]"
        style={{ background: 'linear-gradient(180deg, var(--metal-accent), var(--metal-accent-dim))', opacity: 0.85 }}
      />
      {/* Corner rivets */}
      {[{ top: 8, right: 8 }, { bottom: 8, right: 8 }].map((pos, i) => (
        <span
          key={i}
          aria-hidden
          className="absolute"
          style={{
            ...pos,
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 35% 30%, #6a6a6a, #191919 75%)',
            boxShadow: '0 1px 2px rgba(0,0,0,0.8), inset 0 0.5px 0 rgba(255,255,255,0.25)',
          }}
        />
      ))}
      {children}
    </div>
  );
}

// ─── Card contents ───

function EcologyCard() {
  const { t } = useTranslation();
  return (
    <SectionCard accentColor="#0f1a14">
      <SubtitleBar>{t('interests.ecologySubtitle')}</SubtitleBar>
      <p className="text-sm sm:text-[16px] text-[#8a8a8a] font-body font-light leading-relaxed mb-6 sm:mb-10 max-w-xl italic">
        {t('interests.ecologyDescription')}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8">
        <div>
          <YouTubeEmbed videoId="IESYMFtLIis" title={t('interests.ecology.video1Title')} />
          <p className="text-[12px] sm:text-[13px] text-[#5a5a5a] font-body mt-2 sm:mt-3 tracking-wide">
            {t('interests.ecology.video1Caption')}
          </p>
        </div>
        <div className="hidden md:block">
          <YouTubeEmbed videoId="W93XyXHI8Nw" title={t('interests.ecology.video2Title')} />
          <p className="text-[12px] sm:text-[13px] text-[#5a5a5a] font-body mt-2 sm:mt-3 tracking-wide">
            {t('interests.ecology.video2Caption')}
          </p>
        </div>
      </div>
    </SectionCard>
  );
}

function TechTalksCard() {
  const { t } = useTranslation();
  return (
    <SectionCard accentColor="#0e1120">
      <SubtitleBar>{t('interests.talksSubtitle')}</SubtitleBar>
      <div className="flex flex-col md:flex-row gap-5 sm:gap-10 items-center">
        <div className="flex-1">
          <p className="text-sm sm:text-[16px] text-[#8a8a8a] font-body font-light leading-relaxed italic">
            {t('interests.talksDescription')}
          </p>
        </div>
        <div className="w-full max-w-[280px] md:w-[420px] md:max-w-none flex-shrink-0">
          <div
            style={{
              position: 'relative',
              borderRadius: 14,
              overflow: 'hidden',
              boxShadow: '0 12px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)',
            }}
          >
            <img
              src="/images/tech-talk.webp"
              alt={t('interests.talks.imageAlt')}
              loading="lazy"
              draggable={false}
              width={800}
              height={450}
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.35) 100%)',
                pointerEvents: 'none',
              }}
            />
          </div>
        </div>
      </div>
    </SectionCard>
  );
}

function TravelCard() {
  const { t } = useTranslation();
  return (
    <SectionCard accentColor="#171008">
      <SubtitleBar>{t('interests.travelSubtitle')}</SubtitleBar>
      <p className="text-sm sm:text-[16px] text-[#8a8a8a] font-body font-light leading-relaxed mb-6 sm:mb-10 max-w-xl italic">
        {t('interests.travelDescription')}
      </p>
      <div className="max-w-3xl">
        <YouTubeEmbed videoId="s0AG0_PY93I" title={t('interests.travel.videoTitle')} />
        <p className="text-[12px] sm:text-[13px] text-[#5a5a5a] font-body mt-2 sm:mt-3 tracking-wide">
          {t('interests.travel.videoCaption')}
        </p>
      </div>
    </SectionCard>
  );
}

// ─── Main section ───

export default function V2Interests() {
  const { t } = useTranslation();

  return (
    <section id="interests" className="metal-section">
      <div className="metal-section-inner">
        <MetalScrollReveal>
          <div className="text-center mb-16">
            <span className="block mb-4">
              <DecryptedText
                text={t('interests.number')}
                speed={60}
                className="text-[10px] uppercase tracking-[0.4em] text-[#6b6b6b] font-medium font-body"
              />
            </span>
            <MetalShaderTitle className="text-[clamp(4rem,12vw,12rem)] tracking-wide leading-none">
              {t('interests.title')}
            </MetalShaderTitle>
          </div>
        </MetalScrollReveal>
      </div>

      {/* Music carousel */}
      <MusicPlayerProvider>
        <MetalScrollReveal delay={0.1}>
          <div className="mb-20">
            <div className="metal-section-inner">
              <SubtitleBar>{t('interests.musicSubtitle')}</SubtitleBar>
            </div>
            <MusicCarousel />
          </div>
        </MetalScrollReveal>
      </MusicPlayerProvider>

      {/* Beyond Music — scroll stack cards */}
      <div className="metal-section-inner">
        <MetalScrollReveal delay={0.15}>
          <SubtitleBar>{t('interests.beyondMusicSubtitle')}</SubtitleBar>
        </MetalScrollReveal>
      </div>

      <div className="metal-section-inner px-4 sm:px-6" style={{ maxWidth: 900, margin: '0 auto' }}>
        <ScrollStack
          itemDistance={60}
          itemScale={0.04}
          itemStackDistance={20}
          stackPosition="8%"
          baseScale={0.9}
          rotationAmount={1}
          blurAmount={2}
        >
          <ScrollStackItem>
            <EcologyCard />
          </ScrollStackItem>
          <ScrollStackItem>
            <TechTalksCard />
          </ScrollStackItem>
          <ScrollStackItem>
            <TravelCard />
          </ScrollStackItem>
        </ScrollStack>
      </div>
    </section>
  );
}
