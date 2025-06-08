import React from "react"

const BlogHeader = () => {
  return (
    <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Web Development Blog
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Expert insights, tips, and strategies for building better websites.
            Stay updated with the latest in web development and digital
            marketing.
          </p>
        </div>
      </div>
    </div>
  )
}

export default BlogHeader
