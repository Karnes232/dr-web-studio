import BlogPostContent from "@/components/BlogComponents/BlogPost/BlogPostContent"
import BlogPostHeader from "@/components/BlogComponents/BlogPost/BlogPostHeader"
import { getBlogPostBySlug } from "@/sanity/queries/blog"
import React from "react"
interface PageProps {
  params: Promise<{
    lang: "en" | "es"
    slug: string
  }>
}

export default async function BlogPost({ params }: PageProps) {
  const { lang, slug } = await params
  const post = await getBlogPostBySlug(slug)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-orange-50">
      <BlogPostHeader post={post} lang={lang} />
      <BlogPostContent body={post?.body} lang={lang} />
      {/* <AuthorBio author={post.author} /> */}
      {/* <BlogCTA />  */}
      {/* <RelatedPosts currentPostId={post.id} /> */}
      {/* <CommentsSection postId={post.id} comments={comments} /> */}
    </div>
  )
}
