import { cache } from "react"
import { client } from "@/sanity/lib/client"
import type { EstimateSettings, LocalizedString } from "@/lib/planner/types"

interface FieldLabel {
  label: LocalizedString
  placeholder: LocalizedString
}

interface StepHead {
  kicker: LocalizedString
  title: LocalizedString
  subtitle: LocalizedString
}

export interface PlannerConfig {
  intro: {
    kicker: LocalizedString
    title: LocalizedString
    subtitle: LocalizedString
    timeLabel: LocalizedString
  }
  nav: {
    backLabel: LocalizedString
    continueLabel: LocalizedString
    submitLabel: LocalizedString
    skipLabel: LocalizedString
    progressTemplate: LocalizedString
  }
  steps: {
    service: StepHead
    addons: StepHead & { emptyNote?: LocalizedString }
    design: StepHead & {
      referencesLabel: LocalizedString
      referencesPlaceholder: LocalizedString
    }
    size: StepHead & {
      sizeHeading: LocalizedString
      contentHeading: LocalizedString
      contentReadyLabel: LocalizedString
      contentReadyDesc: LocalizedString
      contentNeedLabel: LocalizedString
      contentNeedDesc: LocalizedString
    }
    timeline: StepHead & {
      estimatedTimelineLabel: LocalizedString
      rushLabel: LocalizedString
      rushDesc: LocalizedString
      rushTag: LocalizedString
    }
    contact: StepHead
  }
  contactFields: {
    name: FieldLabel
    email: FieldLabel & { note: LocalizedString }
    company: FieldLabel
    message: FieldLabel
    nameInvalid: LocalizedString
    reassurance: LocalizedString
  }
  estimatePanel: {
    kicker: LocalizedString
    startingFromLabel: LocalizedString
    ballparkNote: LocalizedString
    includedHeading: LocalizedString
    timelineLabel: LocalizedString
    contentLine: LocalizedString
    rushLine: LocalizedString
    emptyBody: LocalizedString
    footnote: LocalizedString
    mobileKicker: LocalizedString
    mobileCta: LocalizedString
  }
  confirmation: {
    headingTemplate: LocalizedString
    subtitle: LocalizedString
    estKicker: LocalizedString
    estNote: LocalizedString
    nextTitle: LocalizedString
    nextSteps: { title: LocalizedString; body: LocalizedString }[]
    footTemplate: LocalizedString
    restartLabel: LocalizedString
  }
  contactEmail?: string
  estimateSettings: EstimateSettings
}

export const plannerConfigQuery = `*[_id == "plannerConfig"][0]`

export const getPlannerConfig = cache(async (): Promise<PlannerConfig | null> => {
  return client.fetch(plannerConfigQuery)
})
