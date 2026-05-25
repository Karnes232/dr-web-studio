import { createNavigation } from "next-intl/navigation"
import { routing } from "./routing"

// Locale-aware navigation APIs. usePathname() returns the path WITHOUT the
// locale prefix; useRouter().replace(path, { locale }) switches locale.
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing)
