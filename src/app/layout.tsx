import type { Metadata } from 'next'
import { AuthSessionProvider } from '@/components/providers/SessionProvider'
import './globals.css'

export const metadata: Metadata = {
  title: 'SEO Pilot - AI-Powered SEO Blog Generator',
  description: 'Generate SEO-optimized blog posts with AI, publish to GitHub, and track your organic growth.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-white antialiased">
        <AuthSessionProvider>{children}</AuthSessionProvider>
      </body>
    </html>
  )
}
