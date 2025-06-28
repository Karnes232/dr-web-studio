import { type SchemaTypeDefinition } from "sanity"

// Layout Schemas
import generalLayout from "./layout/generalLayout"
import stats from "./layout/stats"

// Home Page Schemas
import heroSection from "./home/HomePageHero"
import heroVisualElement from "./home/HeroVisualElements"
import serviceSection from "./home/HomePageService"
import trustSignals from "./home/TrustSignals"
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
import websiteType from "./project-planner/websiteType"
import projectPlannerHeader from "./project-planner/projectPlannerHeader"
import pagesCount from "./project-planner/pagesCount"
import designStyle from "./project-planner/designStyle"
import features from "./project-planner/features"
import budget from "./project-planner/budget"
import timeline from "./project-planner/timeline"
import contentStatus from "./project-planner/contentStatus"
import languages from "./project-planner/languages"
import contactForm from "./project-planner/contactForm"

// SEO Schema
import seo from "./seo/seo"
import serviceItem from "./services/serviceItem"

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // Layout Schemas
    generalLayout,
    stats,

    // Home Page Schemas
    heroSection,
    heroVisualElement,
    serviceSection,
    trustSignals,
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
    projectPlannerHeader,
    websiteType,
    pagesCount,
    designStyle,
    features,
    budget,
    timeline,
    contentStatus,
    languages,
    contactForm,

    // SEO Schema
    seo,
  ],
}
