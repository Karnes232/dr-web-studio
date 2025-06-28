import { client } from "@/sanity/lib/client"

export const budgetQuery = `
  *[_type == "budget"][0] {
    title,
    description,
    budgetOptions[] {
      value,
      label,
      description
    }
  }
`

export async function getBudget(): Promise<Budget> {
  return client.fetch(budgetQuery)
}

export interface Budget {
  title: {
    en: string
    es: string
  }
  description: {
    en: string
    es: string
  }
  budgetOptions: {
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
