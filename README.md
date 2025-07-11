# Portfolio ChatGPT Parody - Damien Demontis

Un portfolio innovant présenté sous forme de parodie de ChatGPT, développé avec Next.js 15 et React 19.

## 🚀 Fonctionnalités

- **Interface ChatGPT Parodie** : Conversation simulée présentant Damien Demontis
- **Chat IA Véritable** : Intégration OpenAI pour des conversations en temps réel
- **Multilingue** : Support FR/EN/KR avec détection automatique
- **Thème Light/Dark** : Persistance via localStorage
- **Animations Modernes** : Framer Motion pour les effets visuels
- **Design Responsive** : Compatible mobile et desktop
- **Performance Optimisée** : Next.js 15 avec Turbopack

## 🛠 Stack Technique

### Frontend
- **Next.js 15** (App Router) + React 19 + TypeScript 5
- **Tailwind CSS v4** + shadcn/ui
- **Framer Motion** pour les animations
- **next-intl** pour l'internationalisation
- **next-themes** pour la gestion des thèmes

### Backend & IA
- **OpenAI API** pour le chat véritable
- **Streaming SSE** pour l'effet de frappe
- **next-seo** pour le référencement

### Outils de Développement
- **ESLint + Prettier** pour la qualité du code
- **Vitest + React Testing Library** pour les tests
- **Husky + lint-staged** pour les pre-commit hooks

## 📋 Prérequis

- Node.js 18+ 
- npm ou yarn
- Clé API OpenAI (optionnelle pour le chat IA)

## 🚀 Installation

1. **Cloner le repository**
```bash
git clone https://github.com/DamienDemontis/my-portfolio.git
cd my-portfolio
```

2. **Installer les dépendances**
```bash
npm install
# ou
yarn install
```

3. **Configuration des variables d'environnement**
```bash
cp .env.example .env.local
```

Remplir le fichier `.env.local` :
```env
# OpenAI Configuration (optionnel)
OPENAI_API_KEY=your_openai_api_key_here

# Analytics (optionnel)
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=your_analytics_id
```

4. **Personnaliser les données**
Modifier le fichier `data/cv.json` avec vos informations :
- Informations personnelles
- Expériences professionnelles
- Projets
- Compétences
- Liens sociaux

5. **Lancer en développement**
```bash
npm run dev
# ou
yarn dev
```

6. **Accéder à l'application**
Ouvrir [http://localhost:3000](http://localhost:3000)

## 📁 Structure du Projet

```
.
├── app/
│   ├── layout.tsx          # Layout principal avec providers
│   ├── page.tsx            # Page d'accueil avec chat simulé
│   └── api/
│       └── ask/
│           └── route.ts    # API route pour l'IA
├── components/
│   ├── FakeChat.tsx        # Chat simulé avec effets de frappe
│   ├── RealChatButton.tsx  # Bouton chat IA flottant
│   ├── ThemeSwitcher.tsx   # Commutateur de thème
│   ├── LanguageSwitcher.tsx # Sélecteur de langue
│   └── ui/                 # Composants UI réutilisables
├── data/
│   ├── cv.json            # Données CV (à personnaliser)
│   └── projects.ts        # Données projets
├── lib/
│   ├── i18n.ts           # Configuration internationalisation
│   ├── openai.ts         # Configuration OpenAI
│   └── utils.ts          # Utilitaires
├── messages/             # Traductions
│   ├── fr.json           # Français
│   ├── en.json           # Anglais
│   └── ko.json           # Coréen
├── styles/
│   └── globals.css       # Styles globaux et variables CSS
└── types/
    └── cv.ts             # Types TypeScript
```

## 🎨 Personnalisation

### Modifier les Données CV
Éditer `data/cv.json` avec vos informations :
```json
{
  "personalInfo": {
    "name": "Votre Nom",
    "email": "votre@email.com",
    "phone": "+33 X XX XX XX XX",
    // ... autres informations
  },
  "experience": [
    // Vos expériences professionnelles
  ],
  "projects": [
    // Vos projets
  ]
}
```

### Ajouter des Projets
Modifier `data/projects.ts` pour ajouter vos projets avec :
- Descriptions détaillées
- Technologies utilisées
- Liens (GitHub, démo, vidéo)
- Images et captures d'écran

### Personnaliser les Traductions
Modifier les fichiers dans `messages/` pour adapter :
- Les réponses du chat simulé
- Les textes de l'interface
- Les descriptions de sections

### Changer les Couleurs
Modifier les variables CSS dans `styles/globals.css` :
```css
:root {
  --primary: 262 83% 58%;        # Violet par défaut
  --secondary: 240 4.8% 95.9%;   # Gris clair
  /* ... autres variables */
}
```

## 🧪 Tests

```bash
# Lancer les tests
npm run test

# Tests avec interface
npm run test:ui

# Coverage
npm run test:coverage
```

## 📦 Déploiement

### Vercel (Recommandé)
1. **Push sur GitHub**
2. **Connecter à Vercel**
3. **Configurer les variables d'environnement**
4. **Déployer automatiquement**

### Build Local
```bash
npm run build
npm run start
```

## 🔧 Configuration Avancée

### OpenAI API
Pour activer le chat IA véritable :
1. Créer un compte OpenAI
2. Générer une clé API
3. L'ajouter dans `.env.local`
4. Le chat temps réel sera disponible

### Analytics
Intégration Vercel Analytics :
```env
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=your_id
```

### SEO
Modifier les métadonnées dans `app/layout.tsx` :
- Titre et description
- Images Open Graph
- Mots-clés
- Informations structurées

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push sur la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🙏 Remerciements

- [shadcn/ui](https://ui.shadcn.com/) pour les composants UI
- [Framer Motion](https://www.framer.com/motion/) pour les animations
- [Tailwind CSS](https://tailwindcss.com/) pour le design system
- [Next.js](https://nextjs.org/) pour le framework
- [OpenAI](https://openai.com/) pour l'API d'IA

## 📞 Contact

**Damien Demontis**
- Email: damien.demontis@epitech.eu
- LinkedIn: [damien-demontis](https://www.linkedin.com/in/damien-demontis/)
- GitHub: [DamienDemontis](https://github.com/DamienDemontis)

---

*Développé avec ❤️ par Damien Demontis | Rêvant de vivre en Asie 🌏*