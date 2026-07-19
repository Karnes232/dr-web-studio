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
    slug: "samana-peninsula-eco-tourism-property-websites",
    slugEs: "peninsula-de-samana-paginas-web-eco-turismo-y-propiedades",
    title: loc(
      "The Samaná Peninsula: Websites for Eco-Tourism & International Buyers",
      "La Península de Samaná: Páginas Web para Eco-Turismo y Compradores Internacionales",
    ),
    description: loc(
      "The Samaná Peninsula sells authentic eco-tourism and draws international property buyers. Why local businesses need a multilingual website to win an audience that buys online.",
      "La Península de Samaná vende eco-turismo auténtico y atrae compradores internacionales. Por qué los negocios locales necesitan una web multilingüe para ganar una audiencia que compra en línea.",
    ),
    readTime: 9,
    featured: false,
    tags: {
      en: [
        "Samaná",
        "eco-tourism",
        "whale watching",
        "real estate",
        "expats",
        "Las Galeras",
        "multilingual",
        "Dominican Republic",
      ],
      es: [
        "Samaná",
        "eco-turismo",
        "avistamiento de ballenas",
        "bienes raíces",
        "expatriados",
        "Las Galeras",
        "multilingüe",
        "República Dominicana",
      ],
    },
    categories: ["web-design", "business-tips"],
    publishedAt: "2026-07-07T17:00:00.000Z",
    body: {
      en: [
        p(
          "The Samaná Peninsula is the Dominican Republic that the postcards forget — a mountainous finger of land in the northeast where coconut plantations spill down to some of the Caribbean's most beautiful beaches, humpback whales fill the bay each winter, and a decades-old European expat community has quietly built one of the country's most sophisticated small markets. It's not a mega-resort zone and it isn't trying to be. Samaná sells something rarer: authentic, eco-conscious, untouched nature, to travelers and buyers who specifically don't want Punta Cana. For the local businesses serving that market — tour operators, eco-lodges, restaurants, and above all real estate — a website is what connects them to an audience that is researching, comparing, and buying almost entirely online, often from another continent.",
        ),
        h2("A different Dominican market"),
        rich("normal", [
          run(
            "Samaná is anchored by three distinct places, each with its own character. Santa Bárbara de Samaná, the provincial capital, is the working port town and the gateway to whale season. Las Terrenas has become the peninsula's cosmopolitan center, a genuinely multicultural town shaped by French, Italian, and Swiss expats who began arriving in the 1970s. And Las Galeras, at the peninsula's eastern tip, remains a quiet fishing village with access to legendary beaches like Playa Rincón — a more rustic, off-the-grid experience. What ties them together is a shared identity: this is the eco-tourism and authentic-lifestyle corner of the Dominican Republic, served by an El Catey international airport with direct flights from North America, and populated by a resident foreign community that gives the market year-round life beyond the tourist seasons. (We look specifically at the cosmopolitan hub in our piece on ",
          ),
          link(
            "web design in Las Terrenas and Samaná",
            "https://www.dr-webstudio.com/en/blog/web-design-las-terrenas-samana-multilingual",
          ),
          run("; this is the wider-peninsula view.)"),
        ]),
        h2("The whale season and the eco-tourism draw"),
        rich("normal", [
          run(
            "Samaná's signature natural event is one of the great wildlife spectacles on Earth. Each year between January and March, thousands of humpback whales migrate into Samaná Bay to mate and calve, and the region has grown around them: the Dominican Republic has ",
          ),
          link(
            "the largest whale-watching industry in the Caribbean, with international tourists making up the overwhelming majority of whale-watchers in Samaná",
            "https://wwhandbook.iwc.int/en/case-studies/dominican-republic-samana-bay",
          ),
          run(
            ". But the peninsula is far more than a three-month whale show. Los Haitises National Park and its mangroves and caves, the 40-meter Salto El Limón waterfall, the beaches of Las Galeras and Cayo Levantado, and a genuine culture of sustainable, community-based tourism give Samaná a year-round eco-tourism identity. The traveler who comes here is self-selecting: they've chosen nature and authenticity over all-inclusive convenience, which means they research independent operators, read reviews, and book experiences online rather than through a resort desk. That's precisely the traveler a good website captures.",
          ),
        ]),
        h2("Why this is an online market"),
        p(
          "Both halves of Samaná's economy — tourism and real estate — are won and lost on the screen, before anyone arrives. The eco-traveler planning a Samaná trip is comparing whale tours, eco-lodges, and restaurants from home, weeks in advance, in English or French or German. The property buyer is even more online: Samaná's real estate market draws buyers from all over the world, and a foreign buyer researching land, a villa, or a condo on the peninsula does essentially all of that research remotely, in their own language, long before they ever fly in to visit. Neither of these customers can be reached through a Facebook page and a phone number passed around by word of mouth. They find businesses through search, judge them by their websites, and commit — sometimes to a six-figure property — based substantially on what they find online. In a market this international and this research-driven, the website isn't a marketing extra; it's the entire storefront.",
        ),
        h2("Who has the biggest opening in Samaná"),
        p(
          "The eco-tourism-plus-expat character of the peninsula creates especially strong openings for particular business types:",
        ),
        rich("normal", [
          run("•  "),
          run(
            "Tour and excursion operators. Whale watching, Los Haitises, El Limón, Playa Rincón, and Cayo Levantado are world-class draws, and the operators who rank for them online capture the independent traveler directly — exactly the approach we lay out for ",
          ),
          link(
            "tour operators and excursion companies",
            "https://www.dr-webstudio.com/en/blog/websites-for-tour-operators-excursions",
          ),
          run(
            ". For seasonal businesses like whale tours, ranking before the season starts is decisive.",
          ),
        ]),
        rich("normal", [
          run("•  "),
          run(
            "Eco-lodges, boutique hotels, and guesthouses. Samaná's lodging skews small, independent, and character-driven — precisely the kind of business that needs a direct-booking website to escape platform commissions and reach the traveler seeking something more authentic than a resort.",
          ),
        ]),
        rich("normal", [
          run("•  "),
          run(
            "Real estate and property management. With buyers arriving from North America and Europe and a market spanning land, villas, and condos, real estate is Samaná's highest-value online vertical, best served the way we describe for ",
          ),
          link(
            "real estate websites",
            "https://www.dr-webstudio.com/en/blog/real-estate-websites-punta-cana",
          ),
          run(
            " — bilingual, image-rich, and built for the remote foreign buyer.",
          ),
        ]),
        rich("normal", [
          run("•  "),
          run(
            "Restaurants and lifestyle services. The resident expat community plus the international visitor flow means restaurants, wellness practitioners, and services findable online serve both a year-round local market and a seasonal tourist one.",
          ),
        ]),
        h2("What a Samaná website has to do"),
        p(
          "The winning formula, tuned to the eco-tourism and international-buyer reality:",
        ),
        rich("normal", [
          run("•  "),
          run(
            "Multilingual, beyond just English and Spanish. Samaná's deep French, Italian, and other European expat and visitor presence means the languages that matter here go past the usual two. Each language needs its own real, indexed pages, built the way we describe in ",
          ),
          link(
            "bilingual SEO",
            "https://www.dr-webstudio.com/en/blog/seo-bilingue-posicionarse-ingles-espanol-sin-perjudicar-ninguno",
          ),
          run(
            ", so a French buyer or an English-speaking eco-traveler finds you in their own language.",
          ),
        ]),
        rich("normal", [
          run("•  "),
          run(
            "Photo-forward, without the weight. Samaná sells on breathtaking imagery — whales breaching, Playa Rincón, a waterfall in the jungle — but heavy galleries kill mobile speed, so the ",
          ),
          link(
            "image-optimization craft",
            "https://www.dr-webstudio.com/en/blog/optimizacion-imagenes-sitios-web-turismo-fotos-alta-calidad-carga-rapida",
          ),
          run(
            " is essential to selling the beauty without sacrificing the load time.",
          ),
        ]),
        rich("normal", [
          run("•  "),
          run(
            "Fast on mobile. Whether it's a traveler comparing tours or a buyer browsing listings from abroad, the research happens on a phone, and ",
          ),
          link(
            "speed converts directly into inquiries and bookings",
            "https://www.dr-webstudio.com/en/blog/core-web-vitals-como-la-velocidad-afecta-tus-ventas-online",
          ),
          run("."),
        ]),
        rich("normal", [
          run("•  "),
          run(
            "WhatsApp-connected, with deposits online. Bookings and inquiries close in a chat, so one-tap ",
          ),
          link(
            "WhatsApp, Maps, and Instagram",
            "https://www.dr-webstudio.com/en/blog/how-to-connect-website-whatsapp-google-maps-instagram",
          ),
          run(" plus the ability to secure a tour or reservation with an "),
          link(
            "online deposit",
            "https://www.dr-webstudio.com/en/blog/how-to-accept-online-payments-dominican-republic",
          ),
          run(" turns remote interest into confirmed business."),
        ]),
        rich("normal", [
          run("•  "),
          run(
            'Content that ranks year-round. For a seasonal destination, content is what smooths the calendar — pages answering "best time for whale watching in Samaná," "how to visit Los Haitises," or "buying property in Las Galeras" rank continuously and capture planners months ahead, keeping the pipeline full even in the off-season.',
          ),
        ]),
        h2("An honest word on the trade-offs"),
        p(
          "Samaná's market is genuinely attractive — international, high-value, year-round thanks to the expat base — but it has realities worth naming plainly. Seasonality is real for tourism operators: whale season is a concentrated burst, and a business overly dependent on those three months has to work harder, through content and the resident market, to earn year-round. The peninsula is less developed than the big resort zones, with infrastructure quirks that make reliable hosting and a fast, resilient site more than a nicety. And because the buyers and travelers are so international, doing this market justice means genuine multilingual quality, not a token translation — the French retiree and the German eco-traveler notice. None of this argues against building; it argues for building well. Samaná rewards the businesses that meet its discerning, international audience with the professionalism that audience expects.",
        ),
        h2("The infrastructure story that changed everything"),
        p(
          "It's worth understanding why Samaná became reachable enough to build a real market. For most of its history the peninsula was remote — a long, difficult drive from anywhere. Two things changed that: the modern highway connecting Samaná to Santo Domingo, which cut the journey dramatically, and the El Catey International Airport, which brought direct flights from North America and Europe. That access is what turned a beautiful but isolated backwater into a destination that international travelers and property buyers can actually reach on a normal vacation timeline. For local businesses, the significance is simple: the audience that infrastructure unlocked is an international, fly-in, research-first audience — the kind that plans online before arriving. A traveler who books a flight to El Catey has already decided to come; the question is only which whale tour, which eco-lodge, which restaurant they choose once they start searching. Being the business that shows up, in their language, with a professional site and easy booking, is how you capture demand that the airport and the highway delivered to your door.",
        ),
        h2("Build for the peninsula, from anywhere"),
        rich("normal", [
          run(
            "Web development is remote work, so a business in Samaná, Las Terrenas, or Las Galeras doesn't need a developer in town — it needs one who understands the Dominican tourism and real-estate market and Samaná's uniquely international, eco-conscious audience. That's exactly what we do at ",
          ),
          link("DR Web Studio", "https://www.dr-webstudio.com/en"),
          run(
            ": fast, multilingual, bookable websites for Dominican tourism and property businesses, with WhatsApp and local payments wired in and the first year of maintenance included. Whether you're filling whale-season tours, an eco-lodge's calendar, or a pipeline of international property buyers, the site that reaches your audience in their language is the one that wins the peninsula. ",
          ),
          link(
            "Contact us for a free consultation",
            "https://www.dr-webstudio.com/en/contact",
          ),
          run(" and let's build it."),
        ]),
      ],
      es: [
        p(
          "La Península de Samaná es la República Dominicana que las postales olvidan — un dedo montañoso de tierra en el noreste donde las plantaciones de coco se derraman hacia algunas de las playas más hermosas del Caribe, las ballenas jorobadas llenan la bahía cada invierno, y una comunidad de expatriados europeos de décadas ha construido silenciosamente uno de los mercados pequeños más sofisticados del país. No es una zona de mega-resorts y no está tratando de serlo. Samaná vende algo más raro: naturaleza auténtica, eco-consciente e intacta, a viajeros y compradores que específicamente no quieren Punta Cana. Para los negocios locales que sirven a ese mercado — operadores de tours, eco-lodges, restaurantes, y sobre todo bienes raíces — una página web es lo que los conecta con una audiencia que investiga, compara y compra casi enteramente en línea, muchas veces desde otro continente.",
        ),
        h2("Un mercado dominicano distinto"),
        rich("normal", [
          run(
            "Samaná está anclada por tres lugares distintos, cada uno con su propio carácter. Santa Bárbara de Samaná, la capital provincial, es el pueblo portuario de trabajo y la puerta de entrada a la temporada de ballenas. Las Terrenas se ha convertido en el centro cosmopolita de la península, un pueblo genuinamente multicultural moldeado por expatriados franceses, italianos y suizos que empezaron a llegar en los años 70. Y Las Galeras, en la punta oriental de la península, sigue siendo un tranquilo pueblo de pescadores con acceso a playas legendarias como Playa Rincón — una experiencia más rústica y desconectada. Lo que los une es una identidad compartida: este es el rincón de eco-turismo y estilo de vida auténtico de la República Dominicana, servido por el aeropuerto internacional El Catey con vuelos directos desde Norteamérica, y poblado por una comunidad extranjera residente que le da al mercado vida todo el año más allá de las temporadas turísticas. (Vemos específicamente el centro cosmopolita en nuestro artículo sobre ",
          ),
          link(
            "diseño web en Las Terrenas y Samaná",
            "https://www.dr-webstudio.com/es/blog/diseno-web-en-las-terrenas-y-samana-mercado-multilingue",
          ),
          run("; esta es la vista de la península más amplia.)"),
        ]),
        h2("La temporada de ballenas y el atractivo eco-turístico"),
        rich("normal", [
          run(
            "El evento natural insignia de Samaná es uno de los grandes espectáculos de vida silvestre de la Tierra. Cada año entre enero y marzo, miles de ballenas jorobadas migran hacia la Bahía de Samaná para aparearse y parir, y la región ha crecido alrededor de ellas: la República Dominicana tiene ",
          ),
          link(
            "la industria de avistamiento de ballenas más grande del Caribe, con los turistas internacionales conformando la abrumadora mayoría de los observadores de ballenas en Samaná",
            "https://wwhandbook.iwc.int/en/case-studies/dominican-republic-samana-bay",
          ),
          run(
            ". Pero la península es mucho más que un espectáculo de ballenas de tres meses. El Parque Nacional Los Haitises y sus manglares y cuevas, la cascada de 40 metros del Salto El Limón, las playas de Las Galeras y Cayo Levantado, y una cultura genuina de turismo sostenible y comunitario le dan a Samaná una identidad eco-turística de todo el año. El viajero que viene aquí se auto-selecciona: eligió la naturaleza y la autenticidad por encima de la comodidad del todo-incluido, lo que significa que investiga operadores independientes, lee reseñas y reserva experiencias en línea en vez de a través del mostrador de un resort. Ese es precisamente el viajero que captura una buena página web.",
          ),
        ]),
        h2("Por qué este es un mercado en línea"),
        p(
          "Ambas mitades de la economía de Samaná — turismo y bienes raíces — se ganan y se pierden en la pantalla, antes de que alguien llegue. El eco-viajero que planifica un viaje a Samaná está comparando tours de ballenas, eco-lodges y restaurantes desde casa, semanas antes, en inglés o francés o alemán. El comprador de propiedades está aún más en línea: el mercado inmobiliario de Samaná atrae compradores de todo el mundo, y un comprador extranjero que investiga tierra, una villa o un condominio en la península hace esencialmente toda esa investigación de forma remota, en su propio idioma, mucho antes de siquiera volar a visitar. Ninguno de estos clientes puede alcanzarse a través de una página de Facebook y un número de teléfono que circula de boca en boca. Encuentran negocios a través de la búsqueda, los juzgan por sus páginas web, y se comprometen — a veces a una propiedad de seis cifras — basándose sustancialmente en lo que encuentran en línea. En un mercado tan internacional y tan impulsado por la investigación, la página web no es un extra de marketing; es toda la tienda.",
        ),
        h2("Quién tiene la apertura más grande en Samaná"),
        p(
          "El carácter eco-turístico-más-expatriado de la península crea aperturas especialmente fuertes para tipos de negocio particulares:",
        ),
        rich("normal", [
          run("•  "),
          run(
            "Operadores de tours y excursiones. El avistamiento de ballenas, Los Haitises, El Limón, Playa Rincón y Cayo Levantado son atracciones de clase mundial, y los operadores que se posicionan para ellas en línea capturan al viajero independiente directamente — exactamente el enfoque que exponemos para ",
          ),
          link(
            "operadores de tours y excursiones",
            "https://www.dr-webstudio.com/es/blog/paginas-web-para-operadores-de-tours-y-excursiones",
          ),
          run(
            ". Para negocios estacionales como los tours de ballenas, posicionarse antes de que empiece la temporada es decisivo.",
          ),
        ]),
        rich("normal", [
          run("•  "),
          run(
            "Eco-lodges, hoteles boutique y casas de huéspedes. El alojamiento de Samaná tiende a ser pequeño, independiente y con carácter — precisamente el tipo de negocio que necesita una página web de reserva directa para escapar de las comisiones de plataformas y alcanzar al viajero que busca algo más auténtico que un resort.",
          ),
        ]),
        rich("normal", [
          run("•  "),
          run(
            "Bienes raíces y administración de propiedades. Con compradores llegando de Norteamérica y Europa y un mercado que abarca tierra, villas y condominios, los bienes raíces son el vertical en línea de mayor valor de Samaná, mejor servido como describimos para ",
          ),
          link(
            "páginas web inmobiliarias",
            "https://www.dr-webstudio.com/es/blog/paginas-web-para-inmobiliarias-en-punta-cana",
          ),
          run(
            " — bilingüe, rico en imágenes y construido para el comprador extranjero remoto.",
          ),
        ]),
        rich("normal", [
          run("•  "),
          run(
            "Restaurantes y servicios de estilo de vida. La comunidad de expatriados residente más el flujo de visitantes internacionales significa que los restaurantes, practicantes de bienestar y servicios encontrables en línea sirven tanto a un mercado local de todo el año como a uno turístico estacional.",
          ),
        ]),
        h2("Qué tiene que hacer una página web de Samaná"),
        p(
          "La fórmula ganadora, afinada a la realidad eco-turística y de compradores internacionales:",
        ),
        rich("normal", [
          run("•  "),
          run(
            "Multilingüe, más allá de solo inglés y español. La profunda presencia de expatriados y visitantes franceses, italianos y de otros países europeos en Samaná significa que los idiomas que importan aquí van más allá de los dos habituales. Cada idioma necesita sus propias páginas reales e indexadas, construidas como describimos en ",
          ),
          link(
            "SEO bilingüe",
            "https://www.dr-webstudio.com/es/blog/seo-bilingue-posicionarse-ingles-espanol-sin-perjudicar-ninguno",
          ),
          run(
            ", para que un comprador francés o un eco-viajero angloparlante te encuentre en su propio idioma.",
          ),
        ]),
        rich("normal", [
          run("•  "),
          run(
            "Protagonizada por fotos, sin el peso. Samaná se vende con imágenes impresionantes — ballenas saltando, Playa Rincón, una cascada en la selva — pero las galerías pesadas matan la velocidad móvil, así que el ",
          ),
          link(
            "oficio de optimización de imágenes",
            "https://www.dr-webstudio.com/es/blog/optimizacion-imagenes-sitios-web-turismo-fotos-alta-calidad-carga-rapida",
          ),
          run(
            " es esencial para vender la belleza sin sacrificar el tiempo de carga.",
          ),
        ]),
        rich("normal", [
          run("•  "),
          run(
            "Rápida en móvil. Ya sea un viajero comparando tours o un comprador navegando listados desde el extranjero, la investigación ocurre en un teléfono, y ",
          ),
          link(
            "la velocidad se convierte directamente en consultas y reservas",
            "https://www.dr-webstudio.com/es/blog/core-web-vitals-como-la-velocidad-afecta-tus-ventas-online",
          ),
          run("."),
        ]),
        rich("normal", [
          run("•  "),
          run(
            "Conectada a WhatsApp, con depósitos en línea. Las reservas y consultas se cierran en un chat, así que ",
          ),
          link(
            "WhatsApp, Maps e Instagram",
            "https://www.dr-webstudio.com/es/blog/como-conectar-sitio-web-whatsapp-google-maps-instagram",
          ),
          run(
            " en un toque más la capacidad de asegurar un tour o una reserva con un ",
          ),
          link(
            "depósito en línea",
            "https://www.dr-webstudio.com/es/blog/como-aceptar-pagos-en-linea-republica-dominicana",
          ),
          run(" convierte el interés remoto en negocio confirmado."),
        ]),
        rich("normal", [
          run("•  "),
          run(
            'Contenido que posiciona todo el año. Para un destino estacional, el contenido es lo que suaviza el calendario — páginas que responden "mejor época para avistar ballenas en Samaná", "cómo visitar Los Haitises" o "comprar propiedad en Las Galeras" se posicionan continuamente y capturan a los planificadores con meses de antelación, manteniendo el flujo lleno incluso en la temporada baja.',
          ),
        ]),
        h2("Una palabra honesta sobre las concesiones"),
        p(
          "El mercado de Samaná es genuinamente atractivo — internacional, de alto valor, de todo el año gracias a la base de expatriados — pero tiene realidades que vale la pena nombrar con claridad. La estacionalidad es real para los operadores turísticos: la temporada de ballenas es un estallido concentrado, y un negocio demasiado dependiente de esos tres meses tiene que trabajar más duro, a través del contenido y el mercado residente, para ganarse todo el año. La península está menos desarrollada que las grandes zonas de resorts, con peculiaridades de infraestructura que hacen que un hosting confiable y un sitio rápido y resiliente sean más que un lujo. Y como los compradores y viajeros son tan internacionales, hacerle justicia a este mercado significa calidad multilingüe genuina, no una traducción simbólica — el jubilado francés y el eco-viajero alemán lo notan. Nada de esto argumenta contra construir; argumenta a favor de construir bien. Samaná premia a los negocios que reciben a su audiencia internacional y exigente con el profesionalismo que esa audiencia espera.",
        ),
        h2("La historia de infraestructura que lo cambió todo"),
        p(
          "Vale la pena entender por qué Samaná se volvió lo bastante accesible como para construir un mercado real. Durante la mayor parte de su historia la península fue remota — un viaje largo y difícil desde cualquier parte. Dos cosas cambiaron eso: la carretera moderna que conecta Samaná con Santo Domingo, que redujo el viaje dramáticamente, y el Aeropuerto Internacional El Catey, que trajo vuelos directos desde Norteamérica y Europa. Ese acceso es lo que convirtió un rincón hermoso pero aislado en un destino que los viajeros internacionales y los compradores de propiedades pueden realmente alcanzar en un calendario de vacaciones normal. Para los negocios locales, el significado es simple: la audiencia que la infraestructura desbloqueó es una audiencia internacional, que llega en avión, que investiga primero — del tipo que planifica en línea antes de llegar. Un viajero que reserva un vuelo a El Catey ya decidió venir; la única pregunta es cuál tour de ballenas, cuál eco-lodge, cuál restaurante elige una vez que empieza a buscar. Ser el negocio que aparece, en su idioma, con un sitio profesional y reserva fácil, es cómo capturas la demanda que el aeropuerto y la carretera entregaron a tu puerta.",
        ),
        h2("Construye para la península, desde donde sea"),
        rich("normal", [
          run(
            "El desarrollo web es trabajo remoto, así que un negocio en Samaná, Las Terrenas o Las Galeras no necesita un desarrollador en el pueblo — necesita uno que entienda el mercado turístico e inmobiliario dominicano y la audiencia únicamente internacional y eco-consciente de Samaná. Eso es exactamente lo que hacemos en ",
          ),
          link("DR Web Studio", "https://www.dr-webstudio.com/es"),
          run(
            ": páginas web rápidas, multilingües y reservables para negocios de turismo y propiedades dominicanos, con WhatsApp y pagos locales integrados y el primer año de mantenimiento incluido. Ya sea que estés llenando tours de temporada de ballenas, el calendario de un eco-lodge, o un flujo de compradores internacionales de propiedades, el sitio que alcanza a tu audiencia en su idioma es el que gana la península. ",
          ),
          link(
            "Contáctanos para una consulta gratuita",
            "https://www.dr-webstudio.com/es/contacto",
          ),
          run(" y construyámoslo."),
        ]),
      ],
    },
    seo: {
      metaTitle: loc(
        "Samaná Peninsula Websites: Eco-Tourism & Property",
        "Webs Península de Samaná: Eco-Turismo y Propiedades",
      ),
      ogTitle: loc(
        "Websites for Eco-Tourism & International Buyers",
        "Páginas Web para Eco-Turismo y Compradores Internacionales",
      ),
      ogDescription: loc(
        "Whale season, eco-tourism, and an international property market — Samaná's audience researches and buys online, often from another continent. A multilingual website is the storefront.",
        "Temporada de ballenas, eco-turismo y un mercado inmobiliario internacional — la audiencia de Samaná investiga y compra en línea, muchas veces desde otro continente. Una web multilingüe es la tienda.",
      ),
      keywords: {
        en: [
          "Samaná tourism website",
          "whale watching website Samaná",
          "Samaná real estate website",
          "Las Galeras business website",
          "eco-lodge website Dominican Republic",
        ],
        es: [
          "página web turismo Samaná",
          "página web avistamiento ballenas Samaná",
          "página web inmobiliaria Samaná",
          "página web negocio Las Galeras",
          "página web eco-lodge República Dominicana",
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
