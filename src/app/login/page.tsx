'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Rocket, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { rememberMe: false },
  })

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true)
    setError(null)

    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        rememberMe: data.rememberMe ? 'true' : 'false',
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid email or password. Try demo@seopilot.ai / demo123')
        setIsLoading(false)
        return
      }

      // Fetch user to check onboarding status
      const userRes = await fetch('/api/user')
      if (userRes.ok) {
        const { user } = await userRes.json()
        if (!user.onboardingComplete) {
          router.push('/get-started')
        } else {
          router.push('/dashboard')
        }
      } else {
        router.push('/get-started')
      }
    } catch {
      setError('An unexpected error occurred. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-indigo-600 rounded-2xl mb-4 shadow-lg shadow-indigo-200">
            <Rocket className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">SEO Pilot</h1>
          <p className="text-slate-500 text-sm mt-1">AI-powered SEO blog generator</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-1">Welcome back</h2>
          <p className="text-sm text-slate-500 mb-6">Sign in to your account to continue</p>

          {/* Demo credentials hint */}
          <div className="mb-5 p-3 bg-indigo-50 rounded-lg border border-indigo-100">
            <p className="text-xs text-indigo-700 font-medium">Demo credentials:</p>
            <p className="text-xs text-indigo-600 mt-0.5">demo@seopilot.ai / demo123</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-600">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="relative">
              <Input
                label="Email address"
                type="email"
                placeholder="you@example.com"
                error={errors.email?.message}
                {...register('email')}
              />
              <Mail className="absolute right-3 top-8 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                error={errors.password?.message}
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-8 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  {...register('rememberMe')}
                />
                <span className="text-sm text-slate-600">Remember me</span>
              </label>
              <button type="button" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              loading={isLoading}
              className="w-full mt-2"
              size="lg"
            >
              Sign in
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          Secured with industry-standard encryption
        </p>
      </motion.div>
    </div>
  )
}
