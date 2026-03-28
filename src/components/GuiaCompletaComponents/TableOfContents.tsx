"use client"

import { useEffect, useState, useRef } from "react"
import { ChevronRight, Menu, X } from "lucide-react"
import type { TableOfContentsItem } from "./types"

interface TableOfContentsProps {
  items: TableOfContentsItem[]
  language?: "en" | "es"
}

export function TableOfContents({
  items,
  language = "es",
}: TableOfContentsProps) {
  const [activeSection, setActiveSection] = useState<string>("")
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(),
  )
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const observer = useRef<IntersectionObserver | null>(null)

  const tocTitle = language === "es" ? "Contenido" : "Contents"
  const readingProgress =
    language === "es" ? "Progreso de lectura" : "Reading progress"

  // Setup scroll spy
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "-20% 0px -35% 0px",
      threshold: 0,
    }

    observer.current = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id)
        }
      })
    }, options)

    // Observe all sections
    const allIds = items.flatMap(item => [
      item.id,
      ...(item.subsections?.map(sub => sub.id) || []),
    ])

    allIds.forEach(id => {
      const element = document.getElementById(id)
      if (element && observer.current) {
        observer.current.observe(element)
      }
    })

    return () => {
      if (observer.current) {
        observer.current.disconnect()
      }
    }
  }, [items])

  // Calculate scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight
      const documentHeight =
        document.documentElement.scrollHeight - windowHeight
      const scrolled = window.scrollY
      const progress = (scrolled / documentHeight) * 100
      setScrollProgress(Math.min(progress, 100))
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Initial calculation

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Auto-expand active section
  useEffect(() => {
    items.forEach(item => {
      const isActive =
        activeSection === item.id ||
        item.subsections?.some(sub => sub.id === activeSection)

      if (isActive) {
        setExpandedSections(prev => new Set(prev).add(item.id))
      }
    })
  }, [activeSection, items])

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev)
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId)
      } else {
        newSet.add(sectionId)
      }
      return newSet
    })
  }

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const offset = 80 // Account for sticky header
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })

      setIsMobileOpen(false)
    }
  }

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-20 right-4 z-50 p-3 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30 hover:scale-110 transition-transform"
        aria-label={isMobileOpen ? "Close menu" : "Open menu"}
      >
        {isMobileOpen ? (
          <X className="w-5 h-5" />
        ) : (
          <Menu className="w-5 h-5" />
        )}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Table of Contents Sidebar */}
      <aside
        className={`
          fixed top-24 right-0 h-[calc(100vh-6rem)] w-80 z-40
          transition-transform duration-300 ease-in-out
          ${isMobileOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}
        `}
      >
        <nav className="h-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-l border-slate-200/50 dark:border-slate-700/50 shadow-2xl overflow-hidden flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              {tocTitle}
            </h3>

            {/* Reading Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                <span>{readingProgress}</span>
                <span className="font-semibold">
                  {Math.round(scrollProgress)}%
                </span>
              </div>
              <div className="relative h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${scrollProgress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto p-6 space-y-1 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600 scrollbar-track-transparent">
            {items.map((item, index) => (
              <div key={item.id} className="space-y-1">
                {/* Main Section Link */}
                <button
                  onClick={() => {
                    if (item.subsections && item.subsections.length > 0) {
                      toggleSection(item.id)
                    }
                    scrollToSection(item.id)
                  }}
                  className={`
                    group w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-left text-sm font-medium
                    transition-all duration-200
                    ${
                      activeSection === item.id
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }
                  `}
                >
                  {/* Section Number */}
                  <span
                    className={`
                      flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                      transition-colors duration-200
                      ${
                        activeSection === item.id
                          ? "bg-white/20"
                          : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 group-hover:bg-slate-300 dark:group-hover:bg-slate-600"
                      }
                    `}
                  >
                    {index + 1}
                  </span>

                  {/* Section Title */}
                  <span className="flex-1 truncate">{item.title}</span>

                  {/* Expand Icon */}
                  {item.subsections && item.subsections.length > 0 && (
                    <ChevronRight
                      className={`
                        w-4 h-4 flex-shrink-0 transition-transform duration-200
                        ${expandedSections.has(item.id) ? "rotate-90" : ""}
                      `}
                    />
                  )}
                </button>

                {/* Subsections */}
                {item.subsections && item.subsections.length > 0 && (
                  <div
                    className={`
                      overflow-hidden transition-all duration-300 ease-in-out
                      ${
                        expandedSections.has(item.id)
                          ? "max-h-[500px] opacity-100"
                          : "max-h-0 opacity-0"
                      }
                    `}
                  >
                    <div className="ml-8 mt-1 space-y-1 border-l-2 border-slate-200 dark:border-slate-700 pl-4">
                      {item.subsections.map(subsection => (
                        <button
                          key={subsection.id}
                          onClick={() => scrollToSection(subsection.id)}
                          className={`
                            w-full text-left px-3 py-2 rounded-md text-sm transition-all duration-200
                            ${
                              activeSection === subsection.id
                                ? "text-indigo-600 dark:text-indigo-400 font-medium bg-indigo-50 dark:bg-indigo-900/20"
                                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                            }
                          `}
                        >
                          {subsection.title}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Footer Progress Summary */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-400">
                {items.findIndex(
                  item =>
                    item.id === activeSection ||
                    item.subsections?.some(sub => sub.id === activeSection),
                ) + 1}{" "}
                / {items.length}
              </span>
              <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                {scrollProgress < 100
                  ? `${Math.round(scrollProgress)}% complete`
                  : "✓ Complete"}
              </span>
            </div>
          </div>
        </nav>
      </aside>
    </>
  )
}

export default TableOfContents
