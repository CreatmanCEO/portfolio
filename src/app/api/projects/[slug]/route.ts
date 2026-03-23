import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { projects } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    const project = db.select().from(projects)
      .where(eq(projects.slug, slug))
      .get()

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Parse JSON fields
    const parsed = {
      ...project,
      tags: JSON.parse(project.tags),
      techStack: JSON.parse(project.techStack),
      screenshots: project.screenshots ? JSON.parse(project.screenshots) : [],
    }

    return NextResponse.json(parsed, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    })
  } catch (error) {
    console.error('[API /projects/slug] Error:', error)
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 })
  }
}
