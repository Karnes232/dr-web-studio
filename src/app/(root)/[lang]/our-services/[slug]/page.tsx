import { getSEO, getSeoSchema } from "@/sanity/queries/seo"
import { Metadata } from "next"
import IndividualServiceContent from "@/components/IndividualServicePage/IndividualServiceContent"
import { getServiceItemBySlug } from "@/sanity/queries/services/serviceItem"

interface PageProps {
  params: Promise<{
    lang: "en" | "es"
    slug: string
  }>
}

export default async function IndividualService({ params }: PageProps) {
  const { lang, slug } = await params
  console.log(slug)
  const service = await getServiceItemBySlug(slug)
  console.log(service)
  
  if (!service) {
    return <div>Service not found</div>
  }
  
  return (
    <>
      {/* {seoData?.structuredData?.[lang] && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: seoData.structuredData[lang] }}
        />
      )} */}
      <IndividualServiceContent
        // lang={lang}
        service={service}
      />
    </>
  )
}
