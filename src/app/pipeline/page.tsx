import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { PipelineClient } from './PipelineClient'

export default async function PipelinePage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const blogs = await prisma.blog.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      excerpt: true,
      seoScore: true,
      status: true,
      wordCount: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  const serialized = blogs.map((b) => ({
    ...b,
    createdAt: b.createdAt.toISOString(),
    updatedAt: b.updatedAt.toISOString(),
  }))

  return <PipelineClient blogs={serialized} />
}
