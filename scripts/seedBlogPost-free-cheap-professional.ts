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
    slug: "free-vs-cheap-vs-professional-website",
    slugEs: "pagina-web-gratis-vs-barata-vs-profesional",
    title: loc(
      "Free vs. Cheap vs. Professional Website: What You Actually Get",
      "Página Web Gratis vs. Barata vs. Profesional: Qué Obtienes Realmente",
    ),
    description: loc(
      "Free, cheap, or professional website: what you actually get at each level, what the hidden costs are, and how to tell which one your Dominican business genuinely needs.",
      "Página web gratis, barata o profesional: qué obtienes realmente en cada nivel, cuáles son los costos ocultos y cómo saber cuál necesita de verdad tu negocio dominicano.",
    ),
    readTime: 9,
    featured: false,
    tags: {
      en: ["website cost", "cheap website", "free website", "professional web design", "value", "Dominican Republic"],
      es: ["costo página web", "página web barata", "página web gratis", "diseño web profesional", "valor", "República Dominicana"],
    },
    categories: ["web-design", "business-tips"],
    publishedAt: "2026-08-08T13:00:00.000Z",
    body: {
      en: [
        p("Every Dominican business owner shopping for a website meets three very different offers. There's free — a Wix trial, a Facebook page, a friend's nephew who \"does websites.\" There's cheap — RD$15,000 from someone who'll have it done by Friday. And there's professional — a real quote from a real developer, several times the cheap price, with a timeline measured in weeks. From the outside these look like the same product at three prices, which makes the cheapest option look like the obvious win. They are not the same product. Here's honestly what you get at each level, what each one really costs, and — importantly — when free or cheap is genuinely the right call."),
        h2("Level 1: Free"),
        rich("normal", [run("What you actually get. A subdomain address like `yourbusiness.wixsite.com/yourbusiness`, a template shared with thousands of others, the platform's advertising on your pages, limited or no ability to be found on Google, and no ownership of anything. Your business lives at an address you don't control, on a platform that can change its rules.")]),
        rich("normal", [run("What it really costs. The address itself is the first hidden cost — a subdomain tells every visitor you didn't invest in your own name, and in the Dominican market where trust is already the biggest hurdle for a small business, that impression is expensive. "), link("Stanford's long-running research on web credibility found that people judge how trustworthy an organization is substantially from how professional its site appears", "https://credibility.stanford.edu/guidelines/index.html"), run(", and a free-tier site with someone else's branding on it fails that test before a word is read. Second, the visibility: free tiers are typically limited in exactly the ways that matter for search, which means the thing your website exists to do — get found by new customers — doesn't happen. And third, the switching cost when you outgrow it, because there's usually no meaningful way to take your work with you.")]),
        rich("normal", [run("When it's genuinely right. Testing whether an idea has any customers at all. A hobby, a personal project, a temporary event. A business so new it hasn't chosen its name yet. If you have zero budget and need presence today, free beats nothing — just treat it as scaffolding, not a foundation, and buy your own domain immediately regardless of what else you do.")]),
        h2("Level 2: Cheap"),
        p("This is the level where most money gets wasted, so it deserves the most scrutiny."),
        rich("normal", [run("What you actually get. Usually a purchased theme installed with your logo and text dropped in, built quickly by someone whose economics depend on volume and speed. On the surface it can look fine — that's what makes it seductive. Underneath, the predictable pattern: slow loading (a heavy theme plus unoptimized images), a Spanish-only site or an auto-translate widget, no real SEO structure, generic stock imagery, no strategy behind the content, and — the big one — no relationship afterward. The developer's price didn't include being available in six months.")]),
        rich("normal", [run("What it really costs. Cheap sites fail in slow motion. The site is slow on mobile, so "), link("visitors leave and Google ranks it lower", "https://www.dr-webstudio.com/en/blog/core-web-vitals-como-la-velocidad-afecta-tus-ventas-online"), run(". It's not properly bilingual, so half the Dominican market can't find it. Nobody maintains it, so it "), link("decays and eventually breaks", "https://www.dr-webstudio.com/en/blog/website-maintenance-why-its-not-optional"), run(". Often the domain and hosting are registered in the developer's name, which becomes a serious problem the day you want to move — a trap we explain in "), link("what hosting and domains actually are", "https://www.dr-webstudio.com/en/blog/what-is-hosting-and-a-domain-explained-simply"), run(". And the real bill arrives eventually as a rebuild: paying twice, having lost a year or two of the rankings and customers a proper site would have been accumulating. Cheap isn't a smaller version of professional. It's frequently a slower route to the same expense.")]),
        rich("normal", [run("When it's genuinely right. Rarely, but not never. If you need something online this month, your budget is genuinely fixed and small, and you understand you're buying a temporary bridge — that's a legitimate, eyes-open decision. Just insist on two non-negotiables even at this level: your own domain, registered in your name, and your own hosting login. Those two things preserve your ability to move.")]),
        h2("Level 3: Professional"),
        rich("normal", [run("What you actually get. A site designed for your business rather than adapted from a template; built on a modern foundation that's fast on mobile by construction; genuinely bilingual with "), link("real separate pages per language", "https://www.dr-webstudio.com/en/blog/seo-bilingue-posicionarse-ingles-espanol-sin-perjudicar-ninguno"), run("; structured so Google can find and rank each service; integrated with WhatsApp, Google Maps, and local payment methods the way the Dominican market actually works; owned entirely by you; and supported after launch by someone who answers when something breaks.")]),
        rich("normal", [run("What it really costs. More money up front, and more of your time during the build — real briefing, real content decisions, real review. It's a project, not a purchase. But it's the only level where the website functions as an asset: something that appreciates through accumulated rankings and reviews, that you own outright, and that keeps producing customers for years without being rebuilt.")]),
        rich("normal", [run("When it's genuinely right. When customers find and judge you online; when you compete for tourists and locals in two languages; when the website is meant to generate business rather than merely exist. Which, for most established Dominican businesses, is the actual situation.")]),
        h2("The special case: the friend who \"does websites\""),
        rich("normal", [run("Almost every Dominican business gets this offer, and it deserves its own honest treatment because it's neither the scam nor the bargain people assume. Sometimes the nephew, neighbour, or cousin genuinely is a capable developer building a portfolio, and you get real work at a favour price — a great outcome. Far more often, they're capable of making a site appear and not much beyond that, and the real risk isn't the quality; it's what happens next. A favour has no contract, no timeline, and no obligation. When they get a full-time job, move abroad, or simply get busy, your website's updates stop, and you may find the domain sits in their personal account and the design lives in a tool only they can access. The awkwardness of chasing a relative for support is precisely why so many of these sites sit frozen for years. If you take this route — and there are good reasons to — treat it like a professional arrangement anyway: your domain in your name, your hosting login, a written scope, and an honest conversation about what happens when they're no longer available. Friendship and clear terms aren't in conflict; the terms are what protect the friendship.")]),
        h2("The comparison people don't make"),
        rich("normal", [run("Most owners compare the three prices. The more useful comparison is cost per year of useful life. A free site that gets replaced in six months and a cheap site rebuilt in eighteen months both have brutal annualized costs once you count the rebuild — and neither counts the customers that never arrived while you were invisible. A professional site amortized across five productive years, still ranking and still converting, often works out cheaper per year than the cheap one, and dramatically cheaper per customer acquired. The website industry's dirty secret is that the expensive option is frequently the economical one; it just doesn't feel that way at signing.")]),
        h2("How to tell the levels apart before you pay"),
        rich("normal", [run("Since \"professional\" isn't a protected word, judge by evidence, not adjectives. Ask to see three past sites and check them yourself: load them on your phone on mobile data and count the seconds; look for real English and Spanish versions rather than a translate button; see whether the designs look distinct from one another or like the same theme recolored. Then ask three questions: Will the domain and hosting be in my name, with credentials handed to me? What happens after launch, and who maintains it? How is the bilingual setup actually built? Clear, confident answers to those three separate the professionals from the volume shops far more reliably than price alone. A developer charging a professional price who can't answer them is the worst outcome available — the cost of level three with the substance of level two.")]),
        h2("Build once, properly"),
        rich("normal", [run("At "), link("DR Web Studio", "https://www.dr-webstudio.com/en"), run(" we're transparent about all of this because informed clients are better clients: landing pages from $400, full business websites from $950, and everything built fast, bilingual, and registered in your name — with the first year of maintenance included, so \"what happens after launch\" has a concrete answer before you sign. If you're weighing three quotes and can't tell what actually differs between them, "), link("contact us for a free consultation", "https://www.dr-webstudio.com/en/contact"), run(" — we'll walk you through what each is really offering, even if you end up choosing someone else.")]),
      ],
      es: [
        p("Todo dueño de negocio dominicano que busca una página web se encuentra con tres ofertas muy distintas. Está lo gratis — una prueba de Wix, una página de Facebook, el sobrino de un amigo que \"hace páginas web.\" Está lo barato — RD$15,000 de alguien que la tendrá lista el viernes. Y está lo profesional — una cotización real de un desarrollador real, varias veces el precio barato, con un cronograma medido en semanas. Desde afuera parecen el mismo producto a tres precios, lo que hace que la opción más barata parezca la ganadora obvia. No son el mismo producto. Aquí está honestamente lo que obtienes en cada nivel, lo que realmente cuesta cada uno, y — algo importante — cuándo lo gratis o lo barato es genuinamente la decisión correcta."),
        h2("Nivel 1: Gratis"),
        rich("normal", [run("Lo que realmente obtienes. Una dirección de subdominio como `tunegocio.wixsite.com/tunegocio`, una plantilla compartida con miles de otros, la publicidad de la plataforma en tus páginas, capacidad limitada o nula de ser encontrado en Google, y ninguna propiedad sobre nada. Tu negocio vive en una dirección que no controlas, sobre una plataforma que puede cambiar sus reglas.")]),
        rich("normal", [run("Lo que realmente cuesta. La dirección misma es el primer costo oculto — un subdominio le dice a cada visitante que no invertiste en tu propio nombre, y en el mercado dominicano donde la confianza ya es el obstáculo más grande para un negocio pequeño, esa impresión es cara. "), link("La investigación de larga data de Stanford sobre credibilidad web encontró que la gente juzga cuán confiable es una organización sustancialmente por cuán profesional se ve su sitio", "https://credibility.stanford.edu/guidelines/index.html"), run(", y un sitio de nivel gratuito con la marca de otro encima falla esa prueba antes de que se lea una palabra. Segundo, la visibilidad: los niveles gratis típicamente están limitados exactamente en las formas que importan para la búsqueda, lo que significa que aquello para lo que existe tu página web — ser encontrado por clientes nuevos — no ocurre. Y tercero, el costo de cambiar cuando lo superes, porque usualmente no hay forma significativa de llevarte tu trabajo.")]),
        rich("normal", [run("Cuándo es genuinamente correcto. Probar si una idea tiene clientes siquiera. Un pasatiempo, un proyecto personal, un evento temporal. Un negocio tan nuevo que ni ha elegido su nombre. Si tienes cero presupuesto y necesitas presencia hoy, gratis le gana a nada — solo trátalo como andamio, no como cimiento, y compra tu propio dominio de inmediato sin importar qué más hagas.")]),
        h2("Nivel 2: Barato"),
        p("Este es el nivel donde más dinero se desperdicia, así que merece el mayor escrutinio."),
        rich("normal", [run("Lo que realmente obtienes. Usualmente un tema comprado, instalado con tu logo y tu texto encima, construido rápido por alguien cuya economía depende del volumen y la velocidad. En la superficie puede verse bien — eso es lo que lo hace seductor. Debajo, el patrón predecible: carga lenta (un tema pesado más imágenes sin optimizar), un sitio solo en español o un widget de traducción automática, ninguna estructura SEO real, imágenes de banco genéricas, ninguna estrategia detrás del contenido, y — la grande — ninguna relación después. El precio del desarrollador no incluía estar disponible en seis meses.")]),
        rich("normal", [run("Lo que realmente cuesta. Los sitios baratos fallan en cámara lenta. El sitio es lento en móvil, así que "), link("los visitantes se van y Google lo posiciona más abajo", "https://www.dr-webstudio.com/es/blog/core-web-vitals-como-la-velocidad-afecta-tus-ventas-online"), run(". No es correctamente bilingüe, así que la mitad del mercado dominicano no puede encontrarlo. Nadie lo mantiene, así que "), link("decae y eventualmente se rompe", "https://www.dr-webstudio.com/es/blog/mantenimiento-web-por-que-no-es-opcional"), run(". Muchas veces el dominio y el hosting están registrados a nombre del desarrollador, lo que se vuelve un problema serio el día que quieras mudarte — una trampa que explicamos en "), link("qué son realmente el hosting y los dominios", "https://www.dr-webstudio.com/es/blog/que-es-el-hosting-y-un-dominio-explicado-simple"), run(". Y la factura real llega eventualmente como una reconstrucción: pagar dos veces, habiendo perdido un año o dos del posicionamiento y los clientes que un sitio adecuado habría estado acumulando. Lo barato no es una versión más pequeña de lo profesional. Frecuentemente es una ruta más lenta hacia el mismo gasto.")]),
        rich("normal", [run("Cuándo es genuinamente correcto. Rara vez, pero no nunca. Si necesitas algo en línea este mes, tu presupuesto es genuinamente fijo y pequeño, y entiendes que estás comprando un puente temporal — esa es una decisión legítima y con los ojos abiertos. Solo insiste en dos innegociables incluso en este nivel: tu propio dominio, registrado a tu nombre, y tu propio acceso al hosting. Esas dos cosas preservan tu capacidad de mudarte.")]),
        h2("Nivel 3: Profesional"),
        rich("normal", [run("Lo que realmente obtienes. Un sitio diseñado para tu negocio en vez de adaptado de una plantilla; construido sobre una base moderna que es rápida en móvil por construcción; genuinamente bilingüe con "), link("páginas separadas reales por idioma", "https://www.dr-webstudio.com/es/blog/seo-bilingue-posicionarse-ingles-espanol-sin-perjudicar-ninguno"), run("; estructurado para que Google pueda encontrar y posicionar cada servicio; integrado con WhatsApp, Google Maps y métodos de pago locales tal como funciona realmente el mercado dominicano; propiedad enteramente tuya; y respaldado tras el lanzamiento por alguien que responde cuando algo se rompe.")]),
        rich("normal", [run("Lo que realmente cuesta. Más dinero por adelantado, y más de tu tiempo durante la construcción — un briefing real, decisiones reales de contenido, revisión real. Es un proyecto, no una compra. Pero es el único nivel donde la página web funciona como un activo: algo que se aprecia a través del posicionamiento y las reseñas acumuladas, del que eres dueño por completo, y que sigue produciendo clientes por años sin ser reconstruido.")]),
        rich("normal", [run("Cuándo es genuinamente correcto. Cuando los clientes te encuentran y te juzgan en línea; cuando compites por turistas y locales en dos idiomas; cuando la página web debe generar negocio en vez de meramente existir. Que, para la mayoría de los negocios dominicanos establecidos, es la situación real.")]),
        h2("El caso especial: el amigo que \"hace páginas web\""),
        rich("normal", [run("Casi todo negocio dominicano recibe esta oferta, y merece su propio tratamiento honesto porque no es ni la estafa ni la ganga que la gente asume. A veces el sobrino, vecino o primo genuinamente es un desarrollador capaz construyendo un portafolio, y obtienes trabajo real a precio de favor — un resultado excelente. Mucho más seguido, son capaces de hacer que aparezca un sitio y no mucho más, y el riesgo real no es la calidad; es lo que pasa después. Un favor no tiene contrato, ni cronograma, ni obligación. Cuando consiguen un trabajo de tiempo completo, se van del país, o simplemente se ocupan, las actualizaciones de tu página web se detienen, y puedes descubrir que el dominio está en su cuenta personal y el diseño vive en una herramienta a la que solo ellos tienen acceso. La incomodidad de perseguir a un familiar por soporte es precisamente por qué tantos de estos sitios quedan congelados por años. Si tomas esta ruta — y hay buenas razones para hacerlo — trátala como un arreglo profesional de todos modos: tu dominio a tu nombre, tu acceso al hosting, un alcance por escrito, y una conversación honesta sobre qué pasa cuando ya no estén disponibles. La amistad y los términos claros no están en conflicto; los términos son lo que protege la amistad.")]),
        h2("La comparación que la gente no hace"),
        rich("normal", [run("La mayoría de los dueños compara los tres precios. La comparación más útil es el costo por año de vida útil. Un sitio gratis que se reemplaza en seis meses y uno barato reconstruido en dieciocho meses ambos tienen costos anualizados brutales una vez que cuentas la reconstrucción — y ninguno cuenta los clientes que nunca llegaron mientras eras invisible. Un sitio profesional amortizado a lo largo de cinco años productivos, todavía posicionando y todavía convirtiendo, muchas veces resulta más barato por año que el barato, y dramáticamente más barato por cliente adquirido. El secreto sucio de la industria web es que la opción cara frecuentemente es la económica; solo que no se siente así al firmar.")]),
        h2("Cómo distinguir los niveles antes de pagar"),
        rich("normal", [run("Como \"profesional\" no es una palabra protegida, juzga por evidencia, no por adjetivos. Pide ver tres sitios anteriores y revísalos tú mismo: cárgalos en tu teléfono con datos móviles y cuenta los segundos; busca versiones reales en inglés y español en vez de un botón de traducción; mira si los diseños se ven distintos entre sí o como el mismo tema con otros colores. Luego haz tres preguntas: ¿El dominio y el hosting estarán a mi nombre, con las credenciales entregadas a mí? ¿Qué pasa después del lanzamiento, y quién lo mantiene? ¿Cómo está construida realmente la configuración bilingüe? Respuestas claras y seguras a esas tres separan a los profesionales de los talleres de volumen mucho más confiablemente que el precio solo. Un desarrollador que cobra precio profesional y no puede responderlas es el peor resultado disponible — el costo del nivel tres con la sustancia del nivel dos.")]),
        h2("Construye una vez, bien"),
        rich("normal", [run("En "), link("DR Web Studio", "https://www.dr-webstudio.com/es"), run(" somos transparentes sobre todo esto porque los clientes informados son mejores clientes: landing pages desde $400, sitios web de negocio completos desde $950, y todo construido rápido, bilingüe y registrado a tu nombre — con el primer año de mantenimiento incluido, para que \"qué pasa después del lanzamiento\" tenga una respuesta concreta antes de que firmes. Si estás pesando tres cotizaciones y no puedes distinguir qué difiere realmente entre ellas, "), link("contáctanos para una consulta gratuita", "https://www.dr-webstudio.com/es/contacto"), run(" — te explicamos qué está ofreciendo cada una en realidad, incluso si terminas eligiendo a alguien más.")]),
      ],
    },
    seo: {
      metaTitle: loc(
        "Free vs. Cheap vs. Professional Websites (2026)",
        "Web Gratis vs. Barata vs. Profesional (2026)",
      ),
      ogTitle: loc(
        "Free vs. Cheap vs. Professional: What You Actually Get",
        "Gratis vs. Barata vs. Profesional: Qué Obtienes Realmente",
      ),
      ogDescription: loc(
        "Free costs you the domain and the credibility. Cheap costs you the rebuild. Professional costs money up front. An honest breakdown of all three, including when free is right.",
        "Lo gratis te cuesta el dominio y la credibilidad. Lo barato te cuesta la reconstrucción. Lo profesional cuesta por adelantado. Un desglose honesto de los tres.",
      ),
      keywords: {
        en: ["cheap website dominican republic", "free website builder", "professional website cost", "is a cheap website worth it", "website price comparison"],
        es: ["página web barata república dominicana", "constructor de páginas gratis", "costo página web profesional", "vale la pena una página web barata", "comparación precios página web"],
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