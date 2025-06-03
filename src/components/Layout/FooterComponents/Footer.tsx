import React from 'react'
import CTASection from './CTASection'
import CompanyInfo from './CompanyInfo'
import QuickLinks from './QuickLinks'
import ServicesLinks from './ServicesLinks'
import ResourcesLinks from './ResourcesLinks'
import SocialMedia from './SocialMedia'
import BottomBar from './BottomBar'

const Footer = () => {
  return (
    <footer className="bg-slate-800 text-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* CTA Section */}
      <CTASection />
      
      {/* Main Footer Content */}
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-8 mb-8">
        <CompanyInfo />
        <QuickLinks />
        <ServicesLinks />
        <ResourcesLinks />
      </div>
      
      {/* Social Media */}
      <SocialMedia />
      
      {/* Bottom Bar */}
      <BottomBar />
    </div>
  </footer>
  )
}

export default Footer