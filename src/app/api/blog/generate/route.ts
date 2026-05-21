import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateBlogPost } from '@/lib/ai'
import { slugify, countWords, extractTitle, extractExcerpt, calculateSEOScore } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { prompt, model, keyword, tone, userApiKey } = body

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    // Generate blog content using Gemini by default
    const content = await generateBlogPost({
      prompt,
      model: model || 'gemini-2.5-pro',
      keyword,
      tone,
      userApiKey,
    })

    // Extract metadata
    const title = extractTitle(content)
    const slug = slugify(title) + '-' + Date.now()
    const excerpt = extractExcerpt(content)
    const wordCount = countWords(content)
    const seoScore = calculateSEOScore(content, keyword)

    // Save to database
    const blog = await prisma.blog.create({
      data: {
        title,
        slug,
        content,
        excerpt,
        keywords: keyword || '',
        seoScore,
        wordCount,
        status: 'draft',
        userId: session.user.id,
      },
    })

    return NextResponse.json({
      id: blog.id,
      title: blog.title,
      slug: blog.slug,
      seoScore: blog.seoScore,
      wordCount: blog.wordCount,
      excerpt: blog.excerpt,
    })
  } catch (error) {
    console.error('Blog generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate blog post' },
      { status: 500 }
    )
  }
}
