"use client"

import React from "react"
import { Language, PillarPageContent } from "./types"
import PillarHero from "./PillarHero"
import { TableOfContents } from "./TableOfContents"
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
    <>
      <PillarHero
        data={content.heroData}
        onCtaClick={() => console.log("CTA clicked!")}
        language={lang}
      />
      {/* <TableOfContents items={content.tableOfContents} language={lang} /> */}
      <ComparisonTable data={content.comparisonData} language={lang} />
      <TechStackDiagram data={content.techStack} language={lang} />
      <ROICalculator language={lang} />
      <CaseStudyCards data={content.caseStudies} language={lang} />
      <ProcessTimeline data={content.processSteps} language={lang} />
      <FAQAccordion data={content.faqs} language={lang} />
    </>
  )
}

export default PageClientComponent
