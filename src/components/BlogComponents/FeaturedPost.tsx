import { ArrowRight, Calendar, Clock, Eye } from "lucide-react"
import React from "react"

const FeaturedPost = ({ post }: { post: any }) => {
  return (
    <div className="relative bg-white rounded-xl shadow-lg overflow-hidden mb-12">
      <div className="md:flex">
        <div className="md:w-1/2">
          <img
            src={post.image}
            alt={post.title}
            className="h-64 md:h-full w-full object-cover"
          />
        </div>
        <div className="md:w-1/2 p-8">
          <div className="flex items-center mb-4">
            <span className="bg-orange-100 text-orange-800 text-xs font-medium px-3 py-1 rounded-full">
              Featured
            </span>
            <span className="bg-slate-100 text-slate-700 text-xs font-medium px-3 py-1 rounded-full ml-2">
              {post.category}
            </span>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4">
            {post.title}
          </h2>

          <p className="text-slate-600 mb-6 leading-relaxed">{post.excerpt}</p>

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center text-sm text-slate-500">
              <Calendar className="h-4 w-4 mr-2" />
              {new Date(post.publishDate).toLocaleDateString()}
              <Clock className="h-4 w-4 mr-2 ml-4" />
              {post.readTime}
              <Eye className="h-4 w-4 mr-2 ml-4" />
              {post.views} views
            </div>
          </div>

          <a
            href={`/blog/${post.slug}`}
            className="inline-flex items-center bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-6 py-3 rounded-lg font-medium hover:from-orange-600 hover:to-yellow-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
          >
            Read Full Article
            <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  )
}

export default FeaturedPost
