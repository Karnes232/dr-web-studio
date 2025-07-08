import { useLocale } from "@/i18n/useLocale"
import { Search } from "lucide-react"
import React from "react"

const SearchBar = ({
  searchTerm,
  setSearchTerm,
}: {
  searchTerm: string
  setSearchTerm: (searchTerm: string) => void
}) => {
  const { t } = useLocale()
  return (
    <div className="relative mb-8">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        placeholder={t("faqsPage.searchFaqs")}
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
      />
    </div>
  )
}

export default SearchBar
