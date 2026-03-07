import { useTranslation } from 'react-i18next';
import MetalDivider from '../components/MetalDivider';

export default function V2Footer() {
  const { t } = useTranslation();
  return (
    <footer className="px-6 pb-8">
      <MetalDivider variant="gradient" className="mb-8" />
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#6b6b6b] font-medium font-body">
          {t('footer.copyright')} &mdash; 2025
        </span>
        <div className="flex items-center gap-6">
          <a
            href="https://www.linkedin.com/in/damien-demontis/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="text-[10px] uppercase tracking-[0.15em] text-[#6b6b6b] hover:text-white transition-colors"
          >
            LinkedIn
          </a>
          <a
            href="https://github.com/damiendemontis"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="text-[10px] uppercase tracking-[0.15em] text-[#6b6b6b] hover:text-white transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://www.instagram.com/damien.demontis/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="text-[10px] uppercase tracking-[0.15em] text-[#6b6b6b] hover:text-white transition-colors"
          >
            Instagram
          </a>
        </div>
        <span className="text-[9px] uppercase tracking-[0.2em] text-[#555]">
          {t('footer.tagline')}
        </span>
      </div>
    </footer>
  );
}
