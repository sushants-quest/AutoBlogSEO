'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  GitBranch, Globe, Key, Settings2, CheckCircle2, AlertCircle,
  User, Cpu, SlidersHorizontal,
} from 'lucide-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

type Tab = 'general' | 'integrations' | 'ai' | 'site'

const TABS: { id: Tab; label: string; icon: typeof Settings2 }[] = [
  { id: 'general', label: 'General', icon: User },
  { id: 'integrations', label: 'Integrations', icon: SlidersHorizontal },
  { id: 'ai', label: 'AI Models', icon: Cpu },
  { id: 'site', label: 'Site Config', icon: Globe },
]

const AI_MODELS = [
  { value: 'anthropic', label: 'Claude (Default)' },
  { value: 'openai', label: 'GPT-4o (OpenAI)' },
  { value: 'google', label: 'Gemini 2.5 Pro' },
]

const TONE_OPTIONS = [
  { value: 'Professional', label: 'Professional' },
  { value: 'Casual', label: 'Casual' },
  { value: 'Technical', label: 'Technical' },
  { value: 'Educational', label: 'Educational' },
]

interface SettingsClientProps {
  user: {
    id: string
    email: string
    name?: string | null
    githubToken?: string | null
    githubRepo?: string | null
    googleSheetUrl?: string | null
    searchConsoleUrl?: string | null
    aiProvider: string
    siteNiche?: string | null
    siteTone?: string | null
    siteName?: string | null
    targetAudience?: string | null
    knowledgeBase?: string | null
  }
}

export function SettingsClient({ user }: SettingsClientProps) {
  const [activeTab, setActiveTab] = useState<Tab>('general')
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  // General
  const [name, setName] = useState(user.name || '')

  // Integrations
  const [githubRepo, setGithubRepo] = useState(user.githubRepo || '')
  const [githubToken, setGithubToken] = useState('')
  const [googleSheetUrl, setGoogleSheetUrl] = useState(user.googleSheetUrl || '')
  const [siteUrl, setSiteUrl] = useState(user.searchConsoleUrl || '')
  const [serviceAccountJson, setServiceAccountJson] = useState('')

  // AI Models
  const [aiProvider, setAiProvider] = useState(user.aiProvider || 'anthropic')
  const [aiApiKey, setAiApiKey] = useState('')

  // Site Config
  const [siteName, setSiteName] = useState(user.siteName || '')
  const [siteNiche, setSiteNiche] = useState(user.siteNiche || '')
  const [targetAudience, setTargetAudience] = useState(user.targetAudience || '')
  const [siteTone, setSiteTone] = useState(user.siteTone || 'Professional')
  const [knowledgeBase, setKnowledgeBase] = useState(user.knowledgeBase || '')

  const showFeedback = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message })
    setTimeout(() => setFeedback(null), 3000)
  }

  const saveGeneral = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/user', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })
      if (res.ok) showFeedback('success', 'General settings saved!')
      else showFeedback('error', 'Failed to save settings')
    } catch {
      showFeedback('error', 'Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const saveGitHub = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/github/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repoUrl: githubRepo, token: githubToken }),
      })
      const data = await res.json()
      if (res.ok) showFeedback('success', 'GitHub connected successfully!')
      else showFeedback('error', data.error || 'Failed to connect GitHub')
    } catch {
      showFeedback('error', 'Failed to connect GitHub')
    } finally {
      setSaving(false)
    }
  }

  const saveGoogleServices = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/google/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteUrl, serviceAccountJson, googleSheetUrl }),
      })
      if (res.ok) showFeedback('success', 'Google services updated!')
      else showFeedback('error', 'Failed to update')
    } catch {
      showFeedback('error', 'Failed to update')
    } finally {
      setSaving(false)
    }
  }

  const saveAI = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/user', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aiProvider, aiApiKey: aiApiKey || undefined }),
      })
      if (res.ok) showFeedback('success', 'AI model settings saved!')
      else showFeedback('error', 'Failed to save')
    } catch {
      showFeedback('error', 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const saveSiteConfig = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/user', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteName, siteNiche, targetAudience, siteTone, knowledgeBase }),
      })
      if (res.ok) showFeedback('success', 'Site configuration saved!')
      else showFeedback('error', 'Failed to save')
    } catch {
      showFeedback('error', 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your integrations and preferences</p>
        </div>

        {/* Feedback */}
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-4 p-3 rounded-lg border flex items-center gap-2 ${
              feedback.type === 'success'
                ? 'bg-emerald-50 border-emerald-200'
                : 'bg-red-50 border-red-200'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
            )}
            <p className={`text-sm ${feedback.type === 'success' ? 'text-emerald-700' : 'text-red-600'}`}>
              {feedback.message}
            </p>
          </motion.div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-slate-100 p-1 rounded-xl">
          {TABS.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:block">{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* General Tab */}
          {activeTab === 'general' && (
            <Card>
              <CardHeader>
                <h2 className="text-base font-semibold text-slate-900">General Settings</h2>
                <p className="text-xs text-slate-500 mt-0.5">Update your account information</p>
              </CardHeader>
              <CardContent className="space-y-5">
                <Input
                  label="Full Name"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <div>
                  <label className="text-sm font-medium text-slate-700">Email Address</label>
                  <div className="mt-1 flex items-center gap-2">
                    <input
                      type="email"
                      className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 text-slate-500 cursor-not-allowed"
                      value={user.email}
                      disabled
                    />
                    <Badge variant="success">Verified</Badge>
                  </div>
                </div>
                <Button onClick={saveGeneral} loading={saving}>Save Changes</Button>
              </CardContent>
            </Card>
          )}

          {/* Integrations Tab */}
          {activeTab === 'integrations' && (
            <div className="space-y-5">
              {/* GitHub */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-900 rounded-lg">
                        <GitBranch className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-slate-900">GitHub</h3>
                        <p className="text-xs text-slate-500">Publish blogs as Pull Requests</p>
                      </div>
                    </div>
                    {user.githubRepo ? (
                      <Badge variant="success">Connected</Badge>
                    ) : (
                      <Badge variant="default">Not connected</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {user.githubRepo && (
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <p className="text-xs text-slate-500">Connected repository</p>
                      <p className="text-sm font-medium text-slate-900 mt-0.5">{user.githubRepo}</p>
                    </div>
                  )}
                  <Input
                    label="Repository URL"
                    placeholder="https://github.com/username/repo"
                    value={githubRepo}
                    onChange={(e) => setGithubRepo(e.target.value)}
                  />
                  <Input
                    label="Personal Access Token"
                    type="password"
                    placeholder="ghp_xxxxxxxxxxxx (leave empty to keep existing)"
                    value={githubToken}
                    onChange={(e) => setGithubToken(e.target.value)}
                  />
                  <Button onClick={saveGitHub} loading={saving} size="sm">
                    {user.githubRepo ? 'Re-connect GitHub' : 'Connect GitHub'}
                  </Button>
                </CardContent>
              </Card>

              {/* Google Sheet */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Globe className="w-4 h-4 text-green-700" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-slate-900">Google Sheet</h3>
                        <p className="text-xs text-slate-500">Track keywords and performance</p>
                      </div>
                    </div>
                    {user.googleSheetUrl ? (
                      <Badge variant="success">Connected</Badge>
                    ) : (
                      <Badge variant="default">Not connected</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    label="Google Sheet URL"
                    type="url"
                    placeholder="https://docs.google.com/spreadsheets/d/..."
                    value={googleSheetUrl}
                    onChange={(e) => setGoogleSheetUrl(e.target.value)}
                  />
                  <Button onClick={saveGoogleServices} loading={saving} size="sm">
                    Save Sheet URL
                  </Button>
                </CardContent>
              </Card>

              {/* Search Console */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Globe className="w-4 h-4 text-blue-700" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-slate-900">Google Search Console</h3>
                        <p className="text-xs text-slate-500">Monitor search rankings</p>
                      </div>
                    </div>
                    {user.searchConsoleUrl ? (
                      <Badge variant="success">Connected</Badge>
                    ) : (
                      <Badge variant="default">Not connected</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
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
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 h-24 resize-none"
                      placeholder='{"type": "service_account", ...}'
                      value={serviceAccountJson}
                      onChange={(e) => setServiceAccountJson(e.target.value)}
                    />
                  </div>
                  <Button onClick={saveGoogleServices} loading={saving} size="sm">
                    Save Search Console
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* AI Models Tab */}
          {activeTab === 'ai' && (
            <Card>
              <CardHeader>
                <h2 className="text-base font-semibold text-slate-900">AI Model Configuration</h2>
                <p className="text-xs text-slate-500 mt-0.5">Choose and configure your AI provider</p>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                  <p className="text-sm text-indigo-700">
                    <strong>Default (Claude):</strong> Uses our built-in Anthropic API. No key needed unless using your own quota.
                  </p>
                </div>
                <Select
                  label="Active AI Model"
                  options={AI_MODELS}
                  value={aiProvider}
                  onChange={(e) => setAiProvider(e.target.value)}
                />

                <div className="space-y-4">
                  {AI_MODELS.map((m) => (
                    <div
                      key={m.value}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        aiProvider === m.value
                          ? 'border-indigo-300 bg-indigo-50'
                          : 'border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Key className="w-4 h-4 text-slate-400" />
                          <span className="text-sm font-medium text-slate-900">{m.label}</span>
                        </div>
                        {aiProvider === m.value && (
                          <Badge variant="indigo">Active</Badge>
                        )}
                      </div>
                      {m.value !== 'anthropic' && (
                        <Input
                          placeholder={`Enter ${m.label} API key`}
                          type="password"
                          value={aiProvider === m.value ? aiApiKey : ''}
                          onChange={(e) => {
                            setAiProvider(m.value)
                            setAiApiKey(e.target.value)
                          }}
                        />
                      )}
                      {m.value === 'anthropic' && (
                        <p className="text-xs text-slate-500">
                          Powered by Claude claude-sonnet-4-6. Built-in — no key required.
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                <Button onClick={saveAI} loading={saving}>Save AI Settings</Button>
              </CardContent>
            </Card>
          )}

          {/* Site Config Tab */}
          {activeTab === 'site' && (
            <Card>
              <CardHeader>
                <h2 className="text-base font-semibold text-slate-900">Site Configuration</h2>
                <p className="text-xs text-slate-500 mt-0.5">These settings help AI generate better content for your niche</p>
              </CardHeader>
              <CardContent className="space-y-5">
                <Input
                  label="Site Name"
                  placeholder="My SEO Blog"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                />
                <Input
                  label="Niche / Industry"
                  placeholder="e.g., SaaS, E-commerce, Digital Marketing"
                  value={siteNiche}
                  onChange={(e) => setSiteNiche(e.target.value)}
                />
                <Input
                  label="Target Audience"
                  placeholder="e.g., Marketing managers at B2B SaaS companies"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                />
                <Select
                  label="Default Writing Tone"
                  options={TONE_OPTIONS}
                  value={siteTone}
                  onChange={(e) => setSiteTone(e.target.value)}
                />
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-slate-700">Knowledge Base</label>
                  <textarea
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 h-32 resize-none"
                    placeholder="Add context about your company, products, or specific knowledge you want AI to use when writing..."
                    value={knowledgeBase}
                    onChange={(e) => setKnowledgeBase(e.target.value)}
                  />
                  <p className="text-xs text-slate-400">This context is included in every AI generation prompt</p>
                </div>
                <Button onClick={saveSiteConfig} loading={saving}>Save Site Config</Button>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  )
}
