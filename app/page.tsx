import FakeChat from '@/components/FakeChat';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import ExperienceList from '@/components/ExperienceList';
import ProjectList from '@/components/ProjectList';
import VideoList from '@/components/VideoList';

export default function Page() {
  const messages = [
    'Qui est Damien Demontis ?',
    "Développeur full-stack passionné par l'Asie, étudiant à Epitech.",
    'Voici quelques expériences et projets.',
  ];
  return (
    <main className="p-4 space-y-8 max-w-3xl mx-auto">
      <ThemeSwitcher />
      <FakeChat messages={messages} />
      <section>
        <h2 className="text-xl font-bold mt-4">Expériences</h2>
        <ExperienceList />
      </section>
      <section>
        <h2 className="text-xl font-bold mt-4">Projets</h2>
        <ProjectList />
      </section>
      <section>
        <h2 className="text-xl font-bold mt-4">Vidéos</h2>
        <VideoList />
      </section>
    </main>
  );
}
