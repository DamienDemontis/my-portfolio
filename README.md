# Damien Demontis - Portfolio Website

A modern, responsive portfolio website built with React, TypeScript, and Tailwind CSS. This website showcases my professional experience, skills, education, and projects in an elegant and interactive way.

## 🌟 Features

- **Modern Design**: Clean, professional design with smooth animations
- **Responsive**: Fully responsive design that works on all devices
- **Dark/Light Theme**: Toggle between dark and light modes with system preference detection
- **Internationalization**: Support for English and French languages
- **Interactive Animations**: Smooth scroll animations and interactive elements using Framer Motion
- **Resume Downloads**: Download resume in both English and French
- **Contact Form**: Functional contact form for potential employers/clients
- **Performance Optimized**: Built with modern web technologies for optimal performance

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Animations**: Framer Motion for smooth transitions
- **Internationalization**: react-i18next for multi-language support
- **Icons**: Lucide React for modern, consistent icons
- **Build Tool**: Vite for fast development and optimized builds
- **Code Quality**: ESLint and TypeScript for code quality assurance

## 🚀 Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/damiendemontis/portfolio.git
   cd portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000` to view the website

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment.

## 📁 Project Structure

```
src/
├── components/
│   ├── common/           # Reusable components (ThemeToggle, LanguageSwitcher)
│   └── layout/           # Layout components (Navbar, Footer)
├── contexts/             # React contexts (ThemeContext)
├── i18n/                # Internationalization configuration and translations
│   ├── config.ts         # i18next configuration
│   └── locales/          # Translation files (en.json, fr.json)
├── sections/             # Main page sections
│   ├── Hero.tsx          # Hero/landing section
│   ├── About.tsx         # About me section
│   ├── Experience.tsx    # Professional experience
│   ├── Skills.tsx        # Technical skills
│   ├── Education.tsx     # Educational background
│   ├── Projects.tsx      # Featured projects
│   └── Contact.tsx       # Contact form and information
├── App.tsx              # Main application component
├── main.tsx             # Application entry point
└── index.css            # Global styles and Tailwind imports
```

## 🎨 Customization

### Colors
The color palette can be customized in `tailwind.config.js`. The current theme uses:
- Primary: Blue tones for accents and interactive elements
- Secondary: Gray tones for backgrounds and text
- Custom gradients for visual appeal

### Content
Update the content in the translation files:
- `src/i18n/locales/en.json` for English content
- `src/i18n/locales/fr.json` for French content

### Resume Files
Place your resume files in the `public` directory:
- `CV_Damien_DEMONTIS_EN.pdf` (English)
- `CV_Damien_DEMONTIS_FR.pdf` (French)

## 📱 Responsive Design

The website is fully responsive with breakpoints for:
- Mobile: 320px - 768px
- Tablet: 768px - 1024px
- Desktop: 1024px+

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📊 Performance

- **Lighthouse Score**: 95+ on all metrics
- **Core Web Vitals**: Optimized for excellent user experience
- **Bundle Size**: Optimized with tree-shaking and code splitting

## 🔧 Development Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📞 Contact

- **Email**: damien.demontis@epitech.eu
- **LinkedIn**: [damien-demontis](https://www.linkedin.com/in/damien-demontis/)
- **GitHub**: [damiendemontis](https://github.com/damiendemontis)

## 📄 License

This project is personal portfolio website. Feel free to use it as inspiration for your own portfolio, but please don't use it as-is with my personal information.

---

**Built with ❤️ by Damien Demontis** 