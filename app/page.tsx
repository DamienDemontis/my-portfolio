import FakeChat from '@/components/FakeChat';
import ThemeSwitcher from '@/components/ThemeSwitcher';

export default function Page() {
  return (
    <main className="p-4 grid place-items-center min-h-screen">
      <ThemeSwitcher />
      <FakeChat messages={["Qui est Damien Demontis ?", "Développeur full-stack, passionné par l'Asie."]} />
    </main>
  );
}
