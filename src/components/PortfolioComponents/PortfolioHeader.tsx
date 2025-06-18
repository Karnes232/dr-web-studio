import { useLocale } from "@/i18n/useLocale"
import { PortfolioHeaderData } from "@/sanity/queries/portfolio/portfolioHeader"
import React from "react"

const PortfolioHeader = ({
  portfolioHeader,
}: {
  portfolioHeader: PortfolioHeaderData
}) => {
  const { currentLocale } = useLocale()
  return (
    <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-slate-800 mb-4">
          {portfolioHeader.title[currentLocale as keyof typeof portfolioHeader.title]}
      </h2>
      <p className="text-xl text-slate-600 max-w-3xl mx-auto">
        {portfolioHeader.description[currentLocale as keyof typeof portfolioHeader.description]}
      </p>
    </div>
  )
}

export default PortfolioHeader
