import { setRequestLocale } from 'next-intl/server';
import { FakeChat } from '../../components/FakeChat';
import { RealChatButton } from '../../components/RealChatButton';
import { ThemeSwitcher } from '../../components/ThemeSwitcher';
import { LanguageSwitcher } from '../../components/LanguageSwitcher';

type Props = {
  params: { locale: string };
};

export default function HomePage({ params: { locale } }: Props) {
  // Enable static rendering
  setRequestLocale(locale);

  return (
    <main className="min-h-screen bg-background">
      {/* Header with controls */}
      <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center justify-between px-4">
          <h1 className="text-lg font-semibold">Damien Demontis</h1>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeSwitcher />
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <FakeChat />
      </div>

      {/* Real Chat Button */}
      <RealChatButton />
    </main>
  );
} 