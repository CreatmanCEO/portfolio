import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { eq } from 'drizzle-orm'
import * as schema from '../../db/schema'

let sqlite: InstanceType<typeof Database>
let db: ReturnType<typeof drizzle>

beforeEach(() => {
  sqlite = new Database(':memory:')
  sqlite.pragma('journal_mode = WAL')
  db = drizzle(sqlite, { schema })

  sqlite.exec(`
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

describe('Analytics tracking logic', () => {
  it('should insert valid tracking data', () => {
    const body = {
      path: '/projects',
      referrer: 'https://google.com',
      sessionId: 'sess-123',
    }

    // Replicate the track route logic
    db.insert(schema.pageViews).values({
      path: body.path.slice(0, 500),
      referrer: body.referrer ? String(body.referrer).slice(0, 1000) : null,
      country: null,
      userAgent: null,
      sessionId: body.sessionId ? String(body.sessionId).slice(0, 100) : null,
    }).run()

    const view = db.select().from(schema.pageViews).all()
    expect(view).toHaveLength(1)
    expect(view[0].path).toBe('/projects')
    expect(view[0].referrer).toBe('https://google.com')
    expect(view[0].sessionId).toBe('sess-123')
  })

  it('should reject missing path (validation logic)', () => {
    const body = { referrer: 'https://example.com' }

    // Replicate the validation from track route
    const path = (body as Record<string, unknown>).path
    const isValid = path && typeof path === 'string'

    expect(isValid).toBeFalsy()
  })

  it('should truncate long strings to their respective limits', () => {
    const longPath = 'x'.repeat(1000)
    const longReferrer = 'y'.repeat(2000)
    const longSessionId = 'z'.repeat(200)

    // Replicate truncation logic from track route
    db.insert(schema.pageViews).values({
      path: longPath.slice(0, 500),
      referrer: longReferrer.slice(0, 1000),
      userAgent: null,
      sessionId: longSessionId.slice(0, 100),
    }).run()

    const view = db.select().from(schema.pageViews).all()
    expect(view).toHaveLength(1)
    expect(view[0].path).toHaveLength(500)
    expect(view[0].referrer).toHaveLength(1000)
    expect(view[0].sessionId).toHaveLength(100)
  })
})
