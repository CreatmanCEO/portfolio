import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { eq } from 'drizzle-orm'
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

describe('Admin Content API logic', () => {
  it('should upsert a new content key and verify it is stored', () => {
    // Simulate PUT logic: insert new key
    const key = 'custom_banner'
    const value = 'Welcome to my portfolio!'

    const existing = db.select().from(schema.siteContent)
      .where(eq(schema.siteContent.key, key))
      .get()

    expect(existing).toBeUndefined()

    // Insert new
    db.insert(schema.siteContent).values({ key, value }).run()

    const inserted = db.select().from(schema.siteContent)
      .where(eq(schema.siteContent.key, key))
      .get()

    expect(inserted).toBeDefined()
    expect(inserted!.value).toBe('Welcome to my portfolio!')
  })

  it('should read all content and verify 12 seed keys plus custom', () => {
    const rows = db.select().from(schema.siteContent).all()
    // 12 from seed + 1 from previous test
    expect(rows.length).toBe(13)

    const keys = rows.map(r => r.key)
    expect(keys).toContain('hero_subtitle_en')
    expect(keys).toContain('hero_subtitle_ru')
    expect(keys).toContain('about_en')
    expect(keys).toContain('about_ru')
    expect(keys).toContain('tech_stack')
    expect(keys).toContain('quick_facts')
    expect(keys).toContain('meta_title')
    expect(keys).toContain('meta_description')
    expect(keys).toContain('footer_github')
    expect(keys).toContain('footer_telegram')
    expect(keys).toContain('footer_linkedin')
    expect(keys).toContain('footer_email')
  })

  it('should update an existing key and verify new value', () => {
    const key = 'meta_title'
    const newValue = 'Creatman — Updated Title'

    // Simulate PUT update logic
    db.update(schema.siteContent)
      .set({ value: newValue, updatedAt: new Date().toISOString() })
      .where(eq(schema.siteContent.key, key))
      .run()

    const updated = db.select().from(schema.siteContent)
      .where(eq(schema.siteContent.key, key))
      .get()

    expect(updated).toBeDefined()
    expect(updated!.value).toBe('Creatman — Updated Title')
  })
})
