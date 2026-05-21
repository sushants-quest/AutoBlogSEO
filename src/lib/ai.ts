import { GoogleGenerativeAI } from '@google/generative-ai'

const MOCK_BLOG_CONTENT = `---
title: "The Complete Guide to SEO in 2024"
description: "Master search engine optimization with proven strategies that drive organic traffic and boost rankings."
keywords: "SEO, search engine optimization, organic traffic, rankings"
author: "SEO Pilot AI"
date: "2024-01-15"
---

# The Complete Guide to SEO in 2024

## TL;DR
Search engine optimization (SEO) remains one of the most powerful digital marketing strategies in 2024. This comprehensive guide covers everything from technical SEO fundamentals to advanced content strategies that drive sustainable organic growth.

## Introduction

In the ever-evolving digital landscape, SEO continues to be a cornerstone of online visibility. With Google processing over 8.5 billion searches daily, mastering SEO is no longer optional—it's essential for any business seeking sustainable online growth.

This guide will walk you through the most effective SEO strategies for 2024, backed by data and real-world results.

## Understanding Modern SEO

### Core Web Vitals Matter More Than Ever

Google's Core Web Vitals have become a critical ranking factor. These metrics measure:

- **Largest Contentful Paint (LCP)**: Loading performance
- **First Input Delay (FID)**: Interactivity
- **Cumulative Layout Shift (CLS)**: Visual stability

Optimizing for these metrics not only improves your search rankings but also enhances user experience, leading to higher engagement and conversions.

### E-E-A-T: The Foundation of Trust

Experience, Expertise, Authoritativeness, and Trustworthiness (E-E-A-T) form the bedrock of Google's content quality assessment. In 2024, demonstrating these qualities is paramount.

**How to demonstrate E-E-A-T:**
1. Cite credible sources and link to authoritative websites
2. Include author bios with relevant credentials
3. Keep content regularly updated with current information
4. Build a strong backlink profile from reputable domains

## Technical SEO Fundamentals

### Site Architecture and Crawlability

A well-structured website helps search engines discover and index your content efficiently.

**Best practices include:**
- Create a clear URL hierarchy
- Implement XML sitemaps
- Use robots.txt strategically
- Fix broken links and redirect chains

### Page Speed Optimization

Site speed is a confirmed ranking factor. Here's how to improve it:

1. **Compress images**: Use WebP format and lazy loading
2. **Minimize JavaScript**: Remove unused code and defer non-critical scripts
3. **Leverage browser caching**: Set appropriate cache headers
4. **Use a CDN**: Distribute content closer to users

## Content Strategy for 2024

### Topic Clusters and Pillar Pages

Modern SEO success relies on topical authority. Instead of targeting individual keywords, build comprehensive topic clusters:

- **Pillar page**: Broad overview of a topic (2,000+ words)
- **Cluster pages**: In-depth coverage of subtopics
- **Internal linking**: Connect cluster pages to the pillar

This structure signals topical expertise to search engines and improves site navigation.

### Semantic SEO and Natural Language

With Google's BERT and MUM algorithms, understanding context and intent is crucial. Focus on:

- Using related terms and synonyms naturally
- Answering questions comprehensively
- Structuring content for featured snippets

## Link Building Strategies

High-quality backlinks remain one of the strongest ranking signals. Effective link building strategies include:

1. **Digital PR**: Create newsworthy content that earns natural links
2. **Resource page link building**: Get listed on relevant resource pages
3. **Broken link building**: Replace dead links with your content
4. **Guest posting**: Contribute valuable content to authoritative publications

## Measuring SEO Success

Track these key metrics to gauge your SEO performance:

| Metric | Tool | Target |
|--------|------|--------|
| Organic Traffic | Google Analytics | +20% YoY |
| Keyword Rankings | Search Console | Top 10 |
| Backlink Growth | Ahrefs/SEMrush | +10/month |
| Core Web Vitals | PageSpeed Insights | All green |

## Conclusion

SEO in 2024 rewards websites that prioritize user experience, demonstrate expertise, and create genuinely helpful content. By implementing the strategies outlined in this guide, you'll be well-positioned to improve your organic search visibility and drive sustainable traffic growth.

Start with the fundamentals—technical SEO and quality content—then build out your authority through strategic link building and consistent publishing. SEO is a long-term investment, but the compound returns make it one of the highest-ROI marketing channels available.

---

*Ready to accelerate your SEO? Start with a comprehensive audit of your current performance and identify your biggest opportunities for improvement.*`

const SEO_SYSTEM_PROMPT = (tone: string) => `You are an expert SEO blog writer and content strategist. Your task is to write comprehensive, well-optimized blog posts that rank well on search engines and provide genuine value to readers.

When writing blog posts:
1. Start with YAML frontmatter including title, description, keywords, author ("SEO Pilot AI"), and date (today's date)
2. Include a compelling introduction that hooks the reader
3. Add a "TL;DR" section right after the introduction
4. Use proper heading hierarchy (H2 for main sections, H3 for subsections)
5. Include relevant statistics and data points
6. Add practical actionable advice
7. Use bullet points and numbered lists for clarity
8. Include a data table where appropriate
9. Write in a ${tone} tone
10. Optimize for the target keyword naturally throughout the content
11. Aim for 1,500-2,500 words
12. End with a strong conclusion and call-to-action

Always return ONLY valid Markdown content starting with the YAML frontmatter (---).`

export async function generateBlogPost({
  prompt,
  model = 'gemini-2.5-pro',
  keyword,
  tone = 'Professional',
  userApiKey,
}: {
  prompt: string
  model?: string
  keyword?: string
  tone?: string
  userApiKey?: string
}): Promise<string> {
  const geminiKey = userApiKey || process.env.GEMINI_API_KEY

  if (!geminiKey || geminiKey === 'your-gemini-api-key-here') {
    await new Promise((resolve) => setTimeout(resolve, 2000))
    return MOCK_BLOG_CONTENT
  }

  const userMessage = `Write a comprehensive SEO-optimized blog post about: ${prompt}${keyword ? `\n\nTarget keyword: "${keyword}"` : ''}\n\nMake it engaging, informative, and well-structured with proper markdown formatting.`

  try {
    const genAI = new GoogleGenerativeAI(geminiKey)
    const geminiModel = genAI.getGenerativeModel({
      model: model.startsWith('gemini') ? model : 'gemini-2.5-pro',
      systemInstruction: SEO_SYSTEM_PROMPT(tone),
    })

    const result = await geminiModel.generateContent(userMessage)
    const text = result.response.text()
    return text || MOCK_BLOG_CONTENT
  } catch (err) {
    console.error('Gemini generation error:', err)
    return MOCK_BLOG_CONTENT
  }
}
