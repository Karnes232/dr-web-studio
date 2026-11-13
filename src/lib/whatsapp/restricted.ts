/**
 * Destinations the Cloud API will not deliver to.
 *
 * Meta blocks API sends from a business outside Brazil or Indonesia to numbers
 * in those two countries, replies inside the 24-hour window included. The send
 * is ACCEPTED (Kapso returns a wamid, `sendText` reports success) and fails
 * seconds later on a status webhook with error 130497, "Business account is
 * restricted from messaging users in this country".
 *
 * Found on 2026-11-13: both Grand Bay chats that got no reply (Nov 6, Nov 13)
 * were +55 numbers. The agent had paid for three replies nobody received, and
 * nothing told the staff. A person answering from the WhatsApp Business app is
 * not affected, so these chats are simply theirs.
 *
 * Neither tenant's number is Brazilian or Indonesian, so the list is global.
 * If Meta lifts the restriction for an account, remove the country here.
 */

/** Meta error code for the cross-country restriction. */
export const COUNTRY_RESTRICTED = 130497

/** Calling codes. Country codes are prefix-free, so a prefix test is exact. */
const RESTRICTED_CALLING_CODES = ["55", "62"]

/** ISO country prefixes of business-scoped user ids, e.g. `BR.1757…`. */
const RESTRICTED_COUNTRIES = ["BR", "ID"]

/**
 * Is this customer somewhere the agent's replies cannot reach?
 *
 * Takes a `wa_id` as stored: digits for a phone number, or a business-scoped
 * user id (`DO.1757…`) for a username contact, whose prefix is the country.
 */
export function isRestrictedDestination(waId: string): boolean {
  const scoped = /^([A-Za-z]{2})\.\d+$/.exec(waId)
  if (scoped) return RESTRICTED_COUNTRIES.includes(scoped[1].toUpperCase())
  return RESTRICTED_CALLING_CODES.some(code => waId.startsWith(code))
}
