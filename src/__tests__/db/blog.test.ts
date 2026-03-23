import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { eq, sql } from 'drizzle-orm'
import * as schema from '../../db/schema'

let sqlite: InstanceType<typeof Database>
let db: ReturnType<typeof drizzle>

const CREATE_TABLES = `
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

describe('Blog data layer', () => {
  it('should insert an original blog post and verify all fields', () => {
    db.insert(schema.blogPosts).values({
      slug: 'my-first-post',
      titleEn: 'My First Post',
      titleRu: 'Мой первый пост',
      contentMd: '# Hello World\n\nThis is content.',
      excerpt: 'A short excerpt',
      coverImage: '/images/post1.jpg',
      source: 'original',
      published: true,
      publishedAt: '2026-01-15T10:00:00Z',
    }).run()

    const post = db.select().from(schema.blogPosts)
      .where(eq(schema.blogPosts.slug, 'my-first-post'))
      .get()

    expect(post).toBeDefined()
    expect(post!.id).toBe(1)
    expect(post!.slug).toBe('my-first-post')
    expect(post!.titleEn).toBe('My First Post')
    expect(post!.titleRu).toBe('Мой первый пост')
    expect(post!.contentMd).toBe('# Hello World\n\nThis is content.')
    expect(post!.excerpt).toBe('A short excerpt')
    expect(post!.coverImage).toBe('/images/post1.jpg')
    expect(post!.source).toBe('original')
    expect(post!.published).toBe(true)
    expect(post!.publishedAt).toBe('2026-01-15T10:00:00Z')
    expect(post!.externalUrl).toBeNull()
    expect(post!.externalId).toBeNull()
    expect(post!.createdAt).toBeDefined()
    expect(post!.updatedAt).toBeDefined()
  })

  it('should insert an aggregated post (devto source) with source and externalId', () => {
    db.insert(schema.blogPosts).values({
      slug: 'devto-imported-post',
      titleEn: 'Imported from Dev.to',
      contentMd: 'Imported content',
      source: 'devto',
      externalUrl: 'https://dev.to/creatman/my-post',
      externalId: 'devto-12345',
      published: true,
    }).run()

    const post = db.select().from(schema.blogPosts)
      .where(eq(schema.blogPosts.slug, 'devto-imported-post'))
      .get()

    expect(post).toBeDefined()
    expect(post!.source).toBe('devto')
    expect(post!.externalUrl).toBe('https://dev.to/creatman/my-post')
    expect(post!.externalId).toBe('devto-12345')
  })

  it('should query only published posts, excluding unpublished', () => {
    db.insert(schema.blogPosts).values({
      slug: 'published-post',
      titleEn: 'Published',
      published: true,
    }).run()

    db.insert(schema.blogPosts).values({
      slug: 'draft-post',
      titleEn: 'Draft',
      published: false,
    }).run()

    db.insert(schema.blogPosts).values({
      slug: 'another-draft',
      titleEn: 'Another Draft',
      // published defaults to false
    }).run()

    const allPosts = db.select().from(schema.blogPosts).all()
    expect(allPosts).toHaveLength(3)

    const publishedPosts = db.select().from(schema.blogPosts)
      .where(eq(schema.blogPosts.published, true))
      .all()

    expect(publishedPosts).toHaveLength(1)
    expect(publishedPosts[0].slug).toBe('published-post')
  })

  it('should enforce unique slug constraint', () => {
    db.insert(schema.blogPosts).values({
      slug: 'unique-slug',
      titleEn: 'First Post',
    }).run()

    expect(() => {
      db.insert(schema.blogPosts).values({
        slug: 'unique-slug',
        titleEn: 'Duplicate Slug Post',
      }).run()
    }).toThrow()
  })
})
