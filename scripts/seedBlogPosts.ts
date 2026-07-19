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
const block = (
  style: "normal" | "h2" | "h3" | "h4" | "blockquote",
  text: string,
) => ({
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
      return {
        _type: "span" as const,
        _key: key(),
        marks: [_key],
        text: r.text,
      }
    }
    return { _type: "span" as const, _key: key(), marks: [], text: r.text }
  })
  return { _type: "block" as const, _key: key(), style, markDefs, children }
}

/** A bullet-style line. The schema's block set has no list type wired here, so
 *  we prefix a bullet glyph and render as a normal block. Safe everywhere. */
const bulletP = (text: string) => block("normal", `•  ${text}`)

type Localized = { en: string; es: string }
type Block = ReturnType<typeof block> | ReturnType<typeof rich>

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
    slug: "wedding-event-business-websites-punta-cana",
    slugEs: "paginas-web-para-bodas-y-eventos-punta-cana",
    title: loc(
      "Websites for Wedding & Event Businesses: What We Learned Building Four",
      "Páginas Web para Bodas y Eventos: Lo Que Aprendimos Construyendo Cuatro",
    ),
    description: loc(
      "Websites for wedding and event businesses in Punta Cana — what we learned building four of them, from photographers to venues to planners.",
      "Páginas web para bodas y eventos en Punta Cana — lo que aprendimos construyendo cuatro, de fotógrafos a venues a organizadoras.",
    ),
    readTime: 8,
    featured: false,
    tags: {
      en: [
        "weddings",
        "events",
        "destination weddings",
        "photography",
        "venues",
        "bilingual",
        "Punta Cana",
      ],
      es: [
        "bodas",
        "eventos",
        "bodas de destino",
        "fotografía",
        "venues",
        "bilingüe",
        "Punta Cana",
      ],
    },
    categories: ["web-design", "business-tips"],
    publishedAt: "2026-06-24T12:00:00.000Z",
    body: {
      en: [
        p(
          "Punta Cana is one of the destination-wedding capitals of the world, and behind every beach ceremony is an ecosystem of local businesses — planners, photographers, venues, decorators, caterers, officiants — competing for couples who plan everything from another country, sight unseen, on a phone. We've built websites for four businesses in this industry: an event planner, a wedding photographer, a venue platform, and a wedding-packages service. This article is what those four projects taught us about what actually works — not theory, but patterns that repeated across every build.",
        ),
        h2("Why wedding businesses live or die online"),
        p(
          "A destination couple can't drop by your office. Everything they will ever know about you before wiring a deposit comes from a screen: your website, your reviews, your Instagram, and the speed and warmth of your replies. That makes the wedding vertical the purest test of web quality in the whole tourism economy — there is no walk-in traffic to save a weak online presence. It also raises the stakes emotionally: couples are making one of the biggest purchases of their lives for a day that cannot be repeated, so their tolerance for anything that feels unprofessional, slow, or vague is effectively zero. Every lesson below flows from that reality.",
        ),
        h2("Lesson 1: The gallery is the product"),
        rich("normal", [
          run(
            "For a photographer, a venue, or a decorator, the couple isn't buying a service description — they're buying the pictures. When we built the site for ",
          ),
          link(
            "Punta Cana Photo Edition, a wedding photography studio",
            "https://www.dr-webstudio.com/en/blog/punta-cana-photo-edition-case-study-wedding-photography-punta-cana",
          ),
          run(
            ", the entire architecture served one goal: let the work sell itself, fast. That means real-wedding galleries organized the way couples browse (by venue, by style, by moment), images large enough to feel the day, and — the technical crux — aggressive optimization so a gallery of fifty photos still loads instantly on a phone in Toronto. Heavy, slow galleries are the single most common self-inflicted wound in this industry: the couple leaves before your best shot renders. The craft of having both beauty and speed is exactly what we detail in ",
          ),
          link(
            "image optimization for tourism websites",
            "https://www.dr-webstudio.com/en/blog/optimizacion-imagenes-sitios-web-turismo-fotos-alta-calidad-carga-rapida",
          ),
          run(", and nowhere does it matter more than here."),
        ]),
        h2("Lesson 2: Your couples are planning from another country"),
        rich("normal", [
          run(
            "The overwhelming majority of destination-wedding clients research in English — but not only English. Couples come from Quebec and France, from Germany, from Latin America, and each pair searches in its own language with its own phrases. Building ",
          ),
          link(
            "Punta Cana Proposal Packages, a proposal-planning platform that runs in nine languages",
            "https://www.dr-webstudio.com/en/blog/punta-cana-proposal-packages-case-study-9-language-platform",
          ),
          run(
            ", proved the point at scale: each language version ranks independently in its own market, and inquiries arrive from searches the Spanish or English site alone would never have touched. Most wedding businesses don't need nine languages — but genuinely bilingual is the floor, built properly so ",
          ),
          link(
            "each language ranks without cannibalizing the other",
            "https://www.dr-webstudio.com/en/blog/seo-bilingue-posicionarse-ingles-espanol-sin-perjudicar-ninguno",
          ),
          run(
            ", and a third language chosen from your actual inquiry data is often the highest-ROI expansion available.",
          ),
        ]),
        h2("Lesson 3: The inquiry is the conversion — treat it like one"),
        rich("normal", [
          run(
            "Wedding businesses obsess over traffic and neglect the moment that actually produces revenue: the inquiry. Two patterns from our builds matter here. First, the form should qualify, gently. Date, venue or location if known, approximate guest count, and how they found you — enough for you to reply with substance instead of twenty questions, but short enough that no one abandons it. Every additional required field costs you inquiries; every missing essential field costs you hours of back-and-forth. Second, WhatsApp beats email for speed, and speed wins bookings. Couples inquiry-blast several vendors at once, and the first professional, warm reply frequently frames the whole comparison. A one-tap ",
          ),
          link(
            "WhatsApp path from every page",
            "https://www.dr-webstudio.com/en/blog/how-to-connect-website-whatsapp-google-maps-instagram",
          ),
          run(
            " — alongside the form, not instead of it — captures the couples who want to talk now, and in this market that's most of them: ",
          ),
          link(
            "82% of Dominican online-buying households use WhatsApp",
            "https://paymentscmi.com/insights/comercio-electronico-republica-dominicana-datos-clave/",
          ),
          run(
            ", and international couples have long since adopted it for exactly this kind of planning.",
          ),
        ]),
        h2("Lesson 4: Proof beats promises, every time"),
        rich("normal", [
          run(
            "Wedding marketing drowns in the same adjectives — magical, unforgettable, bespoke — and couples have learned to scroll past all of them. What stops the scroll is proof. When we rebuilt the digital presence for ",
          ),
          link(
            "Sertuin Events, an event planner whose sales grew +150% after launch",
            "https://www.dr-webstudio.com/en/blog/sertuin-events-case-study-150-sales-growth-event-planner-punta-cana",
          ),
          run(
            ', the content strategy leaned on specifics: real weddings with real venues named, real couple testimonials with dates, real vendor collaborations. The same principle powers our venue and packages builds: transparent starting prices where the business model allows it, actual availability instead of "contact us to learn more," and reviews embedded from platforms couples already trust. Vagueness reads as risk; specificity reads as competence. It\'s the Stanford credibility finding applied to the highest-emotion purchase there is.',
          ),
        ]),
        h2("What every wedding and event website needs"),
        p("Across all four builds, the non-negotiable checklist converged:"),
        rich("normal", [
          run("•  "),
          run(
            "A gallery architecture that loads fast and is organized the way couples actually browse.",
          ),
        ]),
        rich("normal", [
          run("•  "),
          run(
            "Genuinely bilingual content minimum, with the third language chosen from inquiry data.",
          ),
        ]),
        rich("normal", [
          run("•  "),
          run(
            "A qualifying inquiry form plus one-tap WhatsApp on every page, with reply-time discipline behind it.",
          ),
        ]),
        rich("normal", [
          run("•  "),
          run(
            "Named proof everywhere — real weddings, dated testimonials, transparent pricing signals.",
          ),
        ]),
        rich("normal", [
          run("•  "),
          run(
            "Practical logistics content: legal requirements for marrying in the DR, best months, venue transport — the questions every couple Googles, which almost no local vendor answers, and which therefore rank remarkably fast.",
          ),
        ]),
        rich("normal", [
          run("•  "),
          run(
            "Mobile-first performance, because the entire journey happens on a phone — the revenue link is laid out in ",
          ),
          link(
            "how speed affects your sales",
            "https://www.dr-webstudio.com/en/blog/core-web-vitals-como-la-velocidad-afecta-tus-ventas-online",
          ),
          run("."),
        ]),
        rich("normal", [
          run(
            "That last content point deserves emphasis: the wedding businesses that publish honestly useful planning answers become the site couples land on before they've chosen any vendor — which quietly makes them the first vendor considered.",
          ),
        ]),
        h2("The inquiry calendar: build before engagement season"),
        rich("normal", [
          run(
            "Wedding businesses run on a longer clock than the rest of tourism, and the website should be planned around it. Couples typically book destination vendors twelve to eighteen months before the wedding date, and inquiry volume surges after engagement season — the December-to-February stretch when a large share of proposals happen. Work the math backward: a couple engaged in December starts vendor research in January and February, which means your site needs to be launched, indexed, and ranking before the holidays to capture that wave — and a gallery refreshed with this season's best weddings enters the surge with its strongest material. The same clock governs content: your \"best months to marry in Punta Cana\" and legal-requirements pages do their heaviest work in Q1, so they should be published and aging by autumn. Miss the cycle and you don't lose a month of business — you lose the cohort, because the couples who booked competitors in February won't be back. It's the sharpest version of the timing rule that runs through every tourism vertical: websites earn during the season they were built before. And because destination couples book so far ahead, this season's website investment compounds twice — it fills next year's calendar while its content and reviews are still accruing authority for the year after that.",
          ),
        ]),
        h2("What it costs"),
        rich("normal", [
          run(
            "A professional wedding-business website — fast galleries, bilingual pages, qualifying forms, WhatsApp integration — runs around US$950 in the Dominican market, with multilingual expansion around US$800 more and larger platforms (venue directories, package configurators) quoted as custom builds. Full context is in ",
          ),
          link(
            "what a website costs in the DR in 2026",
            "https://www.dr-webstudio.com/en/blog/cuanto-cuesta-pagina-web-republica-dominicana-2026",
          ),
          run(", and the safe commissioning process in our "),
          link(
            "step-by-step guide",
            "https://www.dr-webstudio.com/en/blog/steps-to-get-a-website-for-your-local-business",
          ),
          run(
            ". Against an average destination-wedding contract, the site pays for itself with a single booking it wins you — and it will be judged by couples spending far more than that.",
          ),
        ]),
        h2("Built by the studio that's already inside this industry"),
        rich("normal", [
          run("Four wedding-industry builds mean "),
          link("DR Web Studio", "https://www.dr-webstudio.com/en"),
          run(
            " doesn't start your project guessing — we start it knowing what converts a couple planning from three thousand kilometers away, because we've watched it happen across planners, photographers, venues, and packages. You can inspect the work in our ",
          ),
          link("portfolio", "https://www.dr-webstudio.com/en/portfolio"),
          run(
            " and the named results in the case studies above. If your wedding or event business is ready for a website that books couples instead of just impressing them, ",
          ),
          link(
            "contact us for a free consultation",
            "https://www.dr-webstudio.com/en/contact",
          ),
          run("."),
        ]),
      ],
      es: [
        p(
          "Punta Cana es una de las capitales mundiales de las bodas de destino, y detrás de cada ceremonia en la playa hay un ecosistema de negocios locales — organizadoras, fotógrafos, venues, decoradores, catering, oficiantes — compitiendo por parejas que planifican todo desde otro país, sin verlo en persona, desde un teléfono. Hemos construido páginas web para cuatro negocios de esta industria: una organizadora de eventos, un estudio de fotografía de bodas, una plataforma de venues y un servicio de paquetes de boda. Este artículo es lo que esos cuatro proyectos nos enseñaron sobre lo que realmente funciona — no teoría, sino patrones que se repitieron en cada construcción.",
        ),
        h2("Por qué los negocios de bodas viven o mueren en línea"),
        p(
          "Una pareja de destino no puede pasar por tu oficina. Todo lo que sabrán de ti antes de transferir un depósito viene de una pantalla: tu página web, tus reseñas, tu Instagram y la velocidad y calidez de tus respuestas. Eso convierte al vertical de bodas en la prueba más pura de calidad web de toda la economía turística — no hay tráfico de paso que salve una presencia débil en línea. También eleva lo emocional: las parejas están haciendo una de las compras más grandes de sus vidas para un día que no se puede repetir, así que su tolerancia a cualquier cosa que se sienta poco profesional, lenta o vaga es efectivamente cero. Cada lección de abajo fluye de esa realidad.",
        ),
        h2("Lección 1: La galería es el producto"),
        rich("normal", [
          run(
            "Para un fotógrafo, un venue o un decorador, la pareja no está comprando una descripción de servicio — está comprando las imágenes. Cuando construimos el sitio de ",
          ),
          link(
            "Punta Cana Photo Edition, un estudio de fotografía de bodas",
            "https://www.dr-webstudio.com/es/blog/punta-cana-photo-edition-caso-de-estudio-fotografia-bodas-punta-cana",
          ),
          run(
            ", toda la arquitectura sirvió a una meta: dejar que el trabajo se venda solo, rápido. Eso significa galerías de bodas reales organizadas como las parejas navegan (por venue, por estilo, por momento), imágenes lo bastante grandes para sentir el día, y — el punto técnico crucial — optimización agresiva para que una galería de cincuenta fotos siga cargando al instante en un teléfono en Toronto. Las galerías pesadas y lentas son la herida autoinfligida más común de esta industria: la pareja se va antes de que tu mejor toma se vea. El oficio de tener belleza y velocidad a la vez es exactamente lo que detallamos en ",
          ),
          link(
            "optimización de imágenes para sitios web de turismo",
            "https://www.dr-webstudio.com/es/blog/optimizacion-imagenes-sitios-web-turismo-fotos-alta-calidad-carga-rapida",
          ),
          run(", y en ningún lugar importa más que aquí."),
        ]),
        h2("Lección 2: Tus parejas planifican desde otro país"),
        rich("normal", [
          run(
            "La abrumadora mayoría de los clientes de bodas de destino investiga en inglés — pero no solo en inglés. Las parejas vienen de Quebec y Francia, de Alemania, de América Latina, y cada una busca en su propio idioma con sus propias frases. Construir ",
          ),
          link(
            "Punta Cana Proposal Packages, una plataforma de planificación de propuestas que funciona en nueve idiomas",
            "https://www.dr-webstudio.com/es/blog/punta-cana-proposal-packages-caso-de-estudio-plataforma-9-idiomas-propuestas",
          ),
          run(
            ", probó el punto a escala: cada versión de idioma se posiciona de forma independiente en su propio mercado, y las consultas llegan de búsquedas que el sitio en español o inglés solo jamás habría tocado. La mayoría de los negocios de bodas no necesita nueve idiomas — pero genuinamente bilingüe es el piso, construido correctamente para que ",
          ),
          link(
            "cada idioma se posicione sin canibalizar al otro",
            "https://www.dr-webstudio.com/es/blog/seo-bilingue-posicionarse-ingles-espanol-sin-perjudicar-ninguno",
          ),
          run(
            ", y un tercer idioma elegido de tus datos reales de consultas suele ser la expansión de mayor retorno disponible.",
          ),
        ]),
        h2("Lección 3: La consulta es la conversión — trátala como tal"),
        rich("normal", [
          run(
            "Los negocios de bodas se obsesionan con el tráfico y descuidan el momento que realmente produce ingresos: la consulta. Dos patrones de nuestras construcciones importan aquí. Primero, el formulario debe calificar, con suavidad. Fecha, venue o ubicación si se conoce, cantidad aproximada de invitados y cómo te encontraron — lo suficiente para que respondas con sustancia en vez de veinte preguntas, pero lo bastante corto para que nadie lo abandone. Cada campo obligatorio adicional te cuesta consultas; cada campo esencial ausente te cuesta horas de ida y vuelta. Segundo, WhatsApp le gana al correo en velocidad, y la velocidad gana reservas. Las parejas consultan a varios proveedores a la vez, y la primera respuesta profesional y cálida frecuentemente enmarca toda la comparación. Un camino de ",
          ),
          link(
            "WhatsApp de un toque desde cada página",
            "https://www.dr-webstudio.com/es/blog/como-conectar-sitio-web-whatsapp-google-maps-instagram",
          ),
          run(
            " — junto al formulario, no en su lugar — captura a las parejas que quieren hablar ahora, y en este mercado esas son la mayoría: ",
          ),
          link(
            "el 82% de los hogares dominicanos que compran en línea usa WhatsApp",
            "https://paymentscmi.com/insights/comercio-electronico-republica-dominicana-datos-clave/",
          ),
          run(
            ", y las parejas internacionales lo adoptaron hace tiempo para exactamente este tipo de planificación.",
          ),
        ]),
        h2("Lección 4: La prueba le gana a las promesas, siempre"),
        rich("normal", [
          run(
            "El marketing de bodas se ahoga en los mismos adjetivos — mágico, inolvidable, personalizado — y las parejas aprendieron a pasarlos de largo. Lo que detiene el scroll es la prueba. Cuando reconstruimos la presencia digital de ",
          ),
          link(
            "Sertuin Events, una organizadora de eventos cuyas ventas crecieron +150% tras el lanzamiento",
            "https://www.dr-webstudio.com/es/blog/sertuin-events-caso-de-estudio-150-crecimiento-ventas-organizadora-eventos-punta-cana",
          ),
          run(
            ', la estrategia de contenido se apoyó en lo específico: bodas reales con venues reales nombrados, testimonios reales de parejas con fecha, colaboraciones reales con proveedores. El mismo principio impulsa nuestras construcciones de venues y paquetes: precios de partida transparentes donde el modelo de negocio lo permite, disponibilidad real en vez de "contáctanos para saber más", y reseñas incrustadas de plataformas en las que las parejas ya confían. La vaguedad se lee como riesgo; la especificidad se lee como competencia. Es el hallazgo de credibilidad de Stanford aplicado a la compra de mayor emoción que existe.',
          ),
        ]),
        h2("Lo que toda página web de bodas y eventos necesita"),
        p(
          "A través de las cuatro construcciones, el checklist innegociable convergió:",
        ),
        rich("normal", [
          run("•  "),
          run(
            "Una arquitectura de galerías que carga rápido y está organizada como las parejas realmente navegan.",
          ),
        ]),
        rich("normal", [
          run("•  "),
          run(
            "Contenido genuinamente bilingüe como mínimo, con el tercer idioma elegido de los datos de consultas.",
          ),
        ]),
        rich("normal", [
          run("•  "),
          run(
            "Un formulario de consulta que califica más WhatsApp de un toque en cada página, con disciplina de tiempo de respuesta detrás.",
          ),
        ]),
        rich("normal", [
          run("•  "),
          run(
            "Prueba con nombre en todas partes — bodas reales, testimonios con fecha, señales transparentes de precio.",
          ),
        ]),
        rich("normal", [
          run("•  "),
          run(
            "Contenido de logística práctica: requisitos legales para casarse en RD, mejores meses, transporte a los venues — las preguntas que toda pareja googlea, que casi ningún proveedor local responde, y que por eso se posicionan notablemente rápido.",
          ),
        ]),
        rich("normal", [
          run("•  "),
          run(
            "Rendimiento mobile-first, porque todo el recorrido ocurre en un teléfono — el vínculo con los ingresos está en ",
          ),
          link(
            "cómo la velocidad afecta tus ventas",
            "https://www.dr-webstudio.com/es/blog/core-web-vitals-como-la-velocidad-afecta-tus-ventas-online",
          ),
          run("."),
        ]),
        rich("normal", [
          run(
            "Ese último punto de contenido merece énfasis: los negocios de bodas que publican respuestas de planificación honestamente útiles se convierten en el sitio donde las parejas aterrizan antes de elegir a cualquier proveedor — lo que silenciosamente los convierte en el primer proveedor considerado.",
          ),
        ]),
        h2("Cuánto cuesta"),
        rich("normal", [
          run(
            "Una página web profesional de negocio de bodas — galerías rápidas, páginas bilingües, formularios que califican, integración de WhatsApp — ronda los US$950 en el mercado dominicano, con la expansión multilingüe alrededor de US$800 más y las plataformas mayores (directorios de venues, configuradores de paquetes) cotizadas como construcciones a medida. El contexto completo está en ",
          ),
          link(
            "cuánto cuesta una página web en RD en 2026",
            "https://www.dr-webstudio.com/es/blog/cuanto-cuesta-pagina-web-republica-dominicana-2026",
          ),
          run(", y el proceso seguro para encargarla en nuestra "),
          link(
            "guía paso a paso",
            "https://www.dr-webstudio.com/es/blog/pasos-para-encargar-una-pagina-web-negocio-local",
          ),
          run(
            ". Contra un contrato promedio de boda de destino, el sitio se paga solo con una sola reserva que te gane — y lo juzgarán parejas que gastan mucho más que eso. Vale también recordar el calendario: las parejas reservan proveedores de destino doce a dieciocho meses antes de la fecha, y el volumen de consultas se dispara tras la temporada de compromisos de diciembre a febrero — así que el sitio debe estar lanzado, indexado y posicionado antes de las fiestas para capturar esa ola, con la galería refrescada con las mejores bodas de la temporada.",
          ),
        ]),
        h2("Construida por el estudio que ya está dentro de esta industria"),
        rich("normal", [
          run("Cuatro construcciones en la industria de bodas significan que "),
          link("DR Web Studio", "https://www.dr-webstudio.com/es"),
          run(
            " no empieza tu proyecto adivinando — lo empieza sabiendo qué convierte a una pareja que planifica desde tres mil kilómetros, porque lo hemos visto suceder con organizadoras, fotógrafos, venues y paquetes. Puedes inspeccionar el trabajo en nuestro ",
          ),
          link("portafolio", "https://www.dr-webstudio.com/es/portafolio"),
          run(
            " y los resultados con nombre en los casos de estudio de arriba. Si tu negocio de bodas o eventos está listo para una página web que reserve parejas en vez de solo impresionarlas, ",
          ),
          link(
            "contáctanos para una consulta gratuita",
            "https://www.dr-webstudio.com/es/contacto",
          ),
          run("."),
        ]),
      ],
    },
    seo: {
      metaTitle: loc(
        "Wedding Business Websites Punta Cana (2026)",
        "Páginas Web para Bodas Punta Cana (2026)",
      ),
      keywords: {
        en: [
          "wedding business website",
          "wedding photographer website Punta Cana",
          "event planner website",
          "wedding venue website Dominican Republic",
        ],
        es: [
          "página web para bodas",
          "página web fotógrafo de bodas Punta Cana",
          "página web organizadora de eventos",
          "diseño web bodas República Dominicana",
        ],
      },
    },
  },
  {
    slug: "websites-for-doctors-dentists-clinics-dominican-republic",
    slugEs: "paginas-web-para-medicos-dentistas-y-clinicas-rd",
    title: loc(
      "Websites for Doctors, Dentists & Clinics in the Dominican Republic",
      "Páginas Web para Médicos, Dentistas y Clínicas en RD",
    ),
    description: loc(
      "Websites for doctors, dentists and clinics in the Dominican Republic: trust, appointments, and the medical tourism opportunity in 2026.",
      "Páginas web para médicos, dentistas y clínicas en RD: confianza, citas y la oportunidad del turismo médico en 2026.",
    ),
    readTime: 8,
    featured: false,
    tags: {
      en: [
        "medical",
        "doctors",
        "dentists",
        "clinics",
        "medical tourism",
        "WhatsApp",
        "bilingual",
        "Dominican Republic",
      ],
      es: [
        "medicina",
        "médicos",
        "dentistas",
        "clínicas",
        "turismo médico",
        "WhatsApp",
        "bilingüe",
        "República Dominicana",
      ],
    },
    categories: ["web-design", "business-tips"],
    publishedAt: "2026-06-24T12:00:00.000Z",
    body: {
      en: [
        rich("normal", [
          run(
            "Healthcare is the last industry in the Dominican Republic still running largely on referrals and Instagram — and the first where patients have quietly changed how they choose. Before booking with a doctor, dentist, or clinic, today's patient searches the name, reads the reviews, checks the credentials, and forms a trust judgment from a screen. A practice without a professional website isn't invisible in that process; it's present and losing, judged by an unclaimed Google profile and a Facebook page last updated two years ago. Here's what a medical website needs to do in the DR in 2026 — and the genuinely large opportunity most practices are missing.",
          ),
        ]),
        h2("Patients decide on trust before they decide on medicine"),
        rich("normal", [
          run(
            "A patient can't evaluate your clinical skill from a website — so they evaluate everything they can: how professional the site looks, how clearly it explains, how easy it is to reach you. Stanford's web-credibility research found that ",
          ),
          link(
            "people judge a site's trustworthiness first and foremost by its visual design",
            "https://credibility.stanford.edu/guidelines/index.html",
          ),
          run(
            ", before reading a word — and no vertical amplifies that effect like healthcare, where the visitor is often anxious, the stakes are personal, and \"does this feel legitimate and current?\" is the real question behind every click. A dated, slow, or broken-on-mobile site doesn't read as a busy doctor; it reads as a practice that doesn't attend to details — precisely the inference no clinician can afford.",
          ),
        ]),
        h2("The trust layer: what must be on the site"),
        rich("normal", [
          run("•  "),
          run(
            "Real credentials, prominently. Degrees, specialty certifications, professional-society memberships, years in practice — with the documents' issuing institutions named. Patients verify; make verifying easy.",
          ),
        ]),
        rich("normal", [
          run("•  "),
          run(
            "Real faces and places. Photos of the actual doctors, the actual team, and the actual facilities. Stock photography in healthcare actively damages trust — patients recognize it instantly and wonder what's being hidden.",
          ),
        ]),
        rich("normal", [
          run("•  "),
          run(
            'Clear service pages, one per treatment. A page for each major procedure or service — what it is, who it\'s for, what to expect, recovery, and honest answers to the questions patients are afraid to ask. These pages do double duty: they convert anxious visitors and they\'re what ranks when someone searches "implantes dentales Punta Cana" or "dermatólogo Bávaro."',
          ),
        ]),
        rich("normal", [
          run("•  "),
          run(
            "Reviews, embedded and answered. Patient reviews from Google, displayed with dates, with professional responses — including to the imperfect ones, handled gracefully.",
          ),
        ]),
        rich("normal", [
          run("•  "),
          run(
            "Location, hours, and emergency guidance one tap from anywhere, connected to an accurate Google Business Profile — if the practice doesn't appear on the map, start with ",
          ),
          link(
            "why businesses don't show up on Google Maps",
            "https://www.dr-webstudio.com/en/blog/por-que-negocio-punta-cana-no-aparece-google-maps-como-solucionarlo",
          ),
          run("."),
        ]),
        h2(
          "Appointments where patients actually are: WhatsApp, handled properly",
        ),
        rich("normal", [
          run(
            "In the Dominican Republic, the appointment request happens on WhatsApp — patients expect it, and a clinic reachable only by phone during office hours loses bookings to one that answers a message at 9 pm. The website's job is to make that one tap from every page, ideally with structured prompts (\"Hola, quisiera una cita con…\") that speed the front desk's triage — the ",
          ),
          link(
            "full integration playbook is here",
            "https://www.dr-webstudio.com/en/blog/how-to-connect-website-whatsapp-google-maps-instagram",
          ),
          run(
            '. Two professional notes, though. First, set response expectations on the site ("we reply within business hours") so the channel builds trust rather than testing it. Second, keep clinical matters out of the marketing site: WhatsApp is for scheduling and general questions, and the site should say so plainly — a discretion that patients read, correctly, as professionalism.',
          ),
        ]),
        h2("The medical tourism opportunity is real — and underserved online"),
        rich("normal", [
          run(
            "The Dominican Republic has a growing medical and dental tourism market: international patients — heavily from the US, Canada, and the diaspora — traveling for dental work, cosmetic procedures, and treatments priced far below their home markets, often combined with a Punta Cana vacation. These patients do all of their diligence online, in English, and their checklist is specific: the procedures offered with transparent price ranges, the doctors' verifiable credentials, before-and-after galleries, what a treatment trip looks like logistically (how many visits, how many days, where to stay), and how to have a real consultation before flying. The practices that answer those questions in properly built English pages — ",
          ),
          link(
            "genuinely bilingual, not widget-translated",
            "https://www.dr-webstudio.com/en/blog/seo-bilingue-posicionarse-ingles-espanol-sin-perjudicar-ninguno",
          ),
          run(
            " — are competing for high-value patients with remarkably little local competition, because almost no DR practice has built this content seriously. For a dental clinic or specialist in the east of the country, this is the single largest growth lever a website can pull.",
          ),
        ]),
        h2("Content that educates is content that ranks"),
        p(
          'Beyond service pages, the medical practices that dominate search publish answers: "how long do dental implants last," "what to expect after LASIK," "when should a mole worry you." Each well-written, honest answer page ranks for questions your future patients are already Googling, demonstrates expertise in the most credible way possible — by teaching — and funnels readers to the relevant service page. Health content carries a special obligation to be accurate and appropriately cautious, which is exactly why it works: in a search landscape full of junk, a real clinician\'s clear answer stands out to patients and to Google alike. One or two pages a month, in both languages, compounds within a year into the region\'s reference site for your specialty.',
        ),
        h2("The mistakes that quietly undermine medical websites"),
        rich("normal", [
          run(
            "Four patterns recur across the practices we've evaluated, and each is fixable. Running the practice on Instagram alone. Social channels build familiarity, but a patient ready to book searches Google — and an Instagram grid can't rank for \"ginecólogo Bávaro,\" can't hold your credentials in a verifiable format, and can't be cited when a relative asks \"send me their website.\" Stock photography. Smiling models in white coats are instantly recognizable as not-your-clinic, and in a trust-critical vertical that recognition costs more than having no photo at all; one afternoon with a local photographer solves it permanently. Total price opacity for elective procedures. Clinical pricing is often genuinely variable, but medical-tourism and elective patients compare on published ranges — \"implants from US$X\" — and practices that publish honest ranges enter shortlists that opaque competitors never see. And the abandoned site. A doctors page listing a physician who left two years ago, or hours that predate the pandemic, tells patients the practice doesn't maintain what it publishes — an inference they extend, fairly or not, to everything else. The common thread: in healthcare, every online detail is read as a proxy for clinical care. Tend the proxies. A quarterly half-hour review — team page current, hours right, prices reviewed, newest reviews answered — costs less than a single lost patient and keeps every proxy pointing the right way. Put it on the calendar the way you'd schedule equipment maintenance, because that's exactly what it is: maintenance on the machine that brings patients through the door. If no one on staff owns that habit, fold it into your website maintenance plan — a good developer handles the technical half and prompts you for the human half, which is precisely how our maintenance service works with the clinics and consultorios we support across the country today. The first year of that plan is included with every site we build.",
          ),
        ]),
        h2("What it costs, and what it returns"),
        rich("normal", [
          run(
            "A professional medical website — trust layer, service pages, WhatsApp scheduling, bilingual content — runs around US$950 in the Dominican market, with the full pricing picture in ",
          ),
          link(
            "what a website costs in the DR in 2026",
            "https://www.dr-webstudio.com/en/blog/cuanto-cuesta-pagina-web-republica-dominicana-2026",
          ),
          run(" and the safe commissioning process in our "),
          link(
            "step-by-step guide",
            "https://www.dr-webstudio.com/en/blog/steps-to-get-a-website-for-your-local-business",
          ),
          run(
            ". Against the lifetime value of even a handful of new patients — let alone a single international dental case — the arithmetic is not close. The real cost in this vertical is the one being paid invisibly right now: every week, patients who searched, judged, and quietly booked elsewhere.",
          ),
        ]),
        h2("A site your patients can trust, built properly"),
        rich("normal", [
          link("DR Web Studio", "https://www.dr-webstudio.com/en"),
          run(
            " builds fast, bilingual, credibility-first websites for professionals and clinics — with the trust layer, the WhatsApp scheduling flow, and the English-language medical-tourism content this market rewards. If your practice is ready for a website that works like a good front desk — professional, warm, and always on — ",
          ),
          link(
            "contact us for a free consultation",
            "https://www.dr-webstudio.com/en/contact",
          ),
          run("."),
        ]),
      ],
      es: [
        rich("normal", [
          run(
            "La salud es la última industria en República Dominicana que todavía funciona mayormente con referencias e Instagram — y la primera donde los pacientes cambiaron silenciosamente cómo eligen. Antes de reservar con un médico, dentista o clínica, el paciente de hoy busca el nombre, lee las reseñas, verifica las credenciales y forma un juicio de confianza desde una pantalla. Una práctica sin página web profesional no es invisible en ese proceso; está presente y perdiendo, juzgada por un perfil de Google sin reclamar y una página de Facebook actualizada por última vez hace dos años. Esto es lo que una página web médica necesita hacer en RD en 2026 — y la oportunidad genuinamente grande que la mayoría de las prácticas está dejando pasar.",
          ),
        ]),
        h2("Los pacientes deciden por confianza antes de decidir por medicina"),
        rich("normal", [
          run(
            "Un paciente no puede evaluar tu destreza clínica desde una página web — así que evalúa todo lo que sí puede: qué tan profesional se ve el sitio, con qué claridad explica, qué tan fácil es contactarte. La investigación de credibilidad web de Stanford encontró que ",
          ),
          link(
            "las personas juzgan la confiabilidad de un sitio ante todo por su diseño visual",
            "https://credibility.stanford.edu/guidelines/index.html",
          ),
          run(
            ', antes de leer una palabra — y ningún vertical amplifica ese efecto como la salud, donde el visitante suele estar ansioso, lo que está en juego es personal, y "¿esto se siente legítimo y actual?" es la pregunta real detrás de cada clic. Un sitio anticuado, lento o roto en móvil no se lee como un médico ocupado; se lee como una práctica que no atiende los detalles — precisamente la inferencia que ningún clínico puede permitirse.',
          ),
        ]),
        h2("La capa de confianza: qué debe estar en el sitio"),
        rich("normal", [
          run("•  "),
          run(
            "Credenciales reales, con prominencia. Títulos, certificaciones de especialidad, membresías en sociedades profesionales, años de práctica — con las instituciones emisoras nombradas. Los pacientes verifican; haz que verificar sea fácil.",
          ),
        ]),
        rich("normal", [
          run("•  "),
          run(
            "Rostros y lugares reales. Fotos de los médicos reales, el equipo real y las instalaciones reales. La fotografía de stock en salud daña activamente la confianza — los pacientes la reconocen al instante y se preguntan qué se está ocultando.",
          ),
        ]),
        rich("normal", [
          run("•  "),
          run(
            'Páginas de servicio claras, una por tratamiento. Una página por cada procedimiento o servicio mayor — qué es, para quién es, qué esperar, la recuperación, y respuestas honestas a las preguntas que a los pacientes les da miedo hacer. Estas páginas hacen doble trabajo: convierten a visitantes ansiosos y son lo que se posiciona cuando alguien busca "implantes dentales Punta Cana" o "dermatólogo Bávaro".',
          ),
        ]),
        rich("normal", [
          run("•  "),
          run(
            "Reseñas, incrustadas y respondidas. Reseñas de pacientes de Google, mostradas con fecha, con respuestas profesionales — incluidas las imperfectas, manejadas con gracia.",
          ),
        ]),
        rich("normal", [
          run("•  "),
          run(
            "Ubicación, horarios y orientación de emergencia a un toque desde cualquier página, conectados a un Perfil de Negocio de Google preciso — si la práctica no aparece en el mapa, empieza con ",
          ),
          link(
            "por qué los negocios no aparecen en Google Maps",
            "https://www.dr-webstudio.com/es/blog/por-que-negocio-punta-cana-no-aparece-google-maps-como-solucionarlo",
          ),
          run("."),
        ]),
        h2(
          "Citas donde los pacientes realmente están: WhatsApp, bien manejado",
        ),
        rich("normal", [
          run(
            'En República Dominicana, la solicitud de cita ocurre por WhatsApp — los pacientes lo esperan, y una clínica alcanzable solo por teléfono en horario de oficina pierde reservas ante una que responde un mensaje a las 9 pm. El trabajo de la página web es poner eso a un toque desde cada página, idealmente con mensajes estructurados ("Hola, quisiera una cita con…") que aceleren el triaje de la recepción — el ',
          ),
          link(
            "playbook completo de integración está aquí",
            "https://www.dr-webstudio.com/es/blog/como-conectar-sitio-web-whatsapp-google-maps-instagram",
          ),
          run(
            '. Dos notas profesionales, eso sí. Primera, establece expectativas de respuesta en el sitio ("respondemos en horario laboral") para que el canal construya confianza en vez de ponerla a prueba. Segunda, mantén los asuntos clínicos fuera del sitio de marketing: WhatsApp es para agendar y preguntas generales, y el sitio debe decirlo con claridad — una discreción que los pacientes leen, correctamente, como profesionalismo.',
          ),
        ]),
        h2(
          "La oportunidad del turismo médico es real — y está desatendida en línea",
        ),
        rich("normal", [
          run(
            "República Dominicana tiene un mercado creciente de turismo médico y dental: pacientes internacionales — fuertemente de Estados Unidos, Canadá y la diáspora — que viajan por trabajos dentales, procedimientos estéticos y tratamientos con precios muy por debajo de sus mercados de origen, a menudo combinados con vacaciones en Punta Cana. Estos pacientes hacen toda su diligencia en línea, en inglés, y su checklist es específico: los procedimientos ofrecidos con rangos de precio transparentes, las credenciales verificables de los médicos, galerías de antes y después, cómo se ve logísticamente un viaje de tratamiento (cuántas visitas, cuántos días, dónde hospedarse) y cómo tener una consulta real antes de volar. Las prácticas que responden esas preguntas en páginas en inglés bien construidas — ",
          ),
          link(
            "genuinamente bilingües, no traducidas por widget",
            "https://www.dr-webstudio.com/es/blog/seo-bilingue-posicionarse-ingles-espanol-sin-perjudicar-ninguno",
          ),
          run(
            " — están compitiendo por pacientes de alto valor con notablemente poca competencia local, porque casi ninguna práctica dominicana ha construido este contenido en serio. Para una clínica dental o un especialista en el este del país, esta es la palanca de crecimiento más grande que una página web puede activar.",
          ),
        ]),
        h2("El contenido que educa es el contenido que posiciona"),
        p(
          'Más allá de las páginas de servicio, las prácticas médicas que dominan la búsqueda publican respuestas: "cuánto duran los implantes dentales", "qué esperar después de LASIK", "cuándo debe preocuparte un lunar". Cada página de respuesta bien escrita y honesta se posiciona para preguntas que tus futuros pacientes ya están googleando, demuestra pericia de la forma más creíble posible — enseñando — y canaliza lectores hacia la página de servicio correspondiente. El contenido de salud lleva una obligación especial de ser preciso y apropiadamente cauteloso, que es exactamente por lo que funciona: en un paisaje de búsqueda lleno de basura, la respuesta clara de un clínico real destaca ante los pacientes y ante Google por igual. Una o dos páginas al mes, en ambos idiomas, se acumula en un año en el sitio de referencia de tu especialidad en la región.',
        ),
        h2("Los errores que socavan silenciosamente las páginas web médicas"),
        rich("normal", [
          run(
            'Cuatro patrones se repiten entre las prácticas que hemos evaluado, y cada uno tiene arreglo. Manejar la práctica solo con Instagram. Los canales sociales construyen familiaridad, pero un paciente listo para reservar busca en Google — y una cuadrícula de Instagram no puede posicionarse para "ginecólogo Bávaro", no puede sostener tus credenciales en un formato verificable, y no puede citarse cuando un familiar pide "mándame su página web". La fotografía de stock. Los modelos sonrientes de bata blanca son instantáneamente reconocibles como no-tu-clínica, y en un vertical crítico de confianza ese reconocimiento cuesta más que no tener foto; una tarde con un fotógrafo local lo resuelve permanentemente. La opacidad total de precios en procedimientos electivos. El precio clínico suele ser genuinamente variable, pero los pacientes de turismo médico y electivos comparan con rangos publicados — "implantes desde US$X" — y las prácticas que publican rangos honestos entran a listas cortas que los competidores opacos nunca ven. Y el sitio abandonado. Una página de médicos que lista a un doctor que se fue hace dos años, u horarios anteriores a la pandemia, le dice a los pacientes que la práctica no mantiene lo que publica — una inferencia que extienden, con o sin justicia, a todo lo demás. El hilo común: en salud, cada detalle en línea se lee como un proxy del cuidado clínico. Cuida los proxies.',
          ),
        ]),
        h2("Cuánto cuesta, y cuánto devuelve"),
        rich("normal", [
          run(
            "Una página web médica profesional — capa de confianza, páginas de servicio, agendado por WhatsApp, contenido bilingüe — ronda los US$950 en el mercado dominicano, con el panorama completo de precios en ",
          ),
          link(
            "cuánto cuesta una página web en RD en 2026",
            "https://www.dr-webstudio.com/es/blog/cuanto-cuesta-pagina-web-republica-dominicana-2026",
          ),
          run(" y el proceso seguro para encargarla en nuestra "),
          link(
            "guía paso a paso",
            "https://www.dr-webstudio.com/es/blog/pasos-para-encargar-una-pagina-web-negocio-local",
          ),
          run(
            ". Contra el valor de vida de apenas un puñado de pacientes nuevos — sin hablar de un solo caso dental internacional — la aritmética no es pareja. El costo real en este vertical es el que se está pagando invisiblemente ahora mismo: cada semana, pacientes que buscaron, juzgaron y reservaron silenciosamente en otra parte.",
          ),
        ]),
        h2("Un sitio en el que tus pacientes puedan confiar, bien construido"),
        rich("normal", [
          link("DR Web Studio", "https://www.dr-webstudio.com/es"),
          run(
            " construye páginas web rápidas, bilingües y de credibilidad-primero para profesionales y clínicas — con la capa de confianza, el flujo de citas por WhatsApp y el contenido en inglés de turismo médico que este mercado premia. Si tu práctica está lista para una página web que funcione como una buena recepción — profesional, cálida y siempre encendida — ",
          ),
          link(
            "contáctanos para una consulta gratuita",
            "https://www.dr-webstudio.com/es/contacto",
          ),
          run("."),
        ]),
      ],
    },
    seo: {
      metaTitle: loc(
        "Medical Websites Dominican Republic (2026)",
        "Páginas Web para Médicos y Clínicas RD (2026)",
      ),
      keywords: {
        en: [
          "medical website Dominican Republic",
          "dentist website Punta Cana",
          "clinic web design",
          "medical tourism website",
        ],
        es: [
          "página web para médicos",
          "página web dentista República Dominicana",
          "diseño web clínicas",
          "turismo médico República Dominicana",
        ],
      },
    },
  },
  {
    slug: "real-estate-websites-punta-cana",
    slugEs: "paginas-web-para-inmobiliarias-en-punta-cana",
    title: loc(
      "Real Estate Websites in Punta Cana: Bilingual Listings & Foreign Buyers",
      "Páginas Web para Inmobiliarias en Punta Cana: Listados Bilingües y Compradores Extranjeros",
    ),
    description: loc(
      "Real estate websites in Punta Cana: bilingual listings, foreign buyers, and the features that turn property browsers into serious inquiries.",
      "Páginas web para inmobiliarias en Punta Cana: listados bilingües, compradores extranjeros y las funciones que convierten curiosos en clientes.",
    ),
    readTime: 8,
    featured: false,
    tags: {
      en: [
        "real estate",
        "listings",
        "foreign buyers",
        "bilingual",
        "property",
        "Cap Cana",
        "Punta Cana",
      ],
      es: [
        "bienes raíces",
        "listados",
        "compradores extranjeros",
        "bilingüe",
        "propiedades",
        "Cap Cana",
        "Punta Cana",
      ],
    },
    categories: ["web-design", "business-tips"],
    publishedAt: "2026-06-24T12:00:00.000Z",
    body: {
      en: [
        p(
          "Punta Cana real estate sells to a buyer who is almost never in the room: a Canadian browsing condos from a Toronto winter, a New Yorker comparing pre-construction projects, a Dominican living abroad planning the return home. The entire early journey — discovery, comparison, shortlisting, first contact — happens on a screen, usually a phone, usually in English. Which makes the real estate website the industry's most consequential asset, and also, across most of the local market, its most neglected one. Here's what a real estate website in Punta Cana actually needs to do.",
        ),
        h2("Understand the foreign buyer's journey"),
        p(
          'The typical international buyer researches for months before contacting anyone. They start broad ("Punta Cana condos for sale"), narrow by area (Cap Cana vs Bávaro vs Cocotal), compare specific properties across several agency sites, verify the agency itself is legitimate, and only then send the first message — carrying a shortlist and a set of anxieties about buying in a country whose laws they don\'t know. Your website meets them at every one of those stages or loses them at one of them: broad landing pages for discovery, neighborhood pages for narrowing, listing pages for comparison, an about-and-credentials page for verification, and a frictionless contact path for that carefully considered first message. Most local sites only build the listings and wonder why the inquiries are cold.',
        ),
        h2("Listing pages: one property, one page, everything answered"),
        rich("normal", [
          run(
            "The listing page is where the shortlisting decision happens, and the bar is set by the international portals your buyers also browse. Each property needs its own URL and page with: abundant, honest photos — optimized so thirty images still load instantly abroad, using exactly the techniques in our ",
          ),
          link(
            "tourism image-optimization guide",
            "https://www.dr-webstudio.com/en/blog/optimizacion-imagenes-sitios-web-turismo-fotos-alta-calidad-carga-rapida",
          ),
          run(
            "; a video walkthrough, which for a remote buyer substitutes for the visit itself; the full specification set — price, size, bedrooms, HOA fees, title status, delivery date for pre-construction — because every unanswered spec is a reason to shortlist the competitor who answered it; the location on a map with distances to the beach, airport, and golf; and a contact action tied to the property, so the WhatsApp message or form arrives saying which listing it's about. Speed matters doubly here: listing pages are photo-heavy by nature, and ",
          ),
          link(
            "slow pages measurably lose buyers",
            "https://www.dr-webstudio.com/en/blog/core-web-vitals-como-la-velocidad-afecta-tus-ventas-online",
          ),
          run(" who have twelve other tabs open."),
        ]),
        h2("Neighborhood pages: the SEO layer almost nobody builds"),
        p(
          'Buyers search areas before properties — "living in Cap Cana," "Bávaro vs Punta Cana village," "best areas to buy in Punta Cana" — and those searches are where the highest-intent traffic enters the funnel. A well-built agency site has a genuine page for each zone it serves: what it\'s like to live there, price ranges, property types, amenities, who it suits. These pages rank for the searches listings can\'t, they position the agency as the local authority, and they funnel readers directly into the matching listings. Almost no Punta Cana agency has built them seriously, which makes this the clearest open SEO opportunity in the vertical.',
        ),
        h2("Bilingual — with English doing the heavy lifting"),
        rich("normal", [
          run(
            "Real estate here inverts the usual language formula: the buyers are overwhelmingly English-speaking, while the sellers, landlords, and long-term rental market are largely Spanish-speaking. A serious site therefore needs both, built as ",
          ),
          link(
            "genuinely independent language versions that each rank in their own market",
            "https://www.dr-webstudio.com/en/blog/seo-bilingue-posicionarse-ingles-espanol-sin-perjudicar-ninguno",
          ),
          run(
            ' — English pages competing for "Punta Cana condo for sale," Spanish pages competing for "vender mi apartamento Punta Cana" and capturing the listing side of the business. Agencies serving Las Terrenas or the French-Canadian buyer wave should treat French as the third language, phased in on the money pages first.',
          ),
        ]),
        h2("Trust content: answer the scary questions"),
        rich("normal", [
          run(
            "The foreign buyer's real obstacle isn't the property — it's the process. Can foreigners own property in the DR? How does title verification work? What does closing cost? What taxes apply? Is financing possible? The agency that answers these questions in clear, honest, well-organized pages does three things at once: it ranks for the exact searches every nervous buyer makes, it defuses the anxiety that stalls deals, and it establishes the credibility research says visitors judge in seconds — ",
          ),
          link(
            "trust is assessed from design and clarity before a word of your pitch is read",
            "https://credibility.stanford.edu/guidelines/index.html",
          ),
          run(
            ". Pair that content with the agency's own proof — years operating, team photos, association memberships, client testimonials with names and countries — and the verification stage of the buyer's journey ends at your site instead of derailing there.",
          ),
        ]),
        h2("Contact: WhatsApp, video tours, and the follow-up machine"),
        rich("normal", [
          run(
            "International buyers have fully adopted WhatsApp for exactly this purpose, and the site should hand them into it in one tap, with the property reference attached — the ",
          ),
          link(
            "integration playbook is here",
            "https://www.dr-webstudio.com/en/blog/how-to-connect-website-whatsapp-google-maps-instagram",
          ),
          run(
            ". From that chat, the modern remote workflow unfolds: a scheduled live video tour of the shortlisted units, documents shared, questions answered across time zones. The site's job is to start that conversation warm — a buyer who arrives having read your neighborhood guide, your buying-process page, and three complete listings needs far less convincing than one who found a phone number under a photo.",
          ),
        ]),
        h2("Portal listings vs your own platform"),
        rich("normal", [
          run(
            "Agencies ask whether their own site matters when portals bring the traffic. The answer mirrors every platform story in this series: use portals for reach, but own your hub — because the portal shows your listing next to twelve competitors, while your site shows your listing next to your credibility. For agencies with real volume, a custom listing platform — searchable, filterable, self-managed, bilingual by design — is a web-application build (from around US$1,250 in our pricing) that pays for itself in the control it returns: your inventory, your leads, your data, no portal fees deciding your visibility. Smaller agencies can start with a standard site around US$950 and grow into the platform; the full numbers are in ",
          ),
          link(
            "what a website costs in the DR in 2026",
            "https://www.dr-webstudio.com/en/blog/cuanto-cuesta-pagina-web-republica-dominicana-2026",
          ),
          run(", and the commissioning process in our "),
          link(
            "step-by-step guide",
            "https://www.dr-webstudio.com/en/blog/steps-to-get-a-website-for-your-local-business",
          ),
          run("."),
        ]),
        h2("Pre-construction projects: the special case"),
        rich("normal", [
          run(
            "A large share of Punta Cana's market is pre-construction, and selling a building that doesn't exist yet raises the website's burden of proof. The project page needs everything a resale listing has, plus: renders clearly labeled as renders alongside real photos of the site's current state — buyers forgive an empty lot, not a surprise; the payment plan spelled out (reserve, signing, construction installments, delivery balance), since staged payment is often the buying reason itself; the delivery timeline with construction updates — a dated photo feed of actual progress is the single strongest trust asset a pre-construction page can carry, because it proves the project is alive in a market where stalled developments are the buyer's chief fear; and the developer's track record, with previous completed projects named and linkable. Agencies that maintain honest monthly-update pages for their projects find they do double duty: they reassure existing buyers who committed months earlier, and they convert new ones who arrive mid-construction and can scroll the entire visible history of promises kept. That's a page a portal listing structurally cannot provide — and one more reason the agency's own platform earns its keep. It also feeds the follow-up machine: every monthly update is a legitimate reason to message your WhatsApp list of interested buyers, keeping deals warm across the long pre-construction sales cycle without ever feeling like a cold pitch. Few tools in real estate marketing convert as reliably as evidence of progress, delivered on schedule, to people who already asked to hear from you — and your own website is the only channel that makes it possible.",
          ),
        ]),
        h2("Built for the market your buyers browse from"),
        rich("normal", [
          link("DR Web Studio", "https://www.dr-webstudio.com/en"),
          run(
            " builds fast, bilingual, listing-ready real estate websites and custom property platforms for the Punta Cana market — pages that survive comparison with the international portals your buyers are already using. If your agency is ready for a website that turns browsers abroad into inquiries with a shortlist, ",
          ),
          link(
            "contact us for a free consultation",
            "https://www.dr-webstudio.com/en/contact",
          ),
          run("."),
        ]),
      ],
      es: [
        p(
          "El sector inmobiliario de Punta Cana le vende a un comprador que casi nunca está en la sala: un canadiense navegando condominios desde el invierno de Toronto, un neoyorquino comparando proyectos en preconstrucción, un dominicano viviendo en el exterior planificando el regreso a casa. Todo el recorrido temprano — descubrimiento, comparación, lista corta, primer contacto — ocurre en una pantalla, usualmente un teléfono, usualmente en inglés. Lo que convierte a la página web inmobiliaria en el activo más consecuente de la industria, y también, en la mayoría del mercado local, en el más descuidado. Esto es lo que una página web de inmobiliaria en Punta Cana realmente necesita hacer.",
        ),
        h2("Entiende el recorrido del comprador extranjero"),
        p(
          'El comprador internacional típico investiga durante meses antes de contactar a nadie. Empieza amplio ("Punta Cana condos for sale"), estrecha por zona (Cap Cana vs Bávaro vs Cocotal), compara propiedades específicas entre varios sitios de agencias, verifica que la agencia misma sea legítima, y solo entonces envía el primer mensaje — cargando una lista corta y un conjunto de ansiedades sobre comprar en un país cuyas leyes no conoce. Tu página web lo encuentra en cada una de esas etapas o lo pierde en una de ellas: páginas amplias de aterrizaje para el descubrimiento, páginas de zonas para el estrechamiento, páginas de listado para la comparación, una página de nosotros-y-credenciales para la verificación, y un camino de contacto sin fricción para ese primer mensaje cuidadosamente considerado. La mayoría de los sitios locales solo construye los listados y se pregunta por qué las consultas llegan frías.',
        ),
        h2("Páginas de listado: una propiedad, una página, todo respondido"),
        rich("normal", [
          run(
            "La página de listado es donde ocurre la decisión de lista corta, y la vara la ponen los portales internacionales que tus compradores también navegan. Cada propiedad necesita su propia URL y página con: fotos abundantes y honestas — optimizadas para que treinta imágenes sigan cargando al instante en el extranjero, usando exactamente las técnicas de nuestra ",
          ),
          link(
            "guía de optimización de imágenes",
            "https://www.dr-webstudio.com/es/blog/optimizacion-imagenes-sitios-web-turismo-fotos-alta-calidad-carga-rapida",
          ),
          run(
            "; un video recorrido, que para un comprador remoto sustituye a la visita misma; el conjunto completo de especificaciones — precio, tamaño, habitaciones, cuotas de mantenimiento, estatus del título, fecha de entrega en preconstrucción — porque cada especificación sin responder es una razón para poner en la lista corta al competidor que sí la respondió; la ubicación en un mapa con distancias a la playa, el aeropuerto y el golf; y una acción de contacto atada a la propiedad, para que el mensaje de WhatsApp o el formulario llegue diciendo de qué listado se trata. La velocidad importa doblemente aquí: las páginas de listado son pesadas en fotos por naturaleza, y ",
          ),
          link(
            "las páginas lentas pierden compradores de forma medible",
            "https://www.dr-webstudio.com/es/blog/core-web-vitals-como-la-velocidad-afecta-tus-ventas-online",
          ),
          run(" cuando tienen doce pestañas más abiertas."),
        ]),
        h2("Páginas de zonas: la capa de SEO que casi nadie construye"),
        p(
          'Los compradores buscan zonas antes que propiedades — "living in Cap Cana", "Bávaro vs Punta Cana village", "mejores zonas para comprar en Punta Cana" — y esas búsquedas son donde el tráfico de mayor intención entra al embudo. Un sitio de agencia bien construido tiene una página genuina por cada zona que sirve: cómo es vivir ahí, rangos de precio, tipos de propiedad, amenidades, para quién es ideal. Estas páginas se posicionan para las búsquedas que los listados no pueden, posicionan a la agencia como la autoridad local, y canalizan a los lectores directamente a los listados correspondientes. Casi ninguna agencia de Punta Cana las ha construido en serio, lo que hace de esto la oportunidad de SEO abierta más clara del vertical.',
        ),
        h2("Bilingüe — con el inglés cargando el peso"),
        rich("normal", [
          run(
            "El sector inmobiliario aquí invierte la fórmula usual de idiomas: los compradores son abrumadoramente angloparlantes, mientras los vendedores, propietarios y el mercado de alquiler a largo plazo son mayormente hispanohablantes. Un sitio serio por lo tanto necesita ambos, construidos como ",
          ),
          link(
            "versiones de idioma genuinamente independientes que se posicionan cada una en su propio mercado",
            "https://www.dr-webstudio.com/es/blog/seo-bilingue-posicionarse-ingles-espanol-sin-perjudicar-ninguno",
          ),
          run(
            ' — páginas en inglés compitiendo por "Punta Cana condo for sale", páginas en español compitiendo por "vender mi apartamento Punta Cana" y capturando el lado de captación del negocio. Las agencias que sirven Las Terrenas o la ola de compradores francocanadienses deben tratar el francés como tercer idioma, introducido por fases en las páginas de dinero primero.',
          ),
        ]),
        h2("Contenido de confianza: responde las preguntas que asustan"),
        rich("normal", [
          run(
            "El obstáculo real del comprador extranjero no es la propiedad — es el proceso. ¿Pueden los extranjeros tener propiedad en RD? ¿Cómo funciona la verificación de título? ¿Cuánto cuesta el cierre? ¿Qué impuestos aplican? ¿Es posible el financiamiento? La agencia que responde estas preguntas en páginas claras, honestas y bien organizadas hace tres cosas a la vez: se posiciona para las búsquedas exactas que hace cada comprador nervioso, desactiva la ansiedad que estanca los tratos, y establece la credibilidad que la investigación dice que los visitantes juzgan en segundos — ",
          ),
          link(
            "la confianza se evalúa desde el diseño y la claridad antes de leer una palabra de tu discurso",
            "https://credibility.stanford.edu/guidelines/index.html",
          ),
          run(
            ". Empareja ese contenido con la prueba propia de la agencia — años operando, fotos del equipo, membresías en asociaciones, testimonios de clientes con nombres y países — y la etapa de verificación del recorrido del comprador termina en tu sitio en vez de descarrilarse ahí.",
          ),
        ]),
        h2("Contacto: WhatsApp, tours por video y la máquina de seguimiento"),
        rich("normal", [
          run(
            "Los compradores internacionales adoptaron por completo WhatsApp para exactamente este propósito, y el sitio debe entregarlos a él en un toque, con la referencia de la propiedad adjunta — el ",
          ),
          link(
            "playbook de integración está aquí",
            "https://www.dr-webstudio.com/es/blog/como-conectar-sitio-web-whatsapp-google-maps-instagram",
          ),
          run(
            ". Desde ese chat se despliega el flujo remoto moderno: un tour en video en vivo de las unidades de la lista corta, documentos compartidos, preguntas respondidas a través de husos horarios. El trabajo del sitio es iniciar esa conversación en caliente — un comprador que llega habiendo leído tu guía de zonas, tu página del proceso de compra y tres listados completos necesita mucho menos convencimiento que uno que encontró un número de teléfono debajo de una foto.",
          ),
        ]),
        h2("Listados en portales vs tu propia plataforma"),
        rich("normal", [
          run(
            "Las agencias preguntan si su propio sitio importa cuando los portales traen el tráfico. La respuesta refleja cada historia de plataformas de esta serie: usa los portales por alcance, pero sé dueño de tu centro — porque el portal muestra tu listado junto a doce competidores, mientras tu sitio muestra tu listado junto a tu credibilidad. Para agencias con volumen real, una plataforma de listados a medida — con búsqueda, filtros, autogestión y bilingüe por diseño — es una construcción de aplicación web (desde alrededor de US$1,250 en nuestros precios) que se paga sola en el control que devuelve: tu inventario, tus leads, tus datos, sin cuotas de portal decidiendo tu visibilidad. Las agencias más pequeñas pueden empezar con un sitio estándar alrededor de US$950 y crecer hacia la plataforma; los números completos están en ",
          ),
          link(
            "cuánto cuesta una página web en RD en 2026",
            "https://www.dr-webstudio.com/es/blog/cuanto-cuesta-pagina-web-republica-dominicana-2026",
          ),
          run(", y el proceso para encargarla en nuestra "),
          link(
            "guía paso a paso",
            "https://www.dr-webstudio.com/es/blog/pasos-para-encargar-una-pagina-web-negocio-local",
          ),
          run("."),
        ]),
        h2("Proyectos en preconstrucción: el caso especial"),
        rich("normal", [
          run(
            "Una gran parte del mercado de Punta Cana es preconstrucción, y vender un edificio que aún no existe eleva la carga de prueba de la página web. La página del proyecto necesita todo lo que tiene un listado de reventa, más: renders claramente etiquetados como renders junto a fotos reales del estado actual del sitio — los compradores perdonan un terreno vacío, no una sorpresa; el plan de pago detallado (reserva, firma, cuotas de construcción, balance a la entrega), ya que el pago por etapas suele ser la razón misma de la compra; el cronograma de entrega con actualizaciones de construcción — un feed fechado de fotos del avance real es el activo de confianza más fuerte que una página de preconstrucción puede llevar, porque prueba que el proyecto está vivo en un mercado donde los desarrollos estancados son el miedo principal del comprador; y el historial del desarrollador, con proyectos anteriores terminados, nombrados y enlazables. Las agencias que mantienen páginas honestas de actualización mensual descubren que hacen doble trabajo: tranquilizan a los compradores existentes que se comprometieron meses antes, y convierten a los nuevos que llegan a mitad de la construcción y pueden recorrer todo el historial visible de promesas cumplidas. Esa es una página que un listado de portal estructuralmente no puede ofrecer — y una razón más por la que la plataforma propia de la agencia se gana su lugar.",
          ),
        ]),
        h2("Construida para el mercado desde donde navegan tus compradores"),
        rich("normal", [
          link("DR Web Studio", "https://www.dr-webstudio.com/es"),
          run(
            " construye páginas web inmobiliarias rápidas y bilingües y plataformas de propiedades a medida para el mercado de Punta Cana — páginas que sobreviven la comparación con los portales internacionales que tus compradores ya usan. Si tu agencia está lista para una página web que convierta navegantes en el extranjero en consultas con lista corta, ",
          ),
          link(
            "contáctanos para una consulta gratuita",
            "https://www.dr-webstudio.com/es/contacto",
          ),
          run("."),
        ]),
      ],
    },
    seo: {
      metaTitle: loc(
        "Real Estate Websites Punta Cana (2026)",
        "Páginas Web para Inmobiliarias Punta Cana (2026)",
      ),
      keywords: {
        en: [
          "real estate website Punta Cana",
          "property listing website",
          "real estate web design Dominican Republic",
          "realtor website Punta Cana",
        ],
        es: [
          "página web inmobiliaria Punta Cana",
          "página web bienes raíces",
          "diseño web inmobiliarias República Dominicana",
          "plataforma de listados de propiedades",
        ],
      },
    },
  },
  {
    slug: "my-website-doesnt-show-up-on-google",
    slugEs: "mi-pagina-web-no-aparece-en-google-causas-soluciones",
    title: loc(
      "My Website Doesn't Show Up on Google: 7 Reasons & Fixes",
      "Mi Página Web No Aparece en Google: 7 Causas y Soluciones",
    ),
    description: loc(
      "My website doesn't show up on Google? The 7 real reasons — indexing, robots.txt, no sitemap, thin content, speed, no Google Business Profile — and how to fix each.",
      "¿Mi página web no aparece en Google? Las 7 causas reales — indexación, robots.txt, sin sitemap, contenido pobre, velocidad, sin perfil de negocio — y cómo solucionarlas.",
    ),
    readTime: 8,
    featured: false,
    tags: {
      en: [
        "SEO",
        "Google",
        "indexing",
        "robots.txt",
        "Google Business Profile",
        "sitemap",
        "Dominican Republic",
        "troubleshooting",
      ],
      es: [
        "SEO",
        "Google",
        "indexación",
        "robots.txt",
        "Perfil de Negocio de Google",
        "sitemap",
        "República Dominicana",
        "diagnóstico",
      ],
    },
    categories: ["business-tips"],
    publishedAt: "2026-06-26T12:00:00.000Z",
    body: {
      en: [
        p(
          "Few things are as frustrating as paying for a website and then searching Google for your own business — only to find nothing. You type your company name, your service, your city, and your competitors appear while you don't. The good news: \"invisible on Google\" is almost always caused by one of a handful of specific, fixable problems, not by bad luck. Here are the seven most common reasons your website doesn't show up on Google, and how to solve each one.",
        ),
        h2(
          'First, understand the difference between "not indexed" and "not ranking"',
        ),
        rich("normal", [
          run(
            "Before diagnosing, separate two very different situations, because they have different fixes. Not indexed means Google doesn't have your page in its database at all — you're not on page ten, you're nowhere. Not ranking means Google knows your page exists but places it so far down that no one sees it. The quickest test: search Google for `site:yourdomain.com` (with your real domain). If nothing comes back, you have an indexing problem — reasons 1 through 4 below. If your pages appear but only when you search your exact business name, you're indexed but not ranking — reasons 5 through 7. This one check saves hours of chasing the wrong fix.",
          ),
        ]),
        h2("Reason 1: Your site is too new, and Google hasn't crawled it yet"),
        p(
          "If your website launched days or a few weeks ago, patience may be the entire answer. Google discovers and indexes new sites on its own schedule, and a brand-new domain with no external links pointing to it can take anywhere from days to several weeks to appear. You can speed this up dramatically: verify your site in Google Search Console (free) and submit your homepage and sitemap directly. That's the single most effective action for a new site — it tells Google you exist instead of waiting to be found. If your site is genuinely new and you've done this, give it two to four weeks before assuming something is broken.",
        ),
        h2("Reason 2: You're accidentally blocking Google"),
        rich("normal", [
          run(
            'This is the most common technical cause, and the most painful, because the site is often blocking Google by mistake. Two files control access. A `robots.txt` file can tell search engines not to crawl your site, and a single stray line — `Disallow: /` — makes the entire site invisible. Separately, a "noindex" tag in a page\'s code explicitly tells Google not to list it. Both are frequently left over from the development phase, when the site was deliberately hidden while being built, and never removed at launch. If your site launched and vanished, this is the first place to look. We explain the file itself in ',
          ),
          link(
            "what robots.txt is and whether it's blocking Google from your Dominican website",
            "https://www.dr-webstudio.com/en/blog/que-es-robots-txt-esta-bloqueando-google-sitio-web-dominicano",
          ),
          run(
            ". A developer can confirm and fix both issues in minutes — but they have to know to check.",
          ),
        ]),
        h2("Reason 3: You have no sitemap"),
        p(
          "A sitemap is a file that lists every page on your site and hands Google a map of what to index. Without one, Google has to discover your pages by following links, and any page not well-linked internally can be missed entirely — especially on a new or large site. A proper sitemap, submitted through Google Search Console, ensures every page you care about is found. Most professional sites generate one automatically; if yours doesn't have one, that's a gap worth closing immediately, and it pairs directly with fixing the robots.txt issues above.",
        ),
        h2("Reason 4: Your content is too thin for Google to bother with"),
        p(
          "Google indexes pages that offer something to searchers. A site that's mostly images, a single sparse page, or a few lines of generic text gives Google little reason to list it — and even less reason to rank it. This is especially common with sites built as digital business cards: a logo, a phone number, a photo, and almost no actual words. Search engines read text, so pages need real, substantive content — descriptions of your services, answers to the questions customers ask, the specifics that make you findable. If your site is beautiful but nearly wordless, that's likely why it's invisible.",
        ),
        h2("Reason 5: You're indexed, but far too slow"),
        rich("normal", [
          run(
            "Once you're indexed, ranking is a competition — and speed is one of Google's tiebreakers. A site that loads slowly on a phone gets pushed down in favor of faster competitors, because Google prioritizes the experience of its users, most of whom are on mobile. In a market like the Dominican Republic, where ",
          ),
          link(
            "around 70% of online activity happens on smartphones",
            "https://paymentscmi.com/insights/comercio-electronico-republica-dominicana-datos-clave/",
          ),
          run(
            " over mobile networks, a slow site is both a ranking problem and a conversion problem. We lay out the direct link in ",
          ),
          link(
            "how speed affects your online sales",
            "https://www.dr-webstudio.com/en/blog/core-web-vitals-como-la-velocidad-afecta-tus-ventas-online",
          ),
          run(
            ". If your pages take more than a few seconds to load, fixing that often lifts rankings on its own.",
          ),
        ]),
        h2("Reason 6: You're not targeting the words people actually search"),
        rich("normal", [
          run(
            'Many businesses are invisible for the searches that matter simply because their site never uses the words customers type. If your pages say "we deliver bespoke culinary experiences" but everyone searches "restaurant Punta Cana," Google has nothing to match. This is doubly true in a bilingual market: a tourist searches in English while your site exists only in Spanish, so half your potential traffic can\'t find you at all — the solution is genuinely bilingual pages, built as we describe in ',
          ),
          link(
            "bilingual SEO: ranking in English and Spanish",
            "https://www.dr-webstudio.com/en/blog/seo-bilingue-posicionarse-ingles-espanol-sin-perjudicar-ninguno",
          ),
          run(
            ". The fix is to write your pages around the actual phrases your customers use, in every language they use them.",
          ),
        ]),
        h2("Reason 7: You have no Google Business Profile"),
        rich("normal", [
          run(
            'For local businesses, this is the big one. When someone searches "dentist near me" or "hotel Bávaro," Google shows the map pack — that box of local businesses with pins, ratings, and hours — above almost everything else. Those results come from Google Business Profile, not from your website directly, and if you haven\'t claimed and completed yours, you\'re absent from the single most valuable local search result there is. A complete profile, connected to a professional website, is what wins local visibility. If you\'re missing from the map, start with our full guide on ',
          ),
          link(
            "why your business doesn't appear on Google Maps and how to fix it",
            "https://www.dr-webstudio.com/en/blog/por-que-negocio-punta-cana-no-aparece-google-maps-como-solucionarlo",
          ),
          run("."),
        ]),
        h2("How to diagnose yours in ten minutes"),
        p(
          "Run this quick sequence. Search `site:yourdomain.com` — nothing means an indexing problem (reasons 1–4), so check Search Console, robots.txt, and your sitemap. If pages appear but only for your exact name, it's a ranking problem (reasons 5–7): test your mobile speed, check that your pages use real customer search terms in the right languages, and confirm your Google Business Profile is claimed and complete. Most invisibility traces to one or two of these, and none of them require luck to fix — just knowing where to look.",
        ),
        h2("How to stay visible once you've fixed it"),
        p(
          "Getting found is one job; staying found is another, and it's mostly maintenance. Keep publishing real content — pages and articles that answer what your customers search build your visibility over time, because each one is a new door into your site. Keep your Google Business Profile current, since Google rewards active profiles with photos, posts, and fresh reviews. Watch Google Search Console monthly for new crawl errors or pages that quietly dropped out. And treat speed as ongoing, not one-time: sites slow down as images and features accumulate, and a site that was fast at launch can drift below the threshold that keeps it ranking. None of this is difficult, but it does need to be somebody's job. The businesses that stay visible are the ones that treat their website as a living asset rather than a finished project — a small, steady habit that compounds into durable search presence.",
        ),
        h2("When to bring in help"),
        rich("normal", [
          run(
            "If you've worked through this list and your site is still missing, the issue is usually technical — an indexing block, a broken sitemap, or structural problems Google can't crawl — and worth a professional diagnosis. At ",
          ),
          link("DR Web Studio", "https://www.dr-webstudio.com/en"),
          run(
            " we build sites that are fast, properly indexed, structured for search, and connected to Google Business Profile from day one, and we can audit an existing site to find exactly why it's not showing up. If your website is invisible and you want it found, ",
          ),
          link(
            "contact us for a free consultation",
            "https://www.dr-webstudio.com/en/contact",
          ),
          run(" and we'll tell you what's actually wrong."),
        ]),
      ],
      es: [
        p(
          'Pocas cosas frustran tanto como pagar por una página web y luego buscar tu propio negocio en Google — y no encontrar nada. Escribes el nombre de tu empresa, tu servicio, tu ciudad, y aparecen tus competidores mientras tú no. La buena noticia: "invisible en Google" casi siempre lo causa uno de un puñado de problemas específicos y solucionables, no la mala suerte. Aquí están las siete causas más comunes por las que tu página web no aparece en Google, y cómo resolver cada una.',
        ),
        h2(
          'Primero, entiende la diferencia entre "no indexado" y "no posicionado"',
        ),
        rich("normal", [
          run(
            "Antes de diagnosticar, separa dos situaciones muy distintas, porque tienen arreglos distintos. No indexado significa que Google no tiene tu página en su base de datos en absoluto — no estás en la página diez, no estás en ninguna parte. No posicionado significa que Google sabe que tu página existe pero la coloca tan abajo que nadie la ve. La prueba más rápida: busca en Google `site:tudominio.com` (con tu dominio real). Si no aparece nada, tienes un problema de indexación — las causas 1 a 4 de abajo. Si tus páginas aparecen pero solo cuando buscas el nombre exacto de tu negocio, estás indexado pero no posicionado — las causas 5 a 7. Esta sola verificación te ahorra horas persiguiendo el arreglo equivocado.",
          ),
        ]),
        h2("Causa 1: Tu sitio es muy nuevo y Google aún no lo ha rastreado"),
        p(
          "Si tu página web se lanzó hace días o pocas semanas, la paciencia puede ser toda la respuesta. Google descubre e indexa sitios nuevos según su propio calendario, y un dominio nuevo sin enlaces externos apuntándole puede tardar desde días hasta varias semanas en aparecer. Puedes acelerar esto dramáticamente: verifica tu sitio en Google Search Console (gratis) y envía tu página de inicio y tu sitemap directamente. Esa es la acción más efectiva para un sitio nuevo — le dice a Google que existes en vez de esperar a ser encontrado. Si tu sitio es genuinamente nuevo y ya hiciste esto, dale de dos a cuatro semanas antes de asumir que algo está roto.",
        ),
        h2("Causa 2: Estás bloqueando a Google sin querer"),
        rich("normal", [
          run(
            'Esta es la causa técnica más común, y la más dolorosa, porque a menudo el sitio bloquea a Google por error. Dos archivos controlan el acceso. Un archivo `robots.txt` puede decirle a los buscadores que no rastreen tu sitio, y una sola línea perdida — `Disallow: /` — hace que todo el sitio sea invisible. Por separado, una etiqueta "noindex" en el código de una página le dice explícitamente a Google que no la liste. Ambos quedan frecuentemente de la fase de desarrollo, cuando el sitio se ocultó deliberadamente mientras se construía, y nunca se removieron al lanzar. Si tu sitio se lanzó y desapareció, este es el primer lugar donde mirar. Explicamos el archivo en sí en ',
          ),
          link(
            "qué es robots.txt y si está bloqueando a Google de tu sitio web dominicano",
            "https://www.dr-webstudio.com/es/blog/que-es-robots-txt-esta-bloqueando-google-sitio-web-dominicano",
          ),
          run(
            ". Un desarrollador puede confirmar y arreglar ambos problemas en minutos — pero tiene que saber que debe revisarlos.",
          ),
        ]),
        h2("Causa 3: No tienes un sitemap"),
        p(
          "Un sitemap es un archivo que lista cada página de tu sitio y le entrega a Google un mapa de qué indexar. Sin uno, Google tiene que descubrir tus páginas siguiendo enlaces, y cualquier página que no esté bien enlazada internamente puede omitirse por completo — especialmente en un sitio nuevo o grande. Un sitemap adecuado, enviado a través de Google Search Console, asegura que cada página que te importa sea encontrada. La mayoría de los sitios profesionales generan uno automáticamente; si el tuyo no tiene, esa es una brecha que vale la pena cerrar de inmediato, y va directamente de la mano con arreglar los problemas de robots.txt de arriba.",
        ),
        h2(
          "Causa 4: Tu contenido es demasiado pobre para que Google se moleste",
        ),
        p(
          "Google indexa páginas que ofrecen algo a los buscadores. Un sitio que es mayormente imágenes, una sola página escasa o unas líneas de texto genérico le da a Google poca razón para listarlo — y aún menos razón para posicionarlo. Esto es especialmente común con sitios construidos como tarjetas de presentación digitales: un logo, un teléfono, una foto y casi ninguna palabra real. Los buscadores leen texto, así que las páginas necesitan contenido real y sustancioso — descripciones de tus servicios, respuestas a las preguntas que hacen los clientes, los detalles que te hacen encontrable. Si tu sitio es hermoso pero casi sin palabras, esa es probablemente la razón de que sea invisible.",
        ),
        h2("Causa 5: Estás indexado, pero eres demasiado lento"),
        rich("normal", [
          run(
            "Una vez que estás indexado, posicionarse es una competencia — y la velocidad es uno de los desempates de Google. Un sitio que carga lento en un teléfono es empujado hacia abajo a favor de competidores más rápidos, porque Google prioriza la experiencia de sus usuarios, la mayoría de los cuales están en móvil. En un mercado como República Dominicana, donde ",
          ),
          link(
            "cerca del 70% de la actividad en línea ocurre desde smartphones",
            "https://paymentscmi.com/insights/comercio-electronico-republica-dominicana-datos-clave/",
          ),
          run(
            " sobre redes móviles, un sitio lento es tanto un problema de posicionamiento como de conversión. Exponemos el vínculo directo en ",
          ),
          link(
            "cómo la velocidad afecta tus ventas en línea",
            "https://www.dr-webstudio.com/es/blog/core-web-vitals-como-la-velocidad-afecta-tus-ventas-online",
          ),
          run(
            ". Si tus páginas tardan más de unos segundos en cargar, arreglar eso a menudo sube el posicionamiento por sí solo.",
          ),
        ]),
        h2(
          "Causa 6: No estás apuntando a las palabras que la gente realmente busca",
        ),
        rich("normal", [
          run(
            'Muchos negocios son invisibles para las búsquedas que importan simplemente porque su sitio nunca usa las palabras que los clientes escriben. Si tus páginas dicen "ofrecemos experiencias culinarias a medida" pero todos buscan "restaurante Punta Cana", Google no tiene nada que emparejar. Esto es doblemente cierto en un mercado bilingüe: un turista busca en inglés mientras tu sitio existe solo en español, así que la mitad de tu tráfico potencial no puede encontrarte en absoluto — la solución son páginas genuinamente bilingües, construidas como describimos en ',
          ),
          link(
            "SEO bilingüe: posicionarse en inglés y español",
            "https://www.dr-webstudio.com/es/blog/seo-bilingue-posicionarse-ingles-espanol-sin-perjudicar-ninguno",
          ),
          run(
            ". El arreglo es escribir tus páginas alrededor de las frases reales que usan tus clientes, en cada idioma en que las usan.",
          ),
        ]),
        h2("Causa 7: No tienes un Perfil de Negocio de Google"),
        rich("normal", [
          run(
            'Para los negocios locales, esta es la grande. Cuando alguien busca "dentista cerca de mí" u "hotel Bávaro", Google muestra el paquete de mapa — esa caja de negocios locales con pines, calificaciones y horarios — por encima de casi todo lo demás. Esos resultados vienen del Perfil de Negocio de Google, no directamente de tu página web, y si no has reclamado y completado el tuyo, estás ausente del resultado de búsqueda local más valioso que existe. Un perfil completo, conectado a una página web profesional, es lo que gana la visibilidad local. Si faltas en el mapa, empieza con nuestra guía completa sobre ',
          ),
          link(
            "por qué tu negocio no aparece en Google Maps y cómo solucionarlo",
            "https://www.dr-webstudio.com/es/blog/por-que-negocio-punta-cana-no-aparece-google-maps-como-solucionarlo",
          ),
          run("."),
        ]),
        h2("Cómo diagnosticar el tuyo en diez minutos"),
        p(
          "Corre esta secuencia rápida. Busca `site:tudominio.com` — nada significa un problema de indexación (causas 1–4), así que revisa Search Console, robots.txt y tu sitemap. Si las páginas aparecen pero solo por tu nombre exacto, es un problema de posicionamiento (causas 5–7): prueba tu velocidad móvil, verifica que tus páginas usen términos de búsqueda reales de clientes en los idiomas correctos, y confirma que tu Perfil de Negocio de Google esté reclamado y completo. La mayoría de la invisibilidad se rastrea a una o dos de estas, y ninguna requiere suerte para arreglarse — solo saber dónde mirar.",
        ),
        h2("Cómo mantenerte visible una vez que lo arreglaste"),
        p(
          "Ser encontrado es un trabajo; mantenerte encontrado es otro, y es mayormente mantenimiento. Sigue publicando contenido real — páginas y artículos que respondan lo que tus clientes buscan construyen tu visibilidad con el tiempo, porque cada uno es una nueva puerta a tu sitio. Mantén tu Perfil de Negocio de Google al día, ya que Google premia los perfiles activos con fotos, publicaciones y reseñas frescas. Vigila Google Search Console cada mes por nuevos errores de rastreo o páginas que silenciosamente se cayeron. Y trata la velocidad como algo continuo, no de una sola vez: los sitios se ralentizan a medida que las imágenes y funciones se acumulan, y un sitio que era rápido al lanzar puede derivar por debajo del umbral que lo mantiene posicionado. Nada de esto es difícil, pero sí necesita ser el trabajo de alguien. Los negocios que se mantienen visibles son los que tratan su página web como un activo vivo en vez de un proyecto terminado — un hábito pequeño y constante que se acumula en una presencia de búsqueda duradera.",
        ),
        h2("Cuándo buscar ayuda"),
        rich("normal", [
          run(
            "Si trabajaste toda esta lista y tu sitio sigue faltando, el problema suele ser técnico — un bloqueo de indexación, un sitemap roto o problemas estructurales que Google no puede rastrear — y vale un diagnóstico profesional. En ",
          ),
          link("DR Web Studio", "https://www.dr-webstudio.com/es"),
          run(
            " construimos sitios que son rápidos, correctamente indexados, estructurados para la búsqueda y conectados al Perfil de Negocio de Google desde el primer día, y podemos auditar un sitio existente para encontrar exactamente por qué no aparece. Si tu página web es invisible y quieres que la encuentren, ",
          ),
          link(
            "contáctanos para una consulta gratuita",
            "https://www.dr-webstudio.com/es/contacto",
          ),
          run(" y te diremos qué está mal en realidad."),
        ]),
      ],
    },
    seo: {
      metaTitle: loc(
        "Website Not Showing on Google? 7 Fixes (2026)",
        "¿Página Web No Aparece en Google? 7 Soluciones",
      ),
      ogTitle: loc(
        "My Website Doesn't Show Up on Google: 7 Reasons & Fixes",
        "Mi Página Web No Aparece en Google: 7 Causas y Soluciones",
      ),
      ogDescription: loc(
        "Indexing, robots.txt, missing sitemap, thin content, speed, no Google Business Profile — the 7 reasons you're invisible, and the fix for each.",
        "Indexación, robots.txt, sitemap ausente, contenido pobre, velocidad, sin perfil de negocio — las 7 razones por las que eres invisible, y el arreglo de cada una.",
      ),
      keywords: {
        en: [
          "my website doesnt show up on google",
          "website not appearing on google",
          "why is my site not on google",
          "not indexed by google",
          "website invisible on google",
        ],
        es: [
          "mi página web no aparece en google",
          "por qué mi sitio no aparece en google",
          "página web no indexada",
          "sitio web invisible en google",
          "no aparezco en google",
        ],
      },
    },
  },
  {
    slug: "redesign-website-without-losing-rankings",
    slugEs: "como-redisenar-una-pagina-web-sin-perder-posicionamiento",
    title: loc(
      "How to Redesign Your Website Without Losing Rankings",
      "Cómo Rediseñar una Página Web Sin Perder Posicionamiento",
    ),
    description: loc(
      "How to redesign your website without losing your Google rankings: the migration checklist — URLs, redirects, content, metadata — that protects your SEO.",
      "Cómo rediseñar tu página web sin perder tu posicionamiento en Google: el checklist de migración — URLs, redirecciones, contenido, metadatos — que protege tu SEO.",
    ),
    readTime: 8,
    featured: false,
    tags: {
      en: [
        "SEO",
        "redesign",
        "migration",
        "301 redirects",
        "rankings",
        "web design",
        "Dominican Republic",
      ],
      es: [
        "SEO",
        "rediseño",
        "migración",
        "redirecciones 301",
        "posicionamiento",
        "diseño web",
        "República Dominicana",
      ],
    },
    categories: ["business-tips"],
    publishedAt: "2026-06-26T12:00:00.000Z",
    body: {
      en: [
        p(
          "A website redesign should be a step forward — a faster, better-looking, more effective site. Too often it's a disaster no one sees coming: the new site launches, everyone admires it, and then three weeks later the leads dry up because the business quietly fell off Google. This happens constantly, and it's entirely avoidable. The rankings you've spent years building are an asset, and a redesign that ignores them can erase that asset overnight. Here's how to redesign your website without losing your SEO.",
        ),
        h2("Why redesigns destroy rankings in the first place"),
        p(
          "Google's rankings are attached to specific things: your exact URLs, the content on each page, the signals that tell Google what each page is about, and the trust your domain has accumulated over time. A redesign that changes those things without accounting for them tells Google, in effect, that the site it knew is gone. Pages it ranked now return errors; content it valued has vanished or been reworded into something it doesn't recognize; the internal structure it mapped has been rebuilt. Google responds the only way it can — by dropping the pages it can no longer verify. The traffic loss isn't Google punishing you; it's Google losing track of you. Every step below exists to prevent that.",
        ),
        h2("Step 1: Measure everything before you touch anything"),
        p(
          "You cannot protect what you haven't recorded. Before any redesign work begins, document your current SEO reality: which pages bring in traffic, which keywords you rank for, which pages have the most valuable inbound links, and what your baseline traffic actually is. Google Search Console and Analytics give you all of this for free. This record is your safety net — it's how you'll know which URLs must be preserved, which pages must keep their content, and, after launch, whether anything slipped. Redesigns that skip this step are flying blind, and the businesses running them often don't discover the damage until a whole quarter of leads has evaporated.",
        ),
        h2("Step 2: Keep your URLs — or map every single change"),
        rich("normal", [
          run(
            "This is the single most important rule of a safe redesign. Every page Google ranks lives at a specific URL, and if that URL changes or disappears, the ranking attached to it is at risk. The safest redesign keeps every URL exactly as it was. When URLs must change — a new structure, a new platform, cleaner addresses — then every old URL needs a 301 redirect pointing to its new equivalent. A 301 is a permanent-move instruction that passes the old page's ranking power to the new one; it's how you renovate the building without losing the address everyone knows. Miss a redirect and that page's visitors and rankings hit a dead end. This mapping — every old URL to its new home — is the heart of a proper migration, and the piece amateur redesigns most often skip.",
          ),
        ]),
        h2("Step 3: Bring your content with you"),
        p(
          "Rankings are built on content, so content that disappears takes its rankings with it. It's tempting during a redesign to \"clean up\" and cut text that feels long or old — but that text is often exactly what's ranking. A page that ranks for a hundred useful searches because it thoroughly answers a question will stop ranking if the redesign trims it to a sleek paragraph. Preserve the substance of pages that perform, even as you improve their design and readability. If you're consolidating several pages into one, make sure the combined page keeps the content and keywords of all of them, and redirect the old URLs to it. Design can change freely; the words that earn your rankings need to survive the move.",
        ),
        h2("Step 4: Preserve the invisible SEO signals"),
        rich("normal", [
          run(
            "Beyond visible content, pages carry signals Google reads but visitors don't: title tags and meta descriptions, heading structure, image alt text, and structured data. These often get wiped in a redesign because they're invisible in the design mockup — nobody notices they're gone until rankings slip. A careful migration carries all of them across: same page titles (unless you're deliberately improving them), same structured data marking up your business, hours, and reviews so you stay eligible for Google's rich results, as we explain in ",
          ),
          link(
            "structured data for Dominican businesses",
            "https://www.dr-webstudio.com/en/blog/datos-estructurados-negocios-dominicanos-resultados-enriquecidos-google",
          ),
          run(
            '. And of course the new site must not accidentally block Google — the launch-day "noindex" and robots.txt traps we cover in ',
          ),
          link(
            "what robots.txt is and whether it's blocking Google",
            "https://www.dr-webstudio.com/en/blog/que-es-robots-txt-esta-bloqueando-google-sitio-web-dominicano",
          ),
          run(" have killed more redesigns than any design flaw."),
        ]),
        h2("Step 5: Launch faster than before, not slower"),
        rich("normal", [
          run(
            "A redesign is the perfect moment to improve speed — and a terrible time to regret losing it. If the new site is heavier and slower than the old one, you can preserve every URL perfectly and still slide down the rankings, because ",
          ),
          link(
            "speed is a ranking factor and a conversion factor at once",
            "https://www.dr-webstudio.com/en/blog/core-web-vitals-como-la-velocidad-afecta-tus-ventas-online",
          ),
          run(
            ", especially in a mobile-first market like the DR. Insist that the redesign lands faster than what it replaces. A modern build should make your site quicker, not prettier-but-slower — and if a proposed redesign can't promise that, question the technology behind it.",
          ),
        ]),
        h2("Step 6: Launch, submit, and watch closely"),
        p(
          'Going live is the start of the SEO work, not the end. The moment the new site launches, submit your updated sitemap through Google Search Console so Google re-crawls the new structure quickly. Then watch: check Search Console for crawl errors and "not found" pages (each one is a missed redirect to fix immediately), and compare your traffic against the baseline from Step 1. A small, brief dip as Google re-processes the site is normal; a sustained drop means something in the migration broke and needs fixing now, while it\'s still recoverable. The businesses that monitor the first few weeks catch problems early; the ones that launch and look away discover them a quarter too late.',
        ),
        h2("The special case: changing platforms"),
        rich("normal", [
          run(
            "Migrations are riskiest when you also change platforms — WordPress to a modern stack, one builder to another — because URLs, content structure, and technical foundations all move at once. This is exactly when the full checklist above becomes non-negotiable, and exactly when experienced hands matter most. Done properly, a platform migration can improve your SEO — faster performance, cleaner structure, better technical foundations — rather than threatening it. It's the core of our ",
          ),
          link(
            "website migrations and rebuilds service",
            "https://www.dr-webstudio.com/en/our-services/website-migrations-or-rebuilds",
          ),
          run(", where SEO preservation is built into the process."),
        ]),
        h2("What to expect on the timeline"),
        rich("normal", [
          run(
            "Even a flawless migration doesn't hold rankings perfectly still, and knowing the normal pattern keeps you from panicking — or from missing a real problem. In the first few days after launch, expect Google to re-crawl the site and some fluctuation as it re-processes your pages; rankings can wobble in both directions. Over the following two to four weeks, a well-executed migration settles back to its previous positions and often improves, as the faster, cleaner site earns Google's favor. What you should not see is a steep drop that persists past the first couple of weeks — that's the signature of a broken redirect, lost content, or an accidental block, and it means going back through the checklist to find what moved without its ranking. The distinction that matters: a brief dip that recovers is the system working; a sustained fall is a fixable error, not fate. Because the recoverable window is narrow, this is precisely why Step 6's monitoring isn't optional — the redesigns that lose rankings permanently are almost always the ones nobody was watching.",
          ),
        ]),
        h2("Redesign as an upgrade, not a gamble"),
        rich("normal", [
          run(
            "A redesign should grow your traffic, not risk it. Handled with a proper migration — measured, URL-mapped, content-preserved, signal-preserving, faster, and monitored — you get the better site and keep every ranking you earned. At ",
          ),
          link("DR Web Studio", "https://www.dr-webstudio.com/en"),
          run(
            " we treat SEO preservation as a required part of every redesign and migration, not an afterthought, because losing a client's hard-won rankings is not an acceptable outcome. If you're planning to rebuild or move your site and want to protect what it already earns, ",
          ),
          link(
            "contact us for a free consultation",
            "https://www.dr-webstudio.com/en/contact",
          ),
          run(" — we'll map the safe path before a single URL changes."),
        ]),
      ],
      es: [
        p(
          "El rediseño de una página web debería ser un paso adelante — un sitio más rápido, mejor visualmente y más efectivo. Con demasiada frecuencia es un desastre que nadie ve venir: el nuevo sitio se lanza, todos lo admiran, y tres semanas después las consultas se secan porque el negocio silenciosamente cayó de Google. Esto pasa constantemente, y es completamente evitable. El posicionamiento que has pasado años construyendo es un activo, y un rediseño que lo ignora puede borrar ese activo de la noche a la mañana. Aquí está cómo rediseñar tu página web sin perder tu SEO.",
        ),
        h2(
          "Por qué los rediseños destruyen el posicionamiento en primer lugar",
        ),
        p(
          "El posicionamiento de Google está atado a cosas específicas: tus URLs exactas, el contenido de cada página, las señales que le dicen a Google de qué trata cada página, y la confianza que tu dominio ha acumulado con el tiempo. Un rediseño que cambia esas cosas sin tenerlas en cuenta le dice a Google, en efecto, que el sitio que conocía desapareció. Las páginas que posicionaba ahora devuelven errores; el contenido que valoraba se esfumó o fue reescrito en algo que no reconoce; la estructura interna que mapeó fue reconstruida. Google responde de la única forma que puede — dejando caer las páginas que ya no puede verificar. La pérdida de tráfico no es Google castigándote; es Google perdiéndote la pista. Cada paso de abajo existe para prevenir eso.",
        ),
        h2("Paso 1: Mide todo antes de tocar nada"),
        p(
          "No puedes proteger lo que no has registrado. Antes de que empiece cualquier trabajo de rediseño, documenta tu realidad SEO actual: qué páginas traen tráfico, para qué palabras clave posicionas, qué páginas tienen los enlaces entrantes más valiosos, y cuál es tu tráfico base en realidad. Google Search Console y Analytics te dan todo esto gratis. Este registro es tu red de seguridad — es como sabrás qué URLs deben preservarse, qué páginas deben mantener su contenido, y, después del lanzamiento, si algo se resbaló. Los rediseños que se saltan este paso vuelan a ciegas, y los negocios que los hacen a menudo no descubren el daño hasta que todo un trimestre de consultas se ha evaporado.",
        ),
        h2("Paso 2: Conserva tus URLs — o mapea cada cambio"),
        rich("normal", [
          run(
            "Esta es la regla más importante de un rediseño seguro. Cada página que Google posiciona vive en una URL específica, y si esa URL cambia o desaparece, el posicionamiento atado a ella está en riesgo. El rediseño más seguro conserva cada URL exactamente como estaba. Cuando las URLs deben cambiar — una nueva estructura, una nueva plataforma, direcciones más limpias — entonces cada URL vieja necesita una redirección 301 apuntando a su nuevo equivalente. Una 301 es una instrucción de movimiento permanente que pasa el poder de posicionamiento de la página vieja a la nueva; es como renuevas el edificio sin perder la dirección que todos conocen. Omite una redirección y los visitantes y el posicionamiento de esa página chocan con un callejón sin salida. Este mapeo — cada URL vieja a su nuevo hogar — es el corazón de una migración adecuada, y la pieza que los rediseños amateur más frecuentemente se saltan.",
          ),
        ]),
        h2("Paso 3: Trae tu contenido contigo"),
        p(
          'El posicionamiento se construye sobre el contenido, así que el contenido que desaparece se lleva su posicionamiento con él. Es tentador durante un rediseño "limpiar" y cortar texto que se siente largo o viejo — pero ese texto suele ser exactamente lo que está posicionando. Una página que posiciona para cien búsquedas útiles porque responde a fondo una pregunta dejará de posicionar si el rediseño la recorta a un párrafo elegante. Preserva la sustancia de las páginas que rinden, incluso mientras mejoras su diseño y legibilidad. Si estás consolidando varias páginas en una, asegúrate de que la página combinada mantenga el contenido y las palabras clave de todas, y redirige las URLs viejas hacia ella. El diseño puede cambiar libremente; las palabras que ganan tu posicionamiento necesitan sobrevivir la mudanza.',
        ),
        h2("Paso 4: Preserva las señales SEO invisibles"),
        rich("normal", [
          run(
            "Más allá del contenido visible, las páginas cargan señales que Google lee pero los visitantes no: etiquetas de título y meta descripciones, estructura de encabezados, texto alternativo de imágenes y datos estructurados. Estos a menudo se borran en un rediseño porque son invisibles en la maqueta de diseño — nadie nota que desaparecieron hasta que el posicionamiento se resbala. Una migración cuidadosa los lleva todos: los mismos títulos de página (a menos que los estés mejorando deliberadamente), los mismos datos estructurados marcando tu negocio, horarios y reseñas para que sigas siendo elegible para los resultados enriquecidos de Google, como explicamos en ",
          ),
          link(
            "datos estructurados para negocios dominicanos",
            "https://www.dr-webstudio.com/es/blog/datos-estructurados-negocios-dominicanos-resultados-enriquecidos-google",
          ),
          run(
            '. Y por supuesto el nuevo sitio no debe bloquear a Google accidentalmente — las trampas de "noindex" y robots.txt del día de lanzamiento que cubrimos en ',
          ),
          link(
            "qué es robots.txt y si está bloqueando a Google",
            "https://www.dr-webstudio.com/es/blog/que-es-robots-txt-esta-bloqueando-google-sitio-web-dominicano",
          ),
          run(" han matado más rediseños que cualquier falla de diseño."),
        ]),
        h2("Paso 5: Lanza más rápido que antes, no más lento"),
        rich("normal", [
          run(
            "Un rediseño es el momento perfecto para mejorar la velocidad — y un pésimo momento para lamentar perderla. Si el nuevo sitio es más pesado y lento que el anterior, puedes conservar cada URL perfectamente y aun así resbalar en el posicionamiento, porque ",
          ),
          link(
            "la velocidad es un factor de posicionamiento y de conversión a la vez",
            "https://www.dr-webstudio.com/es/blog/core-web-vitals-como-la-velocidad-afecta-tus-ventas-online",
          ),
          run(
            ", especialmente en un mercado mobile-first como RD. Insiste en que el rediseño aterrice más rápido que lo que reemplaza. Una construcción moderna debería hacer tu sitio más rápido, no más bonito-pero-lento — y si un rediseño propuesto no puede prometer eso, cuestiona la tecnología detrás.",
          ),
        ]),
        h2("Paso 6: Lanza, envía y observa de cerca"),
        p(
          'Salir en vivo es el inicio del trabajo SEO, no el final. En el momento en que el nuevo sitio se lanza, envía tu sitemap actualizado a través de Google Search Console para que Google vuelva a rastrear la nueva estructura rápido. Luego observa: revisa Search Console por errores de rastreo y páginas "no encontradas" (cada una es una redirección omitida que arreglar de inmediato), y compara tu tráfico contra la base del Paso 1. Una caída pequeña y breve mientras Google reprocesa el sitio es normal; una caída sostenida significa que algo en la migración se rompió y necesita arreglo ahora, mientras aún es recuperable. Los negocios que monitorean las primeras semanas atrapan los problemas temprano; los que lanzan y miran hacia otro lado los descubren un trimestre demasiado tarde.',
        ),
        h2("El caso especial: cambiar de plataforma"),
        rich("normal", [
          run(
            "Las migraciones son más riesgosas cuando también cambias de plataforma — WordPress a un stack moderno, un constructor a otro — porque las URLs, la estructura del contenido y los cimientos técnicos se mueven todos a la vez. Este es exactamente cuando el checklist completo de arriba se vuelve innegociable, y exactamente cuando las manos experimentadas más importan. Hecha correctamente, una migración de plataforma puede mejorar tu SEO — rendimiento más rápido, estructura más limpia, mejores cimientos técnicos — en vez de amenazarlo. Es el corazón de nuestro ",
          ),
          link(
            "servicio de migraciones y reconstrucciones de sitios web",
            "https://www.dr-webstudio.com/es/nuestros-servicios/migraciones-y-reconstrucciones-de-sitios-web",
          ),
          run(", donde la preservación del SEO está integrada en el proceso."),
        ]),
        h2("Qué esperar en el cronograma"),
        rich("normal", [
          run(
            "Incluso una migración impecable no mantiene el posicionamiento perfectamente quieto, y conocer el patrón normal te evita entrar en pánico — o pasar por alto un problema real. En los primeros días tras el lanzamiento, espera que Google vuelva a rastrear el sitio y algo de fluctuación mientras reprocesa tus páginas; el posicionamiento puede oscilar en ambas direcciones. Durante las siguientes dos a cuatro semanas, una migración bien ejecutada se reacomoda a sus posiciones anteriores y a menudo mejora, a medida que el sitio más rápido y limpio se gana el favor de Google. Lo que no deberías ver es una caída pronunciada que persiste más allá de las primeras semanas — esa es la firma de una redirección rota, contenido perdido o un bloqueo accidental, y significa volver por el checklist para encontrar qué se movió sin su posicionamiento. La distinción que importa: una caída breve que se recupera es el sistema funcionando; una caída sostenida es un error solucionable, no el destino. Como la ventana de recuperación es estrecha, esto es precisamente por qué el monitoreo del Paso 6 no es opcional — los rediseños que pierden el posicionamiento permanentemente son casi siempre los que nadie estaba observando.",
          ),
        ]),
        h2("El rediseño como mejora, no como apuesta"),
        rich("normal", [
          run(
            "Un rediseño debería hacer crecer tu tráfico, no arriesgarlo. Manejado con una migración adecuada — medida, con URLs mapeadas, contenido preservado, señales preservadas, más rápido y monitoreado — obtienes el mejor sitio y conservas cada posicionamiento que ganaste. En ",
          ),
          link("DR Web Studio", "https://www.dr-webstudio.com/es"),
          run(
            " tratamos la preservación del SEO como una parte obligatoria de cada rediseño y migración, no como una idea de último momento, porque perder el posicionamiento ganado con esfuerzo de un cliente no es un resultado aceptable. Si estás planeando reconstruir o mover tu sitio y quieres proteger lo que ya gana, ",
          ),
          link(
            "contáctanos para una consulta gratuita",
            "https://www.dr-webstudio.com/es/contacto",
          ),
          run(
            " — mapearemos el camino seguro antes de que una sola URL cambie.",
          ),
        ]),
      ],
    },
    seo: {
      metaTitle: loc(
        "Redesign Without Losing SEO Rankings (2026)",
        "Rediseñar Sin Perder Posicionamiento SEO (2026)",
      ),
      ogTitle: loc(
        "How to Redesign Your Website Without Losing Rankings",
        "Cómo Rediseñar una Página Web Sin Perder Posicionamiento",
      ),
      ogDescription: loc(
        "A redesign can erase years of SEO overnight. The migration checklist — URLs, redirects, content, metadata — that keeps your rankings intact.",
        "Un rediseño puede borrar años de SEO de la noche a la mañana. El checklist de migración que mantiene tu posicionamiento intacto.",
      ),
      keywords: {
        en: [
          "redesign website without losing seo",
          "website redesign seo",
          "migrate website keep rankings",
          "301 redirects redesign",
          "redesign without losing traffic",
        ],
        es: [
          "rediseñar página web sin perder seo",
          "rediseño web seo",
          "migrar sitio mantener posicionamiento",
          "redirecciones 301 rediseño",
          "rediseño sin perder tráfico",
        ],
      },
    },
  },
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
