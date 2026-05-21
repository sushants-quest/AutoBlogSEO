'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { FileText, Clock, Award, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { formatDate, estimateReadingTime } from '@/lib/utils'

interface BlogCardProps {
  blog: {
    id: string
    title: string
    excerpt?: string | null
    seoScore?: number | null
    status: string
    wordCount?: number | null
    createdAt: Date | string
  }
  index?: number
}

const statusVariants: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info' | 'indigo'> = {
  brief: 'default',
  draft: 'warning',
  review: 'info',
  published: 'success',
}

export function BlogCard({ blog, index = 0 }: BlogCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Card hover>
        <CardContent className="py-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div className="p-2 rounded-lg bg-indigo-50 flex-shrink-0">
                <FileText className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="flex-1 min-w-0">
                <Link href={`/blog/${blog.id}`} className="block">
                  <h3 className="text-sm font-semibold text-slate-900 hover:text-indigo-600 transition-colors line-clamp-1">
                    {blog.title}
                  </h3>
                </Link>
                {blog.excerpt && (
                  <p className="mt-1 text-xs text-slate-500 line-clamp-2">{blog.excerpt}</p>
                )}
                <div className="mt-2 flex items-center gap-3 text-xs text-slate-400">
                  <span>{formatDate(blog.createdAt)}</span>
                  {blog.wordCount && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {estimateReadingTime(blog.wordCount)}
                    </span>
                  )}
                  {blog.seoScore !== null && blog.seoScore !== undefined && (
                    <span className="flex items-center gap-1">
                      <Award className="w-3 h-3" />
                      SEO {blog.seoScore}/100
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Badge variant={statusVariants[blog.status] || 'default'}>
                {blog.status}
              </Badge>
              <Link href={`/blog/${blog.id}`}>
                <ArrowRight className="w-4 h-4 text-slate-400 hover:text-indigo-600 transition-colors" />
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
