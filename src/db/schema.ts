import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'

export const projects = sqliteTable('projects', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  slug: text('slug').notNull().unique(),
  titleEn: text('title_en').notNull(),
  titleRu: text('title_ru').notNull().default(''),
  descriptionEn: text('description_en').notNull().default(''),
  descriptionRu: text('description_ru').notNull().default(''),
  tags: text('tags').notNull().default('[]'), // JSON array: ["security", "ai"]
  techStack: text('tech_stack').notNull().default('[]'), // JSON array: ["Python", "FastAPI"]
  status: text('status').notNull().default('production'), // "production" | "in_development" | "concept"
  year: integer('year').notNull().default(2024),
  githubUrl: text('github_url'),
  liveUrl: text('live_url'),
  coverImage: text('cover_image'),
  screenshots: text('screenshots'), // JSON array of paths
  seoTitle: text('seo_title'),
  seoDescription: text('seo_description'),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
  updatedAt: text('updated_at').notNull().default(sql`(datetime('now'))`),
})

export const siteContent = sqliteTable('site_content', {
  key: text('key').primaryKey(),
  value: text('value').notNull().default(''),
  updatedAt: text('updated_at').notNull().default(sql`(datetime('now'))`),
})

export const blogPosts = sqliteTable('blog_posts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  slug: text('slug').notNull().unique(),
  titleEn: text('title_en').notNull(),
  titleRu: text('title_ru').notNull().default(''),
  contentMd: text('content_md').notNull().default(''),
  excerpt: text('excerpt'),
  coverImage: text('cover_image'),
  source: text('source').notNull().default('original'), // "original" | "devto" | "hashnode"
  externalUrl: text('external_url'),
  externalId: text('external_id'),
  published: integer('published', { mode: 'boolean' }).notNull().default(false),
  publishedAt: text('published_at'),
  createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
  updatedAt: text('updated_at').notNull().default(sql`(datetime('now'))`),
})

export const pageViews = sqliteTable('page_views', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  path: text('path').notNull(),
  referrer: text('referrer'),
  country: text('country'),
  userAgent: text('user_agent'),
  sessionId: text('session_id'),
  createdAt: text('created_at').notNull().default(sql`(datetime('now'))`),
})
