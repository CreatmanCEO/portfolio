import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { eq } from 'drizzle-orm'
import * as schema from '../../db/schema'
import { seedDatabase } from '../../db/seed'

let sqlite: InstanceType<typeof Database>
let db: ReturnType<typeof drizzle<typeof schema>>

beforeEach(() => {
  sqlite = new Database(':memory:')
  sqlite.pragma('journal_mode = WAL')
  db = drizzle(sqlite, { schema })

  sqlite.exec(`
    CREATE TABLE projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL UNIQUE,
      title_en TEXT NOT NULL,
      title_ru TEXT NOT NULL DEFAULT '',
      description_en TEXT NOT NULL DEFAULT '',
      description_ru TEXT NOT NULL DEFAULT '',
      tags TEXT NOT NULL DEFAULT '[]',
      tech_stack TEXT NOT NULL DEFAULT '[]',
      status TEXT NOT NULL DEFAULT 'production',
      year INTEGER NOT NULL DEFAULT 2024,
      github_url TEXT,
      live_url TEXT,
      cover_image TEXT,
      screenshots TEXT,
      seo_title TEXT,
      problem TEXT NOT NULL DEFAULT '',
      solution TEXT NOT NULL DEFAULT '',
      results TEXT NOT NULL DEFAULT '',
      complexity_badge TEXT,
      seo_description TEXT,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE site_content (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL DEFAULT '',
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE blog_posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL UNIQUE,
      title_en TEXT NOT NULL,
      title_ru TEXT NOT NULL DEFAULT '',
      content_md TEXT NOT NULL DEFAULT '',
      excerpt TEXT,
      cover_image TEXT,
      source TEXT NOT NULL DEFAULT 'original',
      external_url TEXT,
      external_id TEXT,
      published INTEGER NOT NULL DEFAULT 0,
      published_at TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE page_views (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      path TEXT NOT NULL,
      referrer TEXT,
      country TEXT,
      user_agent TEXT,
      session_id TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `)
})

afterEach(() => {
  sqlite.close()
})

describe('seedDatabase', () => {
  it('should seed 14 site_content keys on empty DB', async () => {
    await seedDatabase(db)

    const rows = db.select().from(schema.siteContent).all()
    expect(rows).toHaveLength(14)
  })

  it('should seed 20 projects on empty DB', async () => {
    await seedDatabase(db)

    const rows = db.select().from(schema.projects).all()
    expect(rows).toHaveLength(20)
  })

  it('should be idempotent — second run does not duplicate data', async () => {
    await seedDatabase(db)
    await seedDatabase(db)

    const contentRows = db.select().from(schema.siteContent).all()
    const projectRows = db.select().from(schema.projects).all()

    expect(contentRows).toHaveLength(14)
    expect(projectRows).toHaveLength(20)
  })

  it('should insert security-scanner project with correct data', async () => {
    await seedDatabase(db)

    const project = db
      .select()
      .from(schema.projects)
      .where(eq(schema.projects.slug, 'security-scanner'))
      .get()

    expect(project).toBeDefined()
    expect(project!.titleEn).toBe('Security Scanner Bot')
    expect(project!.status).toBe('production')
    expect(project!.year).toBe(2026)
    expect(project!.sortOrder).toBe(0)

    const tags = JSON.parse(project!.tags)
    expect(tags).toContain('security')
    expect(tags).toContain('ai')
    expect(tags).toContain('infra')
  })

  it('should insert site content with correct values', async () => {
    await seedDatabase(db)

    const metaTitle = db
      .select()
      .from(schema.siteContent)
      .where(eq(schema.siteContent.key, 'meta_title'))
      .get()

    expect(metaTitle).toBeDefined()
    expect(metaTitle!.value).toBe('Creatman — Technical Product Builder | From Problem to Production')

    const techStack = db
      .select()
      .from(schema.siteContent)
      .where(eq(schema.siteContent.key, 'tech_stack'))
      .get()

    expect(techStack).toBeDefined()
    const parsed = JSON.parse(techStack!.value)
    expect(parsed.primary).toContain('Python')
    expect(parsed.secondary).toContain('Suricata')
  })
})
