import { Facebook, Link, Linkedin, Share2, Twitter } from "lucide-react"
import React, { useState } from "react"

const ShareButtons = ({ post, lang }: { post: any; lang: string }) => {
  const [showShare, setShowShare] = useState(false)
  const postUrl = `${window.location.origin}/${lang}/blog/${post.slug.current}`
  const shareLinks = [
    {
      name: "Facebook",
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`,
      color: "text-blue-600",
    },
    {
      name: "Twitter",
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(post.title)}`,
      color: "text-sky-500",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`,
      color: "text-blue-700",
    },
  ]

  const copyToClipboard = () => {
    navigator.clipboard.writeText(postUrl)
  }
  return (
    <div className="relative">
      <button
        onClick={() => setShowShare(!showShare)}
        className="flex items-center space-x-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
      >
        <Share2 className="h-4 w-4" />
        <span>Share</span>
      </button>

      {showShare && (
        <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-xl border border-slate-200 p-4 z-10 min-w-48">
          <div className="space-y-2">
            {shareLinks.map((link, index) => {
              const Icon = link.icon
              return (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-50 transition-colors ${link.color}`}
                >
                  <Icon className="h-4 w-4" />
                  <span>Share on {link.name}</span>
                </a>
              )
            })}
            <button
              onClick={copyToClipboard}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-50 transition-colors text-slate-600 w-full"
            >
              <Link className="h-4 w-4" />
              <span>Copy Link</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ShareButtons
