"use client"
import {
  Facebook,
  Instagram,
  Link,
  Linkedin,
  Share2,
  Twitter,
} from "lucide-react"
import React, { useState, useEffect, useRef } from "react"
import { getPathname } from "@/i18n/navigation"
import { slugForLocale, type Locale, type LocalizedSlugDoc } from "@/lib/slugs"
import { SITE_URL } from "@/lib/site"
import { useLocale } from "@/i18n/useLocale"

type SharePost = LocalizedSlugDoc & { title: Record<Locale, string> }

const ShareButtons = ({ post, lang }: { post: SharePost; lang: Locale }) => {
  const { t } = useLocale()
  const [showShare, setShowShare] = useState(false)
  const [copied, setCopied] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const title = post.title[lang]
  const path = getPathname({
    locale: lang,
    href: {
      pathname: "/blog/[slug]",
      params: { slug: slugForLocale(post, lang) },
    },
  })
  const [postUrl, setPostUrl] = useState(`${SITE_URL}${path}`)

  useEffect(() => {
    setPostUrl(`${window.location.origin}${path}`)
  }, [path])

  useEffect(() => {
    if (!showShare) return
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setShowShare(false)
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowShare(false)
    }
    document.addEventListener("pointerdown", onPointerDown)
    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("pointerdown", onPointerDown)
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [showShare])

  const shareLinks = [
    {
      name: "Facebook",
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`,
      color: "text-blue-600",
    },
    {
      name: "X",
      icon: Twitter,
      url: `https://x.com/intent/post?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(title)}`,
      color: "text-sky-500",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`,
      color: "text-blue-700",
    },
  ]

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(postUrl)
    } catch {
      const ta = document.createElement("textarea")
      ta.value = postUrl
      document.body.appendChild(ta)
      ta.select()
      document.execCommand("copy")
      ta.remove()
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const shareToInstagram = async () => {
    // Instagram has no web share-intent URL, so use the native share sheet
    // where available and fall back to copy-link + opening instagram.com.
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title, url: postUrl })
        setShowShare(false)
        return
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return
      }
    }
    // window.open must run synchronously in the click gesture or popup
    // blockers eat it; the clipboard write is fired first but not awaited
    // because it can reject once the new tab steals focus.
    void copyUrl()
    window.open("https://www.instagram.com/", "_blank", "noopener,noreferrer")
  }

  return (
    <div className="relative" ref={rootRef}>
      <button
        onClick={() => setShowShare(!showShare)}
        aria-expanded={showShare}
        aria-haspopup="true"
        className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
      >
        <Share2 className="h-4 w-4" />
        <span>{t("blog.share.share")}</span>
      </button>

      {showShare && (
        <div className="absolute right-0 top-full mt-2 bg-white dark:bg-slate-900 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 p-4 z-10 min-w-48">
          <div className="space-y-2">
            {shareLinks.map(link => {
              const Icon = link.icon
              return (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${link.color}`}
                >
                  <Icon className="h-4 w-4" />
                  <span>
                    {t("blog.share.shareOn")} {link.name}
                  </span>
                </a>
              )
            })}
            <button
              onClick={shareToInstagram}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-pink-600 w-full"
            >
              <Instagram className="h-4 w-4" />
              <span>{t("blog.share.shareOn")} Instagram</span>
            </button>
            <button
              onClick={copyUrl}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300 w-full"
            >
              <Link className="h-4 w-4" />
              <span>
                {copied ? t("blog.share.copied") : t("blog.share.copyLink")}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ShareButtons
