import { type SchemaTypeDefinition } from "sanity"

// Layout Schemas
import generalLayout from "./layout/generalLayout"
import stats from "./layout/stats"

// Home Page Schemas
import heroSection from "./home/HomePageHero"
import heroVisualElement from "./home/HeroVisualElements"
import serviceSection from "./home/HomePageService"
import homeFeaturedWork from "./home/HomeFeaturedWork"
import trustSignals from "./home/TrustSignals"
import homeIntro from "./home/HomeIntro"
import previousClients from "./home/PreviousClients"
import Testimonial from "./home/Testimonial"

// Services Schemas
import service from "./services/Service"
import servicesHeader from "./services/servicesHeader"
import featuresStrip from "./services/featuresStrip"
import customSolutionCTA from "./services/customSolutionCTA"
import category from "./services/category"

// About Me Schemas
import sectionHeader from "./about-me/sectionHeader"
import personalStory from "./about-me/personalStory"
import locationAvailability from "./about-me/locationAvailability"
import technologies from "./about-me/technologies"
import developmentApproach from "./about-me/developmentApproach"
import whyChooseUs from "./about-me/whyChooseUs"

// Portfolio Schemas
import portfolioHeader from "./portfolio/portfolioHeader"
import project from "./portfolio/project"

// Pricing Schemas
import pricingHeader from "./pricing/pricingHeader"
import pricingData from "./pricing/pricingData"
import faqsHeader from "./pricing/faqsHeader"
import faq from "./pricing/faq"

// Blog Schemas
import author from "./blog/author"
import blogPost from "./blog/blogPost"
import blogCategory from "./blog/blogCategory"
import blogHeader from "./blog/blogHeader"

// Contact Schemas
import contactHero from "./contact/contactHero"
import locationInfo from "./contact/locationInfo"
import contactFaq from "./contact/contactFaq"

// Project Planner Schemas
import plannerConfig from "./project-planner/plannerConfig"
import plannerService from "./project-planner/plannerService"
import plannerAddon from "./project-planner/plannerAddon"
import plannerDesignStyle from "./project-planner/plannerDesignStyle"
import plannerSizeTier from "./project-planner/plannerSizeTier"

// FAQ Schemas
import faqCategory from "./faqs/faqCategory"
import faqsPageHeader from "./faqs/faqsPageHeader"

// Payment Schemas
import customPayment from "./payment/customPayment"
import paymentSuccess from "./payment/paymentSuccess"

// Pillar Page Schema
import pillarPage from "./pillar-page/pillarPage"

// Landing Pages Schema
import landingPage from "./landing-pages/landingPage"

// SEO Schema
import seo from "./seo/seo"
import legal from "./legal/legal"
import serviceItem from "./services/serviceItem"

// System Schemas
import webhookEvent from "./system/webhookEvent"

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // Layout Schemas
    generalLayout,
    stats,

    // Home Page Schemas
    heroSection,
    heroVisualElement,
    serviceSection,
    homeFeaturedWork,
    trustSignals,
    homeIntro,
    previousClients,
    Testimonial,

    // Services Schemas
    service,
    servicesHeader,
    featuresStrip,
    customSolutionCTA,
    serviceItem,
    category,
    // About Me Schemas
    sectionHeader,
    personalStory,
    locationAvailability,
    technologies,
    developmentApproach,
    whyChooseUs,

    // Portfolio Schemas
    portfolioHeader,
    project,

    // Pricing Schemas
    pricingHeader,
    pricingData,
    faqsHeader,
    faq,

    // Blog Schemas
    author,
    blogPost,
    blogCategory,
    blogHeader,

    // Contact Schemas
    contactHero,
    locationInfo,
    contactFaq,

    // Project Planner Schemas
    plannerConfig,
    plannerService,
    plannerAddon,
    plannerDesignStyle,
    plannerSizeTier,

    // FAQ Schemas
    faqCategory,
    faqsPageHeader,

    // Payment Schemas
    customPayment,
    paymentSuccess,

    // Pillar Page Schema
    pillarPage,

    // Landing Pages Schema
    landingPage,

    // SEO Schema
    seo,

    // Legal Schema
    legal,

    // System Schemas
    webhookEvent,
  ],
}
