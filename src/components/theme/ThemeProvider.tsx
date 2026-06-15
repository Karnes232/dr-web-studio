"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"

// Wraps next-themes with the project's chosen defaults: class-based dark mode
// (Tailwind v4 reads the `.dark` class on <html>), system preference as the
// default, and no transition flicker when the theme flips.
export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  )
}
