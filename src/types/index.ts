export interface User {
  id: string
  email: string
  name?: string | null
  onboardingComplete: boolean
  githubToken?: string | null
  githubRepo?: string | null
  googleSheetUrl?: string | null
  searchConsoleUrl?: string | null
  aiProvider: string
  aiApiKey?: string | null
  siteNiche?: string | null
  siteTone?: string | null
  siteName?: string | null
  targetAudience?: string | null
  knowledgeBase?: string | null
}

export interface Blog {
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
  userId: string
  createdAt: Date
  updatedAt: Date
}

export interface SEOMetrics {
  domainAuthority: number
  indexedPages: number
  organicTraffic: number
  aiCitations: number
  avgQualityScore: number
  pipelineCount: number
  trafficHistory: { month: string; traffic: number }[]
  contentByStatus: { status: string; count: number }[]
  trafficSources: { name: string; value: number }[]
}

export interface BlogGenerateRequest {
  prompt: string
  model?: string
  keyword?: string
  tone?: string
}

export interface BlogPublishRequest {
  blogId: string
  repoUrl: string
  token: string
}

export type BlogStatus = 'brief' | 'draft' | 'review' | 'published'

export interface NavItem {
  label: string
  href: string
  icon: string
}
