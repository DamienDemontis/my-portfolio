import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import MetalScrollReveal from '../components/MetalScrollReveal';
import MetalShaderTitle from '../components/MetalShaderTitle';
import DecryptedText from '../components/DecryptedText';
import DomeGallery from '../components/DomeGallery';

const photoSrcs = [
  '/photography/IMG_20240701_151842.webp',
  '/photography/IMG_20231006_110254.webp',
  '/photography/IMG_20231117_160650.webp',
  '/photography/IMG_20230820_063353.webp',
  '/photography/IMG_20231004_104055.webp',
  '/photography/IMG_20231107_155400.webp',
  '/photography/IMG_20231107_164957.webp',
  '/photography/IMG_20240111_184858.webp',
  '/photography/IMG_20240116_170340.webp',
  '/photography/IMG_20240503_183702.webp',
  '/photography/IMG_20240504_110543.webp',
  '/photography/IMG_20240504_120923_1.webp',
  '/photography/IMG_20240505_120320.webp',
  '/photography/IMG_20240505_142203.webp',
  '/photography/IMG_20240602_034858.webp',
  '/photography/IMG_20240630_203416.webp',
  '/photography/IMG_20240701_150338.webp',
  '/photography/IMG_20240701_200211.webp',
  '/photography/IMG_20240822_170729.webp',
  '/photography/IMG_20240403_130655.webp',
  '/photography/IMG_20240419_184403.webp',
  '/photography/IMG_20240504_110833.webp',
  '/photography/IMG_20240504_114735.webp',
  '/photography/IMG_20240531_232815.webp',
  '/photography/IMG_20240626_184532.webp',
  '/photography/IMG_20240630_181716.webp',
];

export default function V2Photography() {
  const { t } = useTranslation();

  const photos = useMemo(() => {
    const captions = t('photography.photos', { returnObjects: true }) as { alt: string; caption: string }[];
    return photoSrcs.map((src, i) => ({
      src,
      alt: captions[i]?.alt ?? '',
      caption: captions[i]?.caption ?? '',
    }));
  }, [t]);

  return (
    <section id="photography">
      <MetalScrollReveal>
        <div className="text-center pt-24 pb-8 px-4">
          <span className="block mb-4"><DecryptedText text={t('photography.number')} speed={60} className="text-[10px] uppercase tracking-[0.4em] text-[#6b6b6b] font-medium font-body" /></span>
          <MetalShaderTitle className="text-[clamp(4rem,12vw,12rem)] tracking-wide leading-none">{t('photography.title')}</MetalShaderTitle>
          <p className="mt-4 text-sm text-[#8a8a8a] tracking-wide font-light max-w-lg mx-auto">
            {t('photography.subtitle')}
          </p>
        </div>
      </MetalScrollReveal>

      <div style={{ height: '100dvh', position: 'relative', contentVisibility: 'auto', containIntrinsicSize: 'auto 100dvh' } as React.CSSProperties}>
        <DomeGallery
          images={photos}
          overlayBlurColor="#000000"
          imageBorderRadius="24px"
          openedImageBorderRadius="24px"
          segments={45}
          chromaRadius={280}
          chromaDamping={0.4}
        />
      </div>
    </section>
  );
}
