import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')
  const state = searchParams.get('state')

  // Handle GitHub OAuth callback if needed
  if (!code) {
    return NextResponse.redirect(new URL('/settings?error=github_auth_failed', request.url))
  }

  // For now, redirect to settings with the code
  return NextResponse.redirect(
    new URL(`/settings?github_code=${code}&state=${state}`, request.url)
  )
}
