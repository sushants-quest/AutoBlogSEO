'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Wand2, Target, Volume2, AlertCircle, Loader2 } from 'lucide-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { auth } from '@/lib/auth'

const AI_MODELS = [
  { value: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro (Default - Recommended)' },
  { value: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash (Fast)' },
  { value: 'claude-sonnet-4-6', label: 'Claude Sonnet (Anthropic)' },
  { value: 'gpt-4o', label: 'GPT-4o (OpenAI)' },
]

const TONE_OPTIONS = [
  { value: 'Professional', label: 'Professional' },
  { value: 'Casual', label: 'Casual' },
  { value: 'Technical', label: 'Technical' },
]

const EXAMPLE_PROMPTS = [
  'The complete guide to technical SEO for SaaS companies',
  'How to build a content strategy that drives 10x organic traffic',
  'On-page SEO optimization: 15 factors that actually matter in 2024',
  'Link building for beginners: ethical strategies that work',
]

export default function GenerateBlogPage() {
  const router = useRouter()
  const [prompt, setPrompt] = useState('')
  const [model, setModel] = useState('gemini-2.5-pro')
  const [keyword, setKeyword] = useState('')
  const [tone, setTone] = useState('Professional')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please describe the blog you want to create')
      return
    }

    setLoading(true)
    setError(null)
    setProgress(0)

    // Simulate progress animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + Math.random() * 15
      })
    }, 400)

    try {
      const res = await fetch('/api/blog/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, model, keyword, tone }),
      })

      clearInterval(progressInterval)
      setProgress(100)

      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to generate blog post')
        return
      }

      setTimeout(() => {
        router.push(`/blog/${data.id}`)
      }, 500)
    } catch {
      clearInterval(progressInterval)
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-indigo-600 rounded-xl">
              <Wand2 className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Generate Blog Post</h1>
          </div>
          <p className="text-slate-500">
            Describe your blog topic and let AI create a fully SEO-optimized post
          </p>
        </div>

        <div className="space-y-6">
          {/* Main prompt */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <h2 className="text-sm font-semibold text-slate-900">Blog Description</h2>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-700">
                  Describe the blog you want to create
                </label>
                <textarea
                  className="w-full px-4 py-3 text-sm border border-slate-200 rounded-lg bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[140px] resize-none"
                  placeholder="e.g., Write a comprehensive guide on technical SEO for developers. Cover crawlability, indexation, structured data, Core Web Vitals, and performance optimization. Target audience: senior web developers at SaaS companies."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
                <p className="text-xs text-slate-400">{prompt.length} characters</p>
              </div>

              {/* Example prompts */}
              <div className="mt-4">
                <p className="text-xs font-medium text-slate-500 mb-2">Try an example:</p>
                <div className="flex flex-wrap gap-2">
                  {EXAMPLE_PROMPTS.map((ex) => (
                    <button
                      key={ex}
                      onClick={() => setPrompt(ex)}
                      className="text-xs px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-full text-slate-600 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 transition-all"
                    >
                      {ex.length > 45 ? ex.substring(0, 45) + '...' : ex}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Configuration */}
          <Card>
            <CardHeader>
              <h2 className="text-sm font-semibold text-slate-900">Configuration</h2>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Select
                label="AI Model"
                options={AI_MODELS}
                value={model}
                onChange={(e) => setModel(e.target.value)}
              />
              <div className="relative">
                <Input
                  label="Target Keyword (optional)"
                  placeholder="e.g., technical SEO"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
                <Target className="absolute right-3 top-8 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
              <div className="relative">
                <Select
                  label="Tone"
                  options={TONE_OPTIONS}
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3"
              >
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-600">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Progress bar */}
          <AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="p-6 bg-indigo-50 rounded-xl border border-indigo-100"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />
                  <p className="text-sm font-medium text-indigo-800">
                    {progress < 30
                      ? 'Analyzing your topic...'
                      : progress < 60
                      ? 'Generating SEO-optimized content...'
                      : progress < 90
                      ? 'Polishing the writing...'
                      : 'Finalizing your blog post...'}
                  </p>
                </div>
                <div className="w-full h-2 bg-indigo-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-indigo-600 rounded-full"
                    animate={{ width: `${Math.min(progress, 100)}%` }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
                <p className="text-xs text-indigo-600 mt-2">{Math.round(Math.min(progress, 100))}%</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Generate button */}
          <Button
            onClick={handleGenerate}
            loading={loading}
            size="lg"
            className="w-full"
          >
            <Sparkles className="w-4 h-4" />
            {loading ? 'Generating...' : 'Generate Blog Post'}
          </Button>

          {/* Info */}
          <p className="text-center text-xs text-slate-400">
            Generation typically takes 15–30 seconds. The post will be saved to your pipeline as a draft.
          </p>
        </div>
      </div>
    </DashboardLayout>
  )
}
