import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { eq } from 'drizzle-orm'
import * as schema from '../../db/schema'

let sqlite: InstanceType<typeof Database>
let db: ReturnType<typeof drizzle>

const CREATE_TABLES = `
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
`

beforeEach(() => {
  sqlite = new Database(':memory:')
  sqlite.pragma('journal_mode = WAL')
  db = drizzle(sqlite, { schema })
  sqlite.exec(CREATE_TABLES)
})

afterEach(() => {
  sqlite.close()
})

describe('Admin Projects API logic', () => {
  it('should create a project with auto-generated slug from titleEn', () => {
    const data = {
      titleEn: 'My New Awesome Project!',
      titleRu: 'Мой новый проект',
      tags: ['ai', 'web'],
      techStack: ['Next.js', 'TypeScript'],
      status: 'production',
      year: 2026,
    }

    // Replicate the auto-slug logic from admin/projects route
    const slug = data.titleEn
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    expect(slug).toBe('my-new-awesome-project')

    db.insert(schema.projects).values({
      slug,
      titleEn: data.titleEn,
      titleRu: data.titleRu,
      tags: JSON.stringify(data.tags),
      techStack: JSON.stringify(data.techStack),
      status: data.status,
      year: data.year,
    }).run()

    const project = db.select().from(schema.projects)
      .where(eq(schema.projects.slug, 'my-new-awesome-project'))
      .get()

    expect(project).toBeDefined()
    expect(project!.titleEn).toBe('My New Awesome Project!')
    expect(project!.year).toBe(2026)
    expect(JSON.parse(project!.tags)).toEqual(['ai', 'web'])
  })

  it('should update a project and verify changed fields', () => {
    // Insert initial project
    db.insert(schema.projects).values({
      slug: 'updatable-project',
      titleEn: 'Original Title',
      descriptionEn: 'Original description',
      year: 2024,
      status: 'concept',
    }).run()

    const original = db.select().from(schema.projects)
      .where(eq(schema.projects.slug, 'updatable-project'))
      .get()

    expect(original).toBeDefined()

    // Simulate PUT update logic
    db.update(schema.projects)
      .set({
        titleEn: 'Updated Title',
        descriptionEn: 'Updated description',
        status: 'production',
        year: 2026,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(schema.projects.id, original!.id))
      .run()

    const updated = db.select().from(schema.projects)
      .where(eq(schema.projects.id, original!.id))
      .get()

    expect(updated!.titleEn).toBe('Updated Title')
    expect(updated!.descriptionEn).toBe('Updated description')
    expect(updated!.status).toBe('production')
    expect(updated!.year).toBe(2026)
    expect(updated!.slug).toBe('updatable-project') // slug unchanged
  })

  it('should delete a project and verify it is removed', () => {
    db.insert(schema.projects).values({
      slug: 'to-delete',
      titleEn: 'Delete Me',
    }).run()

    const before = db.select().from(schema.projects)
      .where(eq(schema.projects.slug, 'to-delete'))
      .get()

    expect(before).toBeDefined()

    db.delete(schema.projects)
      .where(eq(schema.projects.id, before!.id))
      .run()

    const after = db.select().from(schema.projects)
      .where(eq(schema.projects.slug, 'to-delete'))
      .get()

    expect(after).toBeUndefined()
  })

  it('should filter projects by tag using JSON parsing', () => {
    db.insert(schema.projects).values({
      slug: 'ai-project',
      titleEn: 'AI Project',
      tags: JSON.stringify(['ai', 'security']),
    }).run()

    db.insert(schema.projects).values({
      slug: 'web-project',
      titleEn: 'Web Project',
      tags: JSON.stringify(['web', 'frontend']),
    }).run()

    db.insert(schema.projects).values({
      slug: 'ai-web-project',
      titleEn: 'AI Web Project',
      tags: JSON.stringify(['ai', 'web']),
    }).run()

    const allProjects = db.select().from(schema.projects).all()
    const aiProjects = allProjects.filter(p => {
      const tags = JSON.parse(p.tags) as string[]
      return tags.includes('ai')
    })

    expect(aiProjects).toHaveLength(2)
    expect(aiProjects.map(p => p.slug).sort()).toEqual(['ai-project', 'ai-web-project'])

    const webProjects = allProjects.filter(p => {
      const tags = JSON.parse(p.tags) as string[]
      return tags.includes('web')
    })

    expect(webProjects).toHaveLength(2)
    expect(webProjects.map(p => p.slug).sort()).toEqual(['ai-web-project', 'web-project'])
  })
})
