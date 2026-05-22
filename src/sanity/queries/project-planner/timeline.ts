import { cache } from "react"
import { client } from "@/sanity/lib/client"

export const timelineQuery = `
  *[_type == "timeline"][0] {
    title,
    description,
    timelineOptions[] {
      value,
      label,
      description
    }
  }
`

export const getTimeline = cache(async (): Promise<Timeline> => {
  return client.fetch(timelineQuery)
})

export interface Timeline {
  title: {
    en: string
    es: string
  }
  description: {
    en: string
    es: string
  }
  timelineOptions: {
    value: {
      en: string
      es: string
    }
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
