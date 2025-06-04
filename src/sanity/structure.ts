import type { StructureResolver } from "sanity/structure"

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = S =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("General Layout")
        .child(
          S.editor().schemaType("generalLayout").documentId("generalLayout"),
        ),
      S.listItem()
        .title("Hero Section")
        .child(
          S.documentList()
            .title("Hero Sections")
            .filter('_type == "heroSection"'),
        ),
    ])
