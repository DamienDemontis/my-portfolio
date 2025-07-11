import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useScrollSpy } from '@/hooks/useScrollSpy';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';
import ThemeToggle from '@/components/common/ThemeToggle';
import { HiBars3, HiXMark } from "react-icons/hi2";
import { motion } from 'framer-motion';

const NAV_ITEMS = ["about", "experience", "projects", "skills", "education", "contact"];

const Navbar = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const activeId = useScrollSpy(NAV_ITEMS, { rootMargin: '0% 0% -80% 0%' });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const NavLink = ({ id }: { id: string }) => (
    <li>
      <a
        href={`#${id}`}
        onClick={() => setIsOpen(false)}
        className={`capitalize transition-colors duration-300 ${activeId === id ? 'text-primary font-semibold' : 'hover:text-primary'}`}
      >
        {t(`nav.${id}`)}
      </a>
    </li>
  );

  return (
    <motion.header 
      className={`sticky top-0 z-50 transition-shadow duration-300 ${isScrolled ? 'shadow-lg bg-base-100/80 backdrop-blur-sm' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="navbar container mx-auto">
        <div className="navbar-start">
          <a href="#hero" className="btn btn-ghost text-xl font-display font-bold">
            D.D.
          </a>
        </div>

        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 space-x-2">
            {NAV_ITEMS.map((id) => <NavLink key={id} id={id} />)}
          </ul>
        </div>

        <div className="navbar-end">
          <LanguageSwitcher />
          <ThemeToggle />
          <div className="dropdown dropdown-end lg:hidden">
            <label tabIndex={0} className="btn btn-ghost lg:hidden" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <HiXMark className="h-6 w-6" /> : <HiBars3 className="h-6 w-6" />}
            </label>
            {isOpen && (
              <ul tabIndex={0} className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-200 rounded-box w-52">
                {NAV_ITEMS.map((id) => <NavLink key={id} id={id} />)}
              </ul>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Navbar; 