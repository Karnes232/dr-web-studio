"use client"

import { useState } from "react"
import { Reveal } from "@/components/animation/Reveal"
import {
  Search,
  Lightbulb,
  Palette,
  Code,
  Rocket,
  HeadphonesIcon,
  CheckCircle2,
  ArrowRight,
  Clock,
} from "lucide-react"
import type { ProcessStep } from "./types"

interface ProcessTimelineProps {
  data: ProcessStep[]
  language?: "en" | "es"
}

// Icon mapping
const iconMap: Record<string, any> = {
  Search,
  Lightbulb,
  Palette,
  Code,
  Rocket,
  HeadphonesIcon,
  CheckCircle2,
}

export function ProcessTimeline({
  data,
  language = "es",
}: ProcessTimelineProps) {
  const [activeStep, setActiveStep] = useState<number | null>(null)

  const labels = {
    es: {
      title: "Nuestro Proceso de Desarrollo",
      subtitle: "Un enfoque probado para entregar proyectos exitosos",
      step: "Paso",
      duration: "Duración",
      deliverables: "Entregables",
      details: "Detalles",
      expandStep: "Ver Detalles",
      collapseStep: "Ocultar Detalles",
    },
    en: {
      title: "Our Development Process",
      subtitle: "A proven approach to delivering successful projects",
      step: "Step",
      duration: "Duration",
      deliverables: "Deliverables",
      details: "Details",
      expandStep: "View Details",
      collapseStep: "Hide Details",
    },
  }

  const t = labels[language]

  return (
    <section className="py-20 bg-gradient-to-br from-white via-slate-50 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-500 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <Reveal className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-sm font-medium mb-6">
            <Rocket className="w-4 h-4" />
            {language === "es"
              ? "Metodología Comprobada"
              : "Proven Methodology"}
          </Reveal>

          <Reveal
            as="h2"
            delay={0.1}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-slate-900 dark:text-white"
          >
            {t.title}
          </Reveal>

          <Reveal
            as="p"
            delay={0.2}
            className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto"
          >
            {t.subtitle}
          </Reveal>
        </div>

        {/* Timeline */}
        <div className="max-w-5xl mx-auto">
          {/* Desktop Timeline (Horizontal) */}
          <div className="hidden lg:block">
            {/* Steps Container */}
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute top-20 left-0 right-0 h-1 bg-gradient-to-r from-orange-200 via-yellow-200 to-yellow-200 dark:from-orange-900 dark:via-yellow-900 dark:to-yellow-900" />

              {/* Progress Line */}
              <div className="absolute top-20 left-0 w-full h-1 bg-gradient-to-r from-orange-600 via-yellow-600 to-yellow-600" />

              {/* Steps */}
              <div className="grid grid-cols-6 gap-4">
                {data.map((step, index) => {
                  const Icon = iconMap[step.icon] || CheckCircle2
                  const isActive = activeStep === index

                  return (
                    <Reveal
                      key={index}
                      delay={index * 0.1}
                      className="relative"
                    >
                      {/* Step Card */}
                      <div
                        className={`cursor-pointer transition-all duration-300 ${
                          isActive ? "transform scale-105" : ""
                        }`}
                        onClick={() => setActiveStep(isActive ? null : index)}
                      >
                        {/* Icon Circle */}
                        <div
                          className={`relative z-10 mx-auto w-40 h-40 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300 ${
                            isActive
                              ? "bg-gradient-to-br from-orange-500 to-yellow-500 shadow-2xl shadow-orange-500/50"
                              : "bg-white dark:bg-slate-800 border-4 border-orange-200 dark:border-orange-900"
                          } transition-all duration-300`}
                        >
                          <Icon
                            className={`w-16 h-16 ${
                              isActive
                                ? "text-slate-950"
                                : "text-orange-700 dark:text-orange-400"
                            }`}
                          />
                        </div>

                        {/* Step Info */}
                        <div className="mt-6 text-center">
                          <div className="text-sm font-semibold text-orange-700 dark:text-orange-400 mb-1">
                            {t.step} {step.step}
                          </div>
                          <h3 className="font-bold text-slate-900 dark:text-white mb-2 text-sm">
                            {step.title}
                          </h3>
                          <div className="flex items-center justify-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                            <Clock className="w-3 h-3" />
                            {step.duration}
                          </div>
                        </div>
                      </div>
                    </Reveal>
                  )
                })}
              </div>
            </div>

            {/* Active Step Details */}
            {activeStep !== null && (
              <div className="mt-12 overflow-hidden">
                <StepDetails step={data[activeStep]} labels={t} />
              </div>
            )}
          </div>

          {/* Mobile/Tablet Timeline (Vertical) */}
          <div className="lg:hidden space-y-6">
            {data.map((step, index) => (
              <MobileStepCard
                key={index}
                step={step}
                index={index}
                isActive={activeStep === index}
                onToggle={() =>
                  setActiveStep(activeStep === index ? null : index)
                }
                labels={t}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// Step Details Component
function StepDetails({ step, labels }: { step: ProcessStep; labels: any }) {
  return (
    <div className="bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-950/50 dark:to-yellow-950/50 rounded-3xl border-2 border-orange-200 dark:border-orange-800 p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column */}
        <div>
          <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
            {labels.details}
          </h4>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            {step.description}
          </p>
        </div>

        {/* Right Column */}
        <div>
          <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
            {labels.deliverables}
          </h4>
          <div className="space-y-3">
            {step.deliverables.map((deliverable, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-slate-900 border border-orange-200 dark:border-orange-800"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-slate-950" />
                </div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {deliverable}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Mobile Step Card Component
function MobileStepCard({
  step,
  index,
  isActive,
  onToggle,
  labels,
}: {
  step: ProcessStep
  index: number
  isActive: boolean
  onToggle: () => void
  labels: any
}) {
  const Icon = iconMap[step.icon] || CheckCircle2

  return (
    <Reveal delay={index * 0.1} className="relative">
      {/* Connector Line */}
      {index < 5 && (
        <div className="absolute left-10 top-20 bottom-0 w-1 bg-gradient-to-b from-orange-200 to-yellow-200 dark:from-orange-900 dark:to-yellow-900" />
      )}

      <div
        className={`relative bg-white dark:bg-slate-900 rounded-2xl border-2 ${
          isActive
            ? "border-orange-500 shadow-2xl shadow-orange-500/20"
            : "border-slate-200 dark:border-slate-800"
        } overflow-hidden transition-all duration-300`}
      >
        {/* Header */}
        <div className="p-6 cursor-pointer" onClick={onToggle}>
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div
              className={`relative z-10 flex-shrink-0 w-20 h-20 rounded-2xl flex items-center justify-center ${
                isActive
                  ? "bg-gradient-to-br from-orange-500 to-yellow-500"
                  : "bg-orange-100 dark:bg-orange-900/30"
              } transition-all duration-300`}
            >
              <Icon
                className={`w-10 h-10 ${
                  isActive
                    ? "text-slate-950"
                    : "text-orange-700 dark:text-orange-400"
                }`}
              />
            </div>

            {/* Content */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold text-orange-700 dark:text-orange-400 px-2 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30">
                  {labels.step} {step.step}
                </span>
                <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                  <Clock className="w-3 h-3" />
                  {step.duration}
                </div>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {step.description.substring(0, 100)}...
              </p>
            </div>

            {/* Expand Icon */}
            <div
              className={`flex-shrink-0 ${
                isActive ? "rotate-180" : ""
              } transition-transform duration-300`}
            >
              <ArrowRight className="w-5 h-5 text-slate-400 transform rotate-90" />
            </div>
          </div>
        </div>

        {/* Expanded Details */}
        {isActive && (
          <div className="overflow-hidden border-t border-slate-100 dark:border-slate-800">
            <div className="p-6 bg-slate-50 dark:bg-slate-900/50 space-y-6">
              {/* Full Description */}
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {step.description}
              </p>

              {/* Deliverables */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
                  {labels.deliverables}
                </h4>
                <div className="space-y-2">
                  {step.deliverables.map((deliverable, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                    >
                      <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                      <span className="text-xs text-slate-700 dark:text-slate-300">
                        {deliverable}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Reveal>
  )
}

export default ProcessTimeline
