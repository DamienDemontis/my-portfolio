import { useTranslation } from 'react-i18next';
import { syncLangUrl } from '../core/lang';
import FLAGS from './flags';

const LANG_TO_FLAG = { en: 'GB', fr: 'FR', ko: 'KR' } as const;

/** Corner language switcher (desktop) — flags, monochrome until active/hover. */
export default function MetalLangPill() {
  const { t, i18n } = useTranslation();

  return (
    <div
      className="fixed top-4 right-4 z-50 hidden items-center md:top-6 md:right-6 md:flex"
      style={{
        background: 'rgba(8,8,8,0.55)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 4,
        backdropFilter: 'blur(12px)',
        padding: '3px 4px',
        gap: 3,
      }}
      role="group"
      aria-label={t('nav.languageGroup')}
    >
      {(['en', 'fr', 'ko'] as const).map((lang) => {
        const isActive = i18n.language === lang;
        return (
          <button
            key={lang}
            onClick={() => {
              i18n.changeLanguage(lang);
              syncLangUrl(lang);
            }}
            aria-pressed={isActive}
            aria-label={t('nav.switchTo', { language: t(`nav.languageNames.${lang}`) })}
            title={t(`nav.languageNames.${lang}`)}
            className="metal-lang-flag cursor-pointer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 26,
              height: 18,
              padding: 0,
              borderRadius: 2,
              border: isActive ? '1px solid rgba(255,255,255,0.35)' : '1px solid transparent',
              background: 'transparent',
              overflow: 'hidden',
              filter: isActive
                ? 'grayscale(0.15) brightness(1) contrast(1.05)'
                : 'grayscale(1) brightness(0.5) contrast(1.1)',
              transition: 'filter 200ms ease, border-color 200ms ease',
            }}
          >
            {FLAGS[LANG_TO_FLAG[lang]]}
          </button>
        );
      })}
    </div>
  );
}
