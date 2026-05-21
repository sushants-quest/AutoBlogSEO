'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, Download, GitBranch, CheckCircle2, ExternalLink,
  Clock, Award, Hash, AlertCircle, Loader2, Tag,
} from 'lucide-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Badge } from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { formatDate, estimateReadingTime, countWords } from '@/lib/utils'

interface BlogViewerClientProps {
  blog: {
    id: string
    title: string
    slug: string
    content: string
    excerpt?: string | null
    keywords?: string | null
    seoScore?: number | null
    status: string
    prUrl?: string | null
    prNumber?: number | null
    wordCount?: number | null
    createdAt: string
    updatedAt: string
  }
  githubRepo: string | null
  hasGithubToken: boolean
}

// Extract TL;DR from content
function extractTLDR(content: string): string | null {
  const match = content.match(/## TL;DR\n([\s\S]*?)(?=\n## |\n# |$)/)
  return match ? match[1].trim() : null
}

// Extract keywords from content
function extractKeywordsList(content: string): string[] {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/)
  if (frontmatterMatch) {
    const keywordsMatch = frontmatterMatch[1].match(/keywords:\s*"([^"]+)"/)
    if (keywordsMatch) {
      return keywordsMatch[1].split(',').map((k) => k.trim())
    }
  }
  return []
}

// Strip frontmatter from content for display
function stripFrontmatter(content: string): string {
  return content.replace(/^---\n[\s\S]*?\n---\n/, '')
}

const seoScoreColor = (score: number) => {
  if (score >= 80) return 'text-emerald-600'
  if (score >= 60) return 'text-amber-600'
  return 'text-red-500'
}

const statusBadgeVariant = (status: string): 'default' | 'warning' | 'info' | 'success' => {
  const map: Record<string, 'default' | 'warning' | 'info' | 'success'> = {
    brief: 'default', draft: 'warning', review: 'info', published: 'success',
  }
  return map[status] || 'default'
}

export function BlogViewerClient({ blog, githubRepo, hasGithubToken }: BlogViewerClientProps) {
  const router = useRouter()
  const [publishing, setPublishing] = useState(false)
  const [publishError, setPublishError] = useState<string | null>(null)
  const [publishSuccess, setPublishSuccess] = useState<string | null>(null)
  const [showPublishModal, setShowPublishModal] = useState(false)
  const [repoUrlInput, setRepoUrlInput] = useState(githubRepo || '')
  const [tokenInput, setTokenInput] = useState('')
  const [currentStatus, setCurrentStatus] = useState(blog.status)
  const [currentPrUrl, setCurrentPrUrl] = useState(blog.prUrl)

  const wordCount = blog.wordCount || countWords(blog.content)
  const tldr = extractTLDR(blog.content)
  const keywordsList = extractKeywordsList(blog.content)
  const displayContent = stripFrontmatter(blog.content)

  const handleApprove = async () => {
    const res = await fetch(`/api/blog/${blog.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'review' }),
    })
    if (res.ok) setCurrentStatus('review')
  }

  const handlePublish = async () => {
    if (!repoUrlInput || !tokenInput) {
      setPublishError('Repository URL and token are required')
      return
    }

    setPublishing(true)
    setPublishError(null)

    try {
      const res = await fetch('/api/blog/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blogId: blog.id,
          repoUrl: repoUrlInput,
          token: tokenInput,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        setPublishError(data.error || 'Failed to publish')
        return
      }

      setCurrentStatus('published')
      setCurrentPrUrl(data.prUrl)
      setPublishSuccess(`PR #${data.prNumber} created successfully!`)
      setShowPublishModal(false)
    } catch {
      setPublishError('Failed to publish. Please try again.')
    } finally {
      setPublishing(false)
    }
  }

  const handleDownload = () => {
    const blob = new Blob([blog.content], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${blog.slug}.mdx`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="w-4 h-4" />
            Download MDX
          </Button>
          {currentStatus !== 'review' && currentStatus !== 'published' && (
            <Button variant="secondary" size="sm" onClick={handleApprove}>
              <CheckCircle2 className="w-4 h-4" />
              Approve
            </Button>
          )}
          {currentStatus !== 'published' && (
            <Button size="sm" onClick={() => setShowPublishModal(true)}>
              <GitBranch className="w-4 h-4" />
              Publish to GitHub
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main content */}
        <div className="lg:col-span-3">
          <Card>
            <CardContent className="p-8">
              {/* Blog meta */}
              <div className="mb-6 pb-6 border-b border-slate-100">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant={statusBadgeVariant(currentStatus)}>{currentStatus}</Badge>
                  {blog.seoScore && (
                    <span className={`text-xs font-semibold ${seoScoreColor(blog.seoScore)}`}>
                      SEO Score: {blog.seoScore}/100
                    </span>
                  )}
                </div>
                <h1 className="text-3xl font-bold text-slate-900 leading-tight mb-3">{blog.title}</h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {estimateReadingTime(wordCount)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Hash className="w-3.5 h-3.5" />
                    {wordCount.toLocaleString()} words
                  </span>
                  <span>{formatDate(blog.createdAt)}</span>
                  <span>SEO Pilot AI</span>
                </div>
              </div>

              {/* TL;DR */}
              {tldr && (
                <div className="mb-6 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                  <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide mb-1">TL;DR</p>
                  <p className="text-sm text-indigo-900">{tldr}</p>
                </div>
              )}

              {/* Published PR link */}
              <AnimatePresence>
                {currentPrUrl && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center gap-3"
                  >
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-emerald-800">Published to GitHub</p>
                      <a
                        href={currentPrUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-emerald-600 hover:text-emerald-800 flex items-center gap-1 mt-0.5"
                      >
                        View Pull Request <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </motion.div>
                )}

                {publishSuccess && !currentPrUrl && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mb-6 p-4 bg-emerald-50 rounded-xl border border-emerald-100"
                  >
                    <p className="text-sm text-emerald-700">{publishSuccess}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Blog content */}
              <div className="prose max-w-none">
                <ReactMarkdown>{displayContent}</ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* SEO Score */}
          {blog.seoScore && (
            <Card>
              <CardContent className="pt-5">
                <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <Award className="w-4 h-4 text-indigo-600" />
                  SEO Score
                </h3>
                <div className="text-center mb-3">
                  <span className={`text-4xl font-bold ${seoScoreColor(blog.seoScore)}`}>
                    {blog.seoScore}
                  </span>
                  <span className="text-slate-400 text-lg">/100</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${
                      blog.seoScore >= 80 ? 'bg-emerald-500' :
                      blog.seoScore >= 60 ? 'bg-amber-500' : 'bg-red-500'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${blog.seoScore}%` }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  />
                </div>
                <div className="mt-4 space-y-2">
                  {[
                    { label: 'Word Count', value: wordCount >= 1000 ? 'Good' : 'Too short', ok: wordCount >= 1000 },
                    { label: 'Keywords', value: keywordsList.length > 0 ? 'Present' : 'Missing', ok: keywordsList.length > 0 },
                    { label: 'Structure', value: 'Good', ok: true },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">{item.label}</span>
                      <span className={item.ok ? 'text-emerald-600 font-medium' : 'text-red-500 font-medium'}>
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Keywords */}
          {keywordsList.length > 0 && (
            <Card>
              <CardContent className="pt-5">
                <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-indigo-600" />
                  Keywords
                </h3>
                <div className="flex flex-wrap gap-2">
                  {keywordsList.map((kw) => (
                    <span
                      key={kw}
                      className="px-2.5 py-1 text-xs bg-indigo-50 text-indigo-700 rounded-full font-medium"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Internal Links */}
          <Card>
            <CardContent className="pt-5">
              <h3 className="text-sm font-semibold text-slate-900 mb-3">Suggested Internal Links</h3>
              <div className="space-y-2">
                {[
                  'Beginner\'s Guide to SEO',
                  'SEO Tools Review 2024',
                  'Content Marketing Strategy',
                ].map((link) => (
                  <div key={link} className="flex items-center gap-2 text-xs text-slate-500">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
                    {link}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Publish Modal */}
      <AnimatePresence>
        {showPublishModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={(e) => e.target === e.currentTarget && setShowPublishModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2.5 bg-slate-900 rounded-xl">
                  <GitBranch className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Publish to GitHub</h3>
                  <p className="text-xs text-slate-500">Create a Pull Request with your blog post</p>
                </div>
              </div>

              {publishError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <p className="text-sm text-red-600">{publishError}</p>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700">Repository URL</label>
                  <input
                    type="url"
                    className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="https://github.com/username/my-blog"
                    value={repoUrlInput}
                    onChange={(e) => setRepoUrlInput(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Personal Access Token</label>
                  <input
                    type="password"
                    className="mt-1 w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="ghp_xxxxxxxxxxxx"
                    value={tokenInput}
                    onChange={(e) => setTokenInput(e.target.value)}
                  />
                  <p className="text-xs text-slate-400 mt-1">Needs repo scope permissions</p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowPublishModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  loading={publishing}
                  onClick={handlePublish}
                >
                  {publishing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating PR...
                    </>
                  ) : (
                    <>
                      <GitBranch className="w-4 h-4" />
                      Create PR
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  )
}
