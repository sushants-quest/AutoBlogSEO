'use client'

import { CheckCircle2, Circle } from 'lucide-react'
import { motion } from 'framer-motion'

interface Step {
  number: number
  title: string
  completed: boolean
}

interface StepIndicatorProps {
  steps: Step[]
  currentStep: number
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  const progress = ((currentStep - 1) / (steps.length - 1)) * 100

  return (
    <div className="w-full">
      {/* Progress bar */}
      <div className="relative h-1.5 bg-slate-100 rounded-full mb-6">
        <motion.div
          className="absolute left-0 top-0 h-full bg-indigo-600 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>

      {/* Step labels */}
      <div className="flex justify-between">
        {steps.map((step) => (
          <div key={step.number} className="flex flex-col items-center gap-1">
            {step.completed ? (
              <CheckCircle2 className="w-5 h-5 text-indigo-600" />
            ) : step.number === currentStep ? (
              <div className="w-5 h-5 rounded-full border-2 border-indigo-600 bg-white flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-indigo-600" />
              </div>
            ) : (
              <Circle className="w-5 h-5 text-slate-300" />
            )}
            <span
              className={`text-xs font-medium ${
                step.completed || step.number === currentStep ? 'text-slate-700' : 'text-slate-400'
              } hidden sm:block`}
            >
              {step.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
