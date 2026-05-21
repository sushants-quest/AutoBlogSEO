import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { DashboardClient } from './DashboardClient'
import { prisma } from '@/lib/prisma'

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const blogs = await prisma.blog.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    take: 8,
    select: {
      id: true,
      title: true,
      excerpt: true,
      seoScore: true,
      status: true,
      wordCount: true,
      createdAt: true,
    },
  })

  return <DashboardClient userName={session.user.name || session.user.email} blogs={blogs} />
}
