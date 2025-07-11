export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  technologies: string[];
  category: 'web' | 'mobile' | 'ai' | 'game' | 'tool';
  status: 'completed' | 'in-progress' | 'planning';
  startDate: string;
  endDate?: string;
  image?: string;
  links: {
    github?: string;
    demo?: string;
    video?: string;
    website?: string;
  };
  highlights: string[];
  role: string;
  teamSize?: number;
}

export const projects: Project[] = [
  {
    id: 'leonart',
    title: "Leon'Art",
    description: "Plateforme mobile et web d'achat/vente d'art entre particuliers avec fonctionnalités sociales avancées",
    longDescription: `Leon'Art est un projet de startup étudiante développé dans le cadre de mon projet de fin d'études (EIP) à Epitech. Cette plateforme révolutionnaire permet aux amateurs d'art d'acheter et de vendre des œuvres entre particuliers, tout en créant une véritable communauté autour de l'art.

L'application propose un algorithme de recommandation personnalisé, un système de messagerie intégré, la gestion de collections privées, et un processus de paiement sécurisé avec Stripe. Disponible sur iOS, Android et web, Leon'Art représente l'avenir du marché de l'art numérique.`,
    technologies: ['Node.js', 'MongoDB', 'Mongoose', 'Swagger', 'Stripe', 'Firebase', 'Firestore', 'React Native', 'Express.js'],
    category: 'mobile',
    status: 'completed',
    startDate: '2023-09',
    endDate: '2024-07',
    image: '/images/projects/leonart.jpg',
    links: {
      website: 'https://www.leon-arts.fr/',
      demo: 'https://www.leon-arts.fr/'
    },
    highlights: [
      'Algorithme de recommandation personnalisé basé sur les préférences utilisateur',
      'Système de paiement sécurisé intégré avec Stripe',
      'Messagerie en temps réel pour faciliter les échanges',
      'Gestion de collections personnelles et favoris',
      'Interface responsive compatible mobile et desktop',
      'Architecture scalable pour supporter la croissance'
    ],
    role: 'Project Manager & Back-end Developer',
    teamSize: 6
  },
  {
    id: 'facial-recognition',
    title: 'Système de Reconnaissance Faciale',
    description: 'Plateforme cloud de reconnaissance faciale pour le suivi des présences automatisé',
    longDescription: `Développement d'un système innovant de reconnaissance faciale pour automatiser le suivi des présences à Epitech. Cette solution cloud utilise les dernières technologies d'intelligence artificielle pour identifier automatiquement les étudiants et enregistrer leur présence.

Le système réduit considérablement la charge administrative tout en améliorant la précision du suivi. L'interface développée avec PyQt6 offre une expérience utilisateur intuitive pour les administrateurs.`,
    technologies: ['Python', 'PyQt6', 'OpenCV', 'Torch', 'Firestore', 'Computer Vision', 'Machine Learning'],
    category: 'ai',
    status: 'completed',
    startDate: '2024-10',
    endDate: '2025-01',
    image: '/images/projects/facial-recognition.jpg',
    links: {},
    highlights: [
      'Réduction significative de la charge administrative',
      'Amélioration de la précision du suivi des présences',
      'Architecture cloud pour une haute disponibilité',
      'Interface utilisateur intuitive avec PyQt6',
      'Intégration seamless avec les systèmes existants'
    ],
    role: 'Lead Developer',
    teamSize: 2
  },
  {
    id: 'plus-simple-migration',
    title: 'Migration +Simple',
    description: 'Migration complète d\'une application Django monolithique vers une architecture moderne Nuxt.js + Django',
    longDescription: `Projet de migration d'envergure chez +Simple, transformant leur système de suivi des factures d'une architecture Django monolithique vers une solution moderne avec frontend Nuxt.js et backend Django.

Cette migration a permis d'améliorer significativement les performances, la maintenabilité du code, et l'expérience utilisateur. Le projet incluait également l'internationalisation et l'amélioration de la couverture de tests.`,
    technologies: ['Nuxt.js', 'Vue 3', 'Python', 'Django', 'Pinia', 'PostgreSQL', 'i18n', 'OAuth 2', 'GitLab CI/CD'],
    category: 'web',
    status: 'completed',
    startDate: '2023-04',
    endDate: '2023-08',
    image: '/images/projects/plus-simple.jpg',
    links: {},
    highlights: [
      'Réduction de 50% des temps de chargement',
      'Amélioration de 30% de la couverture de tests',
      'Architecture modulaire pour faciliter les futures évolutions',
      'Internationalisation complète de l\'application',
      'Migration sans interruption de service'
    ],
    role: 'Lead Frontend Developer',
    teamSize: 4
  },
  {
    id: 'acoris-intranet',
    title: 'Intranet ACORIS Mutuelles',
    description: 'Développement d\'une solution intranet complète pour améliorer la communication interne',
    longDescription: `Création d'une solution intranet complète pour ACORIS Mutuelles, facilitant la communication et le partage d'informations entre tous les départements de l'entreprise.

Le projet incluait la collaboration avec tous les départements pour établir les spécifications, le développement de modules PHP personnalisés, et l'implémentation de méthodologies Agile pour la gestion de projet.`,
    technologies: ['PHP', 'WordPress', 'HTML', 'CSS', 'JavaScript', 'MySQL'],
    category: 'web',
    status: 'completed',
    startDate: '2021-07',
    endDate: '2021-12',
    image: '/images/projects/acoris.jpg',
    links: {
      video: 'https://youtu.be/fSEylEdaZiM'
    },
    highlights: [
      'Amélioration de l\'efficacité de la communication interne',
      'Modules PHP personnalisés intégrés aux systèmes existants',
      'Collaboration inter-départementale réussie',
      'Respect des délais grâce aux méthodologies Agile',
      'Interface utilisateur intuitive et responsive'
    ],
    role: 'Full-stack Developer',
    teamSize: 3
  },
  {
    id: 'epitech-projects',
    title: 'Projets Epitech',
    description: 'Collection de projets académiques couvrant divers domaines de l\'informatique',
    longDescription: `Au cours de ma formation à Epitech, j'ai développé une multitude de projets couvrant différents aspects de l'informatique : systèmes, algorithmique, intelligence artificielle, développement web, et jeux vidéo.

Ces projets m'ont permis de maîtriser de nombreux langages et technologies, de C/C++ pour les projets systèmes à Unity pour le développement de jeux, en passant par Haskell pour la programmation fonctionnelle.`,
    technologies: ['C', 'C++', 'SFML', 'CSFML', 'Haskell', 'Assembly', 'JavaScript', 'Unity', 'C#'],
    category: 'tool',
    status: 'completed',
    startDate: '2020-09',
    endDate: '2024-07',
    image: '/images/projects/epitech.jpg',
    links: {
      github: 'https://github.com/DamienDemontis'
    },
    highlights: [
      'Maîtrise de multiples paradigmes de programmation',
      'Projets systèmes avancés en C/C++',
      'Développement de jeux avec SFML',
      'Programmation fonctionnelle avec Haskell',
      'Projets d\'intelligence artificielle et de machine learning'
    ],
    role: 'Student Developer',
    teamSize: 1
  },
  {
    id: 'korea-projects',
    title: 'Projets Corée du Sud',
    description: 'Projets développés pendant l\'année d\'échange à Keimyung University',
    longDescription: `Durant mon année d'échange à Keimyung University en Corée du Sud, j'ai travaillé sur plusieurs projets innovants dans le domaine du développement de jeux vidéo, de l'intelligence artificielle, et de la réalité virtuelle/augmentée.

Cette expérience internationale m'a permis d'approfondir mes compétences en Unity et C#, tout en découvrant de nouvelles approches de développement et en renforçant ma passion pour la culture asiatique.`,
    technologies: ['Unity', 'C#', 'AI/ML', 'VR/AR', 'Computer Vision', 'Korean'],
    category: 'game',
    status: 'completed',
    startDate: '2023-09',
    endDate: '2024-07',
    image: '/images/projects/korea.jpg',
    links: {
      video: 'https://youtu.be/s0AG0_PY93I'
    },
    highlights: [
      'Développement de jeux VR innovants',
      'Projets d\'IA appliquée aux jeux vidéo',
      'Collaboration internationale avec des étudiants coréens',
      'Apprentissage du coréen et immersion culturelle',
      'Ambassadeur Epitech en Corée du Sud'
    ],
    role: 'Exchange Student & Epitech Ambassador',
    teamSize: 3
  }
];

export const getProjectsByCategory = (category: Project['category']) => {
  return projects.filter(project => project.category === category);
};

export const getFeaturedProjects = () => {
  return projects.filter(project => ['leonart', 'facial-recognition', 'plus-simple-migration'].includes(project.id));
};

export const getProjectById = (id: string) => {
  return projects.find(project => project.id === id);
}; 