import { type SchemaTypeDefinition } from "sanity"
import generalLayout from "./layout/generalLayout"
import heroSection from "./home/HomePageHero"
import heroVisualElement from "./home/HeroVisualElements"
import seo from "./seo/seo"
import author from "./blog/author"
import blogPost from "./blog/blogPost"
import blogCategory from "./blog/blogCategory"
import blogHeader from "./blog/blogHeader"

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [generalLayout, heroSection, heroVisualElement, seo, author, blogPost, blogCategory, blogHeader],
}
