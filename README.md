# creatman.site — Portfolio Platform

Personal portfolio with admin panel, blog, AI code analyst, and self-hosted analytics.

**Live:** https://creatman.site
**Admin:** https://creatman.site/creatsetup (Google OAuth)

## Stack

- **Framework:** Next.js 16 (App Router, TypeScript)
- **Database:** SQLite + Drizzle ORM (projects, blog, analytics, site content)
- **Auth:** NextAuth.js v5 + Google OAuth (email whitelist)
- **AI:** Groq + Cerebras (Llama 3.3 70B) with provider rotation
- **Styling:** Tailwind CSS 4
- **Deployment:** Docker + Traefik (reverse proxy, auto SSL)
- **Analytics:** Self-hosted, privacy-friendly (no cookies, no GA)

## Features

- **20 projects** from SQLite with tag filtering, detail pages (Problem/Solution/Results)
- **AI Code Analyst** — browse GitHub repos, get instant AI code review (streaming)
- **Blog** — aggregation from Dev.to/Hashnode + original posts (markdown)
- **Admin panel** — content editor, projects CRUD with AI generation, blog management, analytics dashboard
- **SEO** — dynamic metadata, sitemap.xml, robots.txt, JSON-LD schemas, Open Graph
- **i18n** — EN/RU with auto-detection (Accept-Language)
- **Contact form** → Telegram Bot API

## Architecture

```
src/
├── app/
│   ├── (admin)/creatsetup/  # Admin panel (auth-protected)
│   ├── api/
│   │   ├── analyze-code/    # AI analysis (Groq → Cerebras → fallback)
│   │   ├── admin/           # CRUD APIs (auth-protected via middleware)
│   │   ├── contact/         # Contact form → Telegram
│   │   ├── track/           # Page view analytics
│   │   └── content/         # Site content API
│   ├── projects/            # Project listing + [slug] detail
│   ├── blog/                # Blog listing + [slug] detail
│   └── ai-analyst/          # Interactive code explorer
├── components/
│   ├── admin/               # Admin UI (ContentEditor, ProjectForm, etc.)
│   └── ...                  # Public components (Hero, AboutMe, etc.)
├── db/
│   ├── schema.ts            # Drizzle schema (5 tables)
│   ├── index.ts             # SQLite connection (WAL mode)
│   └── seed.ts              # Initial data (20 projects, site content)
└── lib/
    ├── auth.ts              # NextAuth config
    └── blog-aggregator.ts   # Dev.to + Hashnode fetcher
```

## Setup

```bash
git clone https://github.com/CreatmanCEO/portfolio.git
cd portfolio
npm install
cp .env.example .env  # Fill in API keys
npm run seed          # Populate database
npm run dev           # http://localhost:3000
```

### Environment Variables

```env
GROQ_API_KEY=            # Groq API (primary AI provider)
CEREBRAS_API_KEY=        # Cerebras API (fallback AI provider)
GITHUB_TOKEN=            # GitHub API (higher rate limits)
TELEGRAM_BOT_TOKEN=      # Contact form delivery
TELEGRAM_CHAT_ID=        # Your Telegram chat ID
GOOGLE_CLIENT_ID=        # Admin panel OAuth
GOOGLE_CLIENT_SECRET=    # Admin panel OAuth
NEXTAUTH_SECRET=         # Generate: openssl rand -base64 32
NEXTAUTH_URL=            # https://creatman.site
AUTHORIZED_EMAIL=        # Admin email whitelist
```

## Deployment

Docker + Traefik on VPS:

```bash
docker compose up --build -d
npx drizzle-kit push          # Create/update tables
npm run seed                   # Seed initial data
chown -R 1001:1001 data/      # Fix permissions for nextjs user
```

Data persisted in `./data/` volume (SQLite DB + uploaded images).

## Tests

```bash
npm test          # 54 tests (Vitest)
npm run build     # Production build verification
```

## License

© 2026 Creatman. All rights reserved.

## Contact

- **Telegram:** [@Creatman_it](https://t.me/Creatman_it)
- **Email:** creatmanick@gmail.com
- **GitHub:** [@CreatmanCEO](https://github.com/CreatmanCEO)
- **LinkedIn:** [/in/creatman](https://www.linkedin.com/in/creatman/)
