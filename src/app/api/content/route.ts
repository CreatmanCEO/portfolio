import { NextResponse } from 'next/server'
import { db } from '@/db'
import { siteContent } from '@/db/schema'

export async function GET() {
  try {
    const rows = db.select().from(siteContent).all()

    // Convert rows array to key-value object
    const content: Record<string, string> = {}
    for (const row of rows) {
      content[row.key] = row.value
    }

    return NextResponse.json(content, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    })
  } catch (error) {
    console.error('[API /content] Error:', error)
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 })
  }
}
