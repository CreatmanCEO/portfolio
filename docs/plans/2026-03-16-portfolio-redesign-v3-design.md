# creatman.site Redesign V3 — Design Document

**Date:** 2026-03-16
**Status:** Approved
**Scope:** Full redesign — positioning, data layer, admin panel, blog, analytics, SEO

---

## 1. Positioning

- **Headline:** "I see problems. I build solutions."
- **Subtitle:** Evergreen storytelling — backdoors→scanner, censorship→VPN, wallet→App Store. Ends with "20+ products. 6 years. Every time a new field."
- **Title/Role:** NOT displayed on site. "Technical Product Builder" in meta/SEO only.
- **CTA:** 2 primary buttons (View Projects, Explore My Code with AI) + 1 text-link (Get In Touch ↓)

## 2. Architecture

### Database: SQLite + Drizzle ORM

**Tables:**

#### `projects`
| Column | Type | Notes |
|--------|------|-------|
| id | INTEGER PK | auto-increment |
| slug | TEXT UNIQUE | URL-safe identifier |
| title_en / title_ru | TEXT | bilingual |
| description_en / description_ru | TEXT | bilingual |
| tags | JSON | `["security", "ai", "infra"]` |
| tech_stack | JSON | `["Python", "FastAPI"]` |
| status | TEXT | "production" / "in_development" / "concept" |
| year | INTEGER | for chronological sort |
| github_url | TEXT nullable | |
| live_url | TEXT nullable | |
| cover_image | TEXT nullable | path in /data/uploads/ |
| screenshots | JSON nullable | `["s1.webp", "s2.webp"]` |
| seo_title / seo_description | TEXT nullable | fallback to title/description |
| sort_order | INTEGER | tiebreaker when year matches |
| created_at / updated_at | DATETIME | |

#### `site_content`
| Column | Type | Notes |
|--------|------|-------|
| key | TEXT PK | e.g. "hero_subtitle_en", "about_ru", "tech_stack" |
| value | TEXT | plain text or JSON |
| updated_at | DATETIME | |

Keys: hero_subtitle_en/ru, about_en/ru, tech_stack (JSON: {primary:[], secondary:[]}), quick_facts (JSON array), meta_title, meta_description, og_image_url, twitter_handle, footer_github, footer_telegram, footer_linkedin, footer_email

#### `blog_posts`
| Column | Type | Notes |
|--------|------|-------|
| id | INTEGER PK | |
| slug | TEXT UNIQUE | |
| title_en / title_ru | TEXT | |
| content_md | TEXT | markdown (original posts) |
| excerpt | TEXT nullable | short preview |
| cover_image | TEXT nullable | |
| source | TEXT | "original" / "devto" / "hashnode" |
| external_url | TEXT nullable | link to platform |
| external_id | TEXT nullable | dedup on re-import |
| published | BOOLEAN | |
| published_at | DATETIME | |
| created_at / updated_at | DATETIME | |

#### `page_views`
| Column | Type | Notes |
|--------|------|-------|
| id | INTEGER PK | |
| path | TEXT | /projects, /blog, etc. |
| referrer | TEXT nullable | |
| country | TEXT nullable | GeoIP or CF-IPCountry |
| user_agent | TEXT nullable | |
| session_id | TEXT nullable | crypto.randomUUID() in sessionStorage |
| created_at | DATETIME | |

### Auth: NextAuth.js + Google OAuth
- Provider: Google
- Whitelist: AUTHORIZED_EMAIL=creatmanick@gmail.com
- JWT sessions (no sessions table)
- Middleware on route group (admin)

### Caching: ISR + On-Demand Revalidation
- Public pages: static generation at build
- After admin CRUD: revalidatePath() / revalidateTag()
- Blog aggregation: ISR cron every hour, upsert to SQLite

### i18n: EN + RU only
- UI strings: in code (LanguageContext, reduced to 2 languages)
- Content: dual fields in SQLite (_en / _ru)
- Simple toggle in header
- Delete ES, HE, JP translations

## 3. Pages

### Homepage (/)
- Hero: centered, storytelling subtitle, 2 buttons + text-link
- About Me: photo (rectangular ~300x400, border-radius 12px) left on desktop, above on mobile. Full storytelling text from spec. "I don't specialize. I solve." — 1.25em, font-weight 600
- Quick Facts: 4 cards grid — 20+ Products, 6 Years Solo, Open Worldwide, Idea → Production
- Tech Stack: primary chips (filled) + "Full stack →" toggle for secondary (outlined, smaller)
- Contact Form: name, contact, purpose (4 options: Hire/Discuss/Consulting/Connect), message → Telegram
- Footer: GitHub CreatmanCEO, Telegram @Creatman_it, LinkedIn /in/creatman, creatmanick@gmail.com

### Projects (/projects)
- All projects from SQLite, chronological order (newest first)
- Filter by tags: clickable chips (all, security, ai, automation, devtools, fintech, infra, marketplace, business-tool, mobile, bot, opensource)
- Unified grid (3 cols desktop, 2 tablet, 1 mobile)
- Each card: cover image, title, description excerpt, tech chips, tag badges (colored), status badge
- "15+ Telegram Bots" — aggregator card (full-width, different background)
- AI Code Analyst — project card linking to /ai-analyst
- Click → detail page /projects/[slug]

### Project Detail (/projects/[slug])
- Problem → Solution → Results structure
- Tech stack breakdown
- Screenshots gallery
- GitHub / Live demo links

### Blog (/blog)
- Aggregated (Dev.to, Hashnode) + original posts from SQLite
- Cards: cover, title, excerpt, date, source badge, reading time
- External click → redirect to platform
- Original click → /blog/[slug] (full markdown rendered via react-markdown)
- blog.creatman.site → redirect to creatman.site/blog

### AI Analyst (/ai-analyst)
- Header: "Explore My Code — AI-Powered Portfolio" / "Browse my GitHub repos. Click any file. Get instant AI analysis from Gemini."
- Remove WelcomeModal
- Repos sorted by updated_at (newest first)
- Fix: folder click → expand tree only (NO analysis)
- Fix: new project selected → auto-analyze README.md (fallback: GitHub description + file list)
- Fix: model → gemini-2.5-flash (stable, free tier)
- Fix: add current date + context to system prompt
- Mobile: both FileTree and CodeEditor collapsible (React state + CSS transition, chevron icon from lucide-react, same style). Proportions: ~30% editor / ~70% analysis

### Admin Panel (creatsetup.creatman.site)
- Route group: app/(admin)/creatsetup/...
- Subdomain via nginx rewrite → same container
- Block /creatsetup/ on main domain (404)
- Sidebar: Dashboard, Content, Projects, Blog, Analytics
- Content: textarea + live preview for each site_content key. Markdown for About Me.
- Projects: CRUD form with AI agent ("Generate from GitHub README" → Gemini API, 10s timeout, fallback to manual). Tags multi-select, tech stack chips input, image upload.
- Blog: tabs (All/Original/Aggregated), original post editor (markdown textarea + preview)
- Analytics: recharts dashboard — visits chart (day/week/month/all), top pages, top referrers, top countries, last 50 visits

## 4. Infrastructure

### Docker
- Same Dockerfile (multi-stage build)
- docker-compose.yml additions:
  - Volume: `./data:/data` (SQLite + uploads)
  - Seed script auto-runs on first start (if site_content empty)

### Nginx
- Add server block for creatsetup.creatman.site → proxy to portfolio:3000/creatsetup/
- Rate limiting on /api/track: `limit_req zone=analytics burst=10 nodelay`
- robots.txt disallow /creatsetup/

### Image Storage
- /data/uploads/ in Docker volume
- Next.js Image optimization via custom loader
- Images survive rebuild, don't bloat Docker image
- Backup = copy /data/

### SEO
- Metadata API: dynamic title/description from SQLite per page
- Open Graph + Twitter cards
- JSON-LD: Person (home), CreativeWork (projects), BlogPosting (blog)
- app/sitemap.ts: auto-generate from SQLite
- app/robots.ts: allow all, disallow /creatsetup/
- Canonical URLs, alt text for images

### Analytics
- Self-hosted, privacy-friendly (no cookies, no GA)
- /api/track POST endpoint
- session_id via crypto.randomUUID() in sessionStorage
- Nginx rate limiting
- Dashboard in admin panel (recharts)

## 5. Contact Info (canonical)
- GitHub: https://github.com/CreatmanCEO/
- Telegram: @Creatman_it (https://t.me/Creatman_it)
- LinkedIn: https://www.linkedin.com/in/creatman/
- Email: creatmanick@gmail.com

## 6. Projects List (to populate SQLite seed)

### From spec + GitHub + discussion:
1. Security Scanner Bot — security, ai, infra — production
2. VPN Infrastructure — security, infra — production
3. GHOST — AI Assistant — ai, automation — production
4. LinguaCompanion — ai — in_development
5. claude-statusline — devtools, opensource — production
6. Claude Code Anti-Regression Setup — devtools, opensource — production
7. AviaWallet — fintech, mobile — production
8. Sakhalin-Market — marketplace, mobile — production (no GitHub)
9. Altecotopia — marketplace — production (first IT project, 2020, no GitHub)
10. Club-sbor.ru — marketplace, business-tool — production
11. Creatman Life Hub — ai — production
12. DATN — ai, fintech — in_development
13. ACCU — devtools, automation — production
14. Joy Vision Calculator — business-tool — production
15. Hebrew Doc Translator — ai, bot — production
16. Notion Knowledge Assistant — ai, bot — production
17. 15+ Telegram Bots — aggregator card (bot, automation)
18. AI Code Analyst — ai, devtools, opensource — production (links to /ai-analyst)
19. Cian Parser — automation, bot — production
20. Smart Link Collector — automation, bot — production

### From Google Drive (pending review):
- Additional projects TBD from https://drive.google.com/drive/folders/1NwDUXDLzulKkywp3YnvsFXmvf07tmwfZ

## 7. Design Reference
- Visual mockup: creatman_site_homepage_mockup.html
- Style: flat, no gradients (except cover image areas), no shadows, minimal borders
- Tag badge colors: red=security, blue=ai, yellow/orange=automation/fintech, purple=infra/devtools, green=production/opensource
- Typography: current Geist font family

## 8. Migration Plan
- Create feature branch for all work
- Seed script migrates current hardcoded content → SQLite
- Delete ES/HE/JP translations
- Fix all hardcoded contact info (Telegram, email, GitHub)
- Test cycle: build → code review → test → merge
- Changelog maintained throughout
