import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import * as schema from '../../db/schema'
import { seedDatabase } from '../../db/seed'

let sqlite: InstanceType<typeof Database>
let db: ReturnType<typeof drizzle>

beforeAll(async () => {
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

  await seedDatabase(db)
})

afterAll(() => {
  sqlite.close()
})

describe('Content API data layer', () => {
  it('should return all site_content as key-value pairs', () => {
    const rows = db.select().from(schema.siteContent).all()
    const content: Record<string, string> = {}
    for (const row of rows) {
      content[row.key] = row.value
    }

    expect(Object.keys(content).length).toBe(14)
  })

  it('should contain all expected keys', () => {
    const rows = db.select().from(schema.siteContent).all()
    const keys = rows.map(r => r.key)

    const expectedKeys = [
      'hero_subtitle_en',
      'hero_subtitle_ru',
      'about_en',
      'about_ru',
      'tech_stack',
      'quick_facts',
      'meta_title',
      'meta_description',
      'footer_github',
      'footer_telegram',
      'footer_linkedin',
      'footer_email',
    ]

    for (const key of expectedKeys) {
      expect(keys).toContain(key)
    }
  })

  it('should have hero_subtitle_en containing expected text', () => {
    const rows = db.select().from(schema.siteContent).all()
    const content: Record<string, string> = {}
    for (const row of rows) {
      content[row.key] = row.value
    }

    expect(content.hero_subtitle_en).toContain('I built a security scanner')
  })
})
