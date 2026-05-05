# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- MIT `LICENSE` file
- `CONTRIBUTING.md` with local setup, PR rules, and security reporting
- `.github/workflows/validate.yml` CI: meta-file check, TypeScript type-check, Markdown link check
- README badges, "Why this exists / How it works" section, tech stack table with versions, Limitations section, Related ecosystem links, expanded author block

### Changed
- README rewritten for clarity; tone tightened (no marketing fluff)

## [3.0.0] - 2026-03-20

### Architecture
- Migrated from hardcoded data to SQLite + Drizzle ORM
- Added NextAuth.js with Google OAuth for admin authentication
- Implemented ISR with on-demand revalidation
- Added self-hosted privacy-friendly analytics (no cookies, no GA)

### New Features
- **Admin Panel** (creatsetup.creatman.site): Content editor, Projects CRUD with AI generation, Blog management, Analytics dashboard
- **Blog** (/blog): Aggregation from Dev.to + Hashnode, original posts with markdown
- **Analytics**: Page view tracking with recharts dashboard (views, referrers, countries)
- **SEO**: Dynamic metadata, sitemap.xml, robots.txt, JSON-LD schemas, Open Graph tags
- **Image Uploads**: Admin upload API with persistent Docker volume storage

### Redesigned
- **Hero Section**: "I see problems. I build solutions." storytelling positioning
- **About Me**: Rectangular photo, 5-paragraph storytelling bio, "I don't specialize. I solve." tagline, Quick Facts cards
- **Tech Stack**: Primary/secondary toggle with filled/outlined chips
- **Projects Page**: 20 projects from SQLite, tag-based filtering, colored badges, chronological order
- **Project Detail Pages**: Dynamic from SQLite with generateStaticParams
- **Contact Form**: 4 purpose options (Hire/Discuss/Consulting/Connect)
- **Navigation**: 4 items (Home/Projects/Blog/AI Analyst), EN/RU toggle

### Fixed
- **AI Analyst**: Folder click only expands (no useless analysis), README auto-load on project select, Gemini 2.5 Flash (stable model), current date in system prompt, mobile collapsible panels
- **Contact Links**: All updated to correct values (@Creatman_it, creatmanick@gmail.com, CreatmanCEO)
- **Footer**: LinkedIn URL fixed

### Removed
- Spanish, Hebrew, Japanese translations (EN/RU only)
- WelcomeModal on AI Analyst page
- Hardcoded project data (lib/projects.ts)
- Social icons from navigation (moved to footer)
- Background gradients (flat design)

### Infrastructure
- Docker volume for data persistence (SQLite + uploads)
- Nginx: creatsetup subdomain, rate limiting on /api/track
- Nginx: /creatsetup blocked on main domain
- Custom image loader for uploaded files

### Database Schema
- `projects` — 20 projects with tags, tech stack, multilingual descriptions
- `site_content` — 12 key-value pairs for all editable content
- `blog_posts` — Original + aggregated posts from Dev.to/Hashnode
- `page_views` — Privacy-friendly analytics with session tracking

### Dependencies Added
- drizzle-orm, better-sqlite3 (database)
- next-auth (authentication)
- react-markdown (blog rendering)
- recharts (analytics charts)
- vitest, @testing-library (testing)
