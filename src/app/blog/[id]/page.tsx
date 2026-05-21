import { redirect, notFound } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { BlogViewerClient } from './BlogViewerClient'

export default async function BlogViewerPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const { id } = await params

  const blog = await prisma.blog.findFirst({
    where: { id, userId: session.user.id },
  })

  if (!blog) notFound()

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { githubRepo: true, githubToken: true },
  })

  return (
    <BlogViewerClient
      blog={{
        ...blog,
        createdAt: blog.createdAt.toISOString(),
        updatedAt: blog.updatedAt.toISOString(),
      }}
      githubRepo={user?.githubRepo || null}
      hasGithubToken={!!user?.githubToken}
    />
  )
}
