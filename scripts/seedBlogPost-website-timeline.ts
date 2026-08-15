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
    slug: "how-long-does-a-website-take-to-build",
    slugEs: "cuanto-tarda-en-construirse-una-pagina-web",
    title: loc(
      "How Long Does a Website Take to Build?",
      "¿Cuánto Tarda en Construirse una Página Web?",
    ),
    description: loc(
      "How long does a website take to build? An honest timeline for Dominican businesses — what each phase involves, what actually causes delays, and how to move faster.",
      "¿Cuánto tarda en construirse una página web? Un cronograma honesto para negocios dominicanos — qué implica cada fase, qué causa retrasos y cómo avanzar más rápido.",
    ),
    readTime: 8,
    featured: false,
    tags: {
      en: ["timeline", "web design process", "project planning", "delays", "expectations", "Dominican Republic"],
      es: ["cronograma", "proceso de diseño web", "planificación", "retrasos", "expectativas", "República Dominicana"],
    },
    categories: ["web-design", "business-tips"],
    publishedAt: "2026-08-12T15:00:00.000Z",
    body: {
      en: [
        p("\"How long will it take?\" is usually the second question a business owner asks, right after the price. It's a fair question with an unsatisfying honest answer: it depends — but not on what most people assume. The technical build is rarely what determines the calendar. What determines it is how ready you are, how many rounds of changes happen, and above all how quickly the content arrives. Here's a realistic breakdown of a Dominican website project, phase by phase, with the honest answer about what actually causes delays and how to avoid them."),
        h2("The short answer"),
        p("For a professionally built site, the realistic ranges are roughly:"),
        rich("normal", [run("•  "), run("A landing page or one-page site: one to two weeks.")]),
        rich("normal", [run("•  "), run("A standard business website of five to eight pages, bilingual: three to five weeks.")]),
        rich("normal", [run("•  "), run("A larger site with many pages, or an online store: five to eight weeks.")]),
        rich("normal", [run("•  "), run("A complex web application or a large e-commerce build: two to four months.")]),
        p("Those assume a responsive client and one clear round of revisions. They are not padded — but they're also not the \"your site by Friday\" promise you'll see from the cheapest end of the market, which is achievable only by skipping the parts that make a site work: strategy, real content, bilingual structure, testing, and optimization."),
        h2("Phase 1: Discovery and planning (2–5 days)"),
        rich("normal", [run("Before anything is designed, the project needs decisions: who the site is for, what it must accomplish, which pages exist, what each one must say, and what \"success\" looks like. For a Dominican business this phase also settles the questions that shape everything downstream — which languages, whether you need bookings or payments, how WhatsApp fits, whether a "), link("one-page or multi-page structure", "https://www.dr-webstudio.com/en/blog/one-page-site-vs-multi-page-which-do-you-need"), run(" fits your services.")]),
        p("This phase feels like the one to rush, and rushing it is the most expensive mistake in the whole project. Decisions deferred here resurface in week four as redesigns. Clients who arrive with a clear sense of their goals and their services routinely finish a week earlier than those who figure it out along the way — and the good news is that the preparation costs nothing but thought."),
        h2("Phase 2: Design (1–2 weeks)"),
        rich("normal", [run("The visual direction gets established and applied — layout, typography, color, how the key pages look and feel on both desktop and mobile. You review, you give feedback, and it's refined. Note the assumption baked into that sentence: one round of substantive feedback. Design is where projects most often stretch, not because designing takes long, but because \"let's see another option\" is easy to say and expensive to fulfil. Consolidated, specific feedback from whoever actually decides (\"the hero image should show the boat, not the beach; make the WhatsApp button more prominent\") moves fast. Feedback that arrives in fragments from four people over two weeks does not.")]),
        h2("Phase 3: Content (the real variable)"),
        rich("normal", [run("Here is the honest heart of the matter: content is what delays websites, far more than code. Text for every page, in both languages. Photographs of your actual business. Service descriptions, prices, staff details, the specifics that make the site yours rather than generic. A developer can build the container in days; they cannot invent what goes in it.")]),
        rich("normal", [run("Projects where the client has content ready — or commissions it early, or agrees for the developer to write it — run to schedule. Projects where content is promised \"next week\" for six consecutive weeks are the ones that take three months, and every one of those weeks the site earns nothing. Two practical moves fix this: start gathering photos and writing service descriptions the day the project begins rather than when asked, and if writing isn't your strength, arrange for it to be handled professionally as part of the project. Content is also where "), link("product photography", "https://www.dr-webstudio.com/en/blog/product-photography-that-sells"), run(" or business photography pays off, and it's worth scheduling that shoot early rather than discovering in week four that you have no usable images.")]),
        h2("Phase 4: Build and integration (1–2 weeks)"),
        rich("normal", [run("The actual development: pages built, content placed, both language versions structured properly, and the integrations connected — WhatsApp, Google Maps, forms, "), link("payments", "https://www.dr-webstudio.com/en/blog/how-to-accept-online-payments-dominican-republic"), run(" if you're selling, booking systems if you're taking reservations. This is the phase people imagine constitutes the whole project, and it's usually the most predictable part of it, because it depends on the developer rather than on external decisions.")]),
        h2("Phase 5: Testing, optimization, launch (3–5 days)"),
        rich("normal", [run("The unglamorous phase that separates professional work from cheap work. Every page checked on real phones and desktops, forms tested end to end, images optimized so the site is genuinely "), link("fast on mobile", "https://www.dr-webstudio.com/en/blog/core-web-vitals-como-la-velocidad-afecta-tus-ventas-online"), run(", SEO structure verified, "), link("bilingual tags checked", "https://www.dr-webstudio.com/en/blog/seo-bilingue-posicionarse-ingles-espanol-sin-perjudicar-ninguno"), run(", analytics installed, and the domain and hosting configured. Then launch — and then submitting the sitemap so Google starts indexing.")]),
        p("Worth setting expectations here too: launching is not the same as ranking. The site is live immediately, but Google takes weeks to index and months to rank a new site competitively. The build timeline and the results timeline are two different clocks, and confusing them causes needless disappointment in month two."),
        h2("What actually causes delays"),
        rich("normal", [run("In order of frequency: content that never arrives; decision-makers who aren't in the room, so feedback keeps getting overturned by someone who wasn't consulted; scope that grows mid-project (\"could we also add a booking system?\"), which is fine but is a new timeline, not a free addition; feedback delivered slowly or in fragments; and finally, actual technical complexity, which is real but far less common than the other four. Notice that four of the five are within the client's control — which is genuinely good news, because it means most projects that run late didn't have to.")]),
        h2("How to make it go faster"),
        p("If speed matters to you: gather your photos and write your service descriptions before the project starts. Decide who has final say and let that person give consolidated feedback within two or three days of receiving anything. Say yes or no rather than \"let me think about it\" for a week. Lock scope at the start and put good new ideas in a phase-two list rather than the current build. And if you have a hard deadline — a season opening, an event, a campaign — say so on day one, because a project planned around a date is managed completely differently from one that discovers the date in week three."),
        h2("The clock that starts after launch"),
        rich("normal", [run("It's worth separating two timelines that get conflated constantly, because the confusion causes real frustration. The build timeline ends at launch. The results timeline is only beginning — and it runs on Google's schedule, not yours. Google has to discover the site, crawl it, index the pages, and then gradually assess how it should rank against established competitors, and its own documentation is blunt that this is not immediate: "), link("Google notes that it may take some time — anywhere from a few hours to several weeks — for changes to be crawled and indexed, and cannot guarantee when or whether a page will be indexed at all", "https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl"), run(". Competitive rankings typically take months beyond that. This is why a site launched two weeks before high season is late, not early — the build was fast, but the visibility that makes it profitable had no time to accumulate. Plan backward from when you need customers, not from when you want the site live.")]),
        h2("An honest word on rushing"),
        rich("normal", [run("Some deadlines are real, and a good developer will work to them. But it's worth naming the trade-off honestly: the parts that get sacrificed under time pressure are always the invisible ones — the SEO structure, the image optimization, the bilingual setup, the testing. A site rushed out in five days looks fine and quietly underperforms for years, and no one ever traces the disappointing traffic back to the week it was built. If the real constraint is a launch date, the better move is usually to launch a smaller, excellent site on time and expand it after, rather than a large, compromised one. Fewer pages built properly beats more pages built badly — in a market where "), link("speed and structure decide who gets found", "https://www.dr-webstudio.com/en/blog/my-website-doesnt-show-up-on-google"), run(", that's not a philosophical preference, it's arithmetic.")]),
        h2("Let's map your timeline"),
        rich("normal", [run("At "), link("DR Web Studio", "https://www.dr-webstudio.com/en"), run(" we give a realistic schedule up front, tell you exactly what we need from you and when, and keep the project moving — landing pages from $400 and business websites from $950, with the first year of maintenance included. If you have a date you're building toward, "), link("contact us for a free consultation", "https://www.dr-webstudio.com/en/contact"), run(" and we'll tell you honestly whether it's achievable and what it would take.")]),
      ],
      es: [
        p("\"¿Cuánto va a tardar?\" suele ser la segunda pregunta que hace un dueño de negocio, justo después del precio. Es una pregunta justa con una respuesta honesta poco satisfactoria: depende — pero no de lo que la mayoría asume. La construcción técnica rara vez es lo que determina el calendario. Lo que lo determina es qué tan preparado estás, cuántas rondas de cambios ocurren, y sobre todo qué tan rápido llega el contenido. Aquí está un desglose realista de un proyecto web dominicano, fase por fase, con la respuesta honesta sobre qué causa realmente los retrasos y cómo evitarlos."),
        h2("La respuesta corta"),
        p("Para un sitio construido profesionalmente, los rangos realistas son aproximadamente:"),
        rich("normal", [run("•  "), run("Una landing page o sitio de una página: una a dos semanas.")]),
        rich("normal", [run("•  "), run("Un sitio de negocio estándar de cinco a ocho páginas, bilingüe: tres a cinco semanas.")]),
        rich("normal", [run("•  "), run("Un sitio más grande con muchas páginas, o una tienda en línea: cinco a ocho semanas.")]),
        rich("normal", [run("•  "), run("Una aplicación web compleja o un e-commerce grande: dos a cuatro meses.")]),
        p("Esos rangos asumen un cliente que responde y una ronda clara de revisiones. No están inflados — pero tampoco son la promesa de \"tu sitio para el viernes\" que verás en el extremo más barato del mercado, que solo se logra saltándose las partes que hacen que un sitio funcione: estrategia, contenido real, estructura bilingüe, pruebas y optimización."),
        h2("Fase 1: Descubrimiento y planificación (2–5 días)"),
        rich("normal", [run("Antes de diseñar nada, el proyecto necesita decisiones: para quién es el sitio, qué debe lograr, qué páginas existen, qué debe decir cada una, y cómo se ve el \"éxito.\" Para un negocio dominicano esta fase además resuelve las preguntas que moldean todo lo demás — qué idiomas, si necesitas reservas o pagos, cómo encaja WhatsApp, si una "), link("estructura de una o varias páginas", "https://www.dr-webstudio.com/es/blog/sitio-de-una-pagina-vs-varias-paginas-cual-necesitas"), run(" se ajusta a tus servicios.")]),
        p("Esta fase se siente como la que hay que apurar, y apurarla es el error más caro de todo el proyecto. Las decisiones aplazadas aquí resurgen en la semana cuatro como rediseños. Los clientes que llegan con un sentido claro de sus metas y sus servicios rutinariamente terminan una semana antes que los que lo van descubriendo sobre la marcha — y la buena noticia es que la preparación no cuesta más que reflexión."),
        h2("Fase 2: Diseño (1–2 semanas)"),
        rich("normal", [run("Se establece y aplica la dirección visual — la maquetación, la tipografía, el color, cómo se ven y se sienten las páginas clave en computadora y en móvil. Tú revisas, das retroalimentación, y se refina. Nota la suposición metida en esa oración: una ronda de retroalimentación sustantiva. El diseño es donde los proyectos más se estiran, no porque diseñar tome mucho, sino porque \"veamos otra opción\" es fácil de decir y caro de cumplir. La retroalimentación consolidada y específica de quien realmente decide (\"la imagen principal debe mostrar el bote, no la playa; haz el botón de WhatsApp más prominente\") avanza rápido. La retroalimentación que llega en fragmentos de cuatro personas a lo largo de dos semanas, no.")]),
        h2("Fase 3: Contenido (la verdadera variable)"),
        rich("normal", [run("Aquí está el corazón honesto del asunto: el contenido es lo que retrasa las páginas web, mucho más que el código. Texto para cada página, en ambos idiomas. Fotografías de tu negocio real. Descripciones de servicios, precios, datos del personal, los detalles que hacen el sitio tuyo en vez de genérico. Un desarrollador puede construir el envase en días; no puede inventar lo que va adentro.")]),
        rich("normal", [run("Los proyectos donde el cliente tiene el contenido listo — o lo encarga temprano, o acuerda que el desarrollador lo escriba — corren a tiempo. Los proyectos donde el contenido se promete \"la semana que viene\" durante seis semanas seguidas son los que toman tres meses, y cada una de esas semanas el sitio no gana nada. Dos movimientos prácticos lo arreglan: empieza a reunir fotos y a escribir descripciones de servicios el día que empieza el proyecto en vez de cuando te lo pidan, y si escribir no es tu fuerte, arregla que se maneje profesionalmente como parte del proyecto. El contenido es también donde la "), link("fotografía de producto", "https://www.dr-webstudio.com/es/blog/fotografia-de-producto-que-vende"), run(" o de negocio rinde, y vale la pena agendar esa sesión temprano en vez de descubrir en la semana cuatro que no tienes imágenes usables.")]),
        h2("Fase 4: Construcción e integración (1–2 semanas)"),
        rich("normal", [run("El desarrollo propiamente: páginas construidas, contenido colocado, ambas versiones de idioma estructuradas correctamente, y las integraciones conectadas — WhatsApp, Google Maps, formularios, "), link("pagos", "https://www.dr-webstudio.com/es/blog/como-aceptar-pagos-en-linea-republica-dominicana"), run(" si vendes, sistemas de reserva si tomas reservaciones. Esta es la fase que la gente imagina que constituye todo el proyecto, y usualmente es la parte más predecible, porque depende del desarrollador en vez de decisiones externas.")]),
        h2("Fase 5: Pruebas, optimización, lanzamiento (3–5 días)"),
        rich("normal", [run("La fase poco glamorosa que separa el trabajo profesional del barato. Cada página revisada en teléfonos y computadoras reales, formularios probados de principio a fin, imágenes optimizadas para que el sitio sea genuinamente "), link("rápido en móvil", "https://www.dr-webstudio.com/es/blog/core-web-vitals-como-la-velocidad-afecta-tus-ventas-online"), run(", estructura SEO verificada, "), link("etiquetas bilingües revisadas", "https://www.dr-webstudio.com/es/blog/seo-bilingue-posicionarse-ingles-espanol-sin-perjudicar-ninguno"), run(", analítica instalada, y el dominio y hosting configurados. Luego el lanzamiento — y después el envío del sitemap para que Google empiece a indexar.")]),
        p("Vale la pena fijar expectativas aquí también: lanzar no es lo mismo que posicionar. El sitio está en línea de inmediato, pero Google toma semanas en indexar y meses en posicionar un sitio nuevo de forma competitiva. El cronograma de construcción y el de resultados son dos relojes distintos, y confundirlos causa decepción innecesaria en el mes dos."),
        h2("Qué causa realmente los retrasos"),
        rich("normal", [run("En orden de frecuencia: el contenido que nunca llega; los tomadores de decisiones que no están en la sala, así que la retroalimentación la revierte alguien que no fue consultado; el alcance que crece a mitad del proyecto (\"¿podríamos agregar también un sistema de reservas?\"), lo cual está bien pero es un cronograma nuevo, no una adición gratis; la retroalimentación entregada lento o en fragmentos; y por último, la complejidad técnica real, que existe pero es mucho menos común que las otras cuatro. Nota que cuatro de las cinco están bajo control del cliente — lo cual es genuinamente buena noticia, porque significa que la mayoría de los proyectos que se atrasan no tenían por qué hacerlo.")]),
        h2("Cómo hacer que vaya más rápido"),
        p("Si la velocidad te importa: reúne tus fotos y escribe tus descripciones de servicios antes de que empiece el proyecto. Decide quién tiene la última palabra y deja que esa persona dé retroalimentación consolidada dentro de dos o tres días de recibir cualquier cosa. Di sí o no en vez de \"déjame pensarlo\" por una semana. Fija el alcance al inicio y pon las buenas ideas nuevas en una lista de fase dos en vez de en la construcción actual. Y si tienes una fecha límite dura — una apertura de temporada, un evento, una campaña — dilo el día uno, porque un proyecto planificado alrededor de una fecha se maneja completamente distinto de uno que descubre la fecha en la semana tres."),
        h2("El reloj que empieza después del lanzamiento"),
        rich("normal", [run("Vale la pena separar dos cronogramas que se confunden constantemente, porque la confusión causa frustración real. El cronograma de construcción termina en el lanzamiento. El cronograma de resultados apenas empieza — y corre según el calendario de Google, no el tuyo. Google tiene que descubrir el sitio, rastrearlo, indexar las páginas, y luego evaluar gradualmente cómo debería posicionarlo frente a competidores establecidos, y su propia documentación es directa en que esto no es inmediato: "), link("Google señala que puede tomar tiempo — desde unas horas hasta varias semanas — para que los cambios sean rastreados e indexados, y no puede garantizar cuándo ni si una página será indexada", "https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl"), run(". El posicionamiento competitivo típicamente toma meses más allá de eso. Por esto un sitio lanzado dos semanas antes de la temporada alta llega tarde, no temprano — la construcción fue rápida, pero la visibilidad que lo hace rentable no tuvo tiempo de acumularse. Planifica hacia atrás desde cuándo necesitas clientes, no desde cuándo quieres el sitio en línea.")]),
        h2("Una palabra honesta sobre apurarse"),
        rich("normal", [run("Algunas fechas límite son reales, y un buen desarrollador trabajará hacia ellas. Pero vale la pena nombrar la concesión con honestidad: las partes que se sacrifican bajo presión de tiempo son siempre las invisibles — la estructura SEO, la optimización de imágenes, la configuración bilingüe, las pruebas. Un sitio sacado a las carreras en cinco días se ve bien y rinde por debajo silenciosamente durante años, y nadie rastrea jamás el tráfico decepcionante hasta la semana en que se construyó. Si la restricción real es una fecha de lanzamiento, el mejor movimiento suele ser lanzar un sitio más pequeño y excelente a tiempo y expandirlo después, en vez de uno grande y comprometido. Menos páginas bien construidas le ganan a más páginas mal construidas — en un mercado donde "), link("la velocidad y la estructura deciden quién es encontrado", "https://www.dr-webstudio.com/es/blog/mi-pagina-web-no-aparece-en-google-causas-soluciones"), run(", eso no es una preferencia filosófica, es aritmética.")]),
        h2("Mapeemos tu cronograma"),
        rich("normal", [run("En "), link("DR Web Studio", "https://www.dr-webstudio.com/es"), run(" damos un calendario realista por adelantado, te decimos exactamente qué necesitamos de ti y cuándo, y mantenemos el proyecto en movimiento — landing pages desde $400 y sitios web de negocio desde $950, con el primer año de mantenimiento incluido. Si tienes una fecha hacia la cual estás construyendo, "), link("contáctanos para una consulta gratuita", "https://www.dr-webstudio.com/es/contacto"), run(" y te decimos honestamente si es alcanzable y qué haría falta.")]),
      ],
    },
    seo: {
      metaTitle: loc(
        "How Long Does a Website Take to Build? (2026)",
        "¿Cuánto Tarda en Hacerse una Página Web? (2026)",
      ),
      ogTitle: loc(
        "How Long Does a Website Take to Build?",
        "¿Cuánto Tarda en Construirse una Página Web?",
      ),
      ogDescription: loc(
        "Two to eight weeks, depending. The honest breakdown of every phase — and the one thing that delays more projects than any technical problem: waiting on content.",
        "De dos a ocho semanas, según el caso. El desglose honesto de cada fase — y lo que más retrasa proyectos: esperar por el contenido.",
      ),
      keywords: {
        en: ["how long does a website take", "website build timeline", "web design process time", "website project schedule", "how fast can a website be built"],
        es: ["cuánto tarda una página web", "cronograma construcción web", "tiempo proceso diseño web", "calendario proyecto web", "qué tan rápido se hace una web"],
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