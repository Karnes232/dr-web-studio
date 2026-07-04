"use client"
import {
  Facebook,
  Instagram,
  Link,
  Linkedin,
  Share2,
  Twitter,
} from "lucide-react"
import { FaWhatsapp } from "react-icons/fa"
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react"
import { getPathname } from "@/i18n/navigation"
import { slugForLocale, type Locale, type LocalizedSlugDoc } from "@/lib/slugs"
import { SITE_URL } from "@/lib/site"
import { useLocale } from "@/i18n/useLocale"

type SharePost = LocalizedSlugDoc & {
  title: Record<Locale, string>
  imageUrl?: string
}

type ShareEntry = {
  name: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  href?: string
  onClick?: () => void
}

const isMobileDevice = () =>
  /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
  // iPadOS 13+ masquerades as desktop Safari ("Macintosh") but is touch-capable
  (navigator.userAgent.includes("Macintosh") && navigator.maxTouchPoints > 1)

const isAbortError = (err: unknown) =>
  err instanceof DOMException && err.name === "AbortError"

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

  const shareImageUrl = useMemo(() => {
    if (!post.imageUrl) return null
    try {
      const u = new URL(post.imageUrl)
      // Instagram/iOS handle jpeg reliably; auto=format would negotiate webp/avif
      u.searchParams.delete("auto")
      u.searchParams.set("fm", "jpg")
      return u.toString()
    } catch {
      return null
    }
  }, [post.imageUrl])

  const imageFileRef = useRef<File | null>(null)
  const imageFetchRef = useRef<Promise<File | null> | null>(null)

  const fetchShareImage = useCallback(() => {
    if (!shareImageUrl) return Promise.resolve(null)
    if (imageFileRef.current) return Promise.resolve(imageFileRef.current)
    // Proxy through the Next image optimizer: the Sanity CDN 403s cross-origin
    // fetches from origins outside the project's CORS allowlist, while
    // /_next/image is same-origin everywhere (dev, previews, prod).
    imageFetchRef.current ??= fetch(
      `/_next/image?url=${encodeURIComponent(shareImageUrl)}&w=1200&q=85`,
    )
      .then(res =>
        res.ok ? res.blob() : Promise.reject(new Error(`${res.status}`)),
      )
      .then(blob => {
        const file = new File([blob], `${slugForLocale(post, lang)}.jpg`, {
          type: blob.type || "image/jpeg",
        })
        imageFileRef.current = file
        return file
      })
      .catch(() => {
        imageFetchRef.current = null
        return null
      })
    return imageFetchRef.current
  }, [shareImageUrl, post, lang])

  useEffect(() => {
    // Warm the image File while the user reads the menu, so the Instagram
    // click can call navigator.share within its user-gesture window.
    if (showShare) void fetchShareImage()
  }, [showShare, fetchShareImage])

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
    // Instagram only offers Story/Feed posting when handed an image file —
    // URL shares are limited to DMs by the platform. Share the featured
    // image and put the post URL on the clipboard for the link sticker.
    if (typeof navigator.share === "function") {
      void navigator.clipboard?.writeText(postUrl).catch(() => {})
      const file = imageFileRef.current ?? (await fetchShareImage())
      if (file && navigator.canShare?.({ files: [file] })) {
        try {
          // Files-only: adding text/title makes some iOS targets drop the image
          await navigator.share({ files: [file] })
          setShowShare(false)
          return
        } catch (err) {
          if (isAbortError(err)) return
        }
      }
      try {
        await navigator.share({ title, url: postUrl })
        setShowShare(false)
        return
      } catch (err) {
        if (isAbortError(err)) return
      }
    }
    // window.open must run synchronously in the click gesture or popup
    // blockers eat it; the clipboard write is fired first but not awaited
    // because it can reject once the new tab steals focus.
    void copyUrl()
    window.open("https://www.instagram.com/", "_blank", "noopener,noreferrer")
  }

  const shareToFacebook = async () => {
    // The iOS Facebook app intercepts sharer.php universal links and drops
    // the payload; the native sheet's Facebook target works, so prefer it
    // on mobile only. Desktop keeps the direct popup.
    if (typeof navigator.share === "function" && isMobileDevice()) {
      try {
        await navigator.share({ title, url: postUrl })
        setShowShare(false)
        return
      } catch (err) {
        if (isAbortError(err)) return
      }
    }
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`,
      "_blank",
      "noopener,noreferrer",
    )
  }

  const shareEntries: ShareEntry[] = [
    {
      name: "Facebook",
      icon: Facebook,
      color: "text-blue-600",
      onClick: shareToFacebook,
    },
    {
      name: "WhatsApp",
      icon: FaWhatsapp,
      color: "text-green-500",
      href: `https://wa.me/?text=${encodeURIComponent(`${title} ${postUrl}`)}`,
    },
    {
      name: "X",
      icon: Twitter,
      color: "text-sky-500",
      href: `https://x.com/intent/post?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(title)}`,
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      color: "text-blue-700",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`,
    },
    {
      name: "Instagram",
      icon: Instagram,
      color: "text-pink-600",
      onClick: shareToInstagram,
    },
  ]

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
        <div className="absolute left-5 top-full mt-2 bg-white dark:bg-slate-900 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 p-4 z-10 min-w-48">
          <div className="space-y-2">
            {shareEntries.map(entry => {
              const Icon = entry.icon
              const cls = `flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${entry.color}`
              const content = (
                <>
                  <Icon className="h-4 w-4" />
                  <span>
                    {t("blog.share.shareOn")} {entry.name}
                  </span>
                </>
              )
              return entry.href ? (
                <a
                  key={entry.name}
                  href={entry.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cls}
                >
                  {content}
                </a>
              ) : (
                <button
                  key={entry.name}
                  onClick={entry.onClick}
                  className={`${cls} w-full`}
                >
                  {content}
                </button>
              )
            })}
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
