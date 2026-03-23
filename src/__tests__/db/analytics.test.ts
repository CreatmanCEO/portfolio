import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { eq, sql } from 'drizzle-orm'
import * as schema from '../../db/schema'

let sqlite: InstanceType<typeof Database>
let db: ReturnType<typeof drizzle>

const CREATE_TABLES = `
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

describe('Analytics data layer', () => {
  it('should insert a page view and verify all fields', () => {
    db.insert(schema.pageViews).values({
      path: '/projects/security-scanner',
      referrer: 'https://google.com/search?q=creatman',
      country: 'US',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      sessionId: 'sess-abc-123',
    }).run()

    const view = db.select().from(schema.pageViews)
      .where(eq(schema.pageViews.id, 1))
      .get()

    expect(view).toBeDefined()
    expect(view!.path).toBe('/projects/security-scanner')
    expect(view!.referrer).toBe('https://google.com/search?q=creatman')
    expect(view!.country).toBe('US')
    expect(view!.userAgent).toBe('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)')
    expect(view!.sessionId).toBe('sess-abc-123')
    expect(view!.createdAt).toBeDefined()
  })

  it('should insert multiple views and count by path', () => {
    const paths = ['/projects', '/projects', '/projects', '/', '/', '/blog']
    for (const path of paths) {
      db.insert(schema.pageViews).values({ path }).run()
    }

    const counts = db
      .select({
        path: schema.pageViews.path,
        count: sql<number>`count(*)`,
      })
      .from(schema.pageViews)
      .groupBy(schema.pageViews.path)
      .all()

    const countMap = Object.fromEntries(counts.map(r => [r.path, r.count]))

    expect(countMap['/projects']).toBe(3)
    expect(countMap['/']).toBe(2)
    expect(countMap['/blog']).toBe(1)
  })

  it('should store session ID correctly', () => {
    const sessionId = 'session-uuid-4567-abcd-ef01'

    db.insert(schema.pageViews).values({
      path: '/',
      sessionId,
    }).run()

    db.insert(schema.pageViews).values({
      path: '/projects',
      sessionId,
    }).run()

    const sessionViews = db.select().from(schema.pageViews)
      .where(eq(schema.pageViews.sessionId, sessionId))
      .all()

    expect(sessionViews).toHaveLength(2)
    expect(sessionViews[0].sessionId).toBe(sessionId)
    expect(sessionViews[1].sessionId).toBe(sessionId)
  })

  it('should handle null referrer and country gracefully', () => {
    db.insert(schema.pageViews).values({
      path: '/about',
      // referrer, country, userAgent, sessionId all omitted (null)
    }).run()

    const view = db.select().from(schema.pageViews)
      .where(eq(schema.pageViews.path, '/about'))
      .get()

    expect(view).toBeDefined()
    expect(view!.referrer).toBeNull()
    expect(view!.country).toBeNull()
    expect(view!.userAgent).toBeNull()
    expect(view!.sessionId).toBeNull()
  })
})
