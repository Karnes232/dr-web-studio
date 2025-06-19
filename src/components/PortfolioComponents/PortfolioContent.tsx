"use client"
import FeaturedProject from "@/components/PortfolioComponents/FeaturedProject"
import PortfolioCard from "@/components/PortfolioComponents/PortfolioCard"
import PortfolioFilter from "@/components/PortfolioComponents/PortfolioFilter"
import PortfolioHeader from "@/components/PortfolioComponents/PortfolioHeader"
import ProjectDetailModal from "@/components/PortfolioComponents/ProjectDetailModal"
import { PortfolioHeaderData } from "@/sanity/queries/portfolio/portfolioHeader"
import React, { useState } from "react"


interface PortfolioContentProps {
  lang: string
  portfolioHeader: PortfolioHeaderData
  projects: any
}

export default function PortfolioContent({
  lang,
  portfolioHeader,
  projects,
}: PortfolioContentProps) {
  const [activeFilter, setActiveFilter] = useState(lang === "es" ? "Todos" : "All")
  const [selectedProject, setSelectedProject] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const categories = [
    ...new Set(projects.map((project: any) => project.category[lang as keyof typeof project.category])),
  ]

  const filteredProjects =
    activeFilter === "All" || activeFilter === "Todos"
      ? projects
      : projects.filter((project: any) => project.category[lang as keyof typeof project.category] === activeFilter)

  // const featuredProject = portfolioData.find(project => project.featured)
  const featuredProject = projects[0]

  const handleViewDetails = (project: any) => {
    setSelectedProject(project)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedProject(null)
  }
  return (
    <section
      className="py-16 bg-gradient-to-br from-slate-50 to-orange-50"
      id="portfolio"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PortfolioHeader portfolioHeader={portfolioHeader} />

        {/* Featured Project */}
        {featuredProject && (
          <FeaturedProject
            project={featuredProject}
            onViewDetails={handleViewDetails}
          />
        )}

        {/* Filter */}
        <PortfolioFilter
          categories={categories as string[]}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />

        {/* Portfolio Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project: any, index: number) => (
            <PortfolioCard
              key={index}
              project={project}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>

      

        {/* Project Detail Modal */}
        <ProjectDetailModal
          project={selectedProject}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      </div>
    </section>
  )
}
