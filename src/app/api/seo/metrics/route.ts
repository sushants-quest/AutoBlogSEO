import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Return mock SEO metrics (in production, fetch from Google Search Console)
    const metrics = {
      domainAuthority: 34,
      indexedPages: 127,
      organicTraffic: 4891,
      aiCitations: 23,
      avgQualityScore: 87,
      pipelineCount: 12,
      trafficHistory: [
        { month: 'Jan', traffic: 2400 },
        { month: 'Feb', traffic: 2800 },
        { month: 'Mar', traffic: 3200 },
        { month: 'Apr', traffic: 3800 },
        { month: 'May', traffic: 4200 },
        { month: 'Jun', traffic: 4891 },
      ],
      contentByStatus: [
        { status: 'Brief', count: 4 },
        { status: 'Draft', count: 3 },
        { status: 'Review', count: 3 },
        { status: 'Published', count: 8 },
      ],
      trafficSources: [
        { name: 'Organic', value: 65 },
        { name: 'Direct', value: 20 },
        { name: 'Social', value: 10 },
        { name: 'Referral', value: 5 },
      ],
    }

    return NextResponse.json(metrics)
  } catch (error) {
    console.error('SEO metrics error:', error)
    return NextResponse.json({ error: 'Failed to fetch SEO metrics' }, { status: 500 })
  }
}
