/**
 * Seed script — Blog Posts
 *
 * Creates blog posts as DRAFTS (drafts.blogPost-<slug>) so they never reach
 * the live site until finished. mainImage is required by the schema but not
 * set here — workflow: run this script, open the draft in Studio (/studio),
 * add the main image (with EN/ES alt text), review, then Publish.
 *
 * Author and categories are resolved at runtime by slug from the dataset —
 * posts reference the existing author + blogCategory documents.
 *
 * To add a post: copy an object in `posts` below and edit it. Use the inline
 * helpers for body content:
 *   p("plain paragraph")
 *   h2("Heading")  h3("Subheading")  h4("Minor heading")
 *   bulletP("A bullet line")                       // renders "•  A bullet line"
 *   rich("normal", [run("text "), link("anchor", "https://…"), run(" more")])
 *
 * Usage:
 *   npm run seed:blog              # createIfNotExists — never overwrites a
 *                                  # draft you already edited in Studio
 *   npm run seed:blog -- --replace # createOrReplace — force-overwrite drafts
 *                                  # while iterating on content in this file
 *
 * Requires SANITY_API_TOKEN (write) in .env.local.
 */

import { createClient } from "@sanity/client"

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2025-06-01",
  token: process.env.SANITY_API_TOKEN!,
  useCdn: false,
})

const AUTHOR_SLUG = "james-karnes"
const AUTHOR_NAME = "James Karnes"
const SITE_URL = "https://www.dr-webstudio.com"
// Publisher logo URL used by the structured data of existing published posts.
const PUBLISHER_LOGO = `${SITE_URL}/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2F6r8ro1r9%2Fproduction%2F6a71c6f35fc64c97a98fe4ee324379735ed45a6f-3200x3200.png&w=256&q=75`

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

let _keyCounter = 0
const key = () => `key${++_keyCounter}`

const loc = (en: string, es: string) => ({ en, es })

/** A single portable-text block with one plain span. */
const block = (style: "normal" | "h2" | "h3" | "h4" | "blockquote", text: string) => ({
  _type: "block" as const,
  _key: key(),
  style,
  markDefs: [],
  children: [{ _type: "span" as const, _key: key(), marks: [], text }],
})

const p = (text: string) => block("normal", text)
const h2 = (text: string) => block("h2", text)
const h3 = (text: string) => block("h3", text)
const h4 = (text: string) => block("h4", text)

// ── Rich blocks with inline links ────────────────────────────────────────────
// A "run" is a plain text segment; a "link" is a text segment wrapped in an
// anchor. rich() assembles them into one portable-text block, generating the
// markDefs (link annotations) the editor and renderer expect.

type Run = { text: string; href?: string }

const run = (text: string): Run => ({ text })
const link = (text: string, href: string): Run => ({ text, href })

/** Build a portable-text block from runs, wiring link annotations into markDefs. */
const rich = (
  style: "normal" | "h2" | "h3" | "h4" | "blockquote",
  runs: Run[],
) => {
  const markDefs: { _type: "link"; _key: string; href: string }[] = []
  const children = runs.map(r => {
    if (r.href) {
      const _key = key()
      markDefs.push({ _type: "link", _key, href: r.href })
      return { _type: "span" as const, _key: key(), marks: [_key], text: r.text }
    }
    return { _type: "span" as const, _key: key(), marks: [], text: r.text }
  })
  return { _type: "block" as const, _key: key(), style, markDefs, children }
}

/** A bullet-style line. The schema's block set has no list type wired here, so
 *  we prefix a bullet glyph and render as a normal block. Safe everywhere. */
const bulletP = (text: string) => block("normal", `•  ${text}`)

type Localized = { en: string; es: string }
type Block =
  | ReturnType<typeof block>
  | ReturnType<typeof rich>

interface SeedPost {
  /** English slug — also becomes the document _id suffix. */
  slug: string
  /** Spanish slug. */
  slugEs: string
  title: Localized
  /** Short description, max 200 chars per language. */
  description: Localized
  readTime: number
  featured?: boolean
  tags: { en: string[]; es: string[] }
  /** blogCategory slugs — resolved to references at runtime. */
  categories: string[]
  /** ISO datetime, e.g. "2026-07-04T12:00:00.000Z". */
  publishedAt: string
  body: { en: Block[]; es: Block[] }
  /** Optional SEO overrides — derived from title/description/tags when omitted. */
  seo?: {
    metaTitle?: Localized
    metaDescription?: Localized
    keywords?: { en: string[]; es: string[] }
    ogTitle?: Localized
    ogDescription?: Localized
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Posts
// ─────────────────────────────────────────────────────────────────────────────

const posts: SeedPost[] = [
  {
    slug: "websites-law-firms-accountants-relocation-services",
    slugEs: "paginas-web-firmas-legales-contables-y-reubicacion",
    title: loc(
      "Websites for Law Firms, Accountants & Relocation Services in the DR",
      "Páginas Web para Firmas Legales, Contables y de Reubicación en RD",
    ),
    description: loc(
      "Law firms, accountants and relocation services in the DR serve clients who research entirely online, often from abroad. Why a bilingual, credible website is your practice.",
      "Las firmas legales, contables y de reubicación en RD atienden clientes que investigan en línea, muchas veces desde el extranjero. Por qué una web bilingüe y creíble es tu práctica.",
    ),
    readTime: 9,
    featured: false,
    tags: {
      en: ["law firms", "accountants", "relocation", "residency", "expats", "professional services", "credibility", "Dominican Republic"],
      es: ["firmas legales", "contadores", "reubicación", "residencia", "expatriados", "servicios profesionales", "credibilidad", "República Dominicana"],
    },
    categories: ["business-tips"],
    publishedAt: "2026-08-04T12:00:00.000Z",
    body: {
      en: [
        p("A retiree in Ohio has decided to move to the Dominican Republic. A Canadian couple is buying a condo in Sosúa. A German entrepreneur wants to register a company in Santiago. Every one of them needs a Dominican lawyer, an accountant, or a relocation specialist — and every one of them will find that professional the same way: by searching online, from another country, months before they arrive, and comparing what they find. They will not walk past your office. They will not get a referral from a neighbor. Your website is the entire first impression, the credibility test, and often the deciding factor. For professional services in the DR, the website isn't marketing. It's the first consultation."),
        h2("A client who is remote, cautious, and comparing"),
        p("The defining feature of this vertical is the client's situation: they are handing sensitive matters — their residency, their money, their property, their company — to a professional they have never met, in a country they may not know, in a legal system they don't understand, often in a language they don't speak. That produces a very particular buyer: cautious, research-heavy, and looking hard for reasons to trust or to eliminate. They will read your site carefully, cross-check you against two or three competitors, look for signs of legitimacy, and quietly disqualify anyone whose web presence makes them uneasy. Unlike a restaurant customer risking a mediocre dinner, this client is risking a great deal — so the burden of proof your website carries is much higher, and the reward for clearing it is a client relationship worth far more than a single transaction."),
        h2("The demand is real and growing"),
        rich("normal", [run("This isn't a theoretical market. The Dominican Republic has become one of the Caribbean's most popular relocation destinations, with clear residency pathways — pensionado for retirees with qualifying pension income, rentista for those with steady foreign income, and investor routes — plus a large and expanding foreign resident community concentrated along the north coast, in Santo Domingo, Punta Cana, and Las Terrenas. Crucially for you, this process practically requires professional help. As one expat guide puts it plainly, "), link("engaging a reputable local law firm is highly recommended, because it removes the burden of navigating the procedure in a second language", "https://www.expatfocus.com/dominican-republic/guide/dominican-republic-residency"), run(". Read that again from a business perspective: the client's stated reason for hiring you is that you can bridge the language and system gap. If your website exists only in Spanish, you have failed the test before the conversation starts — you're advertising precisely the barrier they're paying to remove.")]),
        h2("What this website has to prove"),
        p("For professional services, design and content serve one master: credibility. Specifically, the site needs to answer the four questions running silently through the prospect's head."),
        rich("normal", [run("•  "), run("\"Are you real and established?\" Physical office address, years in practice, professional registrations and bar affiliations, real photographs of real people, a genuine team page. Anonymity reads as risk. "), link("Research on web credibility", "https://credibility.stanford.edu/guidelines/index.html"), run(" has long found that people judge an organization's trustworthiness substantially from how professional and legitimate its site appears — and nowhere does that judgment carry more weight than here.")]),
        rich("normal", [run("•  "), run("\"Do you handle my specific situation?\" Not \"we offer legal services\" but \"we handle pensionado and rentista residency applications, property purchases by foreign buyers, company formation, and inheritance for non-residents.\" Prospects search for their exact problem; the firm whose page names that problem wins the click and the confidence.")]),
        rich("normal", [run("•  "), run("\"Can you work with me in my language?\" Genuine English pages — written by someone fluent, not machine-translated — are the single highest-leverage investment this vertical can make, built as "), link("real bilingual architecture", "https://www.dr-webstudio.com/en/blog/seo-bilingue-posicionarse-ingles-espanol-sin-perjudicar-ninguno"), run(" rather than a translate widget. A grammatical mess in English tells an English-speaking client exactly what working with you will feel like.")]),
        rich("normal", [run("•  "), run("\"What will this cost and how does it work?\" The firms that explain the process — the steps, the documents, the realistic timeline, and at least indicative pricing — dramatically outperform those that hide everything behind \"contact us.\" Transparency is trust made concrete, and it also filters out the unqualified inquiries that waste your time.")]),
        h2("Content is how professionals win this market"),
        rich("normal", [run("Here's the strategic advantage available to any Dominican professional firm willing to write: your prospective clients are searching, months in advance, for answers to very specific questions. \"How do I get pensionado residency in the Dominican Republic?\" \"Can foreigners own property in the DR?\" \"How do I register a company as a foreigner?\" \"What documents need an apostille?\" Every one of those searches is a future client doing homework — and the firm that answers the question thoroughly and clearly becomes the expert they trust before they've spoken to anyone. This is the highest-return content strategy in professional services precisely because the sales cycle is long and research-driven: the article they read in March is why they email you in June. It's also exactly the content that "), link("AI search engines now surface and cite", "https://www.dr-webstudio.com/en/blog/ai-search-chatgpt-gemini-how-your-business-shows-up"), run(", which means clear, genuinely useful answers on your own site increasingly get recommended by ChatGPT and Google's AI answers too.")]),
        h2("Who this applies to beyond immigration lawyers"),
        p("The same dynamic drives the whole professional cluster serving the DR's foreign and business community:"),
        rich("normal", [run("•  "), run("Immigration and residency lawyers — the clearest case, with clients researching from abroad for months.")]),
        rich("normal", [run("•  "), run("Real estate and property lawyers — the due diligence, title verification, and closing work behind every foreign purchase, adjacent to the "), link("real estate market", "https://www.dr-webstudio.com/en/blog/real-estate-websites-punta-cana"), run(" itself.")]),
        rich("normal", [run("•  "), run("Accountants and tax advisors — serving both foreign residents with cross-border obligations and Dominican businesses, where credibility drives every referral.")]),
        rich("normal", [run("•  "), run("Corporate lawyers and business formation services — company registration, free-zone structuring, and compliance for the nearshoring investors we described in "), link("Santiago", "https://www.dr-webstudio.com/en/blog/santiago-economic-engine-business-websites"), run(".")]),
        rich("normal", [run("•  "), run("Relocation consultants and concierge services — the practical side of moving, from schools to shipping to setting up utilities.")]),
        h2("Referrals still matter — and they end at your website"),
        p("Professional services run on referrals, and it's tempting to conclude that a website matters less when most work arrives by recommendation. The opposite is true, and the reason is simple: a referral is not a decision, it's a shortlist entry. When an expat in a Sosúa Facebook group asks for a lawyer and three names come back, every person reading that thread does the same thing next — they search the names. What they find either confirms the recommendation or quietly undermines it. A firm with a professional, bilingual, informative site converts that referral into a client; a firm with no site, a broken site, or a site that hasn't been touched since 2016 makes the prospect wonder whether the recommendation was current. The same applies to reviews: in a trust-driven vertical, genuine Google reviews and a complete, accurate Business Profile are part of the credibility package, not a separate marketing task. Your website doesn't replace word of mouth in this business — it's what word of mouth points at, and the last thing standing between a warm recommendation and a signed engagement."),
        h2("An honest word on the profession's constraints"),
        p("Professional services carry constraints other businesses don't, and it's worth naming them. Confidentiality means you can't publish client stories the way a restaurant posts photos, so credibility has to be built through expertise and transparency instead of testimonials alone — though anonymized case examples and genuine reviews go further than most firms use. Professional advertising rules and ethical standards shape what you can claim, which argues for a conservative, substantive tone rather than marketing bravado — fortunately, that tone is also what this cautious client responds to best. And publishing legal or tax content requires care: it must be accurate, dated, and clearly framed as general information rather than advice for a specific situation. None of these constraints prevent an excellent website. They simply mean the winning strategy here is substance over flash — which is a strategy most competitors are too impatient to execute."),
        h2("Build the credibility your practice already has"),
        rich("normal", [run("At "), link("DR Web Studio", "https://www.dr-webstudio.com/en"), run(" we build websites for professional firms that need to be taken seriously by international clients: genuinely bilingual, fast, clean, and structured to answer the questions your prospects are already searching — with WhatsApp and clear contact paths for clients who want a real conversation, and the first year of maintenance included. If your practice is winning clients despite your website rather than because of it, "), link("contact us for a free consultation", "https://www.dr-webstudio.com/en/contact"), run(" and let's make the first impression match the expertise behind it.")]),
      ],
      es: [
        p("Un jubilado en Ohio decidió mudarse a República Dominicana. Una pareja canadiense está comprando un apartamento en Sosúa. Un empresario alemán quiere registrar una empresa en Santiago. Cada uno de ellos necesita un abogado dominicano, un contador o un especialista en reubicación — y cada uno de ellos encontrará a ese profesional de la misma forma: buscando en línea, desde otro país, meses antes de llegar, y comparando lo que encuentre. No van a pasar frente a tu oficina. No van a recibir una referencia de un vecino. Tu página web es toda la primera impresión, la prueba de credibilidad, y muchas veces el factor decisivo. Para los servicios profesionales en RD, la página web no es marketing. Es la primera consulta."),
        h2("Un cliente remoto, cauteloso y comparando"),
        p("La característica definitoria de este vertical es la situación del cliente: está entregando asuntos delicados — su residencia, su dinero, su propiedad, su empresa — a un profesional que nunca ha conocido, en un país que quizás no conoce, en un sistema legal que no entiende, muchas veces en un idioma que no habla. Eso produce un comprador muy particular: cauteloso, intensivo en investigación, y buscando con fuerza razones para confiar o para descartar. Leerá tu sitio con cuidado, te contrastará con dos o tres competidores, buscará señales de legitimidad, y descalificará en silencio a cualquiera cuya presencia web lo inquiete. A diferencia del cliente de un restaurante que arriesga una cena mediocre, este cliente arriesga muchísimo — así que la carga de la prueba que lleva tu página web es mucho más alta, y la recompensa por superarla es una relación de cliente que vale mucho más que una sola transacción."),
        h2("La demanda es real y está creciendo"),
        rich("normal", [run("Este no es un mercado teórico. República Dominicana se ha convertido en uno de los destinos de reubicación más populares del Caribe, con vías de residencia claras — pensionado para jubilados con ingreso de pensión calificado, rentista para quienes tienen ingreso extranjero estable, y rutas de inversionista — más una comunidad de residentes extranjeros grande y en expansión concentrada en la costa norte, Santo Domingo, Punta Cana y Las Terrenas. Y algo crucial para ti: este proceso prácticamente exige ayuda profesional. Como lo dice claramente una guía para expatriados, "), link("contratar a una firma legal local de buena reputación es altamente recomendable, porque quita la carga de navegar el procedimiento en un segundo idioma", "https://www.expatfocus.com/dominican-republic/guide/dominican-republic-residency"), run(". Lee eso de nuevo desde una perspectiva de negocio: la razón declarada del cliente para contratarte es que tú puedes cerrar la brecha de idioma y de sistema. Si tu página web existe solo en español, fallaste la prueba antes de que empiece la conversación — estás anunciando precisamente la barrera que te están pagando por eliminar.")]),
        h2("Qué tiene que probar esta página web"),
        p("Para los servicios profesionales, el diseño y el contenido sirven a un solo amo: la credibilidad. Específicamente, el sitio necesita responder las cuatro preguntas que corren en silencio por la cabeza del prospecto."),
        rich("normal", [run("•  "), run("\"¿Son reales y establecidos?\" Dirección física de la oficina, años de ejercicio, registros profesionales y colegiaturas, fotografías reales de personas reales, una página de equipo genuina. El anonimato se lee como riesgo. "), link("La investigación sobre credibilidad web", "https://credibility.stanford.edu/guidelines/index.html"), run(" ha encontrado desde hace tiempo que la gente juzga la confiabilidad de una organización sustancialmente por cuán profesional y legítimo se ve su sitio — y en ningún lugar ese juicio pesa más que aquí.")]),
        rich("normal", [run("•  "), run("\"¿Manejan mi situación específica?\" No \"ofrecemos servicios legales\" sino \"manejamos solicitudes de residencia pensionado y rentista, compras de propiedad por compradores extranjeros, formación de empresas y sucesiones para no residentes.\" Los prospectos buscan su problema exacto; la firma cuya página nombra ese problema gana el clic y la confianza.")]),
        rich("normal", [run("•  "), run("\"¿Pueden trabajar conmigo en mi idioma?\" Páginas genuinas en inglés — escritas por alguien fluido, no traducidas por máquina — son la inversión de mayor apalancamiento que puede hacer este vertical, construidas como "), link("arquitectura bilingüe real", "https://www.dr-webstudio.com/es/blog/seo-bilingue-posicionarse-ingles-espanol-sin-perjudicar-ninguno"), run(" en vez de un widget de traducción. Un desastre gramatical en inglés le dice a un cliente angloparlante exactamente cómo se sentirá trabajar contigo.")]),
        rich("normal", [run("•  "), run("\"¿Cuánto costará y cómo funciona?\" Las firmas que explican el proceso — los pasos, los documentos, el cronograma realista, y al menos precios indicativos — superan dramáticamente a las que esconden todo detrás de un \"contáctanos.\" La transparencia es confianza hecha concreta, y además filtra las consultas no calificadas que te quitan tiempo.")]),
        h2("El contenido es cómo los profesionales ganan este mercado"),
        rich("normal", [run("Aquí está la ventaja estratégica disponible para cualquier firma profesional dominicana dispuesta a escribir: tus clientes potenciales están buscando, con meses de antelación, respuestas a preguntas muy específicas. \"¿Cómo obtengo la residencia pensionado en República Dominicana?\" \"¿Pueden los extranjeros ser dueños de propiedades en RD?\" \"¿Cómo registro una empresa siendo extranjero?\" \"¿Qué documentos necesitan apostilla?\" Cada una de esas búsquedas es un futuro cliente haciendo su tarea — y la firma que responde la pregunta a fondo y con claridad se convierte en el experto en quien confía antes de haber hablado con nadie. Esta es la estrategia de contenido de mayor retorno en servicios profesionales precisamente porque el ciclo de venta es largo e impulsado por la investigación: el artículo que leyó en marzo es la razón por la que te escribe en junio. Es también exactamente el contenido que "), link("los buscadores con IA ahora muestran y citan", "https://www.dr-webstudio.com/es/blog/busqueda-con-ia-chatgpt-gemini-como-aparece-tu-negocio"), run(", lo que significa que las respuestas claras y genuinamente útiles en tu propio sitio son cada vez más recomendadas también por ChatGPT y las respuestas de IA de Google.")]),
        h2("A quién aplica esto más allá de los abogados de inmigración"),
        p("La misma dinámica impulsa a todo el grupo profesional que sirve a la comunidad extranjera y de negocios de RD:"),
        rich("normal", [run("•  "), run("Abogados de inmigración y residencia — el caso más claro, con clientes investigando desde el extranjero durante meses.")]),
        rich("normal", [run("•  "), run("Abogados inmobiliarios y de propiedades — la debida diligencia, verificación de títulos y cierre detrás de cada compra extranjera, adyacente al "), link("mercado inmobiliario", "https://www.dr-webstudio.com/es/blog/paginas-web-para-inmobiliarias-en-punta-cana"), run(" en sí.")]),
        rich("normal", [run("•  "), run("Contadores y asesores fiscales — sirviendo tanto a residentes extranjeros con obligaciones transfronterizas como a empresas dominicanas, donde la credibilidad impulsa cada referencia.")]),
        rich("normal", [run("•  "), run("Abogados corporativos y servicios de formación de empresas — registro de empresas, estructuración en zonas francas, y cumplimiento para los inversionistas de nearshoring que describimos en "), link("Santiago", "https://www.dr-webstudio.com/es/blog/santiago-motor-economico-paginas-web-de-negocios"), run(".")]),
        rich("normal", [run("•  "), run("Consultores de reubicación y servicios de concierge — el lado práctico de mudarse, desde escuelas hasta envíos y activación de servicios básicos.")]),
        h2("Las referencias siguen importando — y terminan en tu página web"),
        p("Los servicios profesionales funcionan con referencias, y es tentador concluir que una página web importa menos cuando la mayoría del trabajo llega por recomendación. Lo opuesto es cierto, y la razón es simple: una referencia no es una decisión, es una entrada en una lista corta. Cuando un expatriado en un grupo de Facebook de Sosúa pide un abogado y regresan tres nombres, cada persona que lee ese hilo hace lo mismo a continuación — busca los nombres. Lo que encuentra confirma la recomendación o la socava en silencio. Una firma con un sitio profesional, bilingüe e informativo convierte esa referencia en un cliente; una firma sin sitio, con un sitio roto, o con un sitio que no se ha tocado desde 2016 hace que el prospecto se pregunte si la recomendación estaba vigente. Lo mismo aplica a las reseñas: en un vertical impulsado por la confianza, las reseñas genuinas de Google y un Perfil de Negocio completo y preciso son parte del paquete de credibilidad, no una tarea de marketing aparte. Tu página web no reemplaza el boca a boca en este negocio — es a lo que el boca a boca apunta, y lo último que se interpone entre una recomendación cálida y un contrato firmado."),
        h2("Una palabra honesta sobre las restricciones de la profesión"),
        p("Los servicios profesionales cargan restricciones que otros negocios no tienen, y vale la pena nombrarlas. La confidencialidad significa que no puedes publicar historias de clientes como un restaurante publica fotos, así que la credibilidad tiene que construirse a través de la experiencia y la transparencia en vez de solo testimonios — aunque los ejemplos de casos anonimizados y las reseñas genuinas llegan más lejos de lo que la mayoría de las firmas aprovecha. Las reglas de publicidad profesional y los estándares éticos moldean lo que puedes afirmar, lo que aboga por un tono conservador y sustancioso en vez de bravuconería de marketing — afortunadamente, ese tono es también al que este cliente cauteloso responde mejor. Y publicar contenido legal o fiscal requiere cuidado: debe ser preciso, fechado, y claramente enmarcado como información general en vez de asesoría para una situación específica. Ninguna de estas restricciones impide una página web excelente. Simplemente significan que la estrategia ganadora aquí es sustancia sobre destello — que es una estrategia que la mayoría de los competidores es demasiado impaciente para ejecutar."),
        h2("Construye la credibilidad que tu práctica ya tiene"),
        rich("normal", [run("En "), link("DR Web Studio", "https://www.dr-webstudio.com/es"), run(" construimos páginas web para firmas profesionales que necesitan ser tomadas en serio por clientes internacionales: genuinamente bilingües, rápidas, limpias, y estructuradas para responder las preguntas que tus prospectos ya están buscando — con WhatsApp y caminos de contacto claros para clientes que quieren una conversación real, y el primer año de mantenimiento incluido. Si tu práctica está ganando clientes a pesar de tu página web en vez de gracias a ella, "), link("contáctanos para una consulta gratuita", "https://www.dr-webstudio.com/es/contacto"), run(" y hagamos que la primera impresión esté a la altura de la experiencia que hay detrás.")]),
      ],
    },
    seo: {
      metaTitle: loc(
        "Websites for Law Firms & Accountants in the DR (2026)",
        "Webs para Firmas Legales y Contables en RD (2026)",
      ),
      ogTitle: loc(
        "Websites for Law Firms, Accountants & Relocation Services",
        "Páginas Web para Firmas Legales, Contables y de Reubicación",
      ),
      ogDescription: loc(
        "Your client is comparing three firms from another country before they call anyone. In professional services, the website is not marketing — it is the first consultation.",
        "Tu cliente compara tres firmas desde otro país antes de llamar a nadie. En servicios profesionales, la página web no es marketing — es la primera consulta.",
      ),
      keywords: {
        en: ["law firm website Dominican Republic", "immigration lawyer website", "accountant website DR", "relocation services website", "residency lawyer Dominican Republic"],
        es: ["página web firma legal República Dominicana", "página web abogado de inmigración", "página web contador RD", "página web servicios de reubicación", "abogado residencia República Dominicana"],
      },
    },
  }
]

// ─────────────────────────────────────────────────────────────────────────────
// Document builder
// ─────────────────────────────────────────────────────────────────────────────

const truncate = (text: string, max: number) =>
  text.length <= max ? text : `${text.slice(0, max - 1).trimEnd()}…`

/**
 * schema.org Article JSON-LD string, matching the convention of existing
 * published posts. The "image" property is intentionally omitted — the main
 * image doesn't exist yet at seed time; add it in Studio if wanted.
 */
const articleJsonLd = (
  post: SeedPost,
  lang: "en" | "es",
  description: string,
) => {
  const slug = lang === "es" ? post.slugEs : post.slug
  const url = `${SITE_URL}/${lang}/blog/${slug}`
  const date = post.publishedAt.slice(0, 10)
  return JSON.stringify(
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "@id": url,
      mainEntityOfPage: url,
      headline: post.title[lang],
      description,
      author: { "@type": "Person", name: AUTHOR_NAME },
      publisher: {
        "@type": "Organization",
        name: "DR Web Studio",
        logo: { "@type": "ImageObject", url: PUBLISHER_LOGO },
      },
      datePublished: date,
      dateModified: date,
      inLanguage: lang,
    },
    null,
    2,
  )
}

function buildDoc(
  post: SeedPost,
  authorId: string,
  categoryIdsBySlug: Map<string, string>,
) {
  const categories = post.categories.map(slug => {
    const _ref = categoryIdsBySlug.get(slug)
    if (!_ref) {
      throw new Error(
        `Unknown category slug "${slug}" (post: ${post.slug}). Available: ${[...categoryIdsBySlug.keys()].join(", ")}`,
      )
    }
    return { _type: "reference" as const, _key: key(), _ref }
  })

  return {
    _id: `drafts.blogPost-${post.slug}`,
    _type: "blogPost" as const,
    title: post.title,
    description: post.description,
    readTime: post.readTime,
    featured: post.featured ?? false,
    tags: post.tags,
    slug: { _type: "slug" as const, current: post.slug },
    slugEs: { _type: "slug" as const, current: post.slugEs },
    author: { _type: "reference" as const, _ref: authorId },
    categories,
    publishedAt: post.publishedAt,
    // mainImage intentionally omitted — add it in Studio before publishing.
    body: post.body,
    seo: buildSeo(post),
  }
}

function buildSeo(post: SeedPost) {
  const metaEn = {
    title: post.seo?.metaTitle?.en ?? truncate(post.title.en, 60),
    description:
      post.seo?.metaDescription?.en ?? truncate(post.description.en, 160),
    keywords: post.seo?.keywords?.en ?? post.tags.en,
  }
  const metaEs = {
    title: post.seo?.metaTitle?.es ?? truncate(post.title.es, 60),
    description:
      post.seo?.metaDescription?.es ?? truncate(post.description.es, 160),
    keywords: post.seo?.keywords?.es ?? post.tags.es,
  }
  const ogEn = {
    title: post.seo?.ogTitle?.en ?? post.title.en,
    description: post.seo?.ogDescription?.en ?? metaEn.description,
  }
  const ogEs = {
    title: post.seo?.ogTitle?.es ?? post.title.es,
    description: post.seo?.ogDescription?.es ?? metaEs.description,
  }

  return {
    meta: { en: metaEn, es: metaEs },
    openGraph: { en: ogEn, es: ogEs },
    structuredData: {
      en: articleJsonLd(post, "en", ogEn.description),
      es: articleJsonLd(post, "es", ogEs.description),
    },
    noIndex: false,
    noFollow: false,
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Seed
// ─────────────────────────────────────────────────────────────────────────────

async function seed() {
  const replace = process.argv.includes("--replace")

  const authorId = await client.fetch<string | null>(
    `*[_type == "author" && slug.current == $slug][0]._id`,
    { slug: AUTHOR_SLUG },
  )
  if (!authorId) {
    throw new Error(
      `Author with slug "${AUTHOR_SLUG}" not found — create the author in Studio first.`,
    )
  }

  const categoryDocs = await client.fetch<{ slug: string; _id: string }[]>(
    `*[_type == "blogCategory"]{ "slug": slug.current, _id }`,
  )
  const categoryIdsBySlug = new Map(categoryDocs.map(c => [c.slug, c._id]))

  console.log(
    `Seeding ${posts.length} blog post draft(s) as ${replace ? "createOrReplace" : "createIfNotExists"}...`,
  )

  for (const post of posts) {
    try {
      const doc = buildDoc(post, authorId, categoryIdsBySlug)
      if (replace) {
        // Never wipe an image that was already added in Studio.
        const existing = await client.fetch<{ mainImage?: unknown } | null>(
          `*[_id == $id][0]{ mainImage }`,
          { id: doc._id },
        )
        await client.createOrReplace(
          existing?.mainImage ? { ...doc, mainImage: existing.mainImage } : doc,
        )
      } else {
        await client.createIfNotExists(doc)
      }
      console.log(`  ✓ Draft: ${post.slug}`)
    } catch (err) {
      console.error(`  ✗ Failed: ${post.slug}`, err)
    }
  }

  console.log(
    "\nDone. Drafts are invisible to the live site — open /studio, add each post's main image (EN/ES alt text), review, and Publish.",
  )
}

seed().catch(err => {
  console.error(err)
  process.exit(1)
})