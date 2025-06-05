# Damien Demontis Portfolio

This portfolio showcases Damien Demontis in a playful ChatGPT style. The site is built with **Next.js 15**, **React 19** and **TypeScript 5**.

## Installation

```bash
pnpm install
pnpm dev
```

## Adding Data

- Update `data/cv.json` with your experiences.
- Update `data/projects.ts` with your projects and images in `public/images`.
- Environment variables are defined in `.env.local`:

```
OPENAI_API_KEY=your-openai-key
```

## Testing

Run unit tests with Vitest:

```bash
pnpm test
```

## Deployment

Deploy the project on Vercel. The repository is ready for CI with GitHub Actions and a husky pre-commit hook running lint and tests.
