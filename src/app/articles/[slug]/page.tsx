import { notFound } from 'next/navigation'
import Link from 'next/link'
import { articles, getArticle } from '../data'
import { ArrowLeft, Clock, Calendar, ArrowRight, Zap } from 'lucide-react'

export async function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = getArticle(slug)
  if (!article) return {}
  return {
    title: `${article.title} — SEO Pilot Blog`,
    description: article.description,
  }
}

function renderContent(content: string) {
  const lines = content.trim().split('\n')
  const elements: React.ReactNode[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    // Code block
    if (line.startsWith('```')) {
      const lang = line.slice(3).trim()
      const codeLines: string[] = []
      i++
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i])
        i++
      }
      elements.push(
        <pre key={i} className="bg-slate-900 text-slate-100 rounded-xl p-5 my-5 overflow-x-auto text-sm leading-relaxed">
          <code>{codeLines.join('\n')}</code>
        </pre>
      )
      i++
      continue
    }

    // Table
    if (line.startsWith('|')) {
      const tableLines: string[] = []
      while (i < lines.length && lines[i].startsWith('|')) {
        tableLines.push(lines[i])
        i++
      }
      const rows = tableLines.filter((l) => !l.match(/^\|[\s-|]+\|$/))
      const headers = rows[0].split('|').filter(Boolean).map((s) => s.trim())
      const body = rows.slice(1)
      elements.push(
        <div key={i} className="overflow-x-auto my-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50">
                {headers.map((h, hi) => (
                  <th key={hi} className="text-left px-4 py-3 font-semibold text-slate-700 border border-slate-200">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {body.map((row, ri) => {
                const cells = row.split('|').filter(Boolean).map((s) => s.trim())
                return (
                  <tr key={ri} className="hover:bg-slate-50">
                    {cells.map((cell, ci) => (
                      <td key={ci} className="px-4 py-3 border border-slate-200 text-slate-600">{cell}</td>
                    ))}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )
      continue
    }

    // HR
    if (line.startsWith('---')) {
      elements.push(<hr key={i} className="border-slate-200 my-8" />)
      i++
      continue
    }

    // H2
    if (line.startsWith('## ')) {
      elements.push(
        <h2 key={i} className="text-2xl font-bold text-slate-900 mt-10 mb-4">{line.slice(3)}</h2>
      )
      i++
      continue
    }

    // H3
    if (line.startsWith('### ')) {
      elements.push(
        <h3 key={i} className="text-lg font-semibold text-slate-800 mt-6 mb-3">{line.slice(4)}</h3>
      )
      i++
      continue
    }

    // TL;DR box
    if (line.startsWith('## TL;DR')) {
      const tldrLines: string[] = []
      i++
      while (i < lines.length && lines[i] !== '' && !lines[i].startsWith('---')) {
        tldrLines.push(lines[i])
        i++
      }
      elements.push(
        <div key={i} className="bg-indigo-50 border border-indigo-100 rounded-xl p-5 my-6">
          <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-2">TL;DR</p>
          <p className="text-slate-700 leading-relaxed">{tldrLines.join(' ')}</p>
        </div>
      )
      continue
    }

    // Bullet list
    if (line.startsWith('- ')) {
      const items: string[] = []
      while (i < lines.length && lines[i].startsWith('- ')) {
        items.push(lines[i].slice(2))
        i++
      }
      elements.push(
        <ul key={i} className="list-disc list-inside space-y-1.5 my-4 text-slate-600">
          {items.map((item, ii) => (
            <li key={ii} dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
          ))}
        </ul>
      )
      continue
    }

    // Checkbox list (✅)
    if (line.match(/^[✅-] /)) {
      const items: string[] = []
      while (i < lines.length && (lines[i].startsWith('✅') || lines[i].startsWith('- ✅'))) {
        items.push(lines[i].replace(/^[-\s]*✅\s*/, ''))
        i++
      }
      elements.push(
        <ul key={i} className="space-y-2 my-4">
          {items.map((item, ii) => (
            <li key={ii} className="flex items-start gap-2 text-slate-600 text-sm">
              <span className="text-emerald-500 mt-0.5 flex-shrink-0">✅</span>
              <span dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
            </li>
          ))}
        </ul>
      )
      continue
    }

    // Numbered list
    if (line.match(/^\d+\. /)) {
      const items: string[] = []
      while (i < lines.length && lines[i].match(/^\d+\. /)) {
        items.push(lines[i].replace(/^\d+\. /, ''))
        i++
      }
      elements.push(
        <ol key={i} className="list-decimal list-inside space-y-1.5 my-4 text-slate-600">
          {items.map((item, ii) => (
            <li key={ii} dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
          ))}
        </ol>
      )
      continue
    }

    // Empty line
    if (line.trim() === '') {
      i++
      continue
    }

    // Regular paragraph
    elements.push(
      <p
        key={i}
        className="text-slate-600 leading-relaxed my-3"
        dangerouslySetInnerHTML={{
          __html: line
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code class="bg-slate-100 text-indigo-700 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>'),
        }}
      />
    )
    i++
  }

  return elements
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = getArticle(slug)
  if (!article) notFound()

  const related = articles.filter((a) => a.slug !== slug).slice(0, 2)

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* NAV */}
      <nav className="border-b border-slate-100 bg-white">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">SEO Pilot</span>
          </Link>
          <div className="flex items-center gap-6 text-sm font-medium text-slate-600">
            <Link href="/articles" className="hover:text-slate-900 transition-colors">← Blog</Link>
            <Link href="/login" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
              Get started
            </Link>
          </div>
        </div>
      </nav>

      {/* Cover */}
      <div className={`h-52 bg-gradient-to-br ${article.coverColor}`} />

      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Back */}
        <Link href="/articles" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-slate-600 transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </Link>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 rounded-full px-3 py-1">
            {article.category}
          </span>
          <span className="flex items-center gap-1.5 text-sm text-slate-400">
            <Calendar className="w-3.5 h-3.5" /> {article.date}
          </span>
          <span className="flex items-center gap-1.5 text-sm text-slate-400">
            <Clock className="w-3.5 h-3.5" /> {article.readingTime}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 mb-4 leading-tight">
          {article.title}
        </h1>
        <p className="text-lg text-slate-500 mb-10 leading-relaxed">{article.description}</p>

        <hr className="border-slate-200 mb-10" />

        {/* Content */}
        <article className="prose-slate">
          {renderContent(article.content)}
        </article>

        <hr className="border-slate-200 mt-12 mb-10" />

        {/* CTA */}
        <div className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl p-8 text-white text-center mb-14">
          <h3 className="text-2xl font-bold mb-2">Put this into practice with SEO Pilot</h3>
          <p className="text-indigo-100 mb-6">Generate SEO-optimised blog posts in minutes and publish them to GitHub automatically.</p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-colors"
          >
            Try it free <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-5">More from the blog</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {related.map((a) => (
                <Link key={a.slug} href={`/articles/${a.slug}`} className="group block">
                  <div className="rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                    <div className={`h-20 bg-gradient-to-br ${a.coverColor}`} />
                    <div className="p-4">
                      <p className="text-xs text-slate-400 mb-1">{a.readingTime}</p>
                      <p className="font-semibold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors leading-snug">
                        {a.title}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
