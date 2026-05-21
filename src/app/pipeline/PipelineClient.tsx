'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Plus, FileText, ArrowRight, Award, Hash } from 'lucide-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Badge } from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { formatDate } from '@/lib/utils'

type BlogStatus = 'brief' | 'draft' | 'review' | 'published'

interface Blog {
  id: string
  title: string
  excerpt?: string | null
  seoScore?: number | null
  status: string
  wordCount?: number | null
  createdAt: string
  updatedAt: string
}

const COLUMNS: { id: BlogStatus; label: string; color: string; bg: string; dotColor: string }[] = [
  { id: 'brief', label: 'Brief', color: 'text-slate-600', bg: 'bg-slate-50', dotColor: 'bg-slate-400' },
  { id: 'draft', label: 'Draft', color: 'text-amber-700', bg: 'bg-amber-50', dotColor: 'bg-amber-400' },
  { id: 'review', label: 'Review', color: 'text-blue-700', bg: 'bg-blue-50', dotColor: 'bg-blue-400' },
  { id: 'published', label: 'Published', color: 'text-emerald-700', bg: 'bg-emerald-50', dotColor: 'bg-emerald-400' },
]

const STATUS_ORDER: BlogStatus[] = ['brief', 'draft', 'review', 'published']

// Mock data to fill pipeline if no real blogs
const MOCK_BLOGS: Blog[] = [
  { id: 'mock-1', title: 'Top 10 On-Page SEO Techniques', excerpt: 'Learn the most effective on-page SEO strategies.', seoScore: null, status: 'brief', wordCount: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'mock-2', title: 'How to Build Quality Backlinks', excerpt: 'A comprehensive guide to ethical link building.', seoScore: 72, status: 'draft', wordCount: 1850, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'mock-3', title: 'Technical SEO Checklist', excerpt: 'Everything you need for technical SEO excellence.', seoScore: 85, status: 'review', wordCount: 2100, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'mock-4', title: 'Content Marketing vs SEO', excerpt: 'Understanding how content marketing and SEO work together.', seoScore: 91, status: 'published', wordCount: 2400, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
]

interface PipelineClientProps {
  blogs: Blog[]
}

export function PipelineClient({ blogs: initialBlogs }: PipelineClientProps) {
  const router = useRouter()
  const [blogs, setBlogs] = useState<Blog[]>(
    initialBlogs.length > 0 ? initialBlogs : MOCK_BLOGS
  )

  const getBlogsByStatus = (status: BlogStatus) =>
    blogs.filter((b) => b.status === status)

  const moveToNextStage = async (blogId: string, currentStatus: BlogStatus) => {
    const currentIndex = STATUS_ORDER.indexOf(currentStatus)
    if (currentIndex === STATUS_ORDER.length - 1) return
    const nextStatus = STATUS_ORDER[currentIndex + 1]

    if (!blogId.startsWith('mock-')) {
      await fetch(`/api/blog/${blogId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      })
    }

    setBlogs((prev) =>
      prev.map((b) => (b.id === blogId ? { ...b, status: nextStatus } : b))
    )
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Content Pipeline</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your blog posts through each stage</p>
        </div>
        <Button onClick={() => router.push('/blog/generate')} size="md">
          <Plus className="w-4 h-4" />
          New Blog
        </Button>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {COLUMNS.map((column) => {
          const columnBlogs = getBlogsByStatus(column.id)
          return (
            <div key={column.id} className="flex flex-col gap-3">
              {/* Column header */}
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${column.bg}`}>
                <div className={`w-2 h-2 rounded-full ${column.dotColor}`} />
                <span className={`text-sm font-semibold ${column.color}`}>{column.label}</span>
                <span className={`ml-auto text-xs font-medium ${column.color} opacity-70`}>
                  {columnBlogs.length}
                </span>
              </div>

              {/* Cards */}
              <div className="flex flex-col gap-3">
                {columnBlogs.map((blog, index) => (
                  <motion.div
                    key={blog.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow p-4"
                  >
                    <div className="flex items-start gap-2 mb-3">
                      <div className="p-1.5 bg-indigo-50 rounded-lg flex-shrink-0">
                        <FileText className="w-3.5 h-3.5 text-indigo-600" />
                      </div>
                      <button
                        onClick={() => !blog.id.startsWith('mock-') && router.push(`/blog/${blog.id}`)}
                        className="text-sm font-medium text-slate-900 text-left leading-snug hover:text-indigo-600 transition-colors line-clamp-2"
                      >
                        {blog.title}
                      </button>
                    </div>

                    {blog.excerpt && (
                      <p className="text-xs text-slate-500 line-clamp-2 mb-3">{blog.excerpt}</p>
                    )}

                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
                      {blog.wordCount ? (
                        <span className="flex items-center gap-1">
                          <Hash className="w-3 h-3" />
                          {blog.wordCount.toLocaleString()} words
                        </span>
                      ) : null}
                      {blog.seoScore && (
                        <span className="flex items-center gap-1">
                          <Award className="w-3 h-3" />
                          {blog.seoScore}/100
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-400 mb-3">{formatDate(blog.createdAt)}</p>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2">
                      {!blog.id.startsWith('mock-') && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs px-2 py-1 h-auto"
                          onClick={() => router.push(`/blog/${blog.id}`)}
                        >
                          View
                        </Button>
                      )}
                      {column.id !== 'published' && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs px-2 py-1 h-auto flex items-center gap-1 ml-auto"
                          onClick={() => moveToNextStage(blog.id, column.id)}
                        >
                          Next Stage
                          <ArrowRight className="w-3 h-3" />
                        </Button>
                      )}
                      {column.id === 'published' && (
                        <Badge variant="success" className="ml-auto">Live</Badge>
                      )}
                    </div>
                  </motion.div>
                ))}

                {/* Empty state */}
                {columnBlogs.length === 0 && (
                  <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center">
                    <p className="text-xs text-slate-400">No posts in {column.label}</p>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </DashboardLayout>
  )
}
