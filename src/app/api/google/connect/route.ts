import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { siteUrl, serviceAccountJson, googleSheetUrl } = body

    const updateData: Record<string, string> = {}
    if (siteUrl) updateData.searchConsoleUrl = siteUrl
    if (googleSheetUrl) updateData.googleSheetUrl = googleSheetUrl

    if (serviceAccountJson) {
      try {
        JSON.parse(serviceAccountJson)
      } catch {
        return NextResponse.json(
          { error: 'Invalid service account JSON' },
          { status: 400 }
        )
      }
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
    })

    return NextResponse.json({ success: true, message: 'Google services connected successfully' })
  } catch (error) {
    console.error('Google connect error:', error)
    return NextResponse.json(
      { error: 'Failed to connect Google services' },
      { status: 500 }
    )
  }
}
