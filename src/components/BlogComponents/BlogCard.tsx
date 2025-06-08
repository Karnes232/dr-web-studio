import { ArrowRight, Calendar, Clock } from "lucide-react"
import React from "react"

const BlogCard = ({ post }: { post: any }) => {
  return (
    <article className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-white/90 backdrop-blur-sm text-slate-700 text-xs font-medium px-3 py-1 rounded-full">
            {post.category}
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-slate-800 mb-3 line-clamp-2">
          {post.title}
        </h3>

        <p className="text-slate-600 mb-4 leading-relaxed line-clamp-3">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-sm text-slate-500">
            <Calendar className="h-4 w-4 mr-2" />
            {new Date(post.publishDate).toLocaleDateString()}
          </div>
          <div className="flex items-center text-sm text-slate-500">
            <Clock className="h-4 w-4 mr-2" />
            {post.readTime}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {post.tags.slice(0, 2).map((tag: string, index: number) => (
              <span
                key={index}
                className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded"
              >
                {tag}
              </span>
            ))}
          </div>

          <a
            href={`/blog/${post.slug}`}
            className="text-orange-500 hover:text-orange-600 font-medium flex items-center transition-colors"
          >
            Read More
            <ArrowRight className="ml-1 h-4 w-4" />
          </a>
        </div>
      </div>
    </article>
  )
}

export default BlogCard
