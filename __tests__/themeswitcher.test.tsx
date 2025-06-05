import { render, screen, fireEvent } from '@testing-library/react';
import ThemeSwitcher from '../components/ThemeSwitcher';
import { ThemeProvider } from 'next-themes';

describe('ThemeSwitcher', () => {
  it('toggles theme', () => {
    render(
      <ThemeProvider attribute="class">
        <ThemeSwitcher />
      </ThemeProvider>
    );
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(button.textContent).not.toBe('🌙');
  });
});
