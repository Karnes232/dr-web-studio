import { client } from "@/sanity/lib/client"

interface PersonalStoryData {
    title: {
      en: string
      es: string
    }
    story1: {
      en: string
      es: string
    }
    story2: {
      en: string
      es: string
    }
  }
  

export const personalStoryQuery = `*[_type == "personalStory"][0] {
    title {
      en,
      es
    },
    story1 {
      en,
      es
    },
    story2 {
      en,
      es
    }
  }`

  export async function getPersonalStory(): Promise<PersonalStoryData> {
    return client.fetch(personalStoryQuery)
  }