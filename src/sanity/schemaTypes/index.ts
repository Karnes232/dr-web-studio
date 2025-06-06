import { type SchemaTypeDefinition } from "sanity"
import generalLayout from "./generalLayout"
import heroSection from "./HomePageHero"
import heroVisualElement from "./HeroVisualElements"

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [generalLayout, heroSection, heroVisualElement],
}
