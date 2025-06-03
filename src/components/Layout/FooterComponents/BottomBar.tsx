import React from 'react'

const BottomBar = () => {
  return (
    <div className="border-t border-slate-700 pt-6">
    <div className="flex flex-col md:flex-row justify-between items-center">
      <div className="text-gray-400 text-sm mb-4 md:mb-0">
        © {new Date().getFullYear()} DR Web Studio. All rights reserved.
      </div>
      <div className="flex space-x-6 text-sm">
        <a href="#privacy" className="text-gray-400 hover:text-orange-400 transition-colors">
          Privacy Policy
        </a>
        <a href="#terms" className="text-gray-400 hover:text-orange-400 transition-colors">
          Terms of Service
        </a>
        <a href="#sitemap" className="text-gray-400 hover:text-orange-400 transition-colors">
          Sitemap
        </a>
      </div>
    </div>
  </div>
  )
}

export default BottomBar