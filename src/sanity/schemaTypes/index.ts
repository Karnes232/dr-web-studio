import { type SchemaTypeDefinition } from "sanity"
import generalLayout from "./generalLayout"
import heroSection from "./HomePageHero"
import heroVisualElement from "./HeroVisualElements"
import seo from "./seo"

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [generalLayout, heroSection, heroVisualElement, seo],
}
