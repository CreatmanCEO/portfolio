import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { projects } from '@/db/schema'
import { desc, asc } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const tag = searchParams.get('tag')

    const allProjects = db.select().from(projects)
      .orderBy(desc(projects.year), asc(projects.sortOrder))
      .all()

    // Parse JSON fields
    const parsed = allProjects.map(p => ({
      ...p,
      tags: JSON.parse(p.tags),
      techStack: JSON.parse(p.techStack),
      screenshots: p.screenshots ? JSON.parse(p.screenshots) : [],
    }))

    // Filter by tag if provided
    const filtered = tag
      ? parsed.filter(p => p.tags.includes(tag))
      : parsed

    return NextResponse.json(filtered, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    })
  } catch (error) {
    console.error('[API /projects] Error:', error)
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 })
  }
}
