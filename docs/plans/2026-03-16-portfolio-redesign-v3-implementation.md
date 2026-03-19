# Portfolio Redesign V3 — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform creatman.site from a hardcoded portfolio into a dynamic, admin-managed platform with blog, analytics, and SEO — repositioned as "I see problems. I build solutions."

**Architecture:** SQLite + Drizzle ORM as data layer, NextAuth.js + Google OAuth for admin auth, ISR for caching, same Next.js 16 App Router. All content served from SQLite, admin panel as route group with nginx subdomain rewrite.

**Tech Stack:** Next.js 16, TypeScript, Tailwind CSS 4, Drizzle ORM, better-sqlite3, NextAuth.js (auth.js v5), react-markdown, recharts, Vitest

**Design Doc:** `docs/plans/2026-03-16-portfolio-redesign-v3-design.md`

**Branch:** `feature/redesign-v3`

**Agency Rules for Subagents:**
1. ALL work on branch `feature/redesign-v3` — never commit to main
2. Run `npm run build` after every task to verify no build errors
3. Run `npm test` after every task to verify no test regressions
4. Commit after every task with conventional commit prefix (feat:, fix:, refactor:, test:, docs:)
5. Do NOT modify files outside the task scope
6. Do NOT add dependencies not listed in the task
7. Do NOT create documentation files unless specified
8. Preserve existing functionality — no breaking changes to public pages during migration
9. Use exact file paths from this plan
10. Check design doc for visual reference and data schemas

---

## Phase 1: Foundation (architectural base — everything depends on this)

### Task 1: Add Vitest + Test Infrastructure

**Files:**
- Create: `vitest.config.ts`
- Create: `src/__tests__/setup.ts`
- Create: `src/__tests__/smoke.test.ts`
- Modify: `package.json` (add devDependencies + script)

**Step 1: Install dependencies**

```bash
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom
```

**Step 2: Create vitest.config.ts**

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/__tests__/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    globals: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

**Step 3: Create setup file**

```typescript
// src/__tests__/setup.ts
import '@testing-library/jest-dom'
```

**Step 4: Create smoke test**

```typescript
// src/__tests__/smoke.test.ts
import { describe, it, expect } from 'vitest'

describe('Smoke test', () => {
  it('should pass', () => {
    expect(true).toBe(true)
  })
})
```

**Step 5: Add test script to package.json**

Add to scripts: `"test": "vitest run", "test:watch": "vitest"`

**Step 6: Run tests**

```bash
npm test
```
Expected: 1 test passes

**Step 7: Commit**

```bash
git add -A && git commit -m "test: add Vitest infrastructure"
```

---

### Task 2: Add SQLite + Drizzle ORM + Schema

**Files:**
- Create: `src/db/schema.ts`
- Create: `src/db/index.ts`
- Create: `drizzle.config.ts`
- Create: `src/__tests__/db/schema.test.ts`
- Modify: `package.json` (add dependencies)
- Modify: `.gitignore` (add *.db)

**Step 1: Install dependencies**

```bash
npm install drizzle-orm better-sqlite3
npm install -D drizzle-kit @types/better-sqlite3
```

**Step 2: Create schema (src/db/schema.ts)**

Define all 4 tables from design doc:
- `projects` — with id, slug, title_en/ru, description_en/ru, tags (JSON text), tech_stack (JSON text), status, year, github_url, live_url, cover_image, screenshots (JSON text), seo_title, seo_description, sort_order, created_at, updated_at
- `siteContent` — key (PK), value, updated_at
- `blogPosts` — id, slug, title_en/ru, content_md, excerpt, cover_image, source, external_url, external_id, published, published_at, created_at, updated_at
- `pageViews` — id, path, referrer, country, user_agent, session_id, created_at

Use Drizzle SQLite column types: `text`, `integer`, `blob`. Store JSON as text.

**Step 3: Create db connection (src/db/index.ts)**

```typescript
import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import * as schema from './schema'
import path from 'path'

const DB_PATH = process.env.DATABASE_PATH || path.join(process.cwd(), 'data', 'portfolio.db')

// Ensure data directory exists
import fs from 'fs'
const dir = path.dirname(DB_PATH)
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })

const sqlite = new Database(DB_PATH)
sqlite.pragma('journal_mode = WAL')
sqlite.pragma('foreign_keys = ON')

export const db = drizzle(sqlite, { schema })
export { schema }
```

**Step 4: Create drizzle.config.ts**

```typescript
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  dbCredentials: {
    url: process.env.DATABASE_PATH || './data/portfolio.db',
  },
})
```

**Step 5: Write schema test (src/__tests__/db/schema.test.ts)**

Test that all tables can be created and basic CRUD works:
- Insert a project → select → verify fields
- Insert site_content → select by key → verify
- Insert blog_post → select → verify
- Insert page_view → select → verify

**Step 6: Generate migrations + run tests**

```bash
npx drizzle-kit generate
npm test
```

**Step 7: Add data/ and *.db to .gitignore**

**Step 8: Verify build**

```bash
npm run build
```

**Step 9: Commit**

```bash
git add -A && git commit -m "feat: add SQLite database with Drizzle ORM schema"
```

---

### Task 3: Seed Script + Data Migration

**Files:**
- Create: `src/db/seed.ts`
- Create: `scripts/seed.mjs` (runner)
- Create: `src/__tests__/db/seed.test.ts`
- Modify: `package.json` (add seed script)

**Step 1: Create seed script (src/db/seed.ts)**

Exports `seedDatabase()` function that:
1. Checks if `site_content` table has data — if yes, skip (idempotent)
2. Inserts site_content keys:
   - hero_subtitle_en/ru (storytelling text from design doc)
   - about_en/ru (full About Me text from spec section 4)
   - tech_stack JSON: `{"primary": ["Python","FastAPI","Docker","Linux/VPS","Next.js","React","TypeScript"], "secondary": ["Suricata","Zeek","aiogram","Flutter","Electron","n8n","Claude AI","Deepgram","Bash","Nginx","SQLite","GCP"]}`
   - quick_facts JSON array (4 items with icon, text_en, text_ru)
   - meta_title: "Creatman — Technical Product Builder | From Problem to Production"
   - meta_description: "I see problems and build solutions. 20+ shipped products across security, AI, fintech, infrastructure, and developer tools."
   - footer_github, footer_telegram (@Creatman_it), footer_linkedin, footer_email (creatmanick@gmail.com)
3. Inserts all 20 projects from design doc section 6 with full descriptions, tags, tech stacks, years, URLs

**Step 2: Create runner script (scripts/seed.mjs)**

Calls seedDatabase() with proper tsx/ts-node execution.

**Step 3: Write seed test**

Test: run seed on empty DB → verify all site_content keys exist, verify project count >= 18, verify idempotency (run again → same count).

**Step 4: Add script to package.json**

```json
"seed": "npx tsx scripts/seed.mjs"
```

**Step 5: Run seed + tests**

```bash
npm run seed
npm test
```

**Step 6: Commit**

```bash
git add -A && git commit -m "feat: add seed script with all project data and site content"
```

---

### Task 4: Data Access API Routes

**Files:**
- Create: `src/app/api/content/route.ts` (GET site_content)
- Create: `src/app/api/projects/route.ts` (GET projects with tag filter)
- Create: `src/app/api/projects/[slug]/route.ts` (GET single project)
- Create: `src/__tests__/api/content.test.ts`
- Create: `src/__tests__/api/projects.test.ts`

**Step 1: Create content API (GET /api/content)**

Returns all site_content as key-value object. Cache: `s-maxage=3600, stale-while-revalidate=86400`.

**Step 2: Create projects API (GET /api/projects)**

Query params: `?tag=security` (optional filter), `?lang=en` (default en).
Returns projects sorted by year DESC, sort_order ASC.
Each project includes parsed JSON fields (tags, tech_stack, screenshots).

**Step 3: Create project detail API (GET /api/projects/[slug])**

Returns single project by slug. 404 if not found.

**Step 4: Write tests for both APIs**

Test content API returns expected keys.
Test projects API returns array, test tag filter works, test sort order.
Test project detail returns correct project, test 404 for unknown slug.

**Step 5: Run tests + build**

```bash
npm test && npm run build
```

**Step 6: Commit**

```bash
git add -A && git commit -m "feat: add data access API routes for content and projects"
```

---

## Phase 2: Auth (admin panel foundation)

### Task 5: NextAuth.js + Google OAuth Setup

**Files:**
- Create: `src/app/api/auth/[...nextauth]/route.ts`
- Create: `src/lib/auth.ts`
- Modify: `package.json` (add next-auth)
- Modify: `.env` (add Google OAuth + NEXTAUTH_SECRET + AUTHORIZED_EMAIL)
- Modify: `.env.example`

**Step 1: Install NextAuth v5**

```bash
npm install next-auth@beta
```

**Step 2: Create auth config (src/lib/auth.ts)**

Configure Google provider, JWT strategy, callback that checks `user.email === process.env.AUTHORIZED_EMAIL`.

**Step 3: Create API route (src/app/api/auth/[...nextauth]/route.ts)**

Standard NextAuth catch-all route.

**Step 4: Add env variables**

```env
NEXTAUTH_SECRET=<generate with openssl rand -base64 32>
NEXTAUTH_URL=https://creatsetup.creatman.site
GOOGLE_CLIENT_ID=<from Google Cloud Console>
GOOGLE_CLIENT_SECRET=<from Google Cloud Console>
AUTHORIZED_EMAIL=creatmanick@gmail.com
```

**Step 5: Build verification**

```bash
npm run build
```

**Step 6: Commit**

```bash
git add -A && git commit -m "feat: add NextAuth.js with Google OAuth"
```

---

### Task 6: Admin Route Group + Middleware

**Files:**
- Create: `src/app/(admin)/creatsetup/layout.tsx`
- Create: `src/app/(admin)/creatsetup/page.tsx` (dashboard)
- Create: `src/middleware.ts`

**Step 1: Create middleware (src/middleware.ts)**

Check auth session for any request matching `/creatsetup/*`. If no session → redirect to Google OAuth sign-in. If email not authorized → return 403.

**Step 2: Create admin layout**

Simple layout with sidebar navigation (Dashboard, Content, Projects, Blog, Analytics). Include session provider.

**Step 3: Create dashboard page**

Basic stats: project count, blog post count, total page views. Read from SQLite.

**Step 4: Build verification**

```bash
npm run build
```

**Step 5: Commit**

```bash
git add -A && git commit -m "feat: add admin route group with auth middleware"
```

---

## Phase 3: Frontend Core (visual redesign)

### Task 7: i18n Cleanup — EN/RU Only

**Files:**
- Modify: `src/contexts/LanguageContext.tsx` (remove ES, HE, JP; keep EN, RU)
- Modify: `src/components/Navigation.tsx` (EN/RU toggle instead of 5-lang selector)
- Create: `src/__tests__/i18n.test.ts`

**Step 1: Strip LanguageContext to EN + RU**

Remove all ES, HE, JP translations (should reduce from ~530 entries to ~212).
Remove RTL support code (Hebrew).
Remove browser locale mapping for es, he, ja.

**Step 2: Update Navigation**

Replace 5-language dropdown with simple EN/RU toggle button (like in mockup).

**Step 3: Write test**

Test: switching language updates all visible keys. Test: only "en" and "ru" are valid.

**Step 4: Build + test**

```bash
npm test && npm run build
```

**Step 5: Commit**

```bash
git add -A && git commit -m "refactor: reduce i18n to EN/RU only, remove 3 unused languages"
```

---

### Task 8: Hero Section Redesign

**Files:**
- Modify: `src/components/Hero.tsx`
- Modify: `src/contexts/LanguageContext.tsx` (update hero translations)

**Step 1: Update Hero component**

- Remove featured projects grid and TechStack from Hero (they become separate sections)
- Centered layout (text-align center)
- h1: "I see problems. I build solutions." (from translation)
- Subtitle: storytelling text, last line bold ("20+ products. 6 years. Every time a new field.")
- 2 primary buttons: "View Projects" (filled) + "Explore My Code with AI" (outlined)
- 1 text-link: "Get In Touch ↓" (smooth scroll to contact)
- Follow mockup styling: font-weight 500 for h1, max-width 600px for subtitle

**Step 2: Update translations for hero keys**

Both EN and RU versions of headline, subtitle, button text.

**Step 3: Build verification**

```bash
npm run build
```

**Step 4: Commit**

```bash
git add -A && git commit -m "feat: redesign Hero section with storytelling positioning"
```

---

### Task 9: About Me Redesign

**Files:**
- Modify: `src/components/AboutMe.tsx`
- Modify: `src/contexts/LanguageContext.tsx` (update about translations)

**Step 1: Rewrite AboutMe component**

- Grid layout: photo left (rectangular ~300x400, border-radius 12px) + text right on desktop
- Stack (photo top, text below) on mobile
- Full storytelling text from spec section 4 (from translations)
- "I don't specialize. I solve." — separate p tag, text-lg (1.25em), font-semibold (600)
- Quick Facts: 4 cards grid below text (📦 20+ Products, ⏱ 6 Years Solo, 🌍 Open Worldwide, 🔧 Idea → Production)
- Remove old social links from AboutMe (they go in Footer)
- Remove circular photo style, use rectangular with rounded-xl

**Step 2: Update translations**

Full About Me text in EN and RU. Quick facts in both languages.

**Step 3: Build verification**

```bash
npm run build
```

**Step 4: Commit**

```bash
git add -A && git commit -m "feat: redesign About Me with storytelling bio and quick facts"
```

---

### Task 10: Tech Stack Redesign

**Files:**
- Modify: `src/components/TechStack.tsx`

**Step 1: Rewrite TechStack component**

- Section title: "Tech Stack" (uppercase, small, muted)
- Primary row: filled chips (bg-info style) — Python, FastAPI, Docker, Linux/VPS, Next.js, React, TypeScript
- "Full stack →" toggle button
- Secondary row (hidden by default, CSS transition): outlined chips (border, smaller) — Suricata, Zeek, aiogram, Flutter, Electron, n8n, Claude AI, Deepgram, Bash, Nginx, SQLite, GCP
- React state for toggle (not <details>)
- Follow mockup styling exactly

**Step 2: Build verification**

```bash
npm run build
```

**Step 3: Commit**

```bash
git add -A && git commit -m "feat: redesign Tech Stack with primary/secondary toggle"
```

---

### Task 11: Contact Form + Footer Update

**Files:**
- Modify: `src/components/ContactForm.tsx`
- Modify: `src/components/Footer.tsx`
- Modify: `src/contexts/LanguageContext.tsx` (update contact/footer translations)

**Step 1: Update ContactForm**

- Update purpose dropdown: 4 options (Hire for a role, Discuss a project, Technical consulting, Just want to connect)
- Remove hardcoded bg-gradient styles, use flat design
- Update contact form Telegram message format to include new purpose options

**Step 2: Update Footer**

- Fix all contact links:
  - GitHub: https://github.com/CreatmanCEO/
  - Telegram: https://t.me/Creatman_it (display: @Creatman_it)
  - LinkedIn: https://www.linkedin.com/in/creatman/
  - Email: creatmanick@gmail.com
- Remove any references to nirwo, nir_creator, nirazulay

**Step 3: Update translations for contact + footer**

**Step 4: Build verification**

```bash
npm run build
```

**Step 5: Commit**

```bash
git add -A && git commit -m "feat: update contact form options and fix all contact links"
```

---

### Task 12: Navigation Update

**Files:**
- Modify: `src/components/Navigation.tsx`

**Step 1: Update Navigation**

- Nav items: Home, Projects, Blog, AI Analyst (4 items)
- Replace 5-language dropdown with EN/RU toggle (simple button with active state)
- Keep hamburger menu on mobile
- Keep theme toggle
- Remove social icons from nav (they're in footer)

**Step 2: Build verification**

```bash
npm run build
```

**Step 3: Commit**

```bash
git add -A && git commit -m "feat: update navigation with Blog link and EN/RU toggle"
```

---

### Task 13: Homepage Assembly + Cleanup

**Files:**
- Modify: `src/app/page.tsx`
- Delete: `src/components/WelcomeModal.tsx`
- Modify: `src/app/ai-analyst/page.tsx` (remove WelcomeModal import)

**Step 1: Update page.tsx**

Assemble sections in order: Hero → About Me → Tech Stack → Contact Form → Footer.
Remove spacer divs (sections should have proper margins built-in).

**Step 2: Remove WelcomeModal**

Delete WelcomeModal.tsx. Remove import from ai-analyst/page.tsx.

**Step 3: Build verification**

```bash
npm run build
```

**Step 4: Commit**

```bash
git add -A && git commit -m "refactor: assemble homepage sections, remove WelcomeModal"
```

---

## Phase 4: Projects (dynamic from SQLite)

### Task 14: Projects Page — Tags, Filter, Grid from SQLite

**Files:**
- Rewrite: `src/app/projects/page.tsx` (server component reading from SQLite)
- Rewrite: `src/components/ProjectCard.tsx` (new design with tag badges)
- Create: `src/components/ProjectFilter.tsx` (client component for tag filter)
- Create: `src/components/ProjectGrid.tsx` (client component wrapping cards)

**Step 1: Create ProjectFilter component**

Client component with tag chips. "all" selected by default (filled). Others outlined.
Click → filter projects client-side (no page reload).
Tags: all, security, ai, automation, devtools, fintech, infra, marketplace, business-tool, mobile, bot, opensource.
Tag badge colors from mockup: red=security, blue=ai, yellow=automation, purple=infra/devtools, green=production/opensource.

**Step 2: Rewrite ProjectCard component**

Match mockup: cover image area (gradient placeholder if no image), title, description excerpt (2-line clamp), tech chips (small, muted), tag badges (colored, bottom), status badge.
Link to /projects/[slug].

**Step 3: Create ProjectGrid component**

Client component. Receives projects + selected tag. Filters and renders grid.
3 columns desktop, 2 tablet, 1 mobile.
Special handling for aggregator card ("15+ Telegram Bots") — full-width, different background.

**Step 4: Rewrite projects/page.tsx**

Server component. Fetch all projects from SQLite via `db.select().from(projects).orderBy(desc(projects.year), asc(projects.sortOrder))`.
Pass to ProjectGrid client component.

**Step 5: Build + test**

```bash
npm test && npm run build
```

**Step 6: Commit**

```bash
git add -A && git commit -m "feat: dynamic projects page with tag filtering from SQLite"
```

---

### Task 15: Project Detail Pages from SQLite

**Files:**
- Rewrite: `src/app/projects/[slug]/page.tsx`
- Delete: `src/lib/projects.ts` (old hardcoded data)

**Step 1: Rewrite [slug]/page.tsx**

Server component. Fetch project by slug from SQLite.
generateStaticParams() → all slugs from SQLite.
Layout: Problem → Solution → Results (from description), Tech Stack breakdown, Screenshots gallery (if any), GitHub/Live links.
Dynamic metadata from project seo_title/seo_description (fallback to title/description).

**Step 2: Delete old lib/projects.ts**

No longer needed — data comes from SQLite.

**Step 3: Build verification**

```bash
npm run build
```

**Step 4: Commit**

```bash
git add -A && git commit -m "feat: dynamic project detail pages from SQLite"
```

---

## Phase 5: AI Analyst Fixes

### Task 16: AI Analyst — 3 Fixes

**Files:**
- Modify: `src/components/AIAnalyst.tsx` (folder click behavior, README auto-load)
- Modify: `src/components/ProjectSelector.tsx` (sort by updated_at)
- Modify: `src/app/api/analyze-code/route.ts` (model + system prompt)
- Modify: `src/app/ai-analyst/page.tsx` (header text)

**Step 1: Fix folder click behavior**

In AIAnalyst.tsx `handleFileSelect`: if type === "directory" → only expand tree, do NOT call analyzeCode(). Remove the directory analysis branch.

**Step 2: Fix README auto-load on project select**

In `handleProjectSelect`: after setting currentRepo, fetch README.md content via `/api/read-file?repo=...&path=README.md`. If 200 → analyze. If 404 → fetch repo description from GitHub API → display as analysis fallback + show top-level file list.

**Step 3: Fix Gemini model + system prompt**

In analyze-code/route.ts:
- Model: `gemini-2.5-flash` (not alias)
- Add to system prompt: `Current date: ${new Date().toISOString().split('T')[0]}. All technologies mentioned are current as of 2026. Analyze the code professionally.`

**Step 4: Sort repos by updated_at**

In ProjectSelector.tsx or /api/github/repos: ensure sort=updated (already in API), verify dropdown shows most recent first.

**Step 5: Update AI Analyst page header**

In ai-analyst/page.tsx: add header text "Explore My Code — AI-Powered Portfolio" / "Browse my GitHub repos. Click any file. Get instant AI analysis from Gemini."

**Step 6: Fix mobile collapsible panels**

In AIAnalyst.tsx mobile layout: wrap both FileTree AND CodeEditor in collapsible sections using React state + CSS transition (max-height) + chevron icon from lucide-react. Both panels same visual style. Proportions: CodeEditor ~30%, AnalysisPanel ~70%.

**Step 7: Build verification**

```bash
npm run build
```

**Step 8: Commit**

```bash
git add -A && git commit -m "fix: AI Analyst — folder analysis, README auto-load, Gemini 2.5 Flash, mobile panels"
```

---

## Phase 6: Admin Panel

### Task 17: Admin Content Editor

**Files:**
- Create: `src/app/(admin)/creatsetup/content/page.tsx`
- Create: `src/app/api/admin/content/route.ts` (GET/PUT site_content)
- Create: `src/components/admin/ContentEditor.tsx`
- Create: `src/components/admin/MarkdownPreview.tsx`

**Step 1: Create admin content API**

GET /api/admin/content → all site_content rows.
PUT /api/admin/content → update key-value pair → revalidatePath('/').

**Step 2: Create ContentEditor component**

Form with sections: Hero Subtitle (EN/RU), About Me (EN/RU, markdown textarea + live preview), Tech Stack (JSON editor), Quick Facts (JSON editor), Meta (title, description), Footer contacts.
Save button per section → PUT API → revalidate.

**Step 3: Create MarkdownPreview component**

Uses react-markdown to render preview. Install: `npm install react-markdown`

**Step 4: Create content page**

Route: /creatsetup/content. Renders ContentEditor.

**Step 5: Build verification**

```bash
npm run build
```

**Step 6: Commit**

```bash
git add -A && git commit -m "feat: admin content editor with markdown preview"
```

---

### Task 18: Admin Projects CRUD + AI Agent

**Files:**
- Create: `src/app/(admin)/creatsetup/projects/page.tsx`
- Create: `src/app/(admin)/creatsetup/projects/[id]/page.tsx`
- Create: `src/app/api/admin/projects/route.ts` (GET/POST)
- Create: `src/app/api/admin/projects/[id]/route.ts` (GET/PUT/DELETE)
- Create: `src/app/api/admin/projects/generate/route.ts` (AI generation)
- Create: `src/components/admin/ProjectForm.tsx`

**Step 1: Create projects CRUD API**

Standard REST: GET list, POST create, GET by id, PUT update, DELETE.
After each mutation: revalidatePath('/projects').

**Step 2: Create AI generation endpoint**

POST /api/admin/projects/generate with `{ github_url }`.
Fetches README.md from GitHub → sends to Gemini API → returns structured JSON (title, description, tags, tech_stack).
10 second timeout. Error → return `{ error: "AI generation unavailable" }`.

**Step 3: Create ProjectForm component**

Form fields: title (EN/RU), slug (auto-generated from title), description (EN/RU), year, status dropdown, tags (multi-select chips), tech_stack (chips input), GitHub URL, live URL, cover image upload, screenshots upload.
"🤖 Generate from GitHub" button → calls AI endpoint → pre-fills form.
User always reviews before save.

**Step 4: Create projects list page + edit page**

List: table with title, status, year, actions (edit/delete).
Edit: ProjectForm pre-filled with project data.

**Step 5: Build verification**

```bash
npm run build
```

**Step 6: Commit**

```bash
git add -A && git commit -m "feat: admin projects CRUD with AI-powered description generation"
```

---

### Task 19: Admin Blog Management

**Files:**
- Create: `src/app/(admin)/creatsetup/blog/page.tsx`
- Create: `src/app/(admin)/creatsetup/blog/[id]/page.tsx`
- Create: `src/app/api/admin/blog/route.ts` (GET/POST)
- Create: `src/app/api/admin/blog/[id]/route.ts` (GET/PUT/DELETE)
- Create: `src/app/api/admin/blog/aggregate/route.ts` (trigger aggregation)
- Create: `src/lib/blog-aggregator.ts`
- Create: `src/components/admin/BlogPostForm.tsx`

**Step 1: Create blog CRUD API**

Standard REST for original posts.

**Step 2: Create blog aggregator (src/lib/blog-aggregator.ts)**

Function `aggregateExternalPosts()`:
- Fetch Dev.to: `GET https://dev.to/api/articles?username=creatman&per_page=50`
- Fetch Hashnode: GraphQL API (if available, graceful fail if not)
- For each article: upsert into blog_posts (match by external_id + source)
- Set source, external_url, external_id, title, excerpt, cover_image, published_at

**Step 3: Create aggregation trigger endpoint**

POST /api/admin/blog/aggregate → runs aggregateExternalPosts() → returns count.

**Step 4: Create BlogPostForm component**

For original posts: title (EN/RU), slug, markdown editor (textarea) + preview, cover image, published toggle.
Tabs: All / Original / Aggregated.

**Step 5: Build verification**

```bash
npm run build
```

**Step 6: Commit**

```bash
git add -A && git commit -m "feat: admin blog management with Dev.to/Hashnode aggregation"
```

---

## Phase 7: Blog Public Page

### Task 20: Blog Page + Detail Pages

**Files:**
- Create: `src/app/blog/page.tsx`
- Create: `src/app/blog/[slug]/page.tsx`
- Create: `src/components/BlogCard.tsx`

**Step 1: Create blog page (/blog)**

Server component. Fetch all published blog_posts from SQLite, ordered by published_at DESC.
Render grid of BlogCards.

**Step 2: Create BlogCard component**

Cover image, title, excerpt, date, source badge (Dev.to/Hashnode/Original), reading time estimate.
External: `<a>` → platform URL (target="_blank").
Original: `<Link>` → /blog/[slug].

**Step 3: Create blog detail page (/blog/[slug])**

Only for original posts (source="original").
Render markdown via react-markdown.
Dynamic metadata from title/excerpt.

**Step 4: Build verification**

```bash
npm run build
```

**Step 5: Commit**

```bash
git add -A && git commit -m "feat: public blog page with aggregated and original posts"
```

---

## Phase 8: Analytics & SEO

### Task 21: Analytics Tracking

**Files:**
- Create: `src/app/api/track/route.ts`
- Create: `src/components/Analytics.tsx` (client component)
- Modify: `src/app/layout.tsx` (include Analytics component)

**Step 1: Create tracking API (POST /api/track)**

Accepts: `{ path, referrer }`. Extracts country from headers (CF-IPCountry or X-Forwarded-For + GeoIP lite). Extracts user_agent. Inserts into page_views.
Returns 204 No Content.

**Step 2: Create Analytics client component**

On mount: generate session_id (crypto.randomUUID()) in sessionStorage if not exists.
Send POST /api/track with path + referrer + session_id.
Render nothing (invisible tracker).

**Step 3: Add to layout**

Include `<Analytics />` in ClientLayout.

**Step 4: Build verification**

```bash
npm run build
```

**Step 5: Commit**

```bash
git add -A && git commit -m "feat: self-hosted privacy-friendly analytics tracking"
```

---

### Task 22: Analytics Dashboard in Admin

**Files:**
- Create: `src/app/(admin)/creatsetup/analytics/page.tsx`
- Create: `src/app/api/admin/analytics/route.ts`
- Create: `src/components/admin/AnalyticsDashboard.tsx`
- Modify: `package.json` (add recharts)

**Step 1: Install recharts**

```bash
npm install recharts
```

**Step 2: Create analytics API**

GET /api/admin/analytics?period=7d (or 1d, 30d, all).
Returns: visits_by_day (chart data), top_pages, top_referrers, top_countries, recent_visits (last 50), unique_visitors (by session_id).

**Step 3: Create AnalyticsDashboard component**

Period selector: [Today] [7d] [30d] [All].
Line chart (recharts): visits by day.
Tables: top pages, top referrers, top countries.
Scrollable list: last 50 visits (path, referrer, country, time).

**Step 4: Create analytics page**

Route: /creatsetup/analytics. Renders dashboard.

**Step 5: Build verification**

```bash
npm run build
```

**Step 6: Commit**

```bash
git add -A && git commit -m "feat: analytics dashboard with recharts in admin panel"
```

---

### Task 23: SEO Infrastructure

**Files:**
- Modify: `src/app/layout.tsx` (dynamic metadata from SQLite)
- Create: `src/app/sitemap.ts`
- Create: `src/app/robots.ts`
- Modify: `src/app/projects/page.tsx` (add metadata)
- Modify: `src/app/projects/[slug]/page.tsx` (add dynamic metadata)
- Modify: `src/app/blog/page.tsx` (add metadata)
- Modify: `src/app/blog/[slug]/page.tsx` (add dynamic metadata)
- Create: `src/components/JsonLd.tsx`

**Step 1: Create sitemap.ts**

Auto-generate from SQLite: homepage, /projects, /blog, /ai-analyst, all /projects/[slug], all /blog/[slug].

**Step 2: Create robots.ts**

Allow all. Disallow /creatsetup/. Link to sitemap.

**Step 3: Update layout.tsx metadata**

Read meta_title and meta_description from SQLite (site_content). Add Open Graph tags, Twitter cards.

**Step 4: Add per-page metadata**

Projects page, project detail, blog page, blog detail — each with dynamic title/description.

**Step 5: Create JSON-LD component**

Person schema (homepage), CreativeWork (project detail), BlogPosting (blog detail).
Render as `<script type="application/ld+json">` in page.

**Step 6: Build verification**

```bash
npm run build
```

**Step 7: Commit**

```bash
git add -A && git commit -m "feat: SEO infrastructure — sitemap, robots, JSON-LD, dynamic metadata"
```

---

## Phase 9: Infrastructure

### Task 24: Docker, Nginx, Image Uploads

**Files:**
- Modify: `docker-compose.yml` (add /data volume, seed on first start)
- Modify: `nginx.conf` (add creatsetup subdomain, rate limiting)
- Modify: `Dockerfile` (copy data dir setup)
- Create: `src/app/api/admin/upload/route.ts`
- Create: `src/lib/image-loader.ts` (custom Next.js image loader)
- Modify: `next.config.ts` (custom image loader)

**Step 1: Update docker-compose.yml**

Add volume: `./data:/app/data`
Add seed command on first start (entrypoint script that checks DB existence).

**Step 2: Update nginx.conf**

Add server block for creatsetup.creatman.site → proxy to portfolio:3000.
Add location block: /creatsetup/ on main domain → 404.
Add rate limiting zone for /api/track: `limit_req_zone $binary_remote_addr zone=analytics:10m rate=5r/s`.
Apply: `limit_req zone=analytics burst=10 nodelay` on /api/track location.

**Step 3: Create upload API**

POST /api/admin/upload — accepts multipart form data.
Saves to /data/uploads/ with UUID filename.
Returns path for storage in SQLite.
Max size: 5MB. Accepted: jpg, png, webp, gif.

**Step 4: Create custom image loader**

For Next.js Image component to read from /data/uploads/.

**Step 5: Update Dockerfile**

Ensure /app/data directory exists and is writable by nextjs user.

**Step 6: Build verification**

```bash
npm run build
```

**Step 7: Commit**

```bash
git add -A && git commit -m "feat: Docker volume for data, nginx subdomain, image uploads"
```

---

## Phase 10: Final

### Task 25: Changelog + Final Cleanup

**Files:**
- Create: `CHANGELOG.md`
- Modify: `src/app/api/contact/route.ts` (update purpose map for new options)
- Clean up any remaining hardcoded contact info

**Step 1: Create CHANGELOG.md**

Document all changes made in this redesign with version v3.0.0.

**Step 2: Final cleanup**

Grep codebase for old contact info (nir_creator, nirazulay, nirwo) — fix any remaining.
Verify all 4 contact dropdown options work in Telegram message format.
Remove any unused imports, dead code.

**Step 3: Full test suite**

```bash
npm test && npm run build
```

**Step 4: Commit**

```bash
git add -A && git commit -m "docs: add CHANGELOG, final cleanup for v3.0.0"
```

---

## Execution Order Summary

| # | Task | Phase | Depends On | Est. Complexity |
|---|------|-------|------------|-----------------|
| 1 | Vitest setup | Foundation | — | Low |
| 2 | SQLite + Drizzle schema | Foundation | — | Medium |
| 3 | Seed script | Foundation | 2 | Medium |
| 4 | Data access APIs | Foundation | 2 | Medium |
| 5 | NextAuth setup | Auth | — | Medium |
| 6 | Admin route group | Auth | 5 | Medium |
| 7 | i18n cleanup (EN/RU) | Frontend | — | Low |
| 8 | Hero redesign | Frontend | 7 | Low |
| 9 | About Me redesign | Frontend | 7 | Low |
| 10 | Tech Stack redesign | Frontend | — | Low |
| 11 | Contact + Footer fix | Frontend | 7 | Low |
| 12 | Navigation update | Frontend | 7 | Low |
| 13 | Homepage assembly | Frontend | 8,9,10,11 | Low |
| 14 | Projects page (SQLite) | Projects | 2,3,4 | High |
| 15 | Project detail pages | Projects | 14 | Medium |
| 16 | AI Analyst fixes | AI | — | Medium |
| 17 | Admin content editor | Admin | 5,6 | High |
| 18 | Admin projects CRUD + AI | Admin | 6,2 | High |
| 19 | Admin blog management | Admin | 6,2 | High |
| 20 | Blog public page | Blog | 19 | Medium |
| 21 | Analytics tracking | Analytics | 2 | Medium |
| 22 | Analytics dashboard | Analytics | 6,21 | Medium |
| 23 | SEO infrastructure | SEO | 2,14,20 | Medium |
| 24 | Docker/Nginx/uploads | Infra | all | Medium |
| 25 | Changelog + cleanup | Final | all | Low |

## Parallel Execution Opportunities

Tasks that can run simultaneously (no dependencies between them):
- **Batch 1:** Tasks 1 + 2 (Vitest + SQLite)
- **Batch 2:** Tasks 5 + 7 (Auth + i18n cleanup)
- **Batch 3:** Tasks 8 + 9 + 10 + 11 + 12 (all frontend visual tasks)
- **Batch 4:** Tasks 14 + 16 (Projects + AI Analyst)
- **Batch 5:** Tasks 17 + 18 + 19 (all admin CRUD)
- **Batch 6:** Tasks 21 + 23 (Analytics + SEO)
