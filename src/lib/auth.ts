import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        rememberMe: { label: 'Remember Me', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        })

        if (!user) return null

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        )

        if (!isValid) return null

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          onboardingComplete: user.onboardingComplete,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id
        token.onboardingComplete = (user as { onboardingComplete?: boolean }).onboardingComplete
      }
      if (trigger === 'update' && session) {
        token.onboardingComplete = session.onboardingComplete
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.onboardingComplete = token.onboardingComplete as boolean
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days default
  },
  secret: process.env.NEXTAUTH_SECRET,
})

declare module 'next-auth' {
  interface User {
    onboardingComplete?: boolean
  }
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      onboardingComplete?: boolean
    }
  }
}
