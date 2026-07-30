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
    slug: "wix-squarespace-templates-vs-custom-website",
    slugEs: "plantillas-wix-squarespace-vs-pagina-web-a-medida",
    title: loc(
      "Wix, Squarespace & Templates vs. a Custom Website: The Honest Comparison",
      "Wix, Squarespace y Plantillas vs. Página Web a Medida: La Comparación Honesta",
    ),
    description: loc(
      "Wix, Squarespace, and templates vs. a custom-built website: the honest comparison for Dominican businesses — costs over time, speed, bilingual SEO, and when each wins.",
      "Wix, Squarespace y plantillas vs. una página web a medida: la comparación honesta para negocios dominicanos — costos en el tiempo, velocidad, SEO bilingüe y cuándo gana cada una.",
    ),
    readTime: 9,
    featured: false,
    tags: {
      en: ["Wix", "Squarespace", "templates", "custom website", "website builder", "web design", "costs", "Dominican Republic"],
      es: ["Wix", "Squarespace", "plantillas", "página web a medida", "constructor de páginas", "diseño web", "costos", "República Dominicana"],
    },
    categories: ["web-design", "business-tips"],
    publishedAt: "2026-07-16T13:00:00.000Z",
    body: {
      en: [
        p("Every Dominican business owner researching a website meets the same fork in the road within five minutes: the ads promise you can build it yourself on Wix or Squarespace tonight for a few dollars a month, while a developer quotes a real project with a real price. One of these has to be a ripoff, right? Not exactly. Website builders and custom-built sites are both legitimate tools — but they're built for different situations, and the marketing on both sides obscures where the line actually falls. Here's the honest comparison, with the trade-offs the sales pages don't mention, so you can tell which side of the line your business is on."),
        h2("What the builders genuinely do well"),
        rich("normal", [run("Credit where it's due: Wix, Squarespace, and their peers solved a real problem. They let a non-technical person get something online in a weekend — drag, drop, publish — for a monthly subscription. The templates look clean out of the box, hosting is bundled in, and for certain situations that's genuinely enough. A hobby project, a personal page, an idea you want to test before investing anything, a business so early it doesn't yet know what it sells — these are cases where a builder is the rational choice, and a developer who tells you otherwise is selling, not advising. The question was never whether builders work. It's what you give up in exchange for the convenience, and when those trade-offs start costing more than the subscription.")]),
        h2("Trade-off 1: The speed ceiling"),
        rich("normal", [run("Builders carry every feature every customer might ever want, loaded on every page — which makes them structurally heavy. You can optimize a template site, but you can't make it truly fast, because the bloat is the platform. In most markets that's an annoyance; in the Dominican Republic it's a business problem, because your customers are overwhelmingly on phones, often on mobile data, and "), link("speed converts directly into sales", "https://www.dr-webstudio.com/en/blog/core-web-vitals-como-la-velocidad-afecta-tus-ventas-online"), run(" — both through Google's rankings, which favor fast sites, and through visitors who simply leave when a page hesitates. A custom-built site using a modern framework carries only what it needs, which is why the same design can load in a fraction of the time. On a slow connection, that difference isn't cosmetic; it's the difference between a customer and a bounce.")]),
        h2("Trade-off 2: The credibility problem you can't see"),
        rich("normal", [run("Here's the trade-off almost nobody prices in: templates look like templates. Your customers may not consciously recognize the theme, but they've seen its cousins a hundred times, and sameness reads as generic. This matters more than it feels like it should, because design is credibility online — "), link("Stanford's research on web credibility found that people judge how trustworthy a business is largely from how professional its site looks", "https://credibility.stanford.edu/guidelines/index.html"), run(". A template puts a hard ceiling on that judgment: you can look tidy, but you can't look distinctive, and for a business competing on trust — a hotel, a clinic, a real estate agency, anyone selling something that costs real money — \"tidy but generic\" quietly costs conversions every single day.")]),
        h2("Trade-off 3: The bilingual wall"),
        rich("normal", [run("This is the trade-off that matters most in the Dominican market specifically. A serious business here needs to sell in Spanish and English — to locals, tourists, expats, and the diaspora — and builders handle this badly. Their multilingual support typically ranges from clumsy add-ons to automatic translation widgets, and neither produces what actually works: separate, real, indexed pages per language that Google can rank independently, with correct signals about which page serves which audience. We've written about "), link("why real bilingual SEO requires proper architecture", "https://www.dr-webstudio.com/en/blog/seo-bilingue-posicionarse-ingles-espanol-sin-perjudicar-ninguno"), run(" — and that architecture is precisely what template platforms make difficult or impossible. For a Dominican business, this isn't an edge case. It's half your market.")]),
        h2("Trade-off 4: The integrations that matter here"),
        rich("normal", [run("A Dominican business site lives or dies on local plumbing: WhatsApp as the primary contact channel, Google Maps for the physical location, Instagram for the social proof, and local payment options for actually getting paid — the stack we cover in "), link("connecting your website to WhatsApp, Maps, and Instagram", "https://www.dr-webstudio.com/en/blog/how-to-connect-website-whatsapp-google-maps-instagram"), run(" and "), link("accepting online payments in the DR", "https://www.dr-webstudio.com/en/blog/how-to-accept-online-payments-dominican-republic"), run(". Builders offer generic versions of some of this, but they're designed for the U.S. market's tools and assumptions. Getting Dominican payment processors, proper WhatsApp flows, and local business practices working smoothly on a closed platform ranges from awkward to impossible — while on a custom build they're simply requirements, implemented directly.")]),
        h2("Trade-off 5: The math over time"),
        p("The builder's price is a subscription; the custom site's price is a project. Comparing them honestly means comparing them over years, not months. A builder at $20–40 per month (business tiers, apps, and transaction fees push most real businesses toward the upper end and beyond) runs $240–500 every year, forever, while you still don't own the platform — stop paying and the site vanishes, and you can never take it with you. A custom site is a larger one-time investment that you own outright, hosted anywhere, improvable by any developer, no rent due. Somewhere between year two and year three the lines cross for most businesses — and that's before counting the revenue side of the ledger: the conversions the faster, more credible, properly bilingual site was winning the whole time. The builder is cheaper the way renting a market stall is cheaper than owning a shop."),
        h2("When each one honestly wins"),
        rich("normal", [run("So, plainly. Choose a builder when: you're testing an unproven idea, the budget is genuinely zero, the site is temporary or personal, or you just need a simple one-page presence this week and you accept its ceiling knowingly. Choose custom when: the website is how customers find and judge your business; you need to compete in Spanish and English; your market is mobile-first and your competitors' sites are slow; you need WhatsApp, local payments, and Maps working properly; or you're building a long-term asset rather than renting a presence. The line, in one sentence: a builder is for having a website; a custom build is for winning customers with one.")]),
        h2("An honest word about bad custom work"),
        p("Fairness cuts both ways: a custom site built badly is worse than a good template. The Dominican market has its share of \"developers\" who hand over a slow WordPress install with a purchased theme — technically custom, practically a template with extra steps — and disappear. If you're going the custom route, hold the work to the standard that justifies it: ask to see real performance scores on the developer's past sites, ask exactly how the bilingual architecture works, ask what happens after launch and who maintains it. A custom build is only worth its price when it delivers the speed, the SEO structure, and the local integrations the builders can't — so demand evidence of all three before you sign."),
        h2("The exit problem nobody mentions at signup"),
        rich("normal", [run("One more trade-off deserves its own section because it only becomes visible years later: leaving a builder is hard by design. Your content, your design, and your accumulated SEO live inside a closed platform that offers no real export — when you outgrow Wix or Squarespace, you don't migrate your site, you rebuild it from zero somewhere else, and then you have to fight to preserve the Google rankings your old URLs earned. Businesses discover this at the worst moment: right when they're successful enough to need something better, they learn the last three years of work are locked in a building they can't move out of intact. It's worth knowing before you sign up that the subscription's true price includes the exit. If you're already in that position, the escape is a careful migration — preserving URLs, redirects, and content the way we handle it in our "), link("website migrations and rebuilds service", "https://www.dr-webstudio.com/en/our-services/website-migrations-or-rebuilds"), run(" — and it's very doable, but it's a project you can avoid entirely by choosing the ownable asset the first time.")]),
        h2("Get the real thing, built for this market"),
        rich("normal", [run("At "), link("DR Web Studio", "https://www.dr-webstudio.com/en"), run(" we build the custom side of this comparison the way it should be built: modern, genuinely fast sites with real bilingual architecture, WhatsApp and local payments integrated, that you own outright — with the first year of maintenance included so \"what happens after launch\" has an answer from day one. If you're standing at the fork between a template subscription and a real build, "), link("contact us for a free consultation", "https://www.dr-webstudio.com/en/contact"), run(" — we'll tell you honestly which side of the line your business is on, even if the answer is that a builder is enough for now.")]),
      ],
      es: [
        p("Todo dueño de negocio dominicano que investiga una página web se encuentra con la misma bifurcación en cinco minutos: los anuncios prometen que puedes construirla tú mismo en Wix o Squarespace esta noche por unos dólares al mes, mientras un desarrollador cotiza un proyecto real con un precio real. Uno de los dos tiene que ser un engaño, ¿verdad? No exactamente. Los constructores de páginas web y los sitios hechos a medida son herramientas legítimas ambos — pero están construidos para situaciones distintas, y el marketing de ambos lados oscurece dónde cae realmente la línea. Aquí está la comparación honesta, con las concesiones que las páginas de venta no mencionan, para que puedas saber de qué lado de la línea está tu negocio."),
        h2("Lo que los constructores hacen genuinamente bien"),
        rich("normal", [run("Crédito donde se debe: Wix, Squarespace y sus pares resolvieron un problema real. Le permiten a una persona no técnica poner algo en línea en un fin de semana — arrastrar, soltar, publicar — por una suscripción mensual. Las plantillas se ven limpias de fábrica, el hosting viene incluido, y para ciertas situaciones eso es genuinamente suficiente. Un proyecto de pasatiempo, una página personal, una idea que quieres probar antes de invertir, un negocio tan temprano que aún no sabe qué vende — estos son casos donde un constructor es la elección racional, y un desarrollador que te dice lo contrario está vendiendo, no asesorando. La pregunta nunca fue si los constructores funcionan. Es qué cedes a cambio de la conveniencia, y cuándo esas concesiones empiezan a costar más que la suscripción.")]),
        h2("Concesión 1: El techo de velocidad"),
        rich("normal", [run("Los constructores cargan cada función que cualquier cliente podría querer, en cada página — lo que los hace estructuralmente pesados. Puedes optimizar un sitio de plantilla, pero no puedes hacerlo verdaderamente rápido, porque el sobrepeso es la plataforma. En la mayoría de los mercados eso es una molestia; en República Dominicana es un problema de negocio, porque tus clientes están abrumadoramente en teléfonos, muchas veces con datos móviles, y "), link("la velocidad se convierte directamente en ventas", "https://www.dr-webstudio.com/es/blog/core-web-vitals-como-la-velocidad-afecta-tus-ventas-online"), run(" — tanto a través del posicionamiento de Google, que favorece los sitios rápidos, como de los visitantes que simplemente se van cuando una página titubea. Un sitio hecho a medida con un framework moderno carga solo lo que necesita, y por eso el mismo diseño puede cargar en una fracción del tiempo. En una conexión lenta, esa diferencia no es cosmética; es la diferencia entre un cliente y un rebote.")]),
        h2("Concesión 2: El problema de credibilidad que no puedes ver"),
        rich("normal", [run("Aquí está la concesión que casi nadie pone en el precio: las plantillas se ven como plantillas. Puede que tus clientes no reconozcan conscientemente el tema, pero han visto a sus primos cien veces, y lo genérico se lee como genérico. Esto importa más de lo que parece, porque el diseño es la credibilidad en línea — "), link("la investigación de Stanford sobre credibilidad web encontró que la gente juzga cuán confiable es un negocio en gran parte por cuán profesional se ve su sitio", "https://credibility.stanford.edu/guidelines/index.html"), run(". Una plantilla le pone un techo duro a ese juicio: puedes verte ordenado, pero no puedes verte distintivo, y para un negocio que compite en confianza — un hotel, una clínica, una inmobiliaria, cualquiera que venda algo que cuesta dinero real — \"ordenado pero genérico\" cuesta conversiones silenciosamente todos los días.")]),
        h2("Concesión 3: El muro bilingüe"),
        rich("normal", [run("Esta es la concesión que más importa en el mercado dominicano específicamente. Un negocio serio aquí necesita vender en español e inglés — a locales, turistas, expatriados y la diáspora — y los constructores manejan esto mal. Su soporte multilingüe típicamente va de complementos torpes a widgets de traducción automática, y ninguno produce lo que realmente funciona: páginas separadas, reales e indexadas por idioma que Google pueda posicionar independientemente, con las señales correctas sobre qué página sirve a qué audiencia. Hemos escrito sobre "), link("por qué el SEO bilingüe real requiere una arquitectura adecuada", "https://www.dr-webstudio.com/es/blog/seo-bilingue-posicionarse-ingles-espanol-sin-perjudicar-ninguno"), run(" — y esa arquitectura es precisamente lo que las plataformas de plantillas hacen difícil o imposible. Para un negocio dominicano, esto no es un caso raro. Es la mitad de tu mercado.")]),
        h2("Concesión 4: Las integraciones que importan aquí"),
        rich("normal", [run("Un sitio de negocio dominicano vive o muere por la plomería local: WhatsApp como canal de contacto principal, Google Maps para la ubicación física, Instagram para la prueba social, y opciones de pago locales para realmente cobrar — el conjunto que cubrimos en "), link("conectar tu sitio con WhatsApp, Maps e Instagram", "https://www.dr-webstudio.com/es/blog/como-conectar-sitio-web-whatsapp-google-maps-instagram"), run(" y "), link("aceptar pagos en línea en RD", "https://www.dr-webstudio.com/es/blog/como-aceptar-pagos-en-linea-republica-dominicana"), run(". Los constructores ofrecen versiones genéricas de algo de esto, pero están diseñados para las herramientas y suposiciones del mercado estadounidense. Lograr que los procesadores de pago dominicanos, los flujos adecuados de WhatsApp y las prácticas de negocio locales funcionen suavemente en una plataforma cerrada va de incómodo a imposible — mientras que en una construcción a medida son simplemente requisitos, implementados directamente.")]),
        h2("Concesión 5: La matemática en el tiempo"),
        p("El precio del constructor es una suscripción; el precio del sitio a medida es un proyecto. Compararlos honestamente significa compararlos en años, no en meses. Un constructor a $20–40 por mes (los planes de negocio, las apps y las comisiones por transacción empujan a la mayoría de los negocios reales hacia el extremo superior y más allá) corre $240–500 cada año, para siempre, mientras sigues sin ser dueño de la plataforma — deja de pagar y el sitio desaparece, y nunca puedes llevártelo. Un sitio a medida es una inversión única más grande de la que eres dueño por completo, alojada donde quieras, mejorable por cualquier desarrollador, sin renta que pagar. En algún punto entre el año dos y el año tres las líneas se cruzan para la mayoría de los negocios — y eso antes de contar el lado de los ingresos: las conversiones que el sitio más rápido, más creíble y correctamente bilingüe estuvo ganando todo ese tiempo. El constructor es más barato como alquilar un puesto de mercado es más barato que ser dueño de la tienda."),
        h2("Cuándo gana honestamente cada uno"),
        rich("normal", [run("Así que, en claro. Elige un constructor cuando: estás probando una idea sin comprobar, el presupuesto es genuinamente cero, el sitio es temporal o personal, o solo necesitas una presencia simple de una página esta semana y aceptas su techo a sabiendas. Elige a medida cuando: la página web es cómo los clientes encuentran y juzgan tu negocio; necesitas competir en español e inglés; tu mercado es mobile-first y los sitios de tus competidores son lentos; necesitas WhatsApp, pagos locales y Maps funcionando bien; o estás construyendo un activo de largo plazo en vez de alquilar una presencia. La línea, en una oración: un constructor es para tener una página web; una construcción a medida es para ganar clientes con ella.")]),
        h2("Una palabra honesta sobre el mal trabajo a medida"),
        p("La justicia corta en ambas direcciones: un sitio a medida mal construido es peor que una buena plantilla. El mercado dominicano tiene su cuota de \"desarrolladores\" que entregan un WordPress lento con un tema comprado — técnicamente a medida, prácticamente una plantilla con pasos extra — y desaparecen. Si vas por la ruta a medida, exige el estándar que la justifica: pide ver puntuaciones de rendimiento reales de los sitios anteriores del desarrollador, pregunta exactamente cómo funciona la arquitectura bilingüe, pregunta qué pasa después del lanzamiento y quién lo mantiene. Una construcción a medida solo vale su precio cuando entrega la velocidad, la estructura SEO y las integraciones locales que los constructores no pueden — así que exige evidencia de las tres antes de firmar."),
        h2("El problema de salida que nadie menciona al registrarse"),
        rich("normal", [run("Una concesión más merece su propia sección porque solo se vuelve visible años después: salir de un constructor es difícil por diseño. Tu contenido, tu diseño y tu SEO acumulado viven dentro de una plataforma cerrada que no ofrece exportación real — cuando superas a Wix o Squarespace, no migras tu sitio, lo reconstruyes desde cero en otro lugar, y luego tienes que pelear por preservar el posicionamiento de Google que tus URLs viejas ganaron. Los negocios descubren esto en el peor momento: justo cuando son lo bastante exitosos para necesitar algo mejor, aprenden que los últimos tres años de trabajo están encerrados en un edificio del que no pueden mudarse intactos. Vale la pena saber antes de registrarse que el precio verdadero de la suscripción incluye la salida. Si ya estás en esa posición, el escape es una migración cuidadosa — preservando URLs, redirecciones y contenido como lo manejamos en nuestro "), link("servicio de migraciones y reconstrucciones de sitios web", "https://www.dr-webstudio.com/es/nuestros-servicios/migraciones-y-reconstrucciones-de-sitios-web"), run(" — y es muy factible, pero es un proyecto que puedes evitar por completo eligiendo el activo propio desde la primera vez.")]),
        h2("Consigue lo real, construido para este mercado"),
        rich("normal", [run("En "), link("DR Web Studio", "https://www.dr-webstudio.com/es"), run(" construimos el lado a medida de esta comparación como debe construirse: sitios modernos y genuinamente rápidos con arquitectura bilingüe real, WhatsApp y pagos locales integrados, de los que eres dueño por completo — con el primer año de mantenimiento incluido para que \"qué pasa después del lanzamiento\" tenga respuesta desde el día uno. Si estás parado en la bifurcación entre una suscripción de plantilla y una construcción real, "), link("contáctanos para una consulta gratuita", "https://www.dr-webstudio.com/es/contacto"), run(" — te diremos honestamente de qué lado de la línea está tu negocio, incluso si la respuesta es que un constructor te basta por ahora.")]),
      ],
    },
    seo: {
      metaTitle: loc(
        "Wix & Templates vs. Custom Website (2026)",
        "Wix y Plantillas vs. Web a Medida (2026)",
      ),
      ogTitle: loc(
        "Templates vs. Custom: The Honest Comparison",
        "Plantillas vs. A Medida: La Comparación Honesta",
      ),
      ogDescription: loc(
        "The template looks cheaper — until you add up the monthly fees, the speed ceiling, and the bilingual limits. When a builder is enough, and when custom pays for itself.",
        "La plantilla parece más barata — hasta que sumas las cuotas mensuales, el techo de velocidad y los límites bilingües. Cuándo basta un builder y cuándo lo hecho a medida se paga solo.",
      ),
      keywords: {
        en: ["wix vs custom website", "squarespace vs web developer", "website builder vs custom", "template website problems", "custom website dominican republic"],
        es: ["wix vs página web a medida", "squarespace vs desarrollador web", "constructor vs página a medida", "problemas página web plantilla", "página web a medida república dominicana"],
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