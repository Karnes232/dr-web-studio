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
    slug: "punta-bergantin-puerto-plata-next-megaproject",
    slugEs: "punta-bergantin-el-proximo-megaproyecto-de-puerto-plata",
    title: loc(
      "Punta Bergantín: Puerto Plata's Megaproject and the Two-Year Window",
      "Punta Bergantín: El Megaproyecto de Puerto Plata y la Ventana de Dos Años",
    ),
    description: loc(
      "Punta Bergantín is Puerto Plata's new megaproject: Meliá under construction, Westin, Hyatt and Marriott coming, first hotels opening 2027-28. The first-mover window is open now.",
      "Punta Bergantín es el nuevo megaproyecto de Puerto Plata: Meliá en construcción, Westin, Hyatt y Marriott en camino, primeros hoteles 2027-28. La ventana de primer movimiento está abierta.",
    ),
    readTime: 9,
    featured: false,
    tags: {
      en: ["Punta Bergantín", "Puerto Plata", "megaproject", "north coast", "first mover", "tourism", "Dominican Republic"],
      es: ["Punta Bergantín", "Puerto Plata", "megaproyecto", "costa norte", "primer movimiento", "turismo", "República Dominicana"],
    },
    categories: ["web-design", "business-tips"],
    publishedAt: "2026-07-28T15:00:00.000Z",
    body: {
      en: [
        rich("normal", [run("The Dominican Republic's north coast has been waiting decades for its second act — and it now has a name, a master plan, and cranes on the ground. Punta Bergantín, a public-private megaproject on more than 10 million square meters of coastline between Puerto Plata and Villa Montellano, is the government's flagship bet to return the country's original tourist region to the front rank. The first resort is already under construction, four more are queued behind it, and the first guests are expected for the 2027–2028 high season. For the local businesses of Puerto Plata, Villa Montellano, Sosúa, and Cabarete, that timeline is not a headline — it's a countdown. Just as we've argued for "), link("Pedernales in the southwest", "https://www.dr-webstudio.com/en/blog/pedernales-cabo-rojo-southwest-digital-frontier"), run(", the businesses that build their digital presence before the wave arrives are the ones that will own it. Here's what's coming, and how to be findable when it does.")]),
        h2("What Punta Bergantín actually is"),
        rich("normal", [run("This is not a rumor-stage project. Punta Bergantín is a master-planned destination — hotels, branded residences, commercial space, a theme park, and a marina concept — being developed through a public-private trust, with Grupo Puntacana among the key players. The scale is Punta Cana-class: "), link("reports from the project's leadership at FITUR 2026 describe up to nine hotels totaling more than 4,500 rooms, with Hyatt, Westin, Marriott, and Meliá among the confirmed brands", "https://www.arecoa.com/destinos/2026/01/22/punta-bergantin-transformara-puerto-plata-con-mas-de-4500-habitaciones/"), run(", plus 1,500 vacation units and 2,500 mixed-use units across a ten-to-fifteen-year build-out. And it has moved past announcements into concrete: the Meliá Bergantín Beach — a 400-room five-star resort developed with Grupo Puntacana, an investment north of US$100 million — broke ground in October 2025, land sales inside the project have reportedly passed US$100 million, and "), link("construction of the first hotels is underway in 2026 with operations targeted for the 2027–2028 high season", "https://www.diariolibre.com/economia/turismo/2025/07/30/punta-bergantin-recibe-respaldo-en-vistas-publicas/3199224"), run(". The stated ambition: lift Puerto Plata's share of international arrivals from around 3% to 9% — roughly 300,000 additional visitors flying into a region minutes from Gregorio Luperón International Airport.")]),
        h2("Why this frontier is different from the others"),
        rich("normal", [run("We've written about the DR's other emerging fronts — Pedernales's cruise-driven southwest, Miches's all-inclusive boom — and Punta Bergantín has a distinct character worth understanding, because it shapes the opportunity. Unlike Pedernales, this isn't an isolated frontier: it's plugging a megaproject into an already-functioning tourism ecosystem. Puerto Plata already has an international airport with direct flights from three continents, two of the country's busiest cruise ports in Amber Cove and Taíno Bay, and the established markets of "), link("Sosúa and Cabarete just down the road", "https://www.dr-webstudio.com/en/blog/north-coast-three-audiences-puerto-plata-sosua-cabarete"), run(". That means the businesses around Punta Bergantín won't be waiting years for infrastructure — the customers, roads, and flights exist today, and the megaproject adds a step-change of demand on top. It also means the ripple effects start before the hotels open: thousands of construction workers, suppliers, and project staff need housing, food, transport, and services right now, and the real-estate market around Villa Montellano is already moving on expectations, the same dynamic we described for "), link("real estate websites", "https://www.dr-webstudio.com/en/blog/real-estate-websites-punta-cana"), run(" elsewhere on the coast.")]),
        h2("The window: two years to plant your flag"),
        rich("normal", [run("Here's the strategic math, and it's the same math that made early movers rich in Punta Cana. Search rankings compound with time: a website that launches now spends 2026 and 2027 getting indexed, accumulating reviews, links, and authority — so that when the Meliá's first guests search \"things to do near Punta Bergantín,\" \"excursions Puerto Plata,\" \"villa rental Villa Montellano,\" the businesses that built early are the ones on page one, defending positions that get harder to take every month. A website launched the season the hotels open is already behind. And unlike a pure frontier bet, this window has a firm anchor: the first resort is physically under construction with a public opening target. The uncertainty isn't whether meaningful demand arrives — Meliá, Westin, and Hyatt have already made that bet with their capital — it's only exactly when, and \"2027–2028 with possible slippage\" is precisely the timeline that rewards building a web presence in 2026.")]),
        h2("Who has the biggest opening"),
        p("The megaproject's shape creates especially clear opportunities for particular businesses:"),
        rich("normal", [run("•  "), run("Tour and excursion operators. Punta Bergantín's guests will be minutes from the 27 Charcos de Damajagua, Mount Isabel's cable car, whale season in nearby Samaná, and the whole north coast adventure menu — and resort guests research independent excursions online, exactly the playbook in our guide for "), link("tour operators", "https://www.dr-webstudio.com/en/blog/websites-for-tour-operators-excursions"), run(".")]),
        rich("normal", [run("•  "), run("Real estate and property management. The land rush is already on, residences and vacation units are part of the master plan itself, and the foreign buyers evaluating the \"next Punta Cana\" do all their research online, in English.")]),
        rich("normal", [run("•  "), run("Restaurants, transport, and services in Puerto Plata and Villa Montellano. A destination adding thousands of rooms needs everything around it — the businesses findable on Google when the demand lands will absorb it.")]),
        rich("normal", [run("•  "), run("Construction-adjacent and B2B suppliers. Before a single tourist checks in, a decade of build-out means contractors, suppliers, and professional services with a credible web presence can win project business — the same B2B logic we laid out for "), link("Santiago", "https://www.dr-webstudio.com/en/blog/santiago-economic-engine-business-websites"), run(".")]),
        h2("What a Punta Bergantín-ready website looks like"),
        rich("normal", [run("The formula follows the north coast playbook with the frontier timing layered on: genuinely bilingual pages built for "), link("real bilingual SEO", "https://www.dr-webstudio.com/en/blog/seo-bilingue-posicionarse-ingles-espanol-sin-perjudicar-ninguno"), run(", since the incoming guests skew North American and European; "), link("fast on mobile", "https://www.dr-webstudio.com/en/blog/core-web-vitals-como-la-velocidad-afecta-tus-ventas-online"), run(", because every one of them researches on a phone; connected to WhatsApp and Google Maps; able to take bookings and "), link("online payments", "https://www.dr-webstudio.com/en/blog/how-to-accept-online-payments-dominican-republic"), run("; and — the timing-specific move — publishing content now for the searches that will exist later: \"restaurants near Punta Bergantín,\" \"Villa Montellano property,\" \"Puerto Plata airport transfer.\" Those searches are low-volume today, which is exactly why they're winnable today; they won't stay either.")]),
        h2("The region is already warming up"),
        p("One more reason the timing is less speculative than a typical frontier: the demand engine around Punta Bergantín is already running. Puerto Plata's two cruise terminals are among the busiest in the country — the Dominican Port Authority's early-2026 schedules showed well over a hundred cruise calls across the national ports in January alone, with Taíno Bay and Amber Cove carrying the largest share — which means hundreds of thousands of visitors are already stepping ashore minutes from the project site every season, before a single Bergantín hotel opens. Those cruise passengers are today's practice market: the excursion operator, restaurant, or transfer service that builds a bookable web presence now can earn from the cruise flow immediately, while the same site accumulates the rankings that will capture the stay-over wave when the resorts open. It's the rare frontier where the bridge income and the long-term position come from the same investment — build once, get paid twice."),
        h2("An honest word on the risks"),
        p("Megaprojects earn skepticism, and this one deserves the honest version. Timelines slip — the project's own history includes years of relaunches before the current momentum, and a 10-to-15-year build-out will not move in a straight line. The 4,500-room figure is a master-plan ambition, not a signed guarantee; what's bankable today is the smaller first phase actually under construction. Large-scale development also brings real questions for Villa Montellano's community and environment that the project's sustainability commitments will be measured against. None of this changes the core calculation for a local business, for the same reason we gave in Pedernales: a professional website is a modest, one-time investment, the first phase is funded and physically rising, and the surrounding region's tourism economy already works — so the downside of building early is small, while the upside of owning the searches when 300,000 new visitors arrive is a decade of compounding advantage. The risk worth worrying about isn't that you build too early. It's that you build after everyone else does."),
        h2("Build before the ribbon is cut"),
        rich("normal", [run("At "), link("DR Web Studio", "https://www.dr-webstudio.com/en"), run(" we build exactly what this moment calls for: fast, bilingual, bookable websites for Dominican businesses, with WhatsApp, Maps, and local payments wired in and the first year of maintenance included — and we've made the north coast's digital opportunity something of a specialty. If your business is anywhere in Puerto Plata's orbit and you can read a construction timeline, you know what the next two years are for. "), link("Contact us for a free consultation", "https://www.dr-webstudio.com/en/contact"), run(" and let's have you ranking before the first guest checks in.")]),
      ],
      es: [
        rich("normal", [run("La costa norte de República Dominicana ha esperado décadas por su segundo acto — y ahora tiene un nombre, un plan maestro y grúas en el terreno. Punta Bergantín, un megaproyecto público-privado sobre más de 10 millones de metros cuadrados de costa entre Puerto Plata y Villa Montellano, es la apuesta insignia del gobierno para devolver a la región turística original del país a la primera fila. El primer resort ya está en construcción, cuatro más hacen fila detrás, y los primeros huéspedes se esperan para la temporada alta 2027–2028. Para los negocios locales de Puerto Plata, Villa Montellano, Sosúa y Cabarete, ese cronograma no es un titular — es una cuenta regresiva. Igual que argumentamos para "), link("Pedernales en el suroeste", "https://www.dr-webstudio.com/es/blog/pedernales-y-cabo-rojo-suroeste-proxima-frontera-digital"), run(", los negocios que construyen su presencia digital antes de que llegue la ola son los que la van a dominar. Aquí está lo que viene, y cómo ser encontrable cuando llegue.")]),
        h2("Qué es realmente Punta Bergantín"),
        rich("normal", [run("Este no es un proyecto en etapa de rumor. Punta Bergantín es un destino planificado — hoteles, residencias de marca, espacio comercial, un parque temático y un concepto de marina — desarrollado a través de un fideicomiso público-privado, con Grupo Puntacana entre los actores clave. La escala es de clase Punta Cana: "), link("los reportes del liderazgo del proyecto en FITUR 2026 describen hasta nueve hoteles con más de 4,500 habitaciones, con Hyatt, Westin, Marriott y Meliá entre las marcas confirmadas", "https://www.arecoa.com/destinos/2026/01/22/punta-bergantin-transformara-puerto-plata-con-mas-de-4500-habitaciones/"), run(", más 1,500 unidades vacacionales y 2,500 unidades de uso mixto en un desarrollo de diez a quince años. Y ya pasó de anuncios a concreto: el Meliá Bergantín Beach — un resort cinco estrellas de 400 habitaciones desarrollado con Grupo Puntacana, una inversión que supera los US$100 millones — rompió tierra en octubre de 2025, las ventas de terrenos dentro del proyecto reportadamente pasaron los US$100 millones, y "), link("la construcción de los primeros hoteles avanza en 2026 con operaciones apuntadas a la temporada alta 2027–2028", "https://www.diariolibre.com/economia/turismo/2025/07/30/punta-bergantin-recibe-respaldo-en-vistas-publicas/3199224"), run(". La ambición declarada: subir la participación de Puerto Plata en las llegadas internacionales de alrededor del 3% al 9% — unos 300,000 visitantes adicionales volando a una región a minutos del Aeropuerto Internacional Gregorio Luperón.")]),
        h2("Por qué esta frontera es distinta de las otras"),
        rich("normal", [run("Hemos escrito sobre los otros frentes emergentes de RD — el suroeste de cruceros de Pedernales, el auge todo-incluido de Miches — y Punta Bergantín tiene un carácter distinto que vale la pena entender, porque moldea la oportunidad. A diferencia de Pedernales, esta no es una frontera aislada: es enchufar un megaproyecto a un ecosistema turístico que ya funciona. Puerto Plata ya tiene un aeropuerto internacional con vuelos directos desde tres continentes, dos de los puertos de cruceros más activos del país en Amber Cove y Taíno Bay, y los mercados establecidos de "), link("Sosúa y Cabarete carretera abajo", "https://www.dr-webstudio.com/es/blog/costa-norte-tres-audiencias-puerto-plata-sosua-cabarete"), run(". Eso significa que los negocios alrededor de Punta Bergantín no estarán esperando años por infraestructura — los clientes, las carreteras y los vuelos existen hoy, y el megaproyecto agrega un salto de demanda encima. También significa que los efectos de onda empiezan antes de que abran los hoteles: miles de trabajadores de construcción, proveedores y personal del proyecto necesitan vivienda, comida, transporte y servicios ahora mismo, y el mercado inmobiliario alrededor de Villa Montellano ya se está moviendo sobre expectativas, la misma dinámica que describimos para "), link("páginas web inmobiliarias", "https://www.dr-webstudio.com/es/blog/paginas-web-para-inmobiliarias-en-punta-cana"), run(" en otras partes de la costa.")]),
        h2("La ventana: dos años para plantar tu bandera"),
        rich("normal", [run("Aquí está la matemática estratégica, y es la misma matemática que enriqueció a los primeros en moverse en Punta Cana. El posicionamiento en búsqueda se acumula con el tiempo: una página web que se lanza ahora pasa 2026 y 2027 indexándose, acumulando reseñas, enlaces y autoridad — para que cuando los primeros huéspedes del Meliá busquen \"qué hacer cerca de Punta Bergantín,\" \"excursiones Puerto Plata,\" \"alquiler de villa Villa Montellano,\" los negocios que construyeron temprano sean los de la primera página, defendiendo posiciones que se vuelven más difíciles de tomar cada mes. Una página lanzada la temporada en que abren los hoteles ya llega atrasada. Y a diferencia de una apuesta de frontera pura, esta ventana tiene un ancla firme: el primer resort está físicamente en construcción con una meta pública de apertura. La incertidumbre no es si llega demanda significativa — Meliá, Westin y Hyatt ya hicieron esa apuesta con su capital — es solo exactamente cuándo, y \"2027–2028 con posible atraso\" es precisamente el cronograma que premia construir una presencia web en 2026.")]),
        h2("Quién tiene la apertura más grande"),
        p("La forma del megaproyecto crea oportunidades especialmente claras para negocios particulares:"),
        rich("normal", [run("•  "), run("Operadores de tours y excursiones. Los huéspedes de Punta Bergantín estarán a minutos de los 27 Charcos de Damajagua, el teleférico del Monte Isabel, la temporada de ballenas en la cercana Samaná y todo el menú de aventura de la costa norte — y los huéspedes de resort investigan excursiones independientes en línea, exactamente el playbook de nuestra guía para "), link("operadores de tours", "https://www.dr-webstudio.com/es/blog/paginas-web-para-operadores-de-tours-y-excursiones"), run(".")]),
        rich("normal", [run("•  "), run("Bienes raíces y administración de propiedades. La fiebre de terrenos ya empezó, las residencias y unidades vacacionales son parte del propio plan maestro, y los compradores extranjeros evaluando el \"próximo Punta Cana\" hacen toda su investigación en línea, en inglés.")]),
        rich("normal", [run("•  "), run("Restaurantes, transporte y servicios en Puerto Plata y Villa Montellano. Un destino que agrega miles de habitaciones necesita todo a su alrededor — los negocios encontrables en Google cuando aterrice la demanda serán los que la absorban.")]),
        rich("normal", [run("•  "), run("Proveedores B2B y ligados a la construcción. Antes de que un solo turista haga check-in, una década de desarrollo significa que contratistas, proveedores y servicios profesionales con una presencia web creíble pueden ganar negocio del proyecto — la misma lógica B2B que expusimos para "), link("Santiago", "https://www.dr-webstudio.com/es/blog/santiago-motor-economico-paginas-web-de-negocios"), run(".")]),
        h2("Cómo se ve una página web lista para Punta Bergantín"),
        rich("normal", [run("La fórmula sigue el playbook de la costa norte con el tiempo de frontera superpuesto: páginas genuinamente bilingües construidas para "), link("SEO bilingüe real", "https://www.dr-webstudio.com/es/blog/seo-bilingue-posicionarse-ingles-espanol-sin-perjudicar-ninguno"), run(", ya que los huéspedes que vienen tienden a ser norteamericanos y europeos; "), link("rápida en móvil", "https://www.dr-webstudio.com/es/blog/core-web-vitals-como-la-velocidad-afecta-tus-ventas-online"), run(", porque cada uno de ellos investiga en un teléfono; conectada a WhatsApp y Google Maps; capaz de tomar reservas y "), link("pagos en línea", "https://www.dr-webstudio.com/es/blog/como-aceptar-pagos-en-linea-republica-dominicana"), run("; y — la jugada específica del momento — publicando contenido ahora para las búsquedas que existirán después: \"restaurantes cerca de Punta Bergantín,\" \"propiedades Villa Montellano,\" \"traslado aeropuerto Puerto Plata.\" Esas búsquedas son de bajo volumen hoy, que es exactamente por qué son ganables hoy; tampoco se quedarán así.")]),
        h2("La región ya se está calentando"),
        p("Una razón más por la que el momento es menos especulativo que una frontera típica: el motor de demanda alrededor de Punta Bergantín ya está corriendo. Las dos terminales de cruceros de Puerto Plata están entre las más activas del país — los calendarios de inicios de 2026 de la Autoridad Portuaria Dominicana mostraban bastante más de cien escalas de crucero entre los puertos nacionales solo en enero, con Taíno Bay y Amber Cove cargando la mayor parte — lo que significa que cientos de miles de visitantes ya están pisando tierra a minutos del sitio del proyecto cada temporada, antes de que abra un solo hotel de Bergantín. Esos cruceristas son el mercado de práctica de hoy: el operador de excursiones, restaurante o servicio de traslados que construye una presencia web reservable ahora puede ganar del flujo de cruceros de inmediato, mientras el mismo sitio acumula el posicionamiento que capturará la ola de huéspedes de estadía cuando abran los resorts. Es la rara frontera donde el ingreso puente y la posición de largo plazo salen de la misma inversión — construye una vez, cobra dos veces."),
        h2("Una palabra honesta sobre los riesgos"),
        p("Los megaproyectos se ganan el escepticismo, y este merece la versión honesta. Los cronogramas se atrasan — la propia historia del proyecto incluye años de relanzamientos antes del impulso actual, y un desarrollo de 10 a 15 años no se moverá en línea recta. La cifra de 4,500 habitaciones es una ambición del plan maestro, no una garantía firmada; lo bancable hoy es la primera fase más pequeña realmente en construcción. El desarrollo a gran escala también trae preguntas reales para la comunidad y el ambiente de Villa Montellano contra las cuales se medirán los compromisos de sostenibilidad del proyecto. Nada de esto cambia el cálculo central para un negocio local, por la misma razón que dimos en Pedernales: una página web profesional es una inversión modesta y de una sola vez, la primera fase está financiada y físicamente levantándose, y la economía turística de la región circundante ya funciona — así que el lado negativo de construir temprano es pequeño, mientras que el potencial de dominar las búsquedas cuando lleguen 300,000 visitantes nuevos es una década de ventaja acumulándose. El riesgo del que vale la pena preocuparse no es construir demasiado temprano. Es construir después de que todos los demás lo hagan."),
        h2("Construye antes de que corten la cinta"),
        rich("normal", [run("En "), link("DR Web Studio", "https://www.dr-webstudio.com/es"), run(" construimos exactamente lo que este momento pide: páginas web rápidas, bilingües y reservables para negocios dominicanos, con WhatsApp, Maps y pagos locales integrados y el primer año de mantenimiento incluido — y hemos hecho de la oportunidad digital de la costa norte algo así como una especialidad. Si tu negocio está en cualquier parte de la órbita de Puerto Plata y sabes leer un cronograma de construcción, sabes para qué son los próximos dos años. "), link("Contáctanos para una consulta gratuita", "https://www.dr-webstudio.com/es/contacto"), run(" y tengámoste posicionado antes de que el primer huésped haga check-in.")]),
      ],
    },
    seo: {
      metaTitle: loc(
        "Punta Bergantín: The Two-Year Window (2026)",
        "Punta Bergantín: La Ventana de Dos Años (2026)",
      ),
      ogTitle: loc(
        "Punta Bergantín and the Two-Year Window",
        "Punta Bergantín y la Ventana de Dos Años",
      ),
      ogDescription: loc(
        "A 10-million-m² master-planned destination, ~4,500 rooms, Meliá already building, operations from 2027. The businesses that build their web presence now will own the searches.",
        "Un destino planificado de 10 millones de m², ~4,500 habitaciones, Meliá ya construyendo, operaciones desde 2027. Los negocios que construyan su presencia web ahora dominarán las búsquedas.",
      ),
      keywords: {
        en: ["Punta Bergantin project", "Puerto Plata development", "Punta Bergantin hotels", "Villa Montellano real estate", "north coast megaproject website"],
        es: ["proyecto Punta Bergantín", "desarrollo Puerto Plata", "hoteles Punta Bergantín", "bienes raíces Villa Montellano", "página web megaproyecto costa norte"],
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