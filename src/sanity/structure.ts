import type { StructureResolver } from "sanity/structure"

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = S =>
  S.list()
    .title("Content")
    .items([
      // Layout Group
      S.listItem()
        .title("Layout")
        .child(
          S.list()
            .title("Layout")
            .items([
              S.listItem()
                .title("General Layout")
                .child(
                  S.editor()
                    .schemaType("generalLayout")
                    .documentId("generalLayout"),
                ),
              S.listItem()
                .title("Stats")
                .child(
                  S.documentList().title("Stats").filter('_type == "stats"'),
                ),
            ]),
        ),

      // Home Page Group
      S.listItem()
        .title("Home Page")
        .child(
          S.list()
            .title("Home Page Content")
            .items([
              S.listItem()
                .title("Hero Sections")
                .child(
                  S.documentList()
                    .title("Hero Sections")
                    .filter('_type == "heroSection"'),
                ),
              S.listItem()
                .title("Hero Visual Elements")
                .child(
                  S.documentList()
                    .title("Visual Elements")
                    .filter('_type == "heroVisualElement"'),
                ),
              S.listItem()
                .title("Service Sections")
                .child(
                  S.documentList()
                    .title("Service Sections")
                    .filter('_type == "serviceSection"'),
                ),
              S.listItem()
                .title("Trust Signals")
                .child(
                  S.documentList()
                    .title("Trust Signals")
                    .filter('_type == "trustSignals"'),
                ),
              S.listItem()
                .title("Previous Clients")
                .child(
                  S.documentList()
                    .title("Previous Clients")
                    .filter('_type == "previousClients"'),
                ),
              S.listItem()
                .title("Testimonials")
                .child(
                  S.documentList()
                    .title("Testimonials")
                    .filter('_type == "testimonial"'),
                ),
            ]),
        ),

      // About Me Group
      S.listItem()
        .title("About Me")
        .child(
          S.list()
            .title("About Me")
            .items([
              S.listItem()
                .title("Section Header")
                .child(
                  S.documentList()
                    .title("Section Header")
                    .filter('_type == "sectionHeader"'),
                ),
              S.listItem()
                .title("Personal Story")
                .child(
                  S.documentList()
                    .title("Personal Story")
                    .filter('_type == "personalStory"'),
                ),
              S.listItem()
                .title("Location Availability")
                .child(
                  S.documentList()
                    .title("Location Availability")
                    .filter('_type == "locationAvailability"'),
                ),
              S.listItem()
                .title("Technologies")
                .child(
                  S.documentList()
                    .title("Technologies")
                    .filter('_type == "technologies"'),
                ),
              S.listItem()
                .title("Development Approach")
                .child(
                  S.documentList()
                    .title("Development Approach")
                    .filter('_type == "developmentApproach"'),
                ),
              S.listItem()
                .title("Why Choose Us")
                .child(
                  S.documentList()
                    .title("Why Choose Us")
                    .filter('_type == "whyChooseUs"'),
                ),
            ]),
        ),

      // Our Services Group
      S.listItem()
        .title("Our Services")
        .child(
          S.list()
            .title("Our Services")
            .items([
              S.listItem()
                .title("Services Header")
                .child(
                  S.documentList()
                    .title("Services Header")
                    .filter('_type == "servicesHeader"'),
                ),
              S.listItem()
                .title("Features Strip")
                .child(
                  S.documentList()
                    .title("Features Strip")
                    .filter('_type == "featuresStrip"'),
                ),
              S.listItem()
                .title("Custom Solution CTA")
                .child(
                  S.documentList()
                    .title("Custom Solution CTA")
                    .filter('_type == "customSolutionCTA"'),
                ),
            ]),
        ),

      // Services Group
      S.listItem()
        .title("Services")
        .child(
          S.list()
            .title("Services")
            .items([
              S.listItem()
                .title("Services")
                .child(
                  S.documentList()
                    .title("Services")
                    .filter('_type == "service"'),
                ),
              S.listItem()
                .title("Categories")
                .child(
                  S.documentList()
                    .title("Categories")
                    .filter('_type == "category"'),
                ),
              S.listItem()
                .title("Service Items")
                .child(
                  S.documentList()
                    .title("Service Items")
                    .filter('_type == "serviceItem"'),
                ),
            ]),
        ),

      // Portfolio Group
      S.listItem()
        .title("Portfolio")
        .child(
          S.list()
            .title("Portfolio")
            .items([
              S.listItem()
                .title("Portfolio Header")
                .child(
                  S.documentList()
                    .title("Portfolio Header")
                    .filter('_type == "portfolioHeader"'),
                ),
              S.listItem()
                .title("Projects")
                .child(
                  S.documentList()
                    .title("Projects")
                    .filter('_type == "project"'),
                ),
            ]),
        ),

      // Pricing Group
      S.listItem()
        .title("Pricing")
        .child(
          S.list()
            .title("Pricing")
            .items([
              S.listItem()
                .title("Pricing Header")
                .child(
                  S.documentList()
                    .title("Pricing Header")
                    .filter('_type == "pricingHeader"'),
                ),
              S.listItem()
                .title("Pricing Data")
                .child(
                  S.documentList()
                    .title("Pricing Data")
                    .filter('_type == "pricingData"'),
                ),
              S.listItem()
                .title("FAQs Header")
                .child(
                  S.documentList()
                    .title("FAQs Header")
                    .filter('_type == "faqsHeader"'),
                ),
              S.listItem()
                .title("FAQs")
                .child(
                  S.documentList()
                    .title("FAQs")
                    .filter('_type == "faq"'),
                ),
            ]),
        ),

      // Blog Group
      S.listItem()
        .title("Blog")
        .child(
          S.list()
            .title("Blog Content")
            .items([
              S.listItem()
                .title("Blog Header")
                .child(
                  S.editor().schemaType("blogHeader").documentId("blogHeader"),
                ),
              S.listItem()
                .title("Blog Posts")
                .child(
                  S.documentList()
                    .title("Blog Posts")
                    .filter('_type == "blogPost"'),
                ),
              S.listItem()
                .title("Authors")
                .child(
                  S.documentList().title("Authors").filter('_type == "author"'),
                ),
              S.listItem()
                .title("Categories")
                .child(
                  S.documentList()
                    .title("Categories")
                    .filter('_type == "blogCategory"'),
                ),
            ]),
        ),

      // Contact Group
      S.listItem()
        .title("Contact")
        .child(
          S.list()
            .title("Contact")
            .items([
              S.listItem()
                .title("Contact Hero")
                .child(
                  S.documentList()
                    .title("Contact Hero")
                    .filter('_type == "contactHero"'),
                ),
              S.listItem()
                .title("Location Info")
                .child(
                  S.documentList()
                    .title("Location Info")
                    .filter('_type == "locationInfo"'),
                ),
              S.listItem()
                .title("Contact FAQ")
                .child(
                  S.documentList()
                    .title("Contact FAQ")
                    .filter('_type == "contactFaq"'),
                ),
            ]), 
        ),

      // SEO Group
      S.listItem()
        .title("SEO")
        .child(
          S.list()
            .title("SEO Settings")
            .items([
              S.listItem()
                .title("SEO Configuration")
                .child(S.documentList().title("SEO").filter('_type == "seo"')),
            ]),
        ),
    ])
