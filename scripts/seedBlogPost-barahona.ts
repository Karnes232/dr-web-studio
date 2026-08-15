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
    slug: "barahona-southwest-coast-websites",
    slugEs: "barahona-y-la-costa-suroeste-paginas-web",
    title: loc(
      "Barahona & the Southwest Coast: Where Dominicans Vacation",
      "Barahona y la Costa Suroeste: Donde Vacacionan los Dominicanos",
    ),
    description: loc(
      "Barahona is where Dominicans vacation: larimar, coffee, Bahoruco and untouched beaches. Why the southwest base has a domestic-first market and a wide-open digital gap.",
      "Barahona es donde vacacionan los dominicanos: larimar, café, Bahoruco y playas vírgenes. Por qué la base del suroeste tiene un mercado doméstico y una brecha digital abierta.",
    ),
    readTime: 9,
    featured: false,
    tags: {
      en: ["Barahona", "southwest", "ecotourism", "larimar", "Bahoruco", "birding", "domestic tourism", "Dominican Republic"],
      es: ["Barahona", "suroeste", "ecoturismo", "larimar", "Bahoruco", "observación de aves", "turismo doméstico", "República Dominicana"],
    },
    categories: ["web-design", "business-tips"],
    publishedAt: "2026-08-04T14:00:00.000Z",
    body: {
      en: [
        p("There's a Dominican Republic that Dominicans keep for themselves. It's in the southwest, where the Sierra de Bahoruco falls straight into the Caribbean, where rivers of cold mountain water run right into the sea, where coffee grows in the highlands and the only larimar deposit on Earth sits in the hills above the coast. Barahona is not a resort destination and has never tried to be — it's the place where Dominican families go on vacation, where birders and ecotourists come for the biosphere reserve, and where the road south toward Pedernales is one of the most beautiful drives in the Caribbean. For the businesses of this region, the opportunity is unusual and specific: a real, established, year-round market with almost no serious online competition. Here's how to take it."),
        h2("The southwest's established base"),
        rich("normal", [run("If "), link("Pedernales is the frontier", "https://www.dr-webstudio.com/en/blog/pedernales-cabo-rojo-southwest-digital-frontier"), run(", Barahona is the base camp. It's the provincial capital and the region's functioning hub — hotels, restaurants, tour operators, a coastal highway, and even its own small airport at María Montez — and it's the gateway virtually every visitor to the southwest passes through. What makes it worth a business's attention is the depth and variety of what's actually here. The official tourism board describes Barahona as "), link("one of the country's most authentic and naturally diverse destinations, where stone beaches, cold rivers flowing into the sea, and lush mountain scenery create a unique Caribbean landscape", "https://www.godominicanrepublic.com/destinations/barahona"), run(". Concretely, that means San Rafael and Los Patos with their river-fed natural pools, the surf break at Bahoruco, the Sierra de Bahoruco National Park at the heart of a UNESCO biosphere reserve, Lago Enriquillo, the coffee route in the highlands, the larimar mines above La Ciénaga, and — an hour and a half further south — Bahía de las Águilas. That's a portfolio most destinations would envy, and it works twelve months a year.")]),
        h2("The market nobody talks about: domestic first"),
        rich("normal", [run("Here's what makes Barahona genuinely different from every other destination we've covered. Punta Cana serves international tourists. Miches serves all-inclusive guests. The north coast serves cruise passengers and expats. Barahona's core market is Dominican — families from Santo Domingo and the interior taking weekends and holidays, escaping to the rivers and stone beaches, filling the hotels at Semana Santa and through the summer. Layered on top is a smaller but high-value international stream: birders coming specifically for the Sierra de Bahoruco (some of the best birding in the Caribbean), ecotourists, and the growing trickle of travelers extending a Bahía de las Águilas trip into the wider region. This dual audience shapes everything about the web strategy — Spanish comes first here in a way it doesn't on the east coast, and the calendar runs on Dominican holidays, not northern winters.")]),
        h2("The digital gap is the opportunity"),
        rich("normal", [run("Now the part that should get a local business owner's attention. Barahona has real, proven, recurring demand — and almost no serious web presence serving it. The hotels are known by name and word of mouth; the tour operators are found through Facebook, hotel front desks, or by asking around; the restaurants exist on Google Maps at best. Meanwhile the searches are happening every single day: \"qué hacer en Barahona,\" \"hoteles Barahona,\" \"tour Bahía de las Águilas desde Barahona,\" \"playas de Barahona,\" and their English equivalents. In Punta Cana, ranking for a tourism keyword means fighting hundreds of well-funded competitors. Here, a properly built, genuinely bilingual site can reach page one for meaningful terms in months, because the field is close to empty. That's the same first-mover math we described in Pedernales — but with a crucial difference: in Barahona the customers are already arriving. You don't have to wait for an airport or a megaproject. The demand exists now; it's simply being served by whoever the visitor happens to stumble upon.")]),
        h2("Who has the biggest opening"),
        rich("normal", [run("•  "), run("Tour and excursion operators. This is the region's clearest opportunity. Bahía de las Águilas trips, Sierra de Bahoruco birding, the larimar mines, Lago Enriquillo, the coffee route, and waterfall and cave tours are all bookable products that visitors research online — exactly the playbook in our guide for "), link("tour operators", "https://www.dr-webstudio.com/en/blog/websites-for-tour-operators-excursions"), run(". Specialist birding operators in particular serve an international clientele that books months ahead and pays well.")]),
        rich("normal", [run("•  "), run("Hotels, ecolodges and cabañas. Barahona's lodging is independent and character-driven — the very definition of businesses that need direct booking to escape platform commissions and reach travelers directly.")]),
        rich("normal", [run("•  "), run("Restaurants and roadside businesses. The coastal highway is the region's artery, and the businesses findable on Google Maps with real photos and hours capture the constant flow of road-tripping Dominican families.")]),
        rich("normal", [run("•  "), run("Larimar and artisan producers. Barahona sits on the only larimar in the world, and jewelry workshops here sell a product with genuine international demand — a natural fit for an "), link("online store", "https://www.dr-webstudio.com/en/blog/how-to-start-selling-online-dominican-republic"), run(" that reaches far beyond the people who drive past the workshop.")]),
        rich("normal", [run("•  "), run("Coffee producers and agritourism. The Sierra de Bahoruco coffee route turns working farms into experiences, and the product itself sells online to a specialty market that pays a premium for origin.")]),
        h2("What a Barahona website has to do"),
        p("The formula, tuned to the region's realities:"),
        rich("normal", [run("•  "), run("Spanish-first, but genuinely bilingual. The core market is Dominican, so Spanish leads — but the birders, ecotourists, and international visitors are the high-value segment, which makes real English pages, built with "), link("proper bilingual architecture", "https://www.dr-webstudio.com/en/blog/seo-bilingue-posicionarse-ingles-espanol-sin-perjudicar-ninguno"), run(", essential rather than optional.")]),
        rich("normal", [run("•  "), run("Fast on mobile, and resilient. Visitors research on phones, often on patchy rural connections along the coastal highway — so "), link("speed isn't a luxury here", "https://www.dr-webstudio.com/en/blog/core-web-vitals-como-la-velocidad-afecta-tus-ventas-online"), run(", it's whether your page loads at all.")]),
        rich("normal", [run("•  "), run("Photo-forward, without the weight. Barahona sells itself on scenery — the cliffs, the river pools, the blue of larimar — but heavy galleries kill mobile speed, which is what "), link("image optimization", "https://www.dr-webstudio.com/en/blog/optimizacion-imagenes-sitios-web-turismo-fotos-alta-calidad-carga-rapida"), run(" solves.")]),
        rich("normal", [run("•  "), run("WhatsApp and deposits, because this is a cash region. Bookings close in chat, so one-tap "), link("WhatsApp and Maps", "https://www.dr-webstudio.com/en/blog/how-to-connect-website-whatsapp-google-maps-instagram"), run(" is the baseline — and in a region where ATMs are scarce outside the city, the operator who can take an "), link("online deposit", "https://www.dr-webstudio.com/en/blog/how-to-accept-online-payments-dominican-republic"), run(" removes a real barrier for a visitor planning from Santo Domingo.")]),
        rich("normal", [run("•  "), run("Practical content that ranks. Pages answering what travelers actually ask — how to get to Bahía de las Águilas from Barahona, when the birding season is best, whether you need 4x4 for the larimar mines — capture planners weeks ahead and rank for terms nobody local is competing for.")]),
        h2("An honest word on the region"),
        rich("normal", [run("Barahona rewards realism. Infrastructure is genuinely more limited than the resort zones: roads to the best sites can be rough, some attractions need 4x4, connectivity is patchy in the mountains, and the tourism volume, while real, is a fraction of the east coast's. The domestic weekend pattern also means demand concentrates on holidays and weekends rather than spreading evenly. And the region's proximity to the Haitian border shapes some travelers' perceptions, fairly or not. But notice that none of these are reasons a website underperforms — several are reasons it matters more: when a destination is harder to navigate, the business that explains clearly, answers questions honestly, and lets a visitor book with confidence stands out dramatically. Barahona's constraints are exactly what a good website compensates for, and the modest cost of building one against a proven, year-round market is one of the better small bets available in Dominican tourism.")]),
        h2("Build for the southwest, from anywhere"),
        rich("normal", [run("Web development is remote work, so a business in Barahona doesn't need a developer in town — it needs one who understands the Dominican tourism market and the southwest's particular mix of domestic weekenders and international ecotourists. That's exactly what we do at "), link("DR Web Studio", "https://www.dr-webstudio.com/en"), run(": fast, bilingual, bookable websites for Dominican businesses, with WhatsApp and local payments wired in and the first year of maintenance included. Whether you're filling cabañas, birding tours, a larimar workshop's order book, or tables along the coastal highway, the site that gets found is the one that gets the business. "), link("Contact us for a free consultation", "https://www.dr-webstudio.com/en/contact"), run(" and let's put the southwest on the map it deserves.")]),
      ],
      es: [
        p("Hay una República Dominicana que los dominicanos guardan para sí mismos. Está en el suroeste, donde la Sierra de Bahoruco cae directo al Caribe, donde ríos de agua fría de montaña corren hasta el mar, donde el café crece en las alturas y el único depósito de larimar de la Tierra está en las lomas sobre la costa. Barahona no es un destino de resorts y nunca ha intentado serlo — es el lugar donde las familias dominicanas van de vacaciones, donde los observadores de aves y ecoturistas vienen por la reserva de biosfera, y donde la carretera al sur hacia Pedernales es uno de los recorridos más hermosos del Caribe. Para los negocios de esta región, la oportunidad es inusual y específica: un mercado real, establecido y de todo el año con casi ninguna competencia seria en línea. Aquí está cómo tomarla."),
        h2("La base establecida del suroeste"),
        rich("normal", [run("Si "), link("Pedernales es la frontera", "https://www.dr-webstudio.com/es/blog/pedernales-y-cabo-rojo-suroeste-proxima-frontera-digital"), run(", Barahona es el campamento base. Es la capital provincial y el centro funcional de la región — hoteles, restaurantes, operadores de tours, una carretera costera, e incluso su propio pequeño aeropuerto en María Montez — y es la puerta por la que prácticamente todo visitante del suroeste pasa. Lo que la hace digna de la atención de un negocio es la profundidad y variedad de lo que realmente hay aquí. La junta oficial de turismo describe a Barahona como "), link("uno de los destinos más auténticos y naturalmente diversos del país, donde playas de piedra, ríos fríos que desembocan en el mar y un exuberante paisaje montañoso crean un paisaje caribeño único", "https://www.godominicanrepublic.com/destinations/barahona"), run(". En concreto, eso significa San Rafael y Los Patos con sus piscinas naturales alimentadas por ríos, el rompiente de surf en Bahoruco, el Parque Nacional Sierra de Bahoruco en el corazón de una reserva de biosfera UNESCO, el Lago Enriquillo, la ruta del café en las alturas, las minas de larimar sobre La Ciénaga, y — hora y media más al sur — Bahía de las Águilas. Ese es un portafolio que la mayoría de los destinos envidiaría, y funciona doce meses al año.")]),
        h2("El mercado del que nadie habla: doméstico primero"),
        rich("normal", [run("Aquí está lo que hace a Barahona genuinamente distinta de todos los demás destinos que hemos cubierto. Punta Cana sirve a turistas internacionales. Miches sirve a huéspedes de todo-incluido. La costa norte sirve a cruceristas y expatriados. El mercado central de Barahona es dominicano — familias de Santo Domingo y del interior tomando fines de semana y feriados, escapando a los ríos y las playas de piedra, llenando los hoteles en Semana Santa y durante el verano. Superpuesto está un flujo internacional más pequeño pero de alto valor: observadores de aves que vienen específicamente por la Sierra de Bahoruco (de las mejores observaciones de aves del Caribe), ecoturistas, y el goteo creciente de viajeros que extienden un viaje a Bahía de las Águilas hacia la región más amplia. Esta audiencia dual moldea todo sobre la estrategia web — el español va primero aquí de una forma en que no va en la costa este, y el calendario corre sobre feriados dominicanos, no inviernos del norte.")]),
        h2("La brecha digital es la oportunidad"),
        rich("normal", [run("Ahora la parte que debería captar la atención de un dueño de negocio local. Barahona tiene demanda real, comprobada y recurrente — y casi ninguna presencia web seria sirviéndola. Los hoteles se conocen por nombre y de boca en boca; los operadores de tours se encuentran por Facebook, la recepción de un hotel, o preguntando por ahí; los restaurantes existen en Google Maps en el mejor de los casos. Mientras tanto las búsquedas ocurren cada día: \"qué hacer en Barahona,\" \"hoteles Barahona,\" \"tour Bahía de las Águilas desde Barahona,\" \"playas de Barahona,\" y sus equivalentes en inglés. En Punta Cana, posicionarse para una palabra clave de turismo significa pelear contra cientos de competidores bien financiados. Aquí, un sitio bien construido y genuinamente bilingüe puede llegar a la primera página para términos significativos en meses, porque el campo está casi vacío. Es la misma matemática de primer movimiento que describimos en Pedernales — pero con una diferencia crucial: en Barahona los clientes ya están llegando. No tienes que esperar un aeropuerto o un megaproyecto. La demanda existe ahora; simplemente la está atendiendo quien sea con quien el visitante se tropiece.")]),
        h2("Quién tiene la apertura más grande"),
        rich("normal", [run("•  "), run("Operadores de tours y excursiones. Esta es la oportunidad más clara de la región. Los viajes a Bahía de las Águilas, la observación de aves en la Sierra de Bahoruco, las minas de larimar, el Lago Enriquillo, la ruta del café, y los tours de cascadas y cuevas son todos productos reservables que los visitantes investigan en línea — exactamente el playbook de nuestra guía para "), link("operadores de tours", "https://www.dr-webstudio.com/es/blog/paginas-web-para-operadores-de-tours-y-excursiones"), run(". Los operadores especializados en aves en particular sirven a una clientela internacional que reserva con meses de antelación y paga bien.")]),
        rich("normal", [run("•  "), run("Hoteles, ecolodges y cabañas. El alojamiento de Barahona es independiente y con carácter — la definición misma de los negocios que necesitan reserva directa para escapar de las comisiones de plataformas y llegar a los viajeros directamente.")]),
        rich("normal", [run("•  "), run("Restaurantes y negocios de carretera. La carretera costera es la arteria de la región, y los negocios encontrables en Google Maps con fotos y horarios reales capturan el flujo constante de familias dominicanas de viaje.")]),
        rich("normal", [run("•  "), run("Productores de larimar y artesanos. Barahona está sobre el único larimar del mundo, y los talleres de joyería de aquí venden un producto con demanda internacional genuina — un ajuste natural para una "), link("tienda en línea", "https://www.dr-webstudio.com/es/blog/como-empezar-a-vender-en-linea-republica-dominicana"), run(" que llegue mucho más allá de la gente que pasa frente al taller.")]),
        rich("normal", [run("•  "), run("Productores de café y agroturismo. La ruta del café de la Sierra de Bahoruco convierte fincas de trabajo en experiencias, y el producto mismo se vende en línea a un mercado especializado que paga una prima por el origen.")]),
        h2("Qué tiene que hacer una página web de Barahona"),
        p("La fórmula, afinada a las realidades de la región:"),
        rich("normal", [run("•  "), run("Español primero, pero genuinamente bilingüe. El mercado central es dominicano, así que el español lidera — pero los observadores de aves, ecoturistas y visitantes internacionales son el segmento de alto valor, lo que hace las páginas reales en inglés, construidas con "), link("arquitectura bilingüe adecuada", "https://www.dr-webstudio.com/es/blog/seo-bilingue-posicionarse-ingles-espanol-sin-perjudicar-ninguno"), run(", esenciales en vez de opcionales.")]),
        rich("normal", [run("•  "), run("Rápida en móvil, y resiliente. Los visitantes investigan en teléfonos, muchas veces con conexiones rurales irregulares a lo largo de la carretera costera — así que "), link("la velocidad no es un lujo aquí", "https://www.dr-webstudio.com/es/blog/core-web-vitals-como-la-velocidad-afecta-tus-ventas-online"), run(", es si tu página carga siquiera.")]),
        rich("normal", [run("•  "), run("Protagonizada por fotos, sin el peso. Barahona se vende sola con el paisaje — los acantilados, las piscinas de río, el azul del larimar — pero las galerías pesadas matan la velocidad móvil, que es lo que resuelve la "), link("optimización de imágenes", "https://www.dr-webstudio.com/es/blog/optimizacion-imagenes-sitios-web-turismo-fotos-alta-calidad-carga-rapida"), run(".")]),
        rich("normal", [run("•  "), run("WhatsApp y depósitos, porque esta es una región de efectivo. Las reservas se cierran en el chat, así que "), link("WhatsApp y Maps", "https://www.dr-webstudio.com/es/blog/como-conectar-sitio-web-whatsapp-google-maps-instagram"), run(" en un toque es la base — y en una región donde los cajeros escasean fuera de la ciudad, el operador que puede tomar un "), link("depósito en línea", "https://www.dr-webstudio.com/es/blog/como-aceptar-pagos-en-linea-republica-dominicana"), run(" elimina una barrera real para un visitante que planifica desde Santo Domingo.")]),
        rich("normal", [run("•  "), run("Contenido práctico que posiciona. Páginas que respondan lo que los viajeros realmente preguntan — cómo llegar a Bahía de las Águilas desde Barahona, cuándo es mejor la temporada de aves, si necesitas 4x4 para las minas de larimar — capturan planificadores con semanas de antelación y se posicionan para términos por los que nadie local está compitiendo.")]),
        h2("Una palabra honesta sobre la región"),
        rich("normal", [run("Barahona premia el realismo. La infraestructura es genuinamente más limitada que en las zonas de resorts: los caminos a los mejores sitios pueden ser difíciles, algunas atracciones necesitan 4x4, la conectividad es irregular en las montañas, y el volumen turístico, aunque real, es una fracción del de la costa este. El patrón doméstico de fin de semana también significa que la demanda se concentra en feriados y fines de semana en vez de repartirse pareja. Y la proximidad de la región a la frontera haitiana moldea la percepción de algunos viajeros, con justicia o sin ella. Pero nota que ninguna de estas es razón para que una página web rinda menos — varias son razones para que importe más: cuando un destino es más difícil de navegar, el negocio que explica con claridad, responde preguntas con honestidad y deja que un visitante reserve con confianza destaca dramáticamente. Las limitaciones de Barahona son exactamente lo que una buena página web compensa, y el costo modesto de construir una contra un mercado comprobado y de todo el año es una de las mejores apuestas pequeñas disponibles en el turismo dominicano.")]),
        h2("Construye para el suroeste, desde donde sea"),
        rich("normal", [run("El desarrollo web es trabajo remoto, así que un negocio en Barahona no necesita un desarrollador en el pueblo — necesita uno que entienda el mercado turístico dominicano y la mezcla particular del suroeste de visitantes domésticos de fin de semana y ecoturistas internacionales. Eso es exactamente lo que hacemos en "), link("DR Web Studio", "https://www.dr-webstudio.com/es"), run(": páginas web rápidas, bilingües y reservables para negocios dominicanos, con WhatsApp y pagos locales integrados y el primer año de mantenimiento incluido. Ya sea que estés llenando cabañas, tours de aves, el libro de pedidos de un taller de larimar, o mesas a lo largo de la carretera costera, el sitio que se encuentra es el que se lleva el negocio. "), link("Contáctanos para una consulta gratuita", "https://www.dr-webstudio.com/es/contacto"), run(" y pongamos al suroeste en el mapa que merece.")]),
      ],
    },
    seo: {
      metaTitle: loc(
        "Barahona & the Southwest Coast Websites (2026)",
        "Webs para Barahona y la Costa Suroeste (2026)",
      ),
      ogTitle: loc(
        "Barahona: Where Dominicans Vacation",
        "Barahona: Donde Vacacionan los Dominicanos",
      ),
      ogDescription: loc(
        "The only larimar on Earth, coffee in the Sierra de Bahoruco, and beaches Dominicans keep for themselves. An established southwest base with almost no online competition.",
        "El único larimar de la Tierra, café en la Sierra de Bahoruco y playas que los dominicanos guardan para sí. Una base establecida del suroeste casi sin competencia en línea.",
      ),
      keywords: {
        en: ["Barahona tourism website", "Barahona hotels", "Bahia de las Aguilas tour", "larimar Barahona", "southwest Dominican Republic tourism"],
        es: ["página web turismo Barahona", "hoteles Barahona", "tour Bahía de las Águilas", "larimar Barahona", "turismo suroeste República Dominicana"],
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