import Link from "next/link"
import { PortableText, type PortableTextComponents } from "@portabletext/react"

type LinkMode = "link" | "plain"

const LINK_CLASS =
  "text-teal-700 dark:text-teal-400 underline underline-offset-2 hover:text-teal-800 dark:hover:text-teal-300 transition-colors"

// Editors type the full href (including locale prefix, e.g. "/es/pricing"), so
// internal links use plain next/link with the exact path — no locale munging.
function makeComponents(linkMode: LinkMode): PortableTextComponents {
  return {
    block: {
      normal: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
    },
    list: {
      bullet: ({ children }) => (
        <ul className="list-disc pl-5 mb-3 space-y-1">{children}</ul>
      ),
      number: ({ children }) => (
        <ol className="list-decimal pl-5 mb-3 space-y-1">{children}</ol>
      ),
    },
    listItem: {
      bullet: ({ children }) => <li>{children}</li>,
      number: ({ children }) => <li>{children}</li>,
    },
    marks: {
      strong: ({ children }) => (
        <strong className="font-semibold text-slate-700 dark:text-slate-200">
          {children}
        </strong>
      ),
      em: ({ children }) => <em>{children}</em>,
      link: ({ children, value }) => {
        const href: string = value?.href ?? ""

        // The services grid renders each card inside a <Link>, so a nested <a>
        // would be invalid HTML. In that context we degrade links to a styled
        // (non-anchor) span.
        if (linkMode === "plain" || !href) {
          return <span className={LINK_CLASS}>{children}</span>
        }
        if (href.startsWith("/")) {
          return (
            <Link href={href} className={LINK_CLASS}>
              {children}
            </Link>
          )
        }
        if (href.startsWith("#")) {
          return (
            <a href={href} className={LINK_CLASS}>
              {children}
            </a>
          )
        }
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={LINK_CLASS}
          >
            {children}
          </a>
        )
      },
    },
  }
}

const linkComponents = makeComponents("link")
const plainComponents = makeComponents("plain")

interface RichTextProps {
  /** Portable Text block array (already localised to the current language). */
  value: unknown
  /** Applied to the wrapper — reuse the old <p> classes to keep styling. */
  className?: string
  /** "plain" degrades links to styled spans (use inside a card-level <Link>). */
  linkMode?: LinkMode
}

export function RichText({
  value,
  className,
  linkMode = "link",
}: RichTextProps) {
  // Backward-compat: some consumers (e.g. the services page FAQ) still pass a
  // plain string — render it as a single paragraph.
  if (typeof value === "string") {
    return value.trim() ? (
      <div className={className}>
        <p>{value}</p>
      </div>
    ) : null
  }
  if (!Array.isArray(value) || value.length === 0) return null
  return (
    <div className={className}>
      <PortableText
        value={value as never}
        components={linkMode === "plain" ? plainComponents : linkComponents}
      />
    </div>
  )
}
