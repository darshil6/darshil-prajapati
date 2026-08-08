# Darshil Prajapati — Portfolio

An art-directed, interactive portfolio. Dark editorial design, custom cursor,
command palette (⌘K), live LAB experiments, generative project visuals — no
stock images, no templates.

## Stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** (CSS-first tokens in `src/app/globals.css`)
- **Framer Motion** for animation, **Lenis** for smooth scroll
- **Lucide** icons

## Develop

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (also typechecks)
npm start          # serve the production build
```

## Editing content — one file

Every word on the site lives in **`src/data/site.ts`** — name, contact info,
social links, projects + case studies, lab experiments, experience, skills,
desk notes, manifesto, footer. Nothing is hardcoded in components.

> ⚠️ Replace the placeholder **LinkedIn / GitHub URLs** in `site.socials`
> with your real profiles.

Project placeholder art is generated in code
(`src/components/work/project-visual.tsx`). To use real screenshots later,
swap that component's usage for `next/image`.

## Deploy

### Vercel (fastest)

```bash
npx vercel --prod
```

Set env var `NEXT_PUBLIC_SITE_URL=https://your-domain.com` in the project
settings (used for OG metadata, sitemap and robots).

### Docker (any host)

```bash
docker build -t portfolio .
docker run -p 3000:3000 -e NEXT_PUBLIC_SITE_URL=https://your-domain.com portfolio
```

Uses Next.js standalone output; the image serves on port 3000
(`/api/health` responds `{"status":"ok"}` for load-balancer checks).

## Architecture

```
src/
  app/                  # App Router: home, work/[slug] case studies,
                        # robots, sitemap, api/health
  components/           # feature folders (navigation, hero, work, lab,
                        # desk, skills, experience, manifesto, contact,
                        # footer, command-palette, cursor, effects,
                        # loader, providers, common)
  data/                 # single source of truth for ALL content
  hooks/                # shared hooks
  lib/                  # utilities + easing constants
```

## Notable interactions

- **⌘K / Ctrl+K or `/`** — command palette
- **Custom cursor** on desktop (`data-cursor` attributes); native cursor on touch
- **LAB section** — hover/tap to run live generative experiments
- **Digital desk** — draggable objects on desktop
- Click the wordmark 5× … and try typing `voice`
- Full `prefers-reduced-motion` support, keyboard navigable throughout
