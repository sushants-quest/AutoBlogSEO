import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { validateGitHubToken } from '@/lib/github'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { repoUrl, token } = body

    if (!repoUrl || !token) {
      return NextResponse.json(
        { error: 'Repository URL and token are required' },
        { status: 400 }
      )
    }

    const result = await validateGitHubToken(token, repoUrl)
    if (!result.valid) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: { githubToken: token, githubRepo: repoUrl },
    })

    return NextResponse.json({ success: true, message: 'GitHub connected successfully' })
  } catch (error) {
    console.error('GitHub connect error:', error)
    return NextResponse.json(
      { error: 'Failed to connect GitHub' },
      { status: 500 }
    )
  }
}
