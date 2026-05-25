import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import React from "react"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  /** When true, render page numbers as <Link> for crawlability (fixes orphan pages) */
  useLinks?: boolean
  /** Base path for links, e.g. /en/blog */
  basePath?: string
}

const getPageList = (
  current: number,
  total: number,
  siblingCount = 2,
): (number | "...")[] => {
  const maxSlots = 3 + siblingCount * 2
  if (total <= maxSlots)
    return Array.from({ length: total }, (_, i) => i + 1)
  const pages: (number | "...")[] = [1]
  const left = Math.max(2, current - siblingCount)
  const right = Math.min(total - 1, current + siblingCount)
  if (left > 2) pages.push("...")
  for (let i = left; i <= right; i++) pages.push(i)
  if (right < total - 1) pages.push("...")
  pages.push(total)
  return pages
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  useLinks = false,
  basePath = "",
}: PaginationProps) => {
  const pageHref = (page: number) =>
    page === 1 ? basePath : `${basePath}?page=${page}`

  const renderPage = (page: number | "...", idx: number) => {
    if (page === "...") {
      return (
        <span
          key={`ellipsis-${idx}`}
          className="px-2 py-1.5 sm:py-2 text-slate-400 select-none"
        >
          …
        </span>
      )
    }
    return useLinks ? (
      <Link
        key={page}
        href={pageHref(page)}
        className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg ${
          currentPage === page
            ? "bg-orange-500 text-white"
            : "border border-slate-300 hover:bg-slate-50 hover:no-underline"
        }`}
      >
        {page}
      </Link>
    ) : (
      <button
        key={page}
        onClick={() => onPageChange(page)}
        className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg ${
          currentPage === page
            ? "bg-orange-500 text-white"
            : "border border-slate-300 hover:bg-slate-50"
        }`}
      >
        {page}
      </button>
    )
  }

  return (
    <div className="flex items-center justify-center space-x-1 sm:space-x-2 mt-12">
      {useLinks && currentPage > 1 ? (
        <Link
          href={pageHref(currentPage - 1)}
          className="p-2 rounded-lg border border-slate-300 hover:bg-slate-50"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Link>
      ) : (
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg border border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      )}

      <div className="flex lg:hidden items-center space-x-1 sm:space-x-2">
        {getPageList(currentPage, totalPages, 1).map(renderPage)}
      </div>
      <div className="hidden lg:flex items-center space-x-2">
        {getPageList(currentPage, totalPages, 2).map(renderPage)}
      </div>

      {useLinks && currentPage < totalPages ? (
        <Link
          href={pageHref(currentPage + 1)}
          className="p-2 rounded-lg border border-slate-300 hover:bg-slate-50"
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Link>
      ) : (
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg border border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}

export default Pagination
