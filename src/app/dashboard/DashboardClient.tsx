'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  TrendingUp, FileText, Globe, Brain, Award, GitBranch,
  Search, Plus, LayoutList, BarChart2, ArrowRight,
} from 'lucide-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { MetricCard } from '@/components/dashboard/MetricCard'
import { TrafficChart, ContentStatusChart, TrafficSourcesChart } from '@/components/dashboard/Charts'
import { BlogCard } from '@/components/blog/BlogCard'
import Button from '@/components/ui/Button'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

interface Blog {
  id: string
  title: string
  excerpt?: string | null
  seoScore?: number | null
  status: string
  wordCount?: number | null
  createdAt: Date | string
}

interface DashboardClientProps {
  userName: string | null | undefined
  blogs: Blog[]
}

const PIPELINE_PREVIEW = [
  { id: '1', title: 'Top 10 On-Page SEO Techniques', status: 'brief', seoScore: null },
  { id: '2', title: 'How to Build Quality Backlinks in 2024', status: 'draft', seoScore: 72 },
  { id: '3', title: 'Technical SEO Checklist for Developers', status: 'review', seoScore: 85 },
  { id: '4', title: 'Content Marketing vs SEO: The Complete Guide', status: 'published', seoScore: 91 },
]

const statusBadgeVariants: Record<string, 'default' | 'warning' | 'info' | 'success'> = {
  brief: 'default',
  draft: 'warning',
  review: 'info',
  published: 'success',
}

export function DashboardClient({ userName, blogs }: DashboardClientProps) {
  const router = useRouter()

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Good morning{userName ? `, ${userName.split(' ')[0]}` : ''}! 👋
          </h1>
          <p className="text-slate-500 text-sm mt-1">Here&apos;s your SEO performance overview</p>
        </div>
        <Button onClick={() => router.push('/blog/generate')} size="md">
          <Plus className="w-4 h-4" />
          New Blog
        </Button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <MetricCard
          title="Domain Authority"
          value="34"
          change="+2 this month"
          changeType="positive"
          icon={Award}
          iconColor="text-indigo-600"
          iconBg="bg-indigo-50"
          index={0}
        />
        <MetricCard
          title="Indexed Pages"
          value="127"
          change="+8 this week"
          changeType="positive"
          icon={Globe}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
          index={1}
        />
        <MetricCard
          title="Organic Traffic"
          value="4,891"
          change="+16.4% vs last mo."
          changeType="positive"
          icon={TrendingUp}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
          index={2}
        />
        <MetricCard
          title="AI Citations"
          value="23"
          change="+5 new"
          changeType="positive"
          icon={Brain}
          iconColor="text-purple-600"
          iconBg="bg-purple-50"
          index={3}
        />
        <MetricCard
          title="Avg Quality Score"
          value="87/100"
          change="Above average"
          changeType="positive"
          icon={BarChart2}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
          index={4}
        />
        <MetricCard
          title="Pipeline"
          value="12 active"
          change="4 in review"
          changeType="neutral"
          icon={GitBranch}
          iconColor="text-rose-600"
          iconBg="bg-rose-50"
          index={5}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <TrafficChart />
        </div>
        <div>
          <TrafficSourcesChart />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ContentStatusChart />

        {/* Pipeline Preview */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-slate-900">Pipeline</h3>
              <p className="text-xs text-slate-500 mt-0.5">Content at each stage</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => router.push('/pipeline')}>
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {PIPELINE_PREVIEW.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <FileText className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <span className="text-sm text-slate-700 font-medium truncate">{item.title}</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {item.seoScore && (
                    <span className="text-xs text-slate-500">{item.seoScore}/100</span>
                  )}
                  <Badge variant={statusBadgeVariants[item.status]}>{item.status}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="mb-8"
      >
        <Card>
          <CardContent className="py-5">
            <h3 className="text-sm font-semibold text-slate-700 mb-4">Quick Actions</h3>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" size="sm" onClick={() => router.push('/blog/generate')}>
                <Search className="w-4 h-4" />
                Discover Keywords
              </Button>
              <Button variant="outline" size="sm" onClick={() => router.push('/blog/generate')}>
                <FileText className="w-4 h-4" />
                Generate Brief
              </Button>
              <Button variant="outline" size="sm" onClick={() => router.push('/pipeline')}>
                <LayoutList className="w-4 h-4" />
                View Pipeline
              </Button>
              <Button variant="outline" size="sm" onClick={() => router.push('/dashboard')}>
                <TrendingUp className="w-4 h-4" />
                Monitor SEO
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Blogs */}
      {blogs.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Recent Blog Posts</h2>
            <Button variant="ghost" size="sm" onClick={() => router.push('/pipeline')}>
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
          <div className="space-y-3">
            {blogs.map((blog, index) => (
              <BlogCard key={blog.id} blog={blog} index={index} />
            ))}
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
