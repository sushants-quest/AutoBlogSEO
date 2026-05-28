import Link from 'next/link'
import { articles } from './data'
import { ArrowRight, Clock, Zap } from 'lucide-react'

export const metadata = {
  title: 'Blog — SEO Pilot',
  description: 'Actionable guides on SEO, AI content, and publishing workflows from the SEO Pilot team.',
}

export default function ArticlesPage() {
  const [featured, ...rest] = articles

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
            <Link href="/#how-it-works" className="hover:text-slate-900 transition-colors">How it works</Link>
            <Link href="/#pricing" className="hover:text-slate-900 transition-colors">Pricing</Link>
            <Link href="/articles" className="text-indigo-600 font-semibold">Blog</Link>
            <Link href="/login" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
              Get started
            </Link>
          </div>
        </div>
      
        <a href="/blog/mobile-app-vs--website-blog--which-is-best-for-your-brand-" className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition">Read Blog: Mobile App vs. Website Blog: Which is Best For Your Brand?</a>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-14">
          <p className="text-sm font-semibold text-indigo-600 uppercase tracking-widest mb-3">Blog</p>
          <h1 className="text-4xl font-extrabold tracking-tight mb-4">SEO & AI Content Guides</h1>
          <p className="text-lg text-slate-500 max-w-xl">
            Actionable strategies to grow your organic traffic using AI-assisted content, better on-page SEO, and smarter publishing workflows.
          </p>
        </div>

        {/* Featured post */}
        <Link href={`/articles/${featured.slug}`} className="group block mb-12">
          <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className={`h-48 bg-gradient-to-br ${featured.coverColor} flex items-end p-6`}>
              <span className="text-xs font-bold text-white/80 uppercase tracking-widest bg-white/20 rounded-full px-3 py-1">
                {featured.category}
              </span>
            </div>
            <div className="p-7">
              <div className="flex items-center gap-3 text-sm text-slate-400 mb-3">
                <span>{featured.date}</span>
                <span>·</span>
                <Clock className="w-3.5 h-3.5" />
                <span>{featured.readingTime}</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">
                {featured.title}
              </h2>
              <p className="text-slate-500 mb-4 leading-relaxed">{featured.description}</p>
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 group-hover:gap-2.5 transition-all">
                Read article <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </Link>

        {/* Rest of posts */}
        <div className="grid md:grid-cols-2 gap-6">
          {rest.map((article) => (
            <Link key={article.slug} href={`/articles/${article.slug}`} className="group block">
              <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
                <div className={`h-28 bg-gradient-to-br ${article.coverColor}`} />
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 rounded-full px-2.5 py-0.5">
                      {article.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mb-2">
                    <span>{article.date}</span>
                    <span>·</span>
                    <Clock className="w-3 h-3" />
                    <span>{article.readingTime}</span>
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                    {article.title}
                  </h2>
                  <p className="text-sm text-slate-500 leading-relaxed flex-1 mb-4">{article.description}</p>
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 group-hover:gap-2.5 transition-all mt-auto">
                    Read article <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer CTA */}
      <div className="border-t border-slate-100 bg-slate-50 py-16 px-6 mt-16">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-3">Ready to automate your SEO content?</h2>
          <p className="text-slate-500 mb-6">Start generating and publishing SEO blogs in minutes with SEO Pilot.</p>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
          >
            Get started free <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
