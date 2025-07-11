import { useTheme } from '@/context/ThemeContext';
import { LuSun, LuMoon } from 'react-icons/lu';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <label className="swap swap-rotate btn btn-ghost btn-circle">
      <input 
        type="checkbox" 
        onChange={toggleTheme} 
        checked={theme === 'dark'}
        aria-label="Toggle theme"
      />
      <LuSun className="swap-on fill-current w-5 h-5" />
      <LuMoon className="swap-off fill-current w-5 h-5" />
    </label>
  );
};

export default ThemeToggle; 