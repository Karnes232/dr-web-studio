"use client"
import FeaturedProject from "@/components/PortfolioComponents/FeaturedProject"
import PortfolioCard from "@/components/PortfolioComponents/PortfolioCard"
import PortfolioFilter from "@/components/PortfolioComponents/PortfolioFilter"
import PortfolioHeader from "@/components/PortfolioComponents/PortfolioHeader"
import ProjectDetailModal from "@/components/PortfolioComponents/ProjectDetailModal"
import { PortfolioHeaderData } from "@/sanity/queries/portfolio/portfolioHeader"
import React, { useState } from "react"

const portfolioData = [
  {
    id: 1,
    title: "Caribbean Resort Hotel",
    client: "Paradise Beach Resort",
    category: "Business Website",
    image:
      "https://images.unsplash.com/photo-1566241477600-ac026ad43874?q=80&w=2046&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    technologies: ["Next.js", "Tailwind CSS", "Sanity CMS", "Vercel"],
    problem:
      "Outdated website with poor mobile experience and no booking system integration",
    solution:
      "Modern responsive design with integrated booking system and multilingual support",
    outcomes: [
      { metric: "Page Load Speed", value: "2.1s", improvement: "+75%" },
      { metric: "Mobile Traffic", value: "68%", improvement: "+45%" },
      { metric: "Booking Conversions", value: "12.5%", improvement: "+180%" },
    ],
    liveUrl: "https://example.com",
    githubUrl: "#",
    featured: true,
    year: "2024",
  },
  {
    id: 2,
    title: "Local Restaurant Chain",
    client: "Sabor Dominicano",
    category: "E-commerce",
    image:
      "https://images.unsplash.com/photo-1566241477600-ac026ad43874?q=80&w=2046&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    technologies: ["React", "Shopify", "Stripe", "Tailwind CSS"],
    problem:
      "No online ordering system and limited digital presence during pandemic",
    solution:
      "Full e-commerce platform with online ordering, delivery tracking, and loyalty program",
    outcomes: [
      {
        metric: "Online Orders",
        value: "300+",
        improvement: "New Revenue Stream",
      },
      { metric: "Customer Retention", value: "85%", improvement: "+40%" },
      { metric: "Average Order Value", value: "$28", improvement: "+25%" },
    ],
    liveUrl: "https://example.com",
    githubUrl: "#",
    featured: false,
    year: "2024",
  },
  {
    id: 3,
    title: "Digital Marketing Agency",
    client: "Growth Partners DR",
    category: "Landing Page",
    image: "/api/placeholder/600/400",
    technologies: ["Gatsby", "Contentful", "Tailwind CSS", "Netlify"],
    problem:
      "Low conversion rates on marketing campaigns and poor lead quality",
    solution:
      "High-converting landing pages with A/B testing and lead scoring integration",
    outcomes: [
      { metric: "Conversion Rate", value: "8.5%", improvement: "+220%" },
      { metric: "Lead Quality Score", value: "92%", improvement: "+60%" },
      { metric: "Cost Per Lead", value: "$12", improvement: "-45%" },
    ],
    liveUrl: "https://example.com",
    githubUrl: "#",
    featured: false,
    year: "2023",
  },
  {
    id: 4,
    title: "Medical Practice Portal",
    client: "Clinica Moderna",
    category: "CMS Solution",
    image: "/api/placeholder/600/400",
    technologies: ["Next.js", "Sanity", "Tailwind CSS", "Vercel"],
    problem:
      "Manual appointment scheduling and no patient portal for medical records",
    solution:
      "Patient portal with appointment booking, medical records access, and telemedicine integration",
    outcomes: [
      { metric: "Appointment Efficiency", value: "90%", improvement: "+65%" },
      { metric: "Patient Satisfaction", value: "4.8/5", improvement: "+30%" },
      { metric: "Administrative Time", value: "5hrs/day", improvement: "-50%" },
    ],
    liveUrl: "https://example.com",
    githubUrl: "#",
    featured: false,
    year: "2023",
  },
]

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
 // const regularProjects = filteredProjects.filter((project: any) => !project.featured)

  const handleViewDetails = (project: any) => {
    setSelectedProject(project)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedProject(null)
  }
  console.log(projects)
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
