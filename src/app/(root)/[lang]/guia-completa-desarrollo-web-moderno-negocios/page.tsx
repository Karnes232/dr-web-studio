import PageClientComponent from "@/components/GuiaCompletaComponents/PageClientComponent"
import {
  getPillarPageContent,
  Language,
} from "@/components/GuiaCompletaComponents/pillarPageData"

export default async function GuiaCompletaDesarrolloWebModernoNegocios({
  params,
}: {
  params: { lang: string }
}) {
  const { lang } = await params
  const content = await getPillarPageContent(lang as Language)
  return (
    <main>
      <PageClientComponent content={content} lang={lang as Language} />
    </main>
  )
}
