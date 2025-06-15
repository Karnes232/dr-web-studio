import { client } from "@/sanity/lib/client"

interface AvailabilityItem {
  en: string
  es: string
}

interface LocationAvailabilityData {
  availabilityItems: AvailabilityItem[]
}

export const locationAvailabilityQuery = `*[_type == "locationAvailability"][0] {
  availabilityItems[] {
    en,
    es
  }
}`

export async function getLocationAvailability(): Promise<LocationAvailabilityData> {
  return client.fetch(locationAvailabilityQuery)
} 