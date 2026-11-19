// Projets de la salle de projection. Les textes vivent dans i18n (home.projects.items.<id>.*) ;
// la couleur des projets à image vient du manifeste généré par `npm run projects`.
import projectMedia from './projectMedia.json'

const image = (id) => ({ kind: 'image', src: projectMedia[id].src, color: projectMedia[id].color })

export const PROJECTS = [
  {
    id: 'esante',
    media: { kind: 'title', glyph: 'ecg', color: '#5fd3c6' },
    stack: ['Vue 3', 'TypeScript', 'Node.js', 'Fastify', 'MongoDB', 'WebSocket', 'Playwright'],
    links: [],
  },
  {
    id: 'jobneko',
    media: { kind: 'title', glyph: 'cat', color: '#f2b33d' },
    stack: ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL', 'OpenAI API'],
    links: [],
  },
  {
    id: 'leonart',
    media: image('leonart'),
    stack: ['Node.js', 'TypeScript', 'Express', 'MongoDB', 'React Native', 'Stripe', 'GCP'],
    links: [{ kind: 'source', href: 'https://github.com/Leon-Art-EIP' }],
  },
  {
    id: 'wiitanks',
    media: image('wiitanks'),
    stack: ['Unity', 'C#', 'WebGL'],
    links: [
      { kind: 'play', href: '/games/wii-tanks/index.html' },
      { kind: 'video', href: 'https://youtu.be/jWfFh3oCJ2I' },
      { kind: 'source', href: 'https://github.com/Shorssaud/Wii_Tanks_Remastered' },
    ],
  },
  {
    id: 'presence',
    media: image('presence'),
    stack: ['Python', 'PyTorch', 'OpenCV', 'PyQt6', 'Firestore'],
    links: [{ kind: 'source', href: 'https://github.com/DamienDemontis/proto-1-pr-smart' }],
  },
  {
    id: 'msc',
    media: image('msc'),
    stack: ['Jekyll', 'HTML', 'CSS', 'JavaScript'],
    links: [{ kind: 'demo', href: 'https://decouverte-pmsc.vercel.app/' }],
  },
]
