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

// Blog Schemas
import author from "./blog/author"
import blogPost from "./blog/blogPost"
import blogCategory from "./blog/blogCategory"
import blogHeader from "./blog/blogHeader"

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

    // Blog Schemas
    author,
    blogPost,
    blogCategory,
    blogHeader,

    // SEO Schema
    seo,
  ],
}
