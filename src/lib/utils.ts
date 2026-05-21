import { type ClassValue, clsx } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return inputs.filter(Boolean).join(' ')
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter((w) => w.length > 0).length
}

export function estimateReadingTime(wordCount: number): string {
  const wpm = 200
  const minutes = Math.ceil(wordCount / wpm)
  return `${minutes} min read`
}

export function extractTitle(markdown: string): string {
  const match = markdown.match(/^#\s+(.+)$/m)
  return match ? match[1] : 'Untitled'
}

export function extractExcerpt(markdown: string, length = 160): string {
  const text = markdown
    .replace(/^#+\s+.+$/gm, '')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/\[(.+?)\]\(.+?\)/g, '$1')
    .replace(/`(.+?)`/g, '$1')
    .replace(/\n+/g, ' ')
    .trim()
  return text.length > length ? text.substring(0, length) + '...' : text
}

export function calculateSEOScore(content: string, keyword?: string): number {
  let score = 50
  const wordCount = countWords(content)

  if (wordCount > 1000) score += 10
  if (wordCount > 1500) score += 5
  if (wordCount > 2000) score += 5

  const headings = (content.match(/^#{2,3}\s/gm) || []).length
  if (headings >= 3) score += 10
  if (headings >= 5) score += 5

  if (keyword) {
    const keywordCount = (content.toLowerCase().match(new RegExp(keyword.toLowerCase(), 'g')) || []).length
    if (keywordCount >= 3) score += 10
    if (keywordCount >= 5) score += 5
  }

  const hasLinks = content.includes('[') && content.includes('](')
  if (hasLinks) score += 5

  return Math.min(score, 100)
}
