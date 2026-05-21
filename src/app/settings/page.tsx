import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { SettingsClient } from './SettingsClient'

export default async function SettingsPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      email: true,
      name: true,
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

  if (!user) redirect('/login')

  return <SettingsClient user={user} />
}
