import { client } from "@/sanity/lib/client"

export const designStyleQuery = `
  *[_type == "designStyle"][0] {
    _id,
    title,
    description,
    designStyles[] {
      value,
      label,
      description
    }
  }
`

export interface DesignStyle {
  _id: string
  title: {
    en: string
    es: string
  }
  description: {
    en: string
    es: string
  }
  designStyles: {
    value: string
    label: {
      en: string
      es: string
    }
    description: {
      en: string
      es: string
    }
  }[]
}

export async function getDesignStyle(): Promise<DesignStyle> {
  return client.fetch(designStyleQuery)
} 