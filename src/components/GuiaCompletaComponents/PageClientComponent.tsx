import { Language, PillarPageContent } from "./types"
import PillarHero from "./PillarHero"
import { ComparisonTable } from "./ComparisonTable"
import TechStackDiagram from "./TechStackDiagram"
import { ROICalculator } from "./ROICalculator"
import { CaseStudyCards } from "./CaseStudyCards"
import { ProcessTimeline } from "./ProcessTimeline"
import { FAQAccordion } from "./FAQAccordion"

// Plain server wrapper: framer-motion (and its MotionConfig) is gone; entrance
// animations are now CSS-based and honor `prefers-reduced-motion` directly.
const PageClientComponent = ({
  content,
  lang,
}: {
  content: PillarPageContent
  lang: Language
}) => {
  return (
    <>
      <PillarHero data={content.heroData} language={lang} />
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
