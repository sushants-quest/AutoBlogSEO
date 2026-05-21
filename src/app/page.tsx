'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Zap, BarChart2, GitBranch, Search, CheckCircle, ArrowRight,
  Globe, TrendingUp, FileText, Sparkles, ChevronRight, Star,
} from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
}

export default function LandingPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  function handleGetStarted() {
    if (status === 'loading') return
    if (session?.user) {
      router.push((session.user as { onboardingComplete?: boolean }).onboardingComplete ? '/dashboard' : '/get-started')
    } else {
      router.push('/login')
    }
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">SEO Pilot</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#how-it-works" className="hover:text-slate-900 transition-colors">How it works</a>
            <a href="#pricing" className="hover:text-slate-900 transition-colors">Pricing</a>
            <Link href="/articles" className="hover:text-slate-900 transition-colors">Blog</Link>
          </div>
          <div className="flex items-center gap-3">
            {session?.user ? (
              <button
                onClick={handleGetStarted}
                className="px-4 py-2 text-sm font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Go to Dashboard
              </button>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                  Log in
                </Link>
                <button
                  onClick={handleGetStarted}
                  className="px-4 py-2 text-sm font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Get started free
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial="hidden" animate="visible" variants={fadeUp} custom={0}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-6"
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI-Powered SEO Blog Automation
          </motion.div>

          <motion.h1
            initial="hidden" animate="visible" variants={fadeUp} custom={1}
            className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight mb-6"
          >
            Write, publish &amp; rank{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500">
              SEO blogs on autopilot
            </span>
          </motion.h1>

          <motion.p
            initial="hidden" animate="visible" variants={fadeUp} custom={2}
            className="text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            SEO Pilot uses AI to research, write, and publish SEO-optimised blog posts directly
            to your GitHub repo — then tracks your rankings in one place.
          </motion.p>

          <motion.div
            initial="hidden" animate="visible" variants={fadeUp} custom={3}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={handleGetStarted}
              className="flex items-center gap-2 px-7 py-3.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 text-base"
            >
              Get started free <ArrowRight className="w-4 h-4" />
            </button>
            <Link
              href="/articles"
              className="flex items-center gap-2 px-7 py-3.5 border border-slate-200 text-slate-700 font-semibold rounded-xl hover:border-slate-300 hover:bg-slate-50 transition-all text-base"
            >
              Read our blog <ChevronRight className="w-4 h-4" />
            </Link>
          </motion.div>

          <motion.div
            initial="hidden" animate="visible" variants={fadeUp} custom={4}
            className="mt-10 flex items-center justify-center gap-2 text-sm text-slate-400"
          >
            <div className="flex -space-x-2">
              {['bg-indigo-400', 'bg-violet-400', 'bg-pink-400', 'bg-emerald-400'].map((c, i) => (
                <div key={i} className={`w-7 h-7 rounded-full ${c} border-2 border-white`} />
              ))}
            </div>
            <span>Trusted by <strong className="text-slate-600">1,200+</strong> content teams</span>
          </motion.div>
        </div>

        {/* Dashboard preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="max-w-5xl mx-auto mt-16"
        >
          <div className="rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-200 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 border-b border-slate-200">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-emerald-400" />
              <div className="flex-1 mx-4 h-6 bg-white rounded border border-slate-200 flex items-center px-3">
                <span className="text-xs text-slate-400">app.seopilot.ai/dashboard</span>
              </div>
            </div>
            <div className="p-6 bg-slate-50">
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-4">
                {[
                  { label: 'Domain Authority', value: '34', color: 'text-indigo-600' },
                  { label: 'Indexed Pages', value: '127', color: 'text-violet-600' },
                  { label: 'Organic Traffic', value: '4.8K', color: 'text-emerald-600' },
                  { label: 'AI Citations', value: '23', color: 'text-amber-600' },
                  { label: 'Avg Quality', value: '87', color: 'text-pink-600' },
                  { label: 'Pipeline', value: '12', color: 'text-cyan-600' },
                ].map((m) => (
                  <div key={m.label} className="bg-white rounded-xl p-3 border border-slate-100 shadow-sm">
                    <p className="text-[10px] text-slate-400 leading-tight mb-1">{m.label}</p>
                    <p className={`text-xl font-bold ${m.color}`}>{m.value}</p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['Brief', 'Draft', 'Review', 'Published'].map((stage, i) => (
                  <div key={stage} className="bg-white rounded-xl p-3 border border-slate-100">
                    <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-2">{stage}</p>
                    {[...Array(i === 0 ? 2 : i === 3 ? 1 : 2)].map((_, j) => (
                      <div key={j} className="h-6 rounded bg-slate-100 mb-1.5" />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-24 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="text-center mb-16"
          >
            <p className="text-sm font-semibold text-indigo-600 uppercase tracking-widest mb-3">How it works</p>
            <h2 className="text-4xl font-bold tracking-tight">From prompt to published in minutes</h2>
            <p className="mt-4 text-lg text-slate-500 max-w-xl mx-auto">
              No copywriters, no manual uploads. Just describe what you want and SEO Pilot handles the rest.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: <Search className="w-6 h-6 text-indigo-600" />,
                step: '01',
                title: 'Describe your blog topic',
                desc: 'Type a prompt or paste a keyword. SEO Pilot researches the top results and builds an SEO brief automatically.',
              },
              {
                icon: <Sparkles className="w-6 h-6 text-violet-600" />,
                step: '02',
                title: 'AI generates the full post',
                desc: 'Gemini 2.5 Pro writes a structured, keyword-rich article with TL;DR, headings, tables, and a compelling CTA.',
              },
              {
                icon: <CheckCircle className="w-6 h-6 text-emerald-600" />,
                step: '03',
                title: 'Review & approve',
                desc: 'Read the draft in the built-in viewer. Check the SEO score, tweak the content, then approve with one click.',
              },
              {
                icon: <GitBranch className="w-6 h-6 text-pink-600" />,
                step: '04',
                title: 'Published as a GitHub PR',
                desc: 'Approved posts are pushed to your repo as an MDX file via a Pull Request. Merge it to go live.',
              },
              {
                icon: <BarChart2 className="w-6 h-6 text-amber-600" />,
                step: '05',
                title: 'Track rankings & traffic',
                desc: 'Google Search Console data flows into your dashboard. Monitor indexed pages, clicks, and AI citation growth.',
              },
              {
                icon: <Globe className="w-6 h-6 text-cyan-600" />,
                step: '06',
                title: 'Outrank competitors',
                desc: 'See competitor keyword gaps and auto-generate content that fills them — on a continuous, scalable cadence.',
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i * 0.2}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex gap-4"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                  {item.icon}
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-300 tracking-widest">STEP {item.step}</span>
                  <h3 className="font-semibold text-slate-900 mt-0.5 mb-1">{item.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES STRIP */}
      <section className="py-16 px-6 border-y border-slate-100">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: <TrendingUp className="w-6 h-6" />, label: 'SEO-optimised output', color: 'text-indigo-500' },
              { icon: <GitBranch className="w-6 h-6" />, label: 'GitHub PR publishing', color: 'text-violet-500' },
              { icon: <FileText className="w-6 h-6" />, label: 'Markdown / MDX files', color: 'text-emerald-500' },
              { icon: <BarChart2 className="w-6 h-6" />, label: 'Real-time analytics', color: 'text-amber-500' },
            ].map((f) => (
              <div key={f.label} className="flex flex-col items-center gap-2">
                <div className={f.color}>{f.icon}</div>
                <p className="text-sm font-medium text-slate-700">{f.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="text-center mb-16"
          >
            <p className="text-sm font-semibold text-indigo-600 uppercase tracking-widest mb-3">Pricing</p>
            <h2 className="text-4xl font-bold tracking-tight">Simple, transparent pricing</h2>
            <p className="mt-4 text-lg text-slate-500">Start free. Scale as your content engine grows.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 items-start">
            {[
              {
                name: 'Starter',
                price: '$0',
                period: 'forever',
                desc: 'Perfect for personal blogs and side projects.',
                features: ['5 AI blogs / month', 'GitHub PR publishing', 'Basic SEO scoring', 'Community support'],
                cta: 'Start free',
                highlight: false,
              },
              {
                name: 'Pro',
                price: '$29',
                period: '/month',
                desc: 'For growing teams who publish consistently.',
                features: ['Unlimited AI blogs', 'Google Search Console sync', 'Competitor keyword tracking', 'AI citation monitoring', 'Priority support'],
                cta: 'Start Pro trial',
                highlight: true,
              },
              {
                name: 'Enterprise',
                price: 'Custom',
                period: '',
                desc: 'For agencies and large content operations.',
                features: ['Everything in Pro', 'Custom AI model fine-tuning', 'White-label dashboard', 'SLA & dedicated CSM', 'SSO / SAML'],
                cta: 'Talk to sales',
                highlight: false,
              },
            ].map((plan, i) => (
              <motion.div
                key={plan.name}
                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i * 0.2}
                className={`rounded-2xl p-7 border flex flex-col ${
                  plan.highlight
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-2xl shadow-indigo-200 md:-mt-4'
                    : 'bg-white border-slate-200 text-slate-900 shadow-sm'
                }`}
              >
                {plan.highlight && (
                  <div className="flex items-center gap-1 text-xs font-bold text-indigo-200 uppercase tracking-widest mb-3">
                    <Star className="w-3 h-3 fill-indigo-200" /> Most popular
                  </div>
                )}
                <p className={`text-sm font-semibold mb-1 ${plan.highlight ? 'text-indigo-200' : 'text-slate-500'}`}>{plan.name}</p>
                <div className="flex items-end gap-1 mb-2">
                  <span className="text-4xl font-extrabold">{plan.price}</span>
                  {plan.period && <span className={`text-sm mb-1 ${plan.highlight ? 'text-indigo-200' : 'text-slate-400'}`}>{plan.period}</span>}
                </div>
                <p className={`text-sm mb-6 ${plan.highlight ? 'text-indigo-100' : 'text-slate-500'}`}>{plan.desc}</p>
                <ul className="space-y-2.5 flex-1 mb-7">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <CheckCircle className={`w-4 h-4 flex-shrink-0 ${plan.highlight ? 'text-indigo-200' : 'text-indigo-500'}`} />
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={handleGetStarted}
                  className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${
                    plan.highlight
                      ? 'bg-white text-indigo-600 hover:bg-indigo-50'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  {plan.cta}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 px-6 bg-gradient-to-br from-indigo-600 to-violet-600">
        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
          className="max-w-3xl mx-auto text-center text-white"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-5">
            Ready to grow your organic traffic?
          </h2>
          <p className="text-lg text-indigo-100 mb-10 max-w-xl mx-auto">
            Join thousands of teams using SEO Pilot to publish better content faster. No credit card required.
          </p>
          <button
            onClick={handleGetStarted}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-all shadow-xl text-base"
          >
            Get started for free <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 px-6 bg-slate-900 text-slate-400">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white text-lg tracking-tight">SEO Pilot</span>
            </div>
            <div className="flex flex-wrap gap-6 text-sm">
              <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
              <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
              <Link href="/articles" className="hover:text-white transition-colors">Blog</Link>
              <Link href="/login" className="hover:text-white transition-colors">Login</Link>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
            <p>© {new Date().getFullYear()} SEO Pilot. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
