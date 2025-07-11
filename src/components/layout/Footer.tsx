import { useTranslation } from 'react-i18next';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';
import ThemeToggle from '@/components/common/ThemeToggle';

const socialLinks = [
  { href: 'https://github.com/damiendemontis', icon: FaGithub, label: 'GitHub' },
  { href: 'https://linkedin.com/in/damien-demontis', icon: FaLinkedin, label: 'LinkedIn' },
  { href: 'mailto:damien.demontis@epitech.eu', icon: FaEnvelope, label: 'Email' },
];

const NAV_ITEMS = ["about", "experience", "projects", "skills", "education", "contact"];

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="footer footer-center p-10 bg-base-200 text-base-content rounded-t-lg">
      <nav className="grid grid-flow-col gap-4">
        {NAV_ITEMS.map(id => (
          <a key={id} href={`#${id}`} className="link link-hover capitalize">{t(`nav.${id}`)}</a>
        ))}
      </nav>
      <nav>
        <div className="grid grid-flow-col gap-4">
          {socialLinks.map(({ href, icon: Icon, label }) => (
            <a key={href} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="btn btn-ghost btn-circle">
              <Icon className="h-6 w-6" />
            </a>
          ))}
        </div>
      </nav>
      <aside>
        <div className="flex items-center gap-4 mb-4">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
        <p>{t('footer.copyright')}</p>
      </aside>
    </footer>
  );
};

export default Footer; 