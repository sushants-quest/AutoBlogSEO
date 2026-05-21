'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Rocket, CheckCircle2, AlertCircle, GitBranch, Globe, Key, Sparkles, FileText } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { StepIndicator } from '@/components/onboarding/StepIndicator'

const STEPS = [
  { number: 1, title: 'Google Sheet', completed: false },
  { number: 2, title: 'GitHub Repo', completed: false },
  { number: 3, title: 'Search Console', completed: false },
  { number: 4, title: 'AI Model', completed: false },
  { number: 5, title: 'First Blog', completed: false },
]

const AI_MODELS = [
  { value: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro (Default - Recommended)' },
  { value: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash (Fast)' },
  { value: 'claude-sonnet-4-6', label: 'Claude Sonnet (Anthropic)' },
  { value: 'gpt-4o', label: 'GPT-4o (OpenAI)' },
]

export default function GetStartedPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [steps, setSteps] = useState(STEPS)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Step 1
  const [googleSheetUrl, setGoogleSheetUrl] = useState('')

  // Step 2
  const [githubRepoUrl, setGithubRepoUrl] = useState('')
  const [githubToken, setGithubToken] = useState('')

  // Step 3
  const [siteUrl, setSiteUrl] = useState('')
  const [serviceAccountJson, setServiceAccountJson] = useState('')

  // Step 4
  const [aiModel, setAiModel] = useState('gemini-2.5-pro')
  const [aiApiKey, setAiApiKey] = useState('')

  // Step 5
  const [blogPrompt, setBlogPrompt] = useState('')

  const markStepComplete = (stepNumber: number) => {
    setSteps((prev) =>
      prev.map((s) => (s.number === stepNumber ? { ...s, completed: true } : s))
    )
  }

  const handleStep1 = async () => {
    if (!googleSheetUrl.trim()) {
      setError('Please enter your Google Sheet URL')
      return
    }
    setLoading(true)
    setError(null)
    try {
      await fetch('/api/user', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ googleSheetUrl }),
      })
      setSuccess('Google Sheet connected successfully!')
      markStepComplete(1)
      setTimeout(() => { setSuccess(null); setCurrentStep(2) }, 1000)
    } catch {
      setError('Failed to save. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleStep2 = async () => {
    if (!githubRepoUrl.trim() || !githubToken.trim()) {
      setError('Please enter both repository URL and access token')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/github/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repoUrl: githubRepoUrl, token: githubToken }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to connect GitHub')
        return
      }
      setSuccess('GitHub connected successfully!')
      markStepComplete(2)
      setTimeout(() => { setSuccess(null); setCurrentStep(3) }, 1000)
    } catch {
      setError('Failed to connect GitHub. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleStep3 = async () => {
    if (!siteUrl.trim()) {
      setError('Please enter your site URL')
      return
    }
    setLoading(true)
    setError(null)
    try {
      await fetch('/api/google/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteUrl, serviceAccountJson }),
      })
      setSuccess('Search Console connected successfully!')
      markStepComplete(3)
      setTimeout(() => { setSuccess(null); setCurrentStep(4) }, 1000)
    } catch {
      setError('Failed to connect. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleStep4 = async () => {
    setLoading(true)
    setError(null)
    try {
      await fetch('/api/user', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aiProvider: aiModel, aiApiKey: aiApiKey || undefined }),
      })
      setSuccess('AI model configured!')
      markStepComplete(4)
      setTimeout(() => { setSuccess(null); setCurrentStep(5) }, 1000)
    } catch {
      setError('Failed to save. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleStep5 = async () => {
    if (!blogPrompt.trim()) {
      setError('Please describe your first blog topic')
      return
    }
    setLoading(true)
    setError(null)
    try {
      // Mark onboarding complete
      await fetch('/api/user', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ onboardingComplete: true }),
      })

      // Generate first blog
      const res = await fetch('/api/blog/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: blogPrompt }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to generate blog')
        return
      }
      markStepComplete(5)
      router.push(`/blog/${data.id}`)
    } catch {
      setError('Failed to generate blog. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSkip = () => {
    setError(null)
    setSuccess(null)
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1)
    } else {
      // Skip final step - just mark complete and go to dashboard
      fetch('/api/user', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ onboardingComplete: true }),
      }).then(() => router.push('/dashboard'))
    }
  }

  const stepContent: Record<number, React.ReactNode> = {
    1: (
      <div className="space-y-5">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-green-50 rounded-xl">
            <Globe className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Connect Google Sheet</h3>
            <p className="text-sm text-slate-500">Track keywords and blog performance</p>
          </div>
        </div>
        <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
          <p className="text-sm text-slate-600">
            Paste your Google Sheet URL here. We&apos;ll use it to track your keywords and blog performance.
            Make sure the sheet is shared with view access.
          </p>
        </div>
        <Input
          label="Google Sheet URL"
          type="url"
          placeholder="https://docs.google.com/spreadsheets/d/..."
          value={googleSheetUrl}
          onChange={(e) => setGoogleSheetUrl(e.target.value)}
        />
        <Button onClick={handleStep1} loading={loading} className="w-full" size="lg">
          Connect Google Sheet
        </Button>
      </div>
    ),
    2: (
      <div className="space-y-5">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-slate-100 rounded-xl">
            <GitBranch className="w-5 h-5 text-slate-700" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Connect GitHub Repository</h3>
            <p className="text-sm text-slate-500">Publish blogs as Pull Requests</p>
          </div>
        </div>
        <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
          <p className="text-sm text-slate-600">
            Enter your GitHub repository URL and a personal access token with <strong>repo</strong> scope.
            We&apos;ll publish blogs as Pull Requests to your repository.
          </p>
        </div>
        <Input
          label="Repository URL"
          type="url"
          placeholder="https://github.com/username/my-blog"
          value={githubRepoUrl}
          onChange={(e) => setGithubRepoUrl(e.target.value)}
        />
        <Input
          label="Personal Access Token"
          type="password"
          placeholder="ghp_xxxxxxxxxxxx"
          helperText="Create at github.com → Settings → Developer settings → Personal access tokens"
          value={githubToken}
          onChange={(e) => setGithubToken(e.target.value)}
        />
        <Button onClick={handleStep2} loading={loading} className="w-full" size="lg">
          Connect GitHub
        </Button>
      </div>
    ),
    3: (
      <div className="space-y-5">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-blue-50 rounded-xl">
            <Globe className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Connect Google Search Console</h3>
            <p className="text-sm text-slate-500">Track your search rankings</p>
          </div>
        </div>
        <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
          <p className="text-sm text-slate-600">
            Connect your Search Console to track how your content ranks on Google.
            You&apos;ll need your site URL and a service account JSON key file.
          </p>
        </div>
        <Input
          label="Site URL"
          type="url"
          placeholder="https://yourdomain.com"
          value={siteUrl}
          onChange={(e) => setSiteUrl(e.target.value)}
        />
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-slate-700">Service Account JSON (optional)</label>
          <textarea
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 h-28 resize-none"
            placeholder='{"type": "service_account", "project_id": "..."}'
            value={serviceAccountJson}
            onChange={(e) => setServiceAccountJson(e.target.value)}
          />
        </div>
        <Button onClick={handleStep3} loading={loading} className="w-full" size="lg">
          Connect Search Console
        </Button>
      </div>
    ),
    4: (
      <div className="space-y-5">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-purple-50 rounded-xl">
            <Key className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Configure AI Model</h3>
            <p className="text-sm text-slate-500">Choose your blog generation AI</p>
          </div>
        </div>
        <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100">
          <p className="text-sm text-indigo-700">
            <strong>Note:</strong> Leave as default (Claude) to use our built-in AI. No API key needed!
          </p>
        </div>
        <Select
          label="AI Model"
          options={AI_MODELS}
          value={aiModel}
          onChange={(e) => setAiModel(e.target.value)}
        />
        {aiModel !== 'gemini-2.5-pro' && aiModel !== 'gemini-2.0-flash' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
          >
            <Input
              label="API Key"
              type="password"
              placeholder={aiModel === 'openai' ? 'sk-...' : 'AIza...'}
              value={aiApiKey}
              onChange={(e) => setAiApiKey(e.target.value)}
            />
          </motion.div>
        )}
        <Button onClick={handleStep4} loading={loading} className="w-full" size="lg">
          Save Configuration
        </Button>
      </div>
    ),
    5: (
      <div className="space-y-5">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-amber-50 rounded-xl">
            <Sparkles className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Generate Your First Blog</h3>
            <p className="text-sm text-slate-500">Let AI write your first SEO-optimized post</p>
          </div>
        </div>
        <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
          <p className="text-sm text-amber-700">
            Describe your blog topic and our AI will generate a full, SEO-optimized post ready to publish.
          </p>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-slate-700">Blog Topic</label>
          <textarea
            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 h-32 resize-none"
            placeholder="e.g., The ultimate guide to on-page SEO for SaaS companies in 2024..."
            value={blogPrompt}
            onChange={(e) => setBlogPrompt(e.target.value)}
          />
        </div>
        <Button onClick={handleStep5} loading={loading} className="w-full" size="lg">
          <FileText className="w-4 h-4" />
          {loading ? 'Generating...' : 'Generate My First Blog'}
        </Button>
      </div>
    ),
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-lg"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-600 rounded-xl mb-3 shadow-lg shadow-indigo-200">
            <Rocket className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Let&apos;s get you set up</h1>
          <p className="text-sm text-slate-500 mt-1">Step {currentStep} of {STEPS.length}</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
          <div className="mb-8">
            <StepIndicator steps={steps} currentStep={currentStep} />
          </div>

          {/* Feedback messages */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-600">{error}</p>
              </motion.div>
            )}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <p className="text-sm text-emerald-600">{success}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Step content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {stepContent[currentStep]}
            </motion.div>
          </AnimatePresence>

          {/* Skip button */}
          <div className="mt-4 text-center">
            <button
              onClick={handleSkip}
              className="text-sm text-slate-400 hover:text-slate-600 transition-colors"
            >
              Skip for now →
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
