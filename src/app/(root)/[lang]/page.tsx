import { client } from "@/sanity/lib/client"
import LanguageSwitcher from "@/components/LanguageSwitcher"
import HeroSection from "@/components/HeroComponent/HeroSection"
import QuickServicesOverview from "@/components/ServicesOverview/QuickServicesOverview"
import TrustSignals from "@/components/TrustSignalsComponents/TrustSignals"
import { getTranslation } from "@/i18n"

async function getContent() {
  const query = `
*[_type == "heroSection"][0] {
heading,
subheading,
backgroundImage {
  asset->{
    url,
    metadata {
      dimensions,
      lqip,
      palette
    }
  }
}
}
`
  return await client.fetch(query)
}

interface PageProps {
  params: any
}

export default async function Home({ params }: PageProps) {
  const { lang } = await params

  const [pageData, { t }] = await Promise.all([
    getContent(),
    getTranslation(lang),
  ])

  return (
    <main className="">
      <HeroSection
        heading={pageData.heading ? pageData.heading[lang] : pageData.heading}
        subheading={
          pageData.subheading ? pageData.subheading[lang] : pageData.subheading
        }
        backgroundImage={pageData.backgroundImage}
      />
      <QuickServicesOverview />
      <TrustSignals />
    </main>
  )
}
