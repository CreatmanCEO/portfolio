import { type BetterSQLite3Database } from 'drizzle-orm/better-sqlite3'
import { sql } from 'drizzle-orm'
import * as schema from './schema'

// Default: use the app's db instance
let defaultDb: BetterSQLite3Database<typeof schema> | null = null
function getDefaultDb() {
  if (!defaultDb) {
    // Dynamic import to avoid circular issues; the module is cached
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { db } = require('./index')
    defaultDb = db
  }
  return defaultDb!
}

/* ───────── Site Content ───────── */

const siteContentRows: { key: string; value: string }[] = [
  {
    key: 'hero_subtitle_en',
    value: `A phone had 26 backdoor connections — I built a security scanner with Suricata IDS. Government broke the internet — I built VPN infrastructure for 100+ clients. Someone needed a crypto wallet — I shipped it to the App Store.

20+ products. 6 years. Every time a new field.`,
  },
  {
    key: 'hero_subtitle_ru',
    value: `У телефона было 26 бэкдор-соединений — я построил сканер безопасности с Suricata IDS. Правительство сломало интернет — я построил VPN-инфраструктуру для 100+ клиентов. Кому-то понадобился крипто-кошелёк — я выпустил его в App Store.

20+ продуктов. 6 лет. Каждый раз новая область.`,
  },
  {
    key: 'about_en',
    value: `I build things that solve real problems. In whatever field the problem lives.

A friend's phone was compromised — I'd never built a security scanner before. Two days later I had a working product with Suricata IDS, behavioral analysis, and AI-generated reports finding real threats on real devices.

Government breaks the internet — I build VPN infrastructure that bypasses censorship for dozens of clients. Need a crypto wallet — I ship it to the App Store. Need a marketplace — I build it on Flutter and GCP. Need developer tools — I publish them on GitHub.

Before software, I led geological field expeditions in Kolyma, Siberia — mapping subsurface structures in conditions where you can't afford to guess wrong.

6 years running CREATMAN. 20+ shipped products. Security, AI, fintech, infrastructure, automation, developer tools, education.`,
  },
  {
    key: 'about_ru',
    value: `Я строю вещи, которые решают реальные проблемы. В какой бы области эта проблема ни жила.

Телефон друга был скомпрометирован — я никогда раньше не строил сканер безопасности. Через два дня у меня был рабочий продукт с Suricata IDS, поведенческим анализом и AI-отчётами, находящими реальные угрозы на реальных устройствах.

Правительство ломает интернет — я строю VPN-инфраструктуру, обходящую цензуру для десятков клиентов. Нужен крипто-кошелёк — выпускаю в App Store. Нужен маркетплейс — строю на Flutter и GCP. Нужны developer tools — публикую на GitHub.

До софтвера я руководил геологическими полевыми экспедициями на Колыме, в Сибири — картировал подземные структуры в условиях, где нельзя позволить себе ошибку.

6 лет CREATMAN. 20+ shipped продуктов. Безопасность, AI, финтех, инфраструктура, автоматизация, developer tools, образование.`,
  },
  {
    key: 'tech_stack',
    value: JSON.stringify({
      primary: ['Python', 'FastAPI', 'Docker', 'Linux/VPS', 'Next.js', 'React', 'TypeScript'],
      secondary: ['Suricata', 'Zeek', 'aiogram', 'Flutter', 'Electron', 'n8n', 'Claude AI', 'Deepgram', 'Bash', 'Nginx', 'SQLite', 'GCP'],
    }),
  },
  {
    key: 'quick_facts',
    value: JSON.stringify([
      { icon: '📦', textEn: '20+ Products', textRu: '20+ Продуктов' },
      { icon: '⏱', textEn: '6 Years Solo', textRu: '6 Лет Соло' },
      { icon: '🌍', textEn: 'Open Worldwide', textRu: 'Открыт миру' },
      { icon: '🔧', textEn: 'Idea → Production', textRu: 'Идея → Продакшн' },
    ]),
  },
  { key: 'meta_title', value: 'Creatman — Technical Product Builder | From Problem to Production' },
  { key: 'meta_description', value: 'I see problems and build solutions. 20+ shipped products across security, AI, fintech, infrastructure, and developer tools.' },
  { key: 'footer_github', value: 'https://github.com/CreatmanCEO/' },
  { key: 'footer_telegram', value: 'https://t.me/Creatman_it' },
  { key: 'footer_linkedin', value: 'https://www.linkedin.com/in/creatman/' },
  { key: 'footer_email', value: 'creatmanick@gmail.com' },
  { key: 'og_image_url', value: '' },
  { key: 'twitter_handle', value: '' },
]

/* ───────── Projects ───────── */

interface ProjectSeed {
  slug: string
  titleEn: string
  titleRu: string
  descriptionEn: string
  descriptionRu: string
  tags: string
  techStack: string
  status: string
  year: number
  githubUrl?: string
  liveUrl?: string
  sortOrder: number
}

const projectRows: ProjectSeed[] = [
  {
    slug: 'security-scanner',
    titleEn: 'Security Scanner Bot',
    titleRu: '',
    descriptionEn: 'Telegram bot for mobile threat detection via VPN traffic analysis — no app installation required. Four-layer engine: port analysis, behavioral patterns, blacklist correlation (919 stalkerware domains), and JA3 TLS fingerprinting (97 malware signatures), plus Suricata IDS with ~19K rules.',
    descriptionRu: '',
    tags: JSON.stringify(['security', 'ai', 'infra']),
    techStack: JSON.stringify(['Python', 'Telegram Bot API', 'Suricata IDS', 'JA3 Fingerprinting', 'AI Reports']),
    status: 'production',
    year: 2026,
    githubUrl: 'https://github.com/CreatmanCEO/security-scanner',
    sortOrder: 0,
  },
  {
    slug: 'life-hub',
    titleEn: 'Creatman Life Hub',
    titleRu: '',
    descriptionEn: 'AI-powered life management system with goal visualization, natural language input, and intelligent activity classification. Track progress through plant growth metaphor.',
    descriptionRu: '',
    tags: JSON.stringify(['ai']),
    techStack: JSON.stringify(['Python', 'FastAPI', 'React', 'TypeScript', 'AI Classification', 'Docker']),
    status: 'production',
    year: 2025,
    liveUrl: 'https://hub.creatman.ru',
    sortOrder: 1,
  },
  {
    slug: 'vpn-infrastructure',
    titleEn: 'VPN Infrastructure',
    titleRu: '',
    descriptionEn: 'Production VPN infrastructure with WebSocket transport and DPI bypass serving business clients. Custom protocol implementation with automated monitoring.',
    descriptionRu: '',
    tags: JSON.stringify(['security', 'infra']),
    techStack: JSON.stringify(['Python', 'WebSocket', 'Network Security', 'Monitoring']),
    status: 'production',
    year: 2024,
    sortOrder: 2,
  },
  {
    slug: 'datn',
    titleEn: 'DATN',
    titleRu: '',
    descriptionEn: 'Multi-agent trading AI system with complex decision-making architecture. Concept phase exploring autonomous trading strategies with AI coordination.',
    descriptionRu: '',
    tags: JSON.stringify(['ai', 'fintech']),
    techStack: JSON.stringify(['Python', 'Multi-Agent Systems', 'AI', 'Trading Algorithms']),
    status: 'in_development',
    year: 2026,
    githubUrl: 'https://github.com/CreatmanCEO/datn',
    sortOrder: 3,
  },
  {
    slug: 'ghost',
    titleEn: 'GHOST — AI Assistant',
    titleRu: '',
    descriptionEn: 'AI assistant with invisible overlay for interviews, meetings, and coding. Multi-provider LLM support (Claude, GPT-4, Gemini), real-time voice transcription.',
    descriptionRu: '',
    tags: JSON.stringify(['ai', 'automation']),
    techStack: JSON.stringify(['Electron', 'React', 'TypeScript', 'Python', 'Claude', 'Deepgram']),
    status: 'production',
    year: 2025,
    githubUrl: 'https://github.com/CreatmanCEO/ghost-showcase',
    sortOrder: 4,
  },
  {
    slug: 'aviawallet',
    titleEn: 'AviaWallet',
    titleRu: '',
    descriptionEn: 'Mobile app for managing aviation wallet points. Built with Flutter, shipped to App Store. Features offline sync, push notifications, analytics.',
    descriptionRu: '',
    tags: JSON.stringify(['fintech', 'mobile']),
    techStack: JSON.stringify(['Flutter', 'Dart', 'Firebase', 'App Store']),
    status: 'production',
    year: 2023,
    liveUrl: 'https://www.aviacoinus7.com/',
    sortOrder: 5,
  },
  {
    slug: 'accu',
    titleEn: 'ACCU',
    titleRu: '',
    descriptionEn: 'Automated Claude Code agent updater. Monitors GitHub releases, auto-updates binary, notification system. Self-hosted on VPS.',
    descriptionRu: '',
    tags: JSON.stringify(['devtools', 'automation']),
    techStack: JSON.stringify(['Python', 'GitHub API', 'VPS', 'Telegram']),
    status: 'production',
    year: 2025,
    githubUrl: 'https://github.com/CreatmanCEO/accu',
    sortOrder: 6,
  },
  {
    slug: 'club-sbor',
    titleEn: 'Club-sbor.ru',
    titleRu: '',
    descriptionEn: 'Full-stack marketplace platform built with Bubble.io. Complex algorithmic backend, payment integration, user management. Co-author project.',
    descriptionRu: '',
    tags: JSON.stringify(['marketplace', 'business-tool']),
    techStack: JSON.stringify(['Bubble.io', 'No-Code', 'API', 'Payments']),
    status: 'production',
    year: 2022,
    liveUrl: 'https://club-sbor.ru',
    sortOrder: 7,
  },
  {
    slug: 'cian-parser',
    titleEn: 'Cian Parser',
    titleRu: '',
    descriptionEn: 'Real estate data scraper with advanced filtering. Exports to Excel, scheduled parsing, duplicate detection. Headless browser automation.',
    descriptionRu: '',
    tags: JSON.stringify(['automation', 'bot']),
    techStack: JSON.stringify(['Python', 'Selenium', 'Pandas', 'Excel']),
    status: 'production',
    year: 2023,
    githubUrl: 'https://github.com/CreatmanCEO/cian-parser-showcase',
    sortOrder: 8,
  },
  {
    slug: 'smart-link-collector',
    titleEn: 'Smart Link Collector',
    titleRu: '',
    descriptionEn: 'Browser extension for organizing links with AI-powered categorization. Sync across devices, export to Notion.',
    descriptionRu: '',
    tags: JSON.stringify(['automation', 'bot']),
    techStack: JSON.stringify(['TypeScript', 'Chrome API', 'Claude', 'Notion API']),
    status: 'production',
    year: 2024,
    githubUrl: 'https://github.com/CreatmanCEO/smart-link-collector',
    sortOrder: 9,
  },
  {
    slug: 'hebrew-translator',
    titleEn: 'Hebrew Translator Bot',
    titleRu: '',
    descriptionEn: 'Telegram bot for document translation with OCR support. Handles images, PDFs, text. Translation memory for consistency.',
    descriptionRu: '',
    tags: JSON.stringify(['ai', 'bot']),
    techStack: JSON.stringify(['Python', 'Telegram Bot API', 'OCR', 'Translation API']),
    status: 'production',
    year: 2024,
    githubUrl: 'https://github.com/CreatmanCEO/hebrew_doc_translator',
    sortOrder: 10,
  },
  {
    slug: 'lingua-companion',
    titleEn: 'LinguaCompanion AI',
    titleRu: '',
    descriptionEn: 'Voice-first AI language learning platform for Russian-speaking IT professionals. Mixed Russian/English speech recognition, real-time grammar correction, pronunciation analysis, and conversational memory.',
    descriptionRu: '',
    tags: JSON.stringify(['ai']),
    techStack: JSON.stringify(['Next.js', 'FastAPI', 'Groq', 'Gemini', 'Azure Speech SDK', 'Supabase', 'Redis', 'Docker']),
    status: 'in_development',
    year: 2026,
    githubUrl: 'https://github.com/CreatmanCEO/lingua-companion',
    sortOrder: 11,
  },
  {
    slug: 'claude-statusline',
    titleEn: 'claude-statusline',
    titleRu: '',
    descriptionEn: 'Lightweight status line for Claude Code displaying model info, session cost, context window usage, git status, and VPS health monitoring. Pure bash with no Node.js dependencies.',
    descriptionRu: '',
    tags: JSON.stringify(['devtools', 'opensource']),
    techStack: JSON.stringify(['Bash', 'jq', 'SSH']),
    status: 'production',
    year: 2026,
    githubUrl: 'https://github.com/CreatmanCEO/claude-statusline',
    sortOrder: 12,
  },
  {
    slug: 'claude-antiregression',
    titleEn: 'Claude Code Anti-Regression Setup',
    titleRu: '',
    descriptionEn: 'Configuration kit preventing Claude Code regressions during long sessions. Four-layer defense: persistent CLAUDE.md rules, isolated subagents, commit-blocking hooks, and glob-scoped coding standards.',
    descriptionRu: '',
    tags: JSON.stringify(['devtools', 'opensource']),
    techStack: JSON.stringify(['Markdown', 'Claude Code Hooks', 'Agents', 'Rules']),
    status: 'production',
    year: 2026,
    githubUrl: 'https://github.com/CreatmanCEO/claude-code-antiregression-setup',
    sortOrder: 13,
  },
  {
    slug: 'joy-vision-calculator',
    titleEn: 'Joy Vision Calculator',
    titleRu: '',
    descriptionEn: "Web application for calculating frameless glazing components (4 system types). Automatic PDF generation of commercial proposals, Bitrix24 CRM integration, price list management with Excel import. Client's employee spent weeks — built in 1 day.",
    descriptionRu: '',
    tags: JSON.stringify(['business-tool']),
    techStack: JSON.stringify(['Python', 'Flask', 'SQLAlchemy', 'SQLite', 'ReportLab', 'Pandas']),
    status: 'production',
    year: 2026,
    githubUrl: 'https://github.com/CreatmanCEO/joy-vision-calculator',
    sortOrder: 14,
  },
  {
    slug: 'notion-knowledge-assistant',
    titleEn: 'Notion Knowledge Assistant',
    titleRu: '',
    descriptionEn: 'AI-powered Telegram bot turning personal Notion knowledge base into a queryable assistant. Built for a crisis psychologist to search through notes, PDFs, and e-books with fuzzy matching and GPT-4 answers with source citations.',
    descriptionRu: '',
    tags: JSON.stringify(['ai', 'bot']),
    techStack: JSON.stringify(['Python', 'python-telegram-bot', 'OpenAI GPT-4', 'httpx', 'RapidFuzz', 'Docker']),
    status: 'production',
    year: 2024,
    githubUrl: 'https://github.com/CreatmanCEO/notion-knowledge-assistant',
    sortOrder: 15,
  },
  {
    slug: 'sakhalin-market',
    titleEn: 'Sakhalin-Market',
    titleRu: '',
    descriptionEn: 'Regional marketplace for Sakhalin Island. Flutter mobile app + GCP backend.',
    descriptionRu: '',
    tags: JSON.stringify(['marketplace', 'mobile']),
    techStack: JSON.stringify(['Flutter', 'Dart', 'GCP']),
    status: 'production',
    year: 2022,
    sortOrder: 16,
  },
  {
    slug: 'altecotopia',
    titleEn: 'Altecotopia',
    titleRu: '',
    descriptionEn: 'Eco-friendly marketplace on Shopify. First IT project (2020).',
    descriptionRu: '',
    tags: JSON.stringify(['marketplace']),
    techStack: JSON.stringify(['Shopify']),
    status: 'production',
    year: 2020,
    sortOrder: 17,
  },
  {
    slug: 'telegram-bots-aggregator',
    titleEn: '15+ Production Telegram Bots',
    titleRu: '',
    descriptionEn: 'CIAN parser, Notion assistant, form worker, Hebrew translator, VPN key bot, commercial VPN bot, and more.',
    descriptionRu: '',
    tags: JSON.stringify(['bot', 'automation']),
    techStack: JSON.stringify(['Python', 'aiogram', 'n8n', 'Telegram Bot API']),
    status: 'production',
    year: 2023,
    sortOrder: 18,
  },
  {
    slug: 'ai-code-analyst',
    titleEn: 'AI Code Analyst',
    titleRu: '',
    descriptionEn: 'Built into creatman.site — visitors can browse GitHub repos and get instant AI code analysis from Gemini.',
    descriptionRu: '',
    tags: JSON.stringify(['ai', 'devtools', 'opensource']),
    techStack: JSON.stringify(['Next.js', 'TypeScript', 'GitHub API', 'Gemini API']),
    status: 'production',
    year: 2025,
    liveUrl: 'https://creatman.site/ai-analyst',
    sortOrder: 19,
  },
]

/* ───────── Seed Function ───────── */

export async function seedDatabase(dbInstance?: BetterSQLite3Database<typeof schema>) {
  const database = dbInstance ?? getDefaultDb()

  // Check if already seeded
  const existing = database
    .select({ key: schema.siteContent.key })
    .from(schema.siteContent)
    .all()

  if (existing.length > 0) {
    console.log('Database already seeded, skipping')
    return
  }

  // Insert site content
  for (const row of siteContentRows) {
    database.insert(schema.siteContent).values(row).run()
  }

  // Insert projects
  for (const row of projectRows) {
    database.insert(schema.projects).values(row).run()
  }

  const contentCount = database.select({ count: sql<number>`count(*)` }).from(schema.siteContent).get()
  const projectCount = database.select({ count: sql<number>`count(*)` }).from(schema.projects).get()

  console.log(`Seeded ${contentCount?.count ?? 0} site_content keys`)
  console.log(`Seeded ${projectCount?.count ?? 0} projects`)
}
