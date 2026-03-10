import { useTranslation } from 'react-i18next';
import MetalScrollReveal from '../components/MetalScrollReveal';
import MetalShaderTitle from '../components/MetalShaderTitle';
import DecryptedText from '../components/DecryptedText';
import DomeGallery from '../components/DomeGallery';

const photos = [
  { src: '/photography/IMG_20240701_151842.jpg', alt: 'Seoul, South Korea', caption: 'A good meal in the heart of Seoul' },
  { src: '/photography/IMG_20231006_110254.jpg', alt: 'Gyeongju, South Korea', caption: 'Autumn colors in the university campus' },
  { src: '/photography/IMG_20231117_160650.jpg', alt: 'Daegu, South Korea', caption: 'trees in the university campus' },
  { src: '/photography/IMG_20230820_063353.jpg', alt: 'Keimyung University, South Korea', caption: 'Entrance of the university' },
  { src: '/photography/IMG_20231004_104055.jpg', alt: 'KMU, South Korea', caption: 'Taekwondo class' },
  { src: '/photography/IMG_20231107_155400.jpg', alt: 'KMU, South Korea', caption: 'University church' },
  { src: '/photography/IMG_20231107_164957.jpg', alt: 'KMU, South Korea', caption: 'University church' },
  { src: '/photography/IMG_20240111_184858.jpg', alt: 'Kyoto, Japan', caption: 'Animal Rescue Coffee shop' },
  { src: '/photography/IMG_20240116_170340.jpg', alt: 'Kyoto, South Korea', caption: 'Mermaid statue' },
  { src: '/photography/IMG_20240503_183702.jpg', alt: 'Seoul, South Korea', caption: 'Stroll (feat: the sun)' },
  { src: '/photography/IMG_20240504_110543.jpg', alt: 'Seoul, South Korea', caption: 'Seoul sightseeing' },
  { src: '/photography/IMG_20240504_120923_1.jpg', alt: 'Seoul, South Korea', caption: 'Traditional korean Hanbok' },
  { src: '/photography/IMG_20240505_120320.jpg', alt: 'Seoul, South Korea', caption: 'Lotte World' },
  { src: '/photography/IMG_20240505_142203.jpg', alt: 'Seoul, South Korea', caption: 'mmmmmh barbapapa' },
  { src: '/photography/IMG_20240602_034858.jpg', alt: 'Seoul, South Korea', caption: 'International friends' },
  { src: '/photography/IMG_20240630_203416.jpg', alt: 'Seoul, South Korea', caption: 'Summer night and han river' },
  { src: '/photography/IMG_20240701_150338.jpg', alt: 'Seoul, South Korea', caption: 'Library or Mall ? No one knows' },
  { src: '/photography/IMG_20240701_200211.jpg', alt: 'Seoul, South Korea', caption: 'Traditional Korean Street' },
  { src: '/photography/IMG_20240822_170729.jpg', alt: 'KMU, Daegu, South Korea', caption: 'Keimyung main building' },
  { src: '/photography/IMG_20240403_130655.jpg', alt: 'Daegu, South Korea', caption: 'Spring awakening (feat: the rain)' },
  { src: '/photography/IMG_20240419_184403.jpg', alt: 'Seoul, South Korea', caption: 'Korean Flag' },
  { src: '/photography/IMG_20240504_110833.jpg', alt: 'Gyeongju, South Korea', caption: 'Historical sites in spring bloom' },
  { src: '/photography/IMG_20240504_114735.jpg', alt: 'Seoul, South Korea', caption: 'Gardens and tranquility' },
  { src: '/photography/IMG_20240531_232815.jpg', alt: 'Seoul, South Korea', caption: 'Those umbrella are not pointing the right way' },
  { src: '/photography/IMG_20240626_184532.jpg', alt: 'Near Seoul, South Korea', caption: 'Meal with international student association' },
  { src: '/photography/IMG_20240630_181716.jpg', alt: 'Seoul, South Korea', caption: 'One last Picnic with friends' },
];

export default function V2Photography() {
  const { t } = useTranslation();

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

      <div style={{ height: '100vh', position: 'relative', contentVisibility: 'auto', containIntrinsicSize: 'auto 100vh' } as React.CSSProperties}>
        <DomeGallery
          images={photos}
          overlayBlurColor="#000000"
          imageBorderRadius="4px"
          openedImageBorderRadius="4px"
          chromaRadius={280}
          chromaDamping={0.4}
        />
      </div>
    </section>
  );
}
