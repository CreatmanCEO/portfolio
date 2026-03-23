import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { eq } from 'drizzle-orm'
import * as schema from '../../db/schema'

let sqlite: InstanceType<typeof Database>
let db: ReturnType<typeof drizzle>

beforeAll(() => {
  // Use in-memory database for tests
  sqlite = new Database(':memory:')
  sqlite.pragma('journal_mode = WAL')
  db = drizzle(sqlite, { schema })

  // Create tables manually for in-memory DB
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

afterAll(() => {
  sqlite.close()
})

describe('Database Schema', () => {
  describe('projects table', () => {
    it('should insert and retrieve a project', () => {
      db.insert(schema.projects).values({
        slug: 'test-project',
        titleEn: 'Test Project',
        titleRu: 'Тестовый проект',
        descriptionEn: 'A test project',
        tags: JSON.stringify(['ai', 'security']),
        techStack: JSON.stringify(['Python', 'FastAPI']),
        status: 'production',
        year: 2025,
      }).run()

      const result = db.select().from(schema.projects).where(eq(schema.projects.slug, 'test-project')).get()

      expect(result).toBeDefined()
      expect(result!.titleEn).toBe('Test Project')
      expect(result!.titleRu).toBe('Тестовый проект')
      expect(JSON.parse(result!.tags)).toEqual(['ai', 'security'])
      expect(result!.year).toBe(2025)
    })

    it('should enforce unique slug', () => {
      expect(() => {
        db.insert(schema.projects).values({
          slug: 'test-project',
          titleEn: 'Duplicate',
        }).run()
      }).toThrow()
    })
  })

  describe('site_content table', () => {
    it('should insert and retrieve content by key', () => {
      db.insert(schema.siteContent).values({
        key: 'hero_subtitle_en',
        value: 'I see problems. I build solutions.',
      }).run()

      const result = db.select().from(schema.siteContent).where(eq(schema.siteContent.key, 'hero_subtitle_en')).get()

      expect(result).toBeDefined()
      expect(result!.value).toBe('I see problems. I build solutions.')
    })
  })

  describe('blog_posts table', () => {
    it('should insert and retrieve a blog post', () => {
      db.insert(schema.blogPosts).values({
        slug: 'test-post',
        titleEn: 'Test Post',
        contentMd: '# Hello',
        source: 'original',
        published: true,
      }).run()

      const result = db.select().from(schema.blogPosts).where(eq(schema.blogPosts.slug, 'test-post')).get()

      expect(result).toBeDefined()
      expect(result!.source).toBe('original')
      expect(result!.published).toBe(true)
    })
  })

  describe('page_views table', () => {
    it('should insert and retrieve a page view', () => {
      db.insert(schema.pageViews).values({
        path: '/projects',
        referrer: 'https://google.com',
        sessionId: 'test-session-123',
      }).run()

      const result = db.select().from(schema.pageViews).where(eq(schema.pageViews.path, '/projects')).get()

      expect(result).toBeDefined()
      expect(result!.referrer).toBe('https://google.com')
      expect(result!.sessionId).toBe('test-session-123')
    })
  })
})
