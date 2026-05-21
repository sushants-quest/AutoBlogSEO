import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        onboardingComplete: true,
        githubToken: true,
        githubRepo: true,
        googleSheetUrl: true,
        searchConsoleUrl: true,
        aiProvider: true,
        siteNiche: true,
        siteTone: true,
        siteName: true,
        targetAudience: true,
        knowledgeBase: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const allowedFields = [
      'name', 'onboardingComplete', 'githubToken', 'githubRepo',
      'googleSheetUrl', 'searchConsoleUrl', 'aiProvider', 'aiApiKey',
      'siteNiche', 'siteTone', 'siteName', 'targetAudience', 'knowledgeBase',
    ]

    const updateData: Record<string, unknown> = {}
    for (const field of allowedFields) {
      if (field in body) {
        updateData[field] = body[field]
      }
    }

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
    })

    return NextResponse.json({ success: true, user })
  } catch (error) {
    console.error('Update user error:', error)
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
  }
}
