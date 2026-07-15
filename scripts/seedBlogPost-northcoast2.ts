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
    slug: "north-coast-three-audiences-puerto-plata-sosua-cabarete",
    slugEs: "costa-norte-tres-audiencias-puerto-plata-sosua-cabarete",
    title: loc(
      "Puerto Plata, Sosúa & Cabarete: Three Audiences, One North Coast",
      "Puerto Plata, Sosúa y Cabarete: Tres Audiencias, Una Costa Norte",
    ),
    description: loc(
      "The DR's North Coast — Puerto Plata, Sosúa, Cabarete — serves three audiences at once: cruise day-trippers, digital nomads, and resident expats. How to build a site for all three.",
      "La Costa Norte de RD — Puerto Plata, Sosúa, Cabarete — sirve a tres audiencias a la vez: cruceristas, nómadas digitales y expatriados residentes. Cómo construir un sitio para los tres.",
    ),
    readTime: 9,
    featured: false,
    tags: {
      en: ["North Coast", "Puerto Plata", "Sosúa", "Cabarete", "kitesurf", "cruise", "digital nomads", "expats", "Dominican Republic"],
      es: ["Costa Norte", "Puerto Plata", "Sosúa", "Cabarete", "kitesurf", "cruceros", "nómadas digitales", "expatriados", "República Dominicana"],
    },
    categories: ["web-design", "business-tips"],
    publishedAt: "2026-07-07T14:00:00.000Z",
    body: {
      en: [
        p("The Dominican Republic's North Coast is not the next big thing — it's the established thing that never stopped growing. While attention chases emerging frontiers like Miches and Pedernales, Puerto Plata, Sosúa, and Cabarete have quietly become the region seeing the strongest expat growth in fifteen years, anchored by two cruise ports, the kitesurfing capital of the world, and a resident foreign community thousands strong. But that maturity comes with a challenge the frontier towns don't face: the North Coast isn't one market, it's three, arriving by three completely different routes, and the local business that wins here is the one whose website speaks to all of them. Here's how to build for it."),
        h2("Three audiences, one region"),
        p("Most Dominican tourism destinations serve one type of visitor. The North Coast serves three at once, and they could hardly be more different:"),
        rich("normal", [run("•  "), run("The cruise day-tripper. Two ports — Amber Cove and Taíno Bay — pour cruise passengers into Puerto Plata, which "), link("handled about 78% of all Dominican cruise arrivals in 2025, more than two million passengers between the two terminals", "https://www.caribjournal.com/2026/01/12/dominican-republic-cruises-booming/"), run(". The most-visited day-trip from both is Sosúa, about thirty to forty minutes away, where a full ecosystem of shore excursions runs beach days, snorkeling, and catamaran charters. This visitor has a few hours, is researching from the ship or the pier, and books fast or not at all.")]),
        rich("normal", [run("•  "), run("The long-stay independent traveler and digital nomad. Cabarete's constant Atlantic trade winds make it the Caribbean's undisputed kitesurfing and windsurfing hub, drawing athletes, remote workers, and lifestyle travelers who arrive by air and stay for weeks, not hours. This visitor plans ahead, compares options carefully, and spends over a long horizon.")]),
        rich("normal", [run("•  "), run("The resident expat. Thousands of North American and European residents live along the coast year-round — real-estate analysts describe the North Coast as seeing "), link("the strongest expat growth in fifteen years", "https://www.drlistings.com/blog/dr-tourism-culture-lifestyle/"), run(" — and they're not tourists at all. They're local customers who need the same services a resident anywhere needs, and who research them online exactly as they did back home.")]),
        p("A restaurant, tour operator, or service business on the North Coast is potentially selling to all three — but a cruise passenger with three hours, a nomad planning a two-week kite trip, and a retiree who lives down the road are looking for different things, in different ways, on different timelines. A website that speaks to only one of them leaves most of the market on the table."),
        h2("Why this is a website problem, not a marketing problem"),
        p("Here's the key insight: each of these three audiences finds businesses the same way — by searching online — but they search for different things. The cruise passenger types \"Sosúa excursions from Amber Cove\" or \"things to do in Puerto Plata cruise.\" The nomad searches \"Cabarete kitesurf lessons\" or \"best surf school Playa Encuentro.\" The resident searches for the same everyday services — a good restaurant, a reliable dentist, a plumber, a gym — that any local Googles. One physical business can capture all three streams, but only if its website is built to be found for each set of searches and to answer each audience's very different questions once they arrive. That's not something a Facebook page or a word-of-mouth phone number can do; it takes a real, structured, multi-audience website."),
        h2("Standing out in an established market"),
        p("There's a flip side to the North Coast's maturity that the frontier towns don't share: there's real competition here. Unlike Pedernales, where most valuable searches have almost no serious local site competing, the North Coast has decades of established businesses, some with a web presence. That means being findable isn't automatic — you have to be better. The good news is that \"better\" is very achievable, because a great many North Coast businesses still run on outdated, slow, non-bilingual, or barely-existent websites. A genuinely fast, professional, properly bilingual site still stands out sharply here — it just has to clear a real bar rather than an empty field. The businesses that invest in doing it right don't just get found; they look more trustworthy than the competitor whose site is a broken 2015 template, and in a market where the customer is choosing between options, looking trustworthy is what closes the booking."),
        h2("Who has the biggest opportunity"),
        p("The three-audience dynamic creates especially strong openings for certain business types:"),
        rich("normal", [run("•  "), run("Watersports schools. Kitesurf, windsurf, and surf schools are the North Coast's signature vertical, clustered on Kite Beach and Playa Encuentro, and they serve both the planning-ahead nomad and the cruise-overflow day visitor. A bookable, photo-rich, bilingual site is the difference between filling a lesson calendar and waiting for walk-ins — exactly the approach we lay out for "), link("tour and excursion operators", "https://www.dr-webstudio.com/en/blog/websites-for-tour-operators-excursions"), run(".")]),
        rich("normal", [run("•  "), run("Dive operators. Sosúa Bay, the Canyon, and the Three Rocks make Sosúa a mature diving destination serving cruise day-trippers and residents alike. Dive shops live and die by online discovery and reviews.")]),
        rich("normal", [run("•  "), run("Adventure and waterfall tours. The 27 Charcos de Damajagua, El Choco National Park, and big-game fishing charters draw all three audiences, and the operators that rank for them capture bookings the resorts and cruise lines would otherwise intermediate.")]),
        rich("normal", [run("•  "), run("Restaurants and everyday services. The resident-expat base means North Coast restaurants and service businesses have a year-round local market on top of tourism — a stability frontier towns lack — but only if residents can find them on Google Maps with a real menu, hours, and location.")]),
        rich("normal", [run("•  "), run("Real estate and rentals. With entry-level oceanfront still reachable and short-term rentals a year-round business thanks to the off-season-proof kite winds, real estate is a major North Coast vertical, and foreign buyers research it entirely online, in English, the way we describe for "), link("real estate websites", "https://www.dr-webstudio.com/en/blog/real-estate-websites-punta-cana"), run(".")]),
        h2("What a North Coast website has to do"),
        p("The winning formula, tuned to the three-audience reality:"),
        rich("normal", [run("•  "), run("Genuinely bilingual — and built for a multilingual community. English and Spanish are the baseline, but the North Coast's deep European expat presence means German and French traffic matter too. Each language needs its own real, indexed pages, built the way we describe in "), link("bilingual SEO", "https://www.dr-webstudio.com/en/blog/seo-bilingue-posicionarse-ingles-espanol-sin-perjudicar-ninguno"), run(", not a translate button.")]),
        rich("normal", [run("•  "), run("Fast on mobile. Every one of the three audiences researches on a phone — the cruise passenger on ship Wi-Fi, the nomad between sessions, the resident on the go — and "), link("speed converts directly into bookings", "https://www.dr-webstudio.com/en/blog/core-web-vitals-como-la-velocidad-afecta-tus-ventas-online"), run(".")]),
        rich("normal", [run("•  "), run("Photo-forward, without the weight. The North Coast sells on action and scenery — a kite arcing over Kite Beach, the reef at Three Rocks, a waterfall at Damajagua — but heavy galleries kill mobile speed, so "), link("image optimization", "https://www.dr-webstudio.com/en/blog/optimizacion-imagenes-sitios-web-turismo-fotos-alta-calidad-carga-rapida"), run(" is essential.")]),
        rich("normal", [run("•  "), run("WhatsApp-connected, with online booking and deposits. Bookings close in a chat and the cruise visitor needs to lock something in fast, so one-tap "), link("WhatsApp, Maps, and Instagram", "https://www.dr-webstudio.com/en/blog/how-to-connect-website-whatsapp-google-maps-instagram"), run(" plus the ability to take a deposit via "), link("local online payments", "https://www.dr-webstudio.com/en/blog/how-to-accept-online-payments-dominican-republic"), run(" turns interest into a confirmed sale.")]),
        rich("normal", [run("•  "), run("Content that answers each audience's questions. A page for \"kitesurf lessons for beginners in Cabarete,\" another for \"half-day Sosúa snorkeling from the cruise port,\" another aimed at residents — content built around what each of the three actually searches is what ranks and converts across all of them.")]),
        h2("An honest word on the trade-offs"),
        p("The North Coast's maturity is mostly an advantage — proven demand, year-round income, a resident customer base — but it's worth being clear-eyed about the trade-offs versus a frontier. Competition is real, so a website here has to be genuinely good to stand out, not merely present; a thrown-together site won't clear the bar the way it might in an emptier market. The region also has infrastructure quirks residents know well, including occasional power interruptions, which makes reliable hosting and a site that loads fast on imperfect connections more than a nicety. And serving three audiences well takes a little more thought than serving one — the payoff is a much larger addressable market, but it does mean building deliberately rather than throwing up a single generic page. None of this is a drawback so much as a reason to build properly: the North Coast rewards businesses that take their web presence seriously, precisely because enough competitors still don't."),
        h2("Build for all three, from anywhere"),
        rich("normal", [run("Web development is remote work, so a business in Cabarete, Sosúa, or Puerto Plata doesn't need a developer in town — it needs one who understands the Dominican tourism market and the North Coast's uniquely layered audience of cruise visitors, long-stay nomads, and resident expats. That's exactly what we do at "), link("DR Web Studio", "https://www.dr-webstudio.com/en"), run(": fast, bilingual, bookable websites for Dominican businesses, with WhatsApp and local payments wired in and the first year of maintenance included. Whether you're filling a kite-lesson calendar, a dive boat, a dinner service, or a rental pipeline, the site that speaks to all three of your audiences is the one that wins the North Coast. "), link("Contact us for a free consultation", "https://www.dr-webstudio.com/en/contact"), run(" and let's build it.")]),
      ],
      es: [
        p("La Costa Norte de República Dominicana no es la próxima gran cosa — es la cosa establecida que nunca dejó de crecer. Mientras la atención persigue fronteras emergentes como Miches y Pedernales, Puerto Plata, Sosúa y Cabarete se han convertido silenciosamente en la región con el crecimiento de expatriados más fuerte en quince años, anclada por dos puertos de cruceros, la capital mundial del kitesurf, y una comunidad extranjera residente de varios miles de personas. Pero esa madurez viene con un desafío que los pueblos frontera no enfrentan: la Costa Norte no es un solo mercado, son tres, llegando por tres rutas completamente distintas, y el negocio local que gana aquí es aquel cuya página web les habla a los tres. Aquí está cómo construir para ella."),
        h2("Tres audiencias, una región"),
        p("La mayoría de los destinos turísticos dominicanos sirven a un tipo de visitante. La Costa Norte sirve a tres a la vez, y difícilmente podrían ser más distintos:"),
        rich("normal", [run("•  "), run("El crucerista de un día. Dos puertos — Amber Cove y Taíno Bay — vierten cruceristas hacia Puerto Plata, que "), link("manejó cerca del 78% de todas las llegadas de cruceros dominicanas en 2025, más de dos millones de pasajeros entre las dos terminales", "https://www.caribjournal.com/2026/01/12/dominican-republic-cruises-booming/"), run(". La excursión de un día más visitada desde ambos es Sosúa, a unos treinta o cuarenta minutos, donde un ecosistema completo de excursiones ofrece días de playa, snorkel y paseos en catamarán. Este visitante tiene unas pocas horas, investiga desde el barco o el muelle, y reserva rápido o no reserva.")]),
        rich("normal", [run("•  "), run("El viajero independiente de estadía larga y el nómada digital. Los constantes vientos alisios del Atlántico de Cabarete la hacen el indiscutible centro de kitesurf y windsurf del Caribe, atrayendo atletas, trabajadores remotos y viajeros de estilo de vida que llegan en avión y se quedan semanas, no horas. Este visitante planifica con antelación, compara opciones con cuidado, y gasta a lo largo de un horizonte extendido.")]),
        rich("normal", [run("•  "), run("El expatriado residente. Miles de residentes norteamericanos y europeos viven a lo largo de la costa todo el año — los analistas inmobiliarios describen la Costa Norte como la región con "), link("el crecimiento de expatriados más fuerte en quince años", "https://www.drlistings.com/blog/dr-tourism-culture-lifestyle/"), run(" — y no son turistas en absoluto. Son clientes locales que necesitan los mismos servicios que necesita un residente en cualquier parte, y que los investigan en línea exactamente como lo hacían en su país.")]),
        p("Un restaurante, operador de tours o negocio de servicios en la Costa Norte potencialmente le vende a los tres — pero un crucerista con tres horas, un nómada planeando un viaje de kite de dos semanas, y un jubilado que vive calle abajo buscan cosas distintas, de maneras distintas, en tiempos distintos. Una página web que le habla a solo uno de ellos deja la mayor parte del mercado sobre la mesa."),
        h2("Por qué esto es un problema de página web, no de marketing"),
        p("Aquí está la clave: cada una de estas tres audiencias encuentra negocios de la misma manera — buscando en línea — pero buscan cosas distintas. El crucerista escribe \"excursiones Sosúa desde Amber Cove\" o \"qué hacer en Puerto Plata crucero\". El nómada busca \"clases de kitesurf Cabarete\" o \"mejor escuela de surf Playa Encuentro\". El residente busca los mismos servicios cotidianos — un buen restaurante, un dentista confiable, un plomero, un gimnasio — que cualquier local googlea. Un solo negocio físico puede capturar los tres flujos, pero solo si su página web está construida para ser encontrada por cada conjunto de búsquedas y para responder las muy distintas preguntas de cada audiencia una vez que llegan. Eso no es algo que una página de Facebook o un número de boca en boca puedan hacer; requiere una página web real, estructurada y multi-audiencia."),
        h2("Destacar en un mercado establecido"),
        p("Hay una otra cara de la madurez de la Costa Norte que los pueblos frontera no comparten: aquí hay competencia real. A diferencia de Pedernales, donde la mayoría de las búsquedas valiosas casi no tienen un sitio local serio compitiendo, la Costa Norte tiene décadas de negocios establecidos, algunos con presencia web. Eso significa que ser encontrable no es automático — tienes que ser mejor. La buena noticia es que \"mejor\" es muy alcanzable, porque muchísimos negocios de la Costa Norte todavía funcionan con páginas web anticuadas, lentas, no bilingües o apenas existentes. Un sitio genuinamente rápido, profesional y correctamente bilingüe todavía destaca marcadamente aquí — solo tiene que superar una barra real en vez de un campo vacío. Los negocios que invierten en hacerlo bien no solo son encontrados; se ven más confiables que el competidor cuyo sitio es una plantilla rota de 2015, y en un mercado donde el cliente elige entre opciones, verse confiable es lo que cierra la reserva."),
        h2("Quién tiene la oportunidad más grande"),
        p("La dinámica de tres audiencias crea aperturas especialmente fuertes para ciertos tipos de negocio:"),
        rich("normal", [run("•  "), run("Escuelas de deportes acuáticos. Las escuelas de kitesurf, windsurf y surf son el vertical insignia de la Costa Norte, agrupadas en Kite Beach y Playa Encuentro, y sirven tanto al nómada que planifica como al visitante de un día del desbordamiento de cruceros. Un sitio reservable, rico en fotos y bilingüe es la diferencia entre llenar un calendario de clases y esperar a los que llegan sin cita — exactamente el enfoque que exponemos para "), link("operadores de tours y excursiones", "https://www.dr-webstudio.com/es/blog/paginas-web-para-operadores-de-tours-y-excursiones"), run(".")]),
        rich("normal", [run("•  "), run("Operadores de buceo. La Bahía de Sosúa, el Cañón y las Tres Rocas hacen de Sosúa un destino de buceo maduro que sirve a cruceristas de un día y residentes por igual. Las tiendas de buceo viven y mueren por el descubrimiento en línea y las reseñas.")]),
        rich("normal", [run("•  "), run("Tours de aventura y cascadas. Los 27 Charcos de Damajagua, el Parque Nacional El Choco y los charters de pesca de altura atraen a las tres audiencias, y los operadores que se posicionan para ellos capturan reservas que de otro modo los resorts y las líneas de crucero intermediarían.")]),
        rich("normal", [run("•  "), run("Restaurantes y servicios cotidianos. La base de expatriados residentes significa que los restaurantes y negocios de servicios de la Costa Norte tienen un mercado local todo el año además del turismo — una estabilidad que los pueblos frontera no tienen — pero solo si los residentes pueden encontrarlos en Google Maps con un menú, horarios y ubicación reales.")]),
        rich("normal", [run("•  "), run("Bienes raíces y alquileres. Con el frente al mar de entrada todavía alcanzable y los alquileres de corto plazo siendo un negocio de todo el año gracias a los vientos de kite a prueba de temporada baja, los bienes raíces son un vertical mayor de la Costa Norte, y los compradores extranjeros los investigan enteramente en línea, en inglés, como describimos para "), link("páginas web inmobiliarias", "https://www.dr-webstudio.com/es/blog/paginas-web-para-inmobiliarias-en-punta-cana"), run(".")]),
        h2("Qué tiene que hacer una página web de la Costa Norte"),
        p("La fórmula ganadora, afinada a la realidad de tres audiencias:"),
        rich("normal", [run("•  "), run("Genuinamente bilingüe — y construida para una comunidad multilingüe. El inglés y el español son la base, pero la profunda presencia de expatriados europeos de la Costa Norte significa que el tráfico en alemán y francés también importa. Cada idioma necesita sus propias páginas reales e indexadas, construidas como describimos en "), link("SEO bilingüe", "https://www.dr-webstudio.com/es/blog/seo-bilingue-posicionarse-ingles-espanol-sin-perjudicar-ninguno"), run(", no un botón de traducción.")]),
        rich("normal", [run("•  "), run("Rápida en móvil. Cada una de las tres audiencias investiga en un teléfono — el crucerista con el Wi-Fi del barco, el nómada entre sesiones, el residente en movimiento — y "), link("la velocidad se convierte directamente en reservas", "https://www.dr-webstudio.com/es/blog/core-web-vitals-como-la-velocidad-afecta-tus-ventas-online"), run(".")]),
        rich("normal", [run("•  "), run("Protagonizada por fotos, sin el peso. La Costa Norte se vende por la acción y el paisaje — un kite arqueándose sobre Kite Beach, el arrecife de las Tres Rocas, una cascada en Damajagua — pero las galerías pesadas matan la velocidad móvil, así que la "), link("optimización de imágenes", "https://www.dr-webstudio.com/es/blog/optimizacion-imagenes-sitios-web-turismo-fotos-alta-calidad-carga-rapida"), run(" es esencial.")]),
        rich("normal", [run("•  "), run("Conectada a WhatsApp, con reserva y depósitos en línea. Las reservas se cierran en un chat y el visitante de crucero necesita asegurar algo rápido, así que "), link("WhatsApp, Maps e Instagram", "https://www.dr-webstudio.com/es/blog/como-conectar-sitio-web-whatsapp-google-maps-instagram"), run(" en un toque más la capacidad de tomar un depósito vía "), link("pagos en línea locales", "https://www.dr-webstudio.com/es/blog/como-aceptar-pagos-en-linea-republica-dominicana"), run(" convierte el interés en una venta confirmada.")]),
        rich("normal", [run("•  "), run("Contenido que responde las preguntas de cada audiencia. Una página para \"clases de kitesurf para principiantes en Cabarete\", otra para \"snorkel de medio día en Sosúa desde el puerto de cruceros\", otra dirigida a residentes — el contenido construido alrededor de lo que cada uno de los tres realmente busca es lo que posiciona y convierte en todos ellos.")]),
        h2("Una palabra honesta sobre las concesiones"),
        p("La madurez de la Costa Norte es mayormente una ventaja — demanda comprobada, ingresos todo el año, una base de clientes residente — pero vale la pena ser claros sobre las concesiones frente a una frontera. La competencia es real, así que una página web aquí tiene que ser genuinamente buena para destacar, no meramente estar presente; un sitio improvisado no superará la barra como podría hacerlo en un mercado más vacío. La región también tiene peculiaridades de infraestructura que los residentes conocen bien, incluidas interrupciones ocasionales de energía, lo que hace que un hosting confiable y un sitio que carga rápido en conexiones imperfectas sean más que un lujo. Y servir bien a tres audiencias requiere un poco más de reflexión que servir a una — la recompensa es un mercado direccionable mucho más grande, pero sí significa construir deliberadamente en vez de levantar una sola página genérica. Nada de esto es una desventaja sino más bien una razón para construir bien: la Costa Norte premia a los negocios que se toman en serio su presencia web, precisamente porque suficientes competidores todavía no lo hacen."),
        h2("Construye para los tres, desde donde sea"),
        rich("normal", [run("El desarrollo web es trabajo remoto, así que un negocio en Cabarete, Sosúa o Puerto Plata no necesita un desarrollador en el pueblo — necesita uno que entienda el mercado turístico dominicano y la audiencia únicamente estratificada de la Costa Norte de visitantes de crucero, nómadas de estadía larga y expatriados residentes. Eso es exactamente lo que hacemos en "), link("DR Web Studio", "https://www.dr-webstudio.com/es"), run(": páginas web rápidas, bilingües y reservables para negocios dominicanos, con WhatsApp y pagos locales integrados y el primer año de mantenimiento incluido. Ya sea que estés llenando un calendario de clases de kite, un bote de buceo, un servicio de cena o un flujo de alquileres, el sitio que les habla a tus tres audiencias es el que gana la Costa Norte. "), link("Contáctanos para una consulta gratuita", "https://www.dr-webstudio.com/es/contacto"), run(" y construyámoslo.")]),
      ],
    },
    seo: {
      metaTitle: loc(
        "North Coast Websites: Three Audiences, One Region (2026)",
        "Webs Costa Norte: Tres Audiencias, Una Región (2026)",
      ),
      ogTitle: loc(
        "Three Audiences, One North Coast",
        "Tres Audiencias, Una Costa Norte",
      ),
      ogDescription: loc(
        "Cruise day-trippers, kitesurfing nomads, and resident expats — one region, three markets. The North Coast business that wins is the one whose website speaks to all three.",
        "Cruceristas, nómadas del kitesurf y expatriados residentes — una región, tres mercados. El negocio de la Costa Norte que gana es aquel cuya web les habla a los tres.",
      ),
      keywords: {
        en: ["North Coast website", "Cabarete kitesurf website", "Sosúa business website", "Puerto Plata web design", "Cabarete Sosúa tourism website"],
        es: ["página web Costa Norte", "página web kitesurf Cabarete", "página web negocio Sosúa", "diseño web Puerto Plata", "página web turismo Cabarete Sosúa"],
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