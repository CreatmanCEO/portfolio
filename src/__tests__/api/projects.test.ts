import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { desc, asc, eq } from 'drizzle-orm'
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

  await seedDatabase(db)
})

afterAll(() => {
  sqlite.close()
})

describe('Projects API data layer', () => {
  it('should return all 20 projects', () => {
    const allProjects = db.select().from(schema.projects).all()
    expect(allProjects.length).toBe(20)
  })

  it('should return projects sorted by year DESC, sortOrder ASC', () => {
    const allProjects = db.select().from(schema.projects)
      .orderBy(desc(schema.projects.year), asc(schema.projects.sortOrder))
      .all()

    // First project should be year 2026 (highest year)
    expect(allProjects[0].year).toBe(2026)

    // Verify sorting: each project's year should be >= the next one
    for (let i = 0; i < allProjects.length - 1; i++) {
      expect(allProjects[i].year).toBeGreaterThanOrEqual(allProjects[i + 1].year)
    }
  })

  it('should filter projects by tag', () => {
    const allProjects = db.select().from(schema.projects).all()

    const parsed = allProjects.map(p => ({
      ...p,
      tags: JSON.parse(p.tags) as string[],
    }))

    const securityProjects = parsed.filter(p => p.tags.includes('security'))

    expect(securityProjects.length).toBeGreaterThan(0)
    for (const p of securityProjects) {
      expect(p.tags).toContain('security')
    }
  })

  it('should return correct project by slug', () => {
    const project = db.select().from(schema.projects)
      .where(eq(schema.projects.slug, 'security-scanner'))
      .get()

    expect(project).toBeDefined()
    expect(project!.slug).toBe('security-scanner')
    expect(project!.titleEn).toBe('Security Scanner Bot')
    expect(JSON.parse(project!.tags)).toContain('security')
  })

  it('should return undefined for nonexistent slug', () => {
    const project = db.select().from(schema.projects)
      .where(eq(schema.projects.slug, 'nonexistent'))
      .get()

    expect(project).toBeUndefined()
  })

  it('should parse JSON fields correctly', () => {
    const project = db.select().from(schema.projects)
      .where(eq(schema.projects.slug, 'security-scanner'))
      .get()

    expect(project).toBeDefined()

    const tags = JSON.parse(project!.tags)
    const techStack = JSON.parse(project!.techStack)

    expect(Array.isArray(tags)).toBe(true)
    expect(Array.isArray(techStack)).toBe(true)
    expect(tags.length).toBeGreaterThan(0)
    expect(techStack.length).toBeGreaterThan(0)
  })
})
