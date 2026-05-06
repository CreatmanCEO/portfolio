# creatman.site — Portfolio Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/CreatmanCEO/portfolio?style=social)](https://github.com/CreatmanCEO/portfolio/stargazers)
[![Validate](https://github.com/CreatmanCEO/portfolio/actions/workflows/validate.yml/badge.svg)](https://github.com/CreatmanCEO/portfolio/actions/workflows/validate.yml)
[![Status: production](https://img.shields.io/badge/status-production-brightgreen)](https://creatman.site)
[![Platform: Next.js](https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs)](https://nextjs.org)

Personal portfolio platform powering [creatman.site](https://creatman.site) — a content-managed Next.js site with project gallery, blog aggregator, AI code analyst, and self-hosted analytics. Open-sourced as a working reference for anyone building a similar developer portfolio.

**Live:** https://creatman.site
**Admin:** https://creatman.site/creatsetup (Google OAuth, email-whitelisted)

## Why this exists

Most "portfolio templates" are static one-pagers. This one runs a small CMS so projects, blog posts, and bio copy can be edited in a browser without a redeploy. It also doubles as a sandbox for experimenting with AI integrations (the AI Code Analyst lets visitors paste a GitHub repo URL and get a streamed code review).

## How it works

- Next.js 16 App Router renders public pages (Home, Projects, Blog, AI Analyst).
- Drizzle ORM reads/writes a SQLite database (`projects`, `blog_posts`, `site_content`, `page_views`).
- The admin panel at `/creatsetup` is gated by NextAuth + Google OAuth and an email whitelist.
- Edits trigger on-demand revalidation; static pages stay fast, content stays fresh.
- AI Code Analyst calls Groq (primary) → Cerebras (fallback) for Llama 3.3 70B inference with streaming responses.
- Analytics endpoint records page views server-side (no third-party scripts, no cookies).

## Tech stack

| Layer        | Tool                                          |
|--------------|-----------------------------------------------|
| Framework    | Next.js 16.1.6 (App Router, RSC)              |
| Language     | TypeScript 5                                  |
| UI           | React 19.2.3, Tailwind CSS 4                  |
| Database     | SQLite (better-sqlite3 12) + Drizzle ORM 0.45 |
| Auth         | NextAuth.js v5 + Google OAuth                 |
| AI           | Groq + Cerebras (Llama 3.3 70B)               |
| Charts       | Recharts 3                                    |
| Tests        | Vitest 4 + Testing Library                    |
| Deployment   | Docker + Traefik (auto SSL)                   |
| Node         | 20+                                           |

## Setup

```bash
git clone https://github.com/CreatmanCEO/portfolio.git
cd portfolio
npm install
cp .env.example .env   # fill in API keys (see below)
npm run seed           # populate SQLite with initial content
npm run dev            # http://localhost:3000
```

### Environment variables

```env
GROQ_API_KEY=            # primary AI provider
CEREBRAS_API_KEY=        # fallback AI provider
GITHUB_TOKEN=            # higher GitHub API rate limits
TELEGRAM_BOT_TOKEN=      # contact form delivery
TELEGRAM_CHAT_ID=        # your Telegram chat ID
GOOGLE_CLIENT_ID=        # admin OAuth
GOOGLE_CLIENT_SECRET=    # admin OAuth
NEXTAUTH_SECRET=         # openssl rand -base64 32
NEXTAUTH_URL=            # https://creatman.site
AUTHORIZED_EMAIL=        # admin email whitelist
```

## Deployment

Docker + Traefik on a VPS:

```bash
docker compose up --build -d
npx drizzle-kit push           # create/update tables
npm run seed                   # seed initial data
chown -R 1001:1001 data/       # fix permissions for nextjs user
```

Data persists in the `./data/` volume (SQLite DB + uploaded images).

## Tests

```bash
npm test          # 54 Vitest tests
npm run lint      # ESLint
```

## Limitations

- SQLite is single-node only; no horizontal scaling without migration to Postgres.
- Admin panel assumes a single operator (whitelist of one email).
- AI provider rotation is hard-coded to Groq → Cerebras; switching providers needs code changes.
- Blog aggregator polls Dev.to and Hashnode on demand; no background refresh queue.
- No automated visual regression tests yet.

## Related — Claude Code ecosystem by the same author

Sister repos exploring Claude Code workflows, context engineering, and agent tooling:

- [`claude-code-antiregression-setup`](https://github.com/CreatmanCEO/claude-code-antiregression-setup) — settings + hooks to prevent regression loops
- [`ai-context-hierarchy`](https://github.com/CreatmanCEO/ai-context-hierarchy) — layered CLAUDE.md context strategy
- [`claude-statusline`](https://github.com/CreatmanCEO/claude-statusline) — statusline customization for Claude Code
- [`notebooklm-claude-workflows`](https://github.com/CreatmanCEO/notebooklm-claude-workflows) — NotebookLM + Claude research loops
- [`webtest-orch`](https://github.com/CreatmanCEO/webtest-orch) — universal e2e testing orchestrator
- [`hydrowatch`](https://github.com/CreatmanCEO/hydrowatch) — hydration / water-tracking utility
- [`lingua-companion`](https://github.com/CreatmanCEO/lingua-companion) — voice-first English learning app
- [`security-scanner`](https://github.com/CreatmanCEO/security-scanner) — Telegram bot for mobile traffic security audits
- [`diabot`](https://github.com/CreatmanCEO/diabot) — Telegram nutrition bot for Type 1 diabetes
- [`ghost-showcase`](https://github.com/CreatmanCEO/ghost-showcase) — GHOST AI desktop overlay (showcase)
- [`cc-janitor`](https://github.com/CreatmanCEO/cc-janitor) — repo hygiene tool (active development)

## Author

**Nick Podolyak** — full-stack engineer, security & AI tooling.

- GitHub: [@CreatmanCEO](https://github.com/CreatmanCEO)
- Habr: [creatman](https://habr.com/ru/users/creatman/)
- dev.to: [@creatman](https://dev.to/creatman)
- Telegram: [@Creatman_it](https://t.me/Creatman_it)
- Site: [creatman.site](https://creatman.site)

## License

MIT — see [LICENSE](LICENSE).
