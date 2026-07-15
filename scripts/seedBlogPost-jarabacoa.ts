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
    slug: "jarabacoa-constanza-mountain-adventure-websites",
    slugEs: "jarabacoa-y-constanza-paginas-web-aventura-de-montana",
    title: loc(
      "Jarabacoa & Constanza: Websites for the DR's Mountain Adventure Capital",
      "Jarabacoa y Constanza: Páginas Web para la Capital de Aventura de Montaña de RD",
    ),
    description: loc(
      "Jarabacoa and Constanza are the DR's mountain adventure capital — rafting, Pico Duarte, eco-tourism. Why these businesses need a bilingual, trust-building, year-round website.",
      "Jarabacoa y Constanza son la capital de aventura de montaña de RD — rafting, Pico Duarte, eco-turismo. Por qué estos negocios necesitan una web bilingüe, confiable y de todo el año.",
    ),
    readTime: 9,
    featured: false,
    tags: {
      en: ["Jarabacoa", "Constanza", "adventure tourism", "rafting", "Pico Duarte", "eco-tourism", "mountains", "Dominican Republic"],
      es: ["Jarabacoa", "Constanza", "turismo de aventura", "rafting", "Pico Duarte", "eco-turismo", "montañas", "República Dominicana"],
    },
    categories: ["web-design", "business-tips"],
    publishedAt: "2026-07-07T18:00:00.000Z",
    body: {
      en: [
        p("Mention the Dominican Republic and almost everyone pictures the same thing: a beach, a palm tree, an all-inclusive resort. But drive inland into the Cordillera Central and you find a completely different country — pine forests, whitewater rivers, waterfalls, coffee farms, and mountain air cool enough to need a jacket at night. Jarabacoa and Constanza are the heart of this other Dominican Republic, the nation's eco-tourism and adventure capital, and they run on a market that looks nothing like the coast. For the local businesses here — rafting outfitters, mountain lodges, coffee farms, adventure guides, and cabin rentals — a website is what turns \"the Caribbean's best-kept secret\" into a booked calendar."),
        h2("The anti-beach Dominican Republic"),
        rich("normal", [run("Jarabacoa, known as the \"City of Eternal Spring,\" sits around 500 meters up in the Cordillera Central with a mild 22°C climate year-round, and it's the gateway to Pico Duarte — at over 3,000 meters, the highest peak in the entire Caribbean. Constanza sits higher still, above 1,200 meters, cool enough that the surrounding hills have occasionally seen frost, and it's the country's agricultural breadbasket of strawberries, flowers, and vegetables. According to the "), link("official Dominican Republic tourism board, Jarabacoa is the country's premier ecotourism and adventure destination, offering a cool, natural alternative to beach resorts", "https://www.godominicanrepublic.com/destinations/jarabacoa"), run(". Between them these towns offer whitewater rafting on the Yaque del Norte — the only commercial rafting river in the Caribbean — plus canyoning, paragliding, horseback riding, coffee tours, and hikes to waterfalls like Salto de Jimenoa and Salto Baiguate. This is adventure and nature tourism, not sun-and-sand, and it draws a fundamentally different visitor.")]),
        h2("A different, and largely domestic, market"),
        p("Here's the defining feature of the mountain market: a large share of it is Dominican. Jarabacoa and Constanza are the favorite getaway for families and weekenders from Santiago and Santo Domingo escaping the heat, which means a big part of the audience is searching in Spanish, deciding quickly, and coming for a weekend rather than flying in for a week. Layered on top is a smaller but valuable stream of international adventure travelers — the hikers, rafters, and eco-tourists who seek out Pico Duarte and the \"Dominican Alps\" specifically. This dual audience is the mountain market's defining web challenge: a rafting outfitter or a mountain lodge needs to speak to the Spanish-first domestic weekender and the English-speaking adventure traveler at once, because both are searching, and whoever ranks and looks trustworthy gets the booking. And unlike the intensely seasonal coast, the mountains draw visitors year-round — busier on weekends and holidays, but never truly closed — which rewards a web presence that works every month."),
        h2("Why adventure tourism lives or dies online"),
        p("Adventure activities are high-commitment, high-research purchases. Someone booking a whitewater rafting trip, a two-day Pico Duarte trek, or a paragliding flight isn't making a casual impulse buy — they're weighing safety, reputation, price, and trust, and they do that weighing online. They read reviews, compare operators, look for evidence of professionalism and experienced guides, and want to understand exactly what they're signing up for before they commit. An operator whose only presence is a Facebook page and a phone number gives a nervous first-time rafter no reason to trust them over a competitor with a real website that shows the guides, the equipment, the safety briefing, and clear pricing. In adventure tourism especially, the website is where trust is built — and trust is what converts a browser into a booking for an activity that, by nature, requires the customer to feel safe."),
        h2("Who has the biggest opening in the mountains"),
        p("The adventure-and-nature character of Jarabacoa and Constanza creates especially strong openings for particular business types:"),
        rich("normal", [run("•  "), run("Adventure and tour operators. Rafting, canyoning, paragliding, Pico Duarte treks, and waterfall tours are the region's signature product, and the operators who rank for them and present themselves professionally capture both the domestic weekender and the international adventurer — exactly the approach we lay out for "), link("tour and excursion operators", "https://www.dr-webstudio.com/en/blog/websites-for-tour-operators-excursions"), run(", with trust and clear booking as the priorities.")]),
        rich("normal", [run("•  "), run("Mountain lodges, cabins, and eco-resorts. Lodging here is independent and character-driven — ranches, cabins, boutique mountain hotels — and every one needs a direct-booking website to fill rooms without surrendering margin to platforms, especially for the weekend domestic market that books fast.")]),
        rich("normal", [run("•  "), run("Coffee farms and agritourism. The Cordillera's coffee plantations and Constanza's farms are a growing agritourism draw, and a website turns a working farm into a bookable experience for visitors and a storefront for its product.")]),
        rich("normal", [run("•  "), run("Restaurants and mountain dining. From Jarabacoa's hilltop parrilladas to Constanza's farm-to-table bistros, the restaurants findable on Google Maps with a real menu win the weekender deciding where to eat.")]),
        rich("normal", [run("•  "), run("Cabin and vacation rentals. The steady flow of domestic weekenders creates real demand for rentals, and a direct-booking site reaches them without platform fees.")]),
        h2("What a mountain website has to do"),
        p("The winning formula, tuned to the dual-audience, adventure-tourism reality:"),
        rich("normal", [run("•  "), run("Genuinely bilingual, Spanish-forward. Unlike the coast's English-first tourism, the mountain market leans heavily Dominican, so Spanish comes first here — but the international adventure traveler makes real English pages essential too, built the way we describe in "), link("bilingual SEO", "https://www.dr-webstudio.com/en/blog/seo-bilingue-posicionarse-ingles-espanol-sin-perjudicar-ninguno"), run(", so both audiences find you in their own language.")]),
        rich("normal", [run("•  "), run("Trust-building, for high-commitment activities. For adventure tourism the site has to establish safety and professionalism — showing guides, equipment, experience, reviews, and exactly what an activity involves — because that's what convinces someone to book a raft trip or a summit trek.")]),
        rich("normal", [run("•  "), run("Fast on mobile. The weekender planning a quick escape and the traveler researching a trek both do it on a phone, and "), link("speed converts directly into bookings", "https://www.dr-webstudio.com/en/blog/core-web-vitals-como-la-velocidad-afecta-tus-ventas-online"), run(".")]),
        rich("normal", [run("•  "), run("Photo-forward, without the weight. The mountains sell on scenery — a raft in the rapids, a waterfall, a sunrise from Pico Duarte — but heavy galleries kill mobile speed, so "), link("image optimization", "https://www.dr-webstudio.com/en/blog/optimizacion-imagenes-sitios-web-turismo-fotos-alta-calidad-carga-rapida"), run(" matters.")]),
        rich("normal", [run("•  "), run("WhatsApp-connected, with deposits online — and this one is pointed. The mountains are cash-first, and ATMs in Jarabacoa and Constanza are known to run dry on busy weekends. The operator whose site lets a visitor secure a spot with an online deposit, using the tools in "), link("accepting online payments in the DR", "https://www.dr-webstudio.com/en/blog/how-to-accept-online-payments-dominican-republic"), run(", removes real friction — alongside one-tap "), link("WhatsApp, Maps, and Instagram", "https://www.dr-webstudio.com/en/blog/how-to-connect-website-whatsapp-google-maps-instagram"), run(" to start the conversation.")]),
        h2("An honest word on the trade-offs"),
        p("The mountain market has a real edge the coast lacks — year-round demand, a stable domestic base, and much lighter online competition than the saturated beach zones — but it comes with its own realities. The domestic weekend pattern means demand concentrates on weekends and holidays, so the business has to be findable and bookable exactly when everyone is searching at once. Adventure tourism carries a trust-and-safety burden that a website has to shoulder honestly, which means real content and real professionalism, not hype. And the terrain itself brings infrastructure quirks — variable connectivity, the cash-first economy — that make a fast, resilient, deposit-ready site more valuable, not less. None of this argues against building; it argues for building thoughtfully. The mountains reward businesses that present their adventures as the safe, professional, unforgettable experiences they are — because that's exactly what the visitor is trying to confirm before they book."),
        h2("The low-competition advantage"),
        p("There's one more reason the timing favors mountain businesses that build now: online competition here is remarkably thin. The coastal tourism zones have had professional websites for years, and ranking among them is a hard fight. The mountains are different — a great many rafting outfitters, lodges, and tour operators in Jarabacoa and Constanza still run on nothing more than a Facebook page or a listing on a booking aggregator that takes a commission and owns the customer relationship. That means the valuable searches — \"rafting Jarabacoa,\" \"Pico Duarte trek,\" \"cabañas Constanza,\" and their English equivalents — have few serious, well-built local sites competing for them. A properly built, genuinely bilingual website can reach the first page of Google for these terms far faster than the same effort would achieve on the coast, and because rankings compound over time, the operator who plants a flag now will be hard to displace later. In an under-served market with year-round demand, being early and being professional is a combination that pays off for years."),
        h2("Build for the mountains, from anywhere"),
        rich("normal", [run("Web development is remote work, so a business in Jarabacoa or Constanza doesn't need a developer in town — it needs one who understands the Dominican market and the mountains' distinctive dual audience of domestic weekenders and international adventurers. That's exactly what we do at "), link("DR Web Studio", "https://www.dr-webstudio.com/en"), run(": fast, bilingual, bookable websites for Dominican tourism businesses, with WhatsApp and local payments wired in and the first year of maintenance included. Whether you're filling rafts on the Yaque del Norte, cabins in the pines, or seats on a Pico Duarte trek, the site that builds trust and books both your audiences is the one that wins the mountains. "), link("Contact us for a free consultation", "https://www.dr-webstudio.com/en/contact"), run(" and let's build it.")]),
      ],
      es: [
        p("Menciona la República Dominicana y casi todos imaginan lo mismo: una playa, una palmera, un resort todo-incluido. Pero maneja tierra adentro hacia la Cordillera Central y encuentras un país completamente distinto — bosques de pinos, ríos de aguas bravas, cascadas, fincas de café, y aire de montaña lo bastante fresco como para necesitar una chaqueta de noche. Jarabacoa y Constanza son el corazón de esta otra República Dominicana, la capital de eco-turismo y aventura de la nación, y funcionan con un mercado que no se parece en nada a la costa. Para los negocios locales de aquí — operadores de rafting, lodges de montaña, fincas de café, guías de aventura y alquileres de cabañas — una página web es lo que convierte \"el secreto mejor guardado del Caribe\" en un calendario reservado."),
        h2("La República Dominicana anti-playa"),
        rich("normal", [run("Jarabacoa, conocida como la \"Ciudad de la Eterna Primavera,\" se ubica a unos 500 metros de altura en la Cordillera Central con un clima templado de 22°C todo el año, y es la puerta de entrada al Pico Duarte — con más de 3,000 metros, el pico más alto de todo el Caribe. Constanza se ubica aún más alto, sobre los 1,200 metros, lo bastante fresca como para que las colinas circundantes ocasionalmente hayan visto escarcha, y es el granero agrícola del país de fresas, flores y vegetales. Según la "), link("junta oficial de turismo de la República Dominicana, Jarabacoa es el principal destino de eco-turismo y aventura del país, ofreciendo una alternativa fresca y natural a los resorts de playa", "https://www.godominicanrepublic.com/destinations/jarabacoa"), run(". Entre ambas, estos pueblos ofrecen rafting de aguas bravas en el Yaque del Norte — el único río de rafting comercial del Caribe — más canyoning, parapente, cabalgatas, tours de café, y caminatas a cascadas como el Salto de Jimenoa y el Salto Baiguate. Esto es turismo de aventura y naturaleza, no de sol y arena, y atrae a un visitante fundamentalmente distinto.")]),
        h2("Un mercado distinto, y en gran parte doméstico"),
        p("Aquí está la característica definitoria del mercado de montaña: una gran parte de él es dominicana. Jarabacoa y Constanza son la escapada favorita de familias y personas de fin de semana de Santiago y Santo Domingo huyendo del calor, lo que significa que una gran parte de la audiencia busca en español, decide rápido, y viene por un fin de semana en vez de volar por una semana. Superpuesto está un flujo más pequeño pero valioso de viajeros de aventura internacionales — los excursionistas, rafters y eco-turistas que buscan específicamente el Pico Duarte y los \"Alpes Dominicanos.\" Esta audiencia dual es el desafío web definitorio del mercado de montaña: un operador de rafting o un lodge de montaña necesita hablarle al visitante de fin de semana doméstico que va primero en español y al viajero de aventura angloparlante a la vez, porque ambos están buscando, y quien se posicione y se vea confiable se lleva la reserva. Y a diferencia de la costa intensamente estacional, las montañas atraen visitantes todo el año — más ocupadas los fines de semana y días festivos, pero nunca verdaderamente cerradas — lo que premia una presencia web que funciona cada mes."),
        h2("Por qué el turismo de aventura vive o muere en línea"),
        p("Las actividades de aventura son compras de alto compromiso y alta investigación. Alguien que reserva un viaje de rafting, una caminata de dos días al Pico Duarte, o un vuelo en parapente no está haciendo una compra impulsiva casual — está sopesando seguridad, reputación, precio y confianza, y hace ese sopeso en línea. Lee reseñas, compara operadores, busca evidencia de profesionalismo y guías experimentados, y quiere entender exactamente en qué se está inscribiendo antes de comprometerse. Un operador cuya única presencia es una página de Facebook y un número de teléfono no le da a un rafter primerizo y nervioso ninguna razón para confiar en él por encima de un competidor con una página web real que muestra los guías, el equipo, la charla de seguridad y los precios claros. En el turismo de aventura especialmente, la página web es donde se construye la confianza — y la confianza es lo que convierte a un curioso en una reserva para una actividad que, por naturaleza, requiere que el cliente se sienta seguro."),
        h2("Quién tiene la apertura más grande en las montañas"),
        p("El carácter de aventura y naturaleza de Jarabacoa y Constanza crea aperturas especialmente fuertes para tipos de negocio particulares:"),
        rich("normal", [run("•  "), run("Operadores de aventura y tours. El rafting, el canyoning, el parapente, las caminatas al Pico Duarte y los tours de cascadas son el producto insignia de la región, y los operadores que se posicionan para ellos y se presentan profesionalmente capturan tanto al visitante de fin de semana doméstico como al aventurero internacional — exactamente el enfoque que exponemos para "), link("operadores de tours y excursiones", "https://www.dr-webstudio.com/es/blog/paginas-web-para-operadores-de-tours-y-excursiones"), run(", con la confianza y la reserva clara como prioridades.")]),
        rich("normal", [run("•  "), run("Lodges de montaña, cabañas y eco-resorts. El alojamiento aquí es independiente y con carácter — ranchos, cabañas, hoteles boutique de montaña — y cada uno necesita una página web de reserva directa para llenar habitaciones sin ceder margen a las plataformas, especialmente para el mercado doméstico de fin de semana que reserva rápido.")]),
        rich("normal", [run("•  "), run("Fincas de café y agroturismo. Las plantaciones de café de la Cordillera y las fincas de Constanza son un atractivo de agroturismo creciente, y una página web convierte una finca de trabajo en una experiencia reservable para visitantes y una tienda para su producto.")]),
        rich("normal", [run("•  "), run("Restaurantes y gastronomía de montaña. Desde las parrilladas en la cima de Jarabacoa hasta los bistros de la granja a la mesa de Constanza, los restaurantes encontrables en Google Maps con un menú real ganan al visitante de fin de semana decidiendo dónde comer.")]),
        rich("normal", [run("•  "), run("Alquileres de cabañas y vacacionales. El flujo constante de visitantes de fin de semana domésticos crea demanda real de alquileres, y un sitio de reserva directa los alcanza sin comisiones de plataforma.")]),
        h2("Qué tiene que hacer una página web de montaña"),
        p("La fórmula ganadora, afinada a la realidad de audiencia dual y turismo de aventura:"),
        rich("normal", [run("•  "), run("Genuinamente bilingüe, con el español al frente. A diferencia del turismo de inglés primero de la costa, el mercado de montaña se inclina fuertemente dominicano, así que el español va primero aquí — pero el viajero de aventura internacional hace que las páginas reales en inglés sean esenciales también, construidas como describimos en "), link("SEO bilingüe", "https://www.dr-webstudio.com/es/blog/seo-bilingue-posicionarse-ingles-espanol-sin-perjudicar-ninguno"), run(", para que ambas audiencias te encuentren en su propio idioma.")]),
        rich("normal", [run("•  "), run("Constructora de confianza, para actividades de alto compromiso. Para el turismo de aventura el sitio tiene que establecer seguridad y profesionalismo — mostrando guías, equipo, experiencia, reseñas, y exactamente en qué consiste una actividad — porque eso es lo que convence a alguien de reservar un viaje de rafting o una caminata a la cima.")]),
        rich("normal", [run("•  "), run("Rápida en móvil. El visitante de fin de semana planeando una escapada rápida y el viajero investigando una caminata ambos lo hacen en un teléfono, y "), link("la velocidad se convierte directamente en reservas", "https://www.dr-webstudio.com/es/blog/core-web-vitals-como-la-velocidad-afecta-tus-ventas-online"), run(".")]),
        rich("normal", [run("•  "), run("Protagonizada por fotos, sin el peso. Las montañas se venden por el paisaje — un raft en los rápidos, una cascada, un amanecer desde el Pico Duarte — pero las galerías pesadas matan la velocidad móvil, así que la "), link("optimización de imágenes", "https://www.dr-webstudio.com/es/blog/optimizacion-imagenes-sitios-web-turismo-fotos-alta-calidad-carga-rapida"), run(" importa.")]),
        rich("normal", [run("•  "), run("Conectada a WhatsApp, con depósitos en línea — y este punto es puntual. Las montañas son de efectivo primero, y los cajeros automáticos en Jarabacoa y Constanza son conocidos por quedarse sin efectivo en los fines de semana ocupados. El operador cuyo sitio permite a un visitante asegurar un lugar con un depósito en línea, usando las herramientas de "), link("aceptar pagos en línea en RD", "https://www.dr-webstudio.com/es/blog/como-aceptar-pagos-en-linea-republica-dominicana"), run(", elimina fricción real — junto a "), link("WhatsApp, Maps e Instagram", "https://www.dr-webstudio.com/es/blog/como-conectar-sitio-web-whatsapp-google-maps-instagram"), run(" en un toque para iniciar la conversación.")]),
        h2("Una palabra honesta sobre las concesiones"),
        p("El mercado de montaña tiene una ventaja real que la costa no tiene — demanda de todo el año, una base doméstica estable, y competencia en línea mucho más ligera que las saturadas zonas de playa — pero viene con sus propias realidades. El patrón doméstico de fin de semana significa que la demanda se concentra en fines de semana y días festivos, así que el negocio tiene que ser encontrable y reservable exactamente cuando todos están buscando a la vez. El turismo de aventura carga una responsabilidad de confianza y seguridad que una página web tiene que asumir honestamente, lo que significa contenido real y profesionalismo real, no exageración. Y el terreno mismo trae peculiaridades de infraestructura — conectividad variable, la economía de efectivo primero — que hacen un sitio rápido, resiliente y listo para depósitos más valioso, no menos. Nada de esto argumenta contra construir; argumenta a favor de construir con reflexión. Las montañas premian a los negocios que presentan sus aventuras como las experiencias seguras, profesionales e inolvidables que son — porque eso es exactamente lo que el visitante está tratando de confirmar antes de reservar."),
        h2("La ventaja de la baja competencia"),
        p("Hay una razón más por la que el momento favorece a los negocios de montaña que construyen ahora: la competencia en línea aquí es notablemente escasa. Las zonas turísticas costeras han tenido páginas web profesionales por años, y posicionarse entre ellas es una pelea dura. Las montañas son distintas — muchísimos operadores de rafting, lodges y operadores de tours en Jarabacoa y Constanza todavía funcionan con nada más que una página de Facebook o un listado en un agregador de reservas que cobra comisión y se adueña de la relación con el cliente. Eso significa que las búsquedas valiosas — \"rafting Jarabacoa,\" \"caminata Pico Duarte,\" \"cabañas Constanza,\" y sus equivalentes en inglés — tienen pocos sitios locales serios y bien construidos compitiendo por ellas. Una página web bien construida y genuinamente bilingüe puede llegar a la primera página de Google para estos términos mucho más rápido de lo que el mismo esfuerzo lograría en la costa, y como el posicionamiento se acumula con el tiempo, el operador que planta una bandera ahora será difícil de desplazar después. En un mercado sub-atendido con demanda de todo el año, ser temprano y ser profesional es una combinación que rinde por años."),
        h2("Construye para las montañas, desde donde sea"),
        rich("normal", [run("El desarrollo web es trabajo remoto, así que un negocio en Jarabacoa o Constanza no necesita un desarrollador en el pueblo — necesita uno que entienda el mercado dominicano y la distintiva audiencia dual de las montañas de visitantes de fin de semana domésticos y aventureros internacionales. Eso es exactamente lo que hacemos en "), link("DR Web Studio", "https://www.dr-webstudio.com/es"), run(": páginas web rápidas, bilingües y reservables para negocios de turismo dominicanos, con WhatsApp y pagos locales integrados y el primer año de mantenimiento incluido. Ya sea que estés llenando rafts en el Yaque del Norte, cabañas en los pinos, o cupos en una caminata al Pico Duarte, el sitio que construye confianza y reserva a tus dos audiencias es el que gana las montañas. "), link("Contáctanos para una consulta gratuita", "https://www.dr-webstudio.com/es/contacto"), run(" y construyámoslo.")]),
      ],
    },
    seo: {
      metaTitle: loc(
        "Jarabacoa & Constanza Websites: Mountain Adventure",
        "Webs Jarabacoa y Constanza: Aventura de Montaña",
      ),
      ogTitle: loc(
        "Websites for the DR's Mountain Adventure Capital",
        "Páginas Web para la Capital de Aventura de Montaña de RD",
      ),
      ogDescription: loc(
        "The Caribbean's only whitewater rafting, the gateway to Pico Duarte, and a year-round mountain market. Adventure tourism is won on trust — and trust is built on your website.",
        "El único rafting de aguas bravas del Caribe, la puerta al Pico Duarte, y un mercado de montaña de todo el año. El turismo de aventura se gana con confianza — y la confianza se construye en tu web.",
      ),
      keywords: {
        en: ["Jarabacoa tourism website", "rafting website Jarabacoa", "Pico Duarte trek website", "Constanza tourism website", "adventure tour website Dominican Republic"],
        es: ["página web turismo Jarabacoa", "página web rafting Jarabacoa", "página web caminata Pico Duarte", "página web turismo Constanza", "página web tour de aventura República Dominicana"],
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