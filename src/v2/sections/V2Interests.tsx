import { useTranslation } from 'react-i18next';
import MetalShaderTitle from '../components/MetalShaderTitle';
import MetalScrollReveal from '../components/MetalScrollReveal';
import DecryptedText from '../components/DecryptedText';
import { MusicPlayerProvider } from '../contexts/MusicPlayerContext';
import MusicCarousel from '../components/MusicCarousel';
import ScrollStack, { ScrollStackItem } from '../components/ScrollStack';

function SubtitleBar({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xs uppercase tracking-[0.2em] text-[#8a8a8a] font-heading font-semibold mb-6 flex items-center gap-3">
      <span className="w-3 h-px bg-[rgba(255,255,255,0.15)]" />
      {children}
    </h3>
  );
}

function YouTubeEmbed({ videoId, title }: { videoId: string; title: string }) {
  return (
    <div
      style={{
        position: 'relative',
        paddingBottom: '56.25%',
        height: 0,
        overflow: 'hidden',
        borderRadius: 14,
        border: '1px solid rgba(255,255,255,0.06)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)',
      }}
    >
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          border: 'none',
        }}
      />
    </div>
  );
}

function SectionCard({
  children,
  accentColor = 'rgba(255,255,255,0.02)',
}: {
  children: React.ReactNode;
  accentColor?: string;
}) {
  return (
    <div
      className="p-5 sm:p-7 md:p-9"
      style={{
        background: `linear-gradient(135deg, ${accentColor}, #0a0a0a)`,
        border: '1px solid rgba(255,255,255,0.04)',
        borderRadius: 20,
        boxShadow: '0 8px 40px rgba(0,0,0,0.35)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle top edge highlight */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '10%',
          right: '10%',
          height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)',
        }}
      />
      {children}
    </div>
  );
}

// ─── Card contents ───

function EcologyCard() {
  const { t } = useTranslation();
  return (
    <SectionCard accentColor="#0f1a14">
      <SubtitleBar>{t('interests.ecologySubtitle', 'Ecology & Collapse')}</SubtitleBar>
      <p className="text-sm sm:text-[16px] text-[#8a8a8a] font-body font-light leading-relaxed mb-6 sm:mb-10 max-w-xl italic">
        {t('interests.ecologyDescription', 'What happens when civilizations push past planetary boundaries? These talks shaped how I think about our future.')}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8">
        <div>
          <YouTubeEmbed videoId="IESYMFtLIis" title="Jared Diamond — Why do societies collapse?" />
          <p className="text-[12px] sm:text-[13px] text-[#5a5a5a] font-body mt-2 sm:mt-3 tracking-wide">
            Jared Diamond — Why do societies collapse?
          </p>
        </div>
        <div className="hidden md:block">
          <YouTubeEmbed videoId="W93XyXHI8Nw" title="Is Civilization on the Brink of Collapse?" />
          <p className="text-[12px] sm:text-[13px] text-[#5a5a5a] font-body mt-2 sm:mt-3 tracking-wide">
            Kurzgesagt — Is Civilization on the Brink of Collapse?
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
      <SubtitleBar>{t('interests.talksSubtitle', 'Tech Talks')}</SubtitleBar>
      <div className="flex flex-col md:flex-row gap-5 sm:gap-10 items-center">
        <div className="flex-1">
          <p className="text-sm sm:text-[16px] text-[#8a8a8a] font-body font-light leading-relaxed italic">
            {t('interests.talksDescription', 'I regularly give talks at Epitech on a wide range of subjects — from deep technical topics and new technology introductions to video game history and culture. Speaking about what fascinates me is one of the best ways I know to learn deeper and share that spark with others.')}
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
              alt="Giving a tech talk at Epitech"
              loading="lazy"
              draggable={false}
              style={{ width: '100%', display: 'block' }}
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
      <SubtitleBar>{t('interests.travelSubtitle', 'Adventures Abroad')}</SubtitleBar>
      <p className="text-sm sm:text-[16px] text-[#8a8a8a] font-body font-light leading-relaxed mb-6 sm:mb-10 max-w-xl italic">
        {t('interests.travelDescription', 'As an Epitech Ambassador, I spent a year on exchange at Keimyung University in Daegu, South Korea. An experience that reshaped my worldview.')}
      </p>
      <div className="max-w-3xl">
        <YouTubeEmbed videoId="s0AG0_PY93I" title="Exchange year in South Korea — Epitech Ambassador" />
        <p className="text-[12px] sm:text-[13px] text-[#5a5a5a] font-body mt-2 sm:mt-3 tracking-wide">
          My year in South Korea — Epitech Ambassador
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
              <SubtitleBar>{t('interests.musicSubtitle', 'Absolute Nonsense Musical Taste')}</SubtitleBar>
            </div>
            <MusicCarousel />
          </div>
        </MetalScrollReveal>
      </MusicPlayerProvider>

      {/* Beyond Music — scroll stack cards */}
      <div className="metal-section-inner">
        <MetalScrollReveal delay={0.15}>
          <SubtitleBar>{t('interests.beyondMusicSubtitle', 'Other')}</SubtitleBar>
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
