import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createBlogPR } from '@/lib/github'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { blogId, repoUrl, token } = body

    if (!blogId || !repoUrl || !token) {
      return NextResponse.json(
        { error: 'blogId, repoUrl, and token are required' },
        { status: 400 }
      )
    }

    const blog = await prisma.blog.findFirst({
      where: { id: blogId, userId: session.user.id },
    })

    if (!blog) {
      return NextResponse.json({ error: 'Blog not found' }, { status: 404 })
    }

    const { prUrl, prNumber } = await createBlogPR({
      token,
      repoUrl,
      slug: blog.slug,
      title: blog.title,
      content: blog.content,
    })

    // Update blog record
    const updatedBlog = await prisma.blog.update({
      where: { id: blogId },
      data: {
        status: 'published',
        prUrl,
        prNumber,
      },
    })

    return NextResponse.json({
      prUrl,
      prNumber,
      status: updatedBlog.status,
    })
  } catch (error) {
    console.error('Blog publish error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to publish blog' },
      { status: 500 }
    )
  }
}
