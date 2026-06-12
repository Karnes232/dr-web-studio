import { createClient } from "next-sanity"

import { apiVersion, dataset, projectId } from "../env"

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // CDN read; pages use short ISR (revalidate) so Studio edits still appear within ~1 min
})
