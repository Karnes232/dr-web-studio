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

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  useLinks = false,
  basePath = "",
}: PaginationProps) => {
  const pageHref = (page: number) =>
    page === 1 ? basePath : `${basePath}?page=${page}`

  return (
    <div className="flex items-center justify-center space-x-2 mt-12">
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

      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page =>
        useLinks ? (
          <Link
            key={page}
            href={pageHref(page)}
            className={`px-4 py-2 rounded-lg ${
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
            className={`px-4 py-2 rounded-lg ${
              currentPage === page
                ? "bg-orange-500 text-white"
                : "border border-slate-300 hover:bg-slate-50"
            }`}
          >
            {page}
          </button>
        ),
      )}

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
