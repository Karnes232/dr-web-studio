interface PageProps {
  params: Promise<{
    lang: "en" | "es"
    slug: string
  }>
}

export default async function IndividualService({ params }: PageProps) {
  const { lang, slug } = await params
  console.log(slug)
  return <div>Individual Service</div>
}
