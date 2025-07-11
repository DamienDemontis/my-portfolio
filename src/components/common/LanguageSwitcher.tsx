import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: 'en' | 'fr') => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
        <span className="text-xl">{i18n.language === 'fr' ? '🇫🇷' : '🇬🇧'}</span>
      </div>
      <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-200 rounded-box w-32">
        <li>
          <button 
            onClick={() => changeLanguage('en')} 
            className={`w-full text-left ${i18n.language === 'en' ? 'font-bold' : ''}`}
            aria-current={i18n.language === 'en'}
          >
            🇬🇧 English
          </button>
        </li>
        <li>
          <button 
            onClick={() => changeLanguage('fr')} 
            className={`w-full text-left ${i18n.language === 'fr' ? 'font-bold' : ''}`}
            aria-current={i18n.language === 'fr'}
          >
            🇫🇷 Français
          </button>
        </li>
      </ul>
    </div>
  );
};

export default LanguageSwitcher; 