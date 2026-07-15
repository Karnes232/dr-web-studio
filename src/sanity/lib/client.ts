// Import from @sanity/client, NOT next-sanity: next-sanity's index re-exports
// its live/visual-editing client components, so importing it from any module
// reachable by a client component ships all of @sanity/client (~55KB) to the
// browser on every page.
import { createClient } from "@sanity/client"

import { apiVersion, dataset, projectId } from "../env"

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // CDN read; pages use short ISR (revalidate) so Studio edits still appear within ~1 min
})
