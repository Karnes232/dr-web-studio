import { type SchemaTypeDefinition } from "sanity"
import generalLayout from "./generalLayout"
import heroSection from "./HomePageHero"

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [generalLayout, heroSection],
}
