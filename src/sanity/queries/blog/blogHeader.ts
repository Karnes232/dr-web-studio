import { cache } from "react"
import { client } from "../../lib/client"

export const blogHeaderQuery = `
*[_type == "blogHeader"][0] {
  title {
    en,
    es
  },
  subtitle {
    en,
    es
  }
}`

export interface BlogHeader {
  title: {
    en: string
    es: string
  }
  subtitle: {
    en: string
    es: string
  }
}

export const getBlogHeader = cache(async (): Promise<BlogHeader | null> => {
  return await client.fetch(blogHeaderQuery)
})
