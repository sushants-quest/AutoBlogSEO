import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const blogs = await prisma.blog.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        keywords: true,
        seoScore: true,
        status: true,
        prUrl: true,
        prNumber: true,
        wordCount: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return NextResponse.json({ blogs })
  } catch (error) {
    console.error('Blog list error:', error)
    return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 })
  }
}
