"use client"

import React from "react"
import { MotionConfig } from "framer-motion"
import { Language, PillarPageContent } from "./types"
import PillarHero from "./PillarHero"
import { ComparisonTable } from "./ComparisonTable"
import TechStackDiagram from "./TechStackDiagram"
import { ROICalculator } from "./ROICalculator"
import { CaseStudyCards } from "./CaseStudyCards"
import { ProcessTimeline } from "./ProcessTimeline"
import { FAQAccordion } from "./FAQAccordion"

const PageClientComponent = ({
  content,
  lang,
}: {
  content: PillarPageContent
  lang: Language
}) => {
  return (
    // Honor the OS "reduce motion" setting across every Framer Motion animation
    // on the page (entrance reveals, hover/scale, infinite loops).
    <MotionConfig reducedMotion="user">
      <PillarHero data={content.heroData} language={lang} />
      <ComparisonTable data={content.comparisonData} language={lang} />
      <TechStackDiagram data={content.techStack} language={lang} />
      <ROICalculator language={lang} />
      <CaseStudyCards data={content.caseStudies} language={lang} />
      <ProcessTimeline data={content.processSteps} language={lang} />
      <FAQAccordion data={content.faqs} language={lang} />
    </MotionConfig>
  )
}

export default PageClientComponent
