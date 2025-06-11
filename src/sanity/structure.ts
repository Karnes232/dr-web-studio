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
                  S.editor().schemaType("generalLayout").documentId("generalLayout")
                ),
            ])
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
                    .filter('_type == "heroSection"')
                ),
              S.listItem()
                .title("Hero Visual Elements")
                .child(
                  S.documentList()
                    .title("Visual Elements")
                    .filter('_type == "heroVisualElement"')
                ),
            ])
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
                  S.editor()
                    .schemaType("blogHeader")
                    .documentId("blogHeader")
                ),
              S.listItem()
                .title("Blog Posts")
                .child(
                  S.documentList()
                    .title("Blog Posts")
                    .filter('_type == "blogPost"')
                ),
              S.listItem()
                .title("Authors")
                .child(
                  S.documentList()
                    .title("Authors")
                    .filter('_type == "author"')
                ),
              S.listItem()
                .title("Categories")
                .child(
                  S.documentList()
                    .title("Categories")
                    .filter('_type == "blogCategory"')
                ),
            ])
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
                .child(
                  S.documentList()
                    .title("SEO")
                    .filter('_type == "seo"')
                ),
            ])
        ),
    ])

