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
    slug: "websites-car-rental-private-transfer-services",
    slugEs: "paginas-web-renta-de-autos-y-traslados-privados",
    title: loc(
      "Websites for Car Rental & Private Transfer Services in the DR",
      "Páginas Web para Renta de Autos y Traslados Privados en RD",
    ),
    description: loc(
      "Car rental and transfer businesses in the DR live inside aggregators that own the customer. Why your own bookable, bilingual site is how you win direct reservations.",
      "Los negocios de renta de autos y traslados en RD viven dentro de agregadores que se quedan con el cliente. Por qué tu propio sitio reservable y bilingüe gana reservas directas.",
    ),
    readTime: 9,
    featured: false,
    tags: {
      en: ["car rental", "transfers", "transport", "aggregators", "direct booking", "tourism", "Dominican Republic"],
      es: ["renta de autos", "traslados", "transporte", "agregadores", "reserva directa", "turismo", "República Dominicana"],
    },
    categories: ["business-tips"],
    publishedAt: "2026-08-12T12:00:00.000Z",
    body: {
      en: [
        p("Search \"car rental Punta Cana\" and look at what actually fills the first page. Expedia. EconomyBookings. Airport Rentals. Discover Cars. A dozen aggregators, each listing the same local operators as interchangeable rows in a price-sorted table. Somewhere in those tables is your business — a name, a rate, a star rating, competing against everyone else on the single dimension the table allows. The customer books, the platform takes its cut, and you never learn who they were. Car rental and private transfer businesses in the Dominican Republic operate in one of the most intermediated markets in tourism, and the escape route is the same one every squeezed operator eventually finds: your own bookable website, and every reason for the customer to use it."),
        h2("The aggregator squeeze, stated plainly"),
        rich("normal", [run("The comparison sites are genuinely good at what they do — they aggregate demand and deliver volume, and a new operation would struggle without them. But understand the terms of the arrangement. You compete on price alone, because that's what the table sorts by. Your fleet's condition, your service, your local knowledge, your flexibility on a late flight — none of it fits in a row. You pay a commission on every booking. You don't get the customer's contact details, so a family that had a great week with you can't easily be reached next year. And the platform ranks above you in Google for the searches about your own city, which means even a customer who wants a local operator often can't find one directly.")]),
        rich("normal", [run("None of that argues for abandoning the platforms. It argues for not being only a listing on them — because the moment a traveler wants to book directly, or a hotel wants a reliable transfer partner, or a repeat visitor remembers you, they need somewhere to go. That somewhere is your website, and if it doesn't exist or doesn't take bookings, the aggregator wins by default.")]),
        h2("Trust is the real product here"),
        rich("normal", [run("There's a reason this vertical converts on more than price, and it's worth naming honestly: renting a car or booking a transfer in an unfamiliar country makes travelers nervous. They've read the forum threads about surprise insurance charges, deposit holds, and hidden fees. They're arriving at night in a place they don't know, sometimes with children, and they need to believe a vehicle and a driver will actually be there. Requirements are genuinely confusing too — most rental companies in the DR require a credit card in the driver's name, "), link("local liability insurance is mandatory regardless of what a traveler's home credit card covers", "https://www.jumbocar-dominicanrepublic.com/car-rental-santo-domingo-airport"), run(", and minimum age rules apply.")]),
        p("Every one of those anxieties is an opportunity. The operator whose website explains the insurance situation clearly, states the deposit and what's held, shows the actual vehicles, names the airport meeting point, and publishes an all-in price with nothing hidden converts the nervous traveler that a price-sorted table never could. In this vertical, transparency isn't a nice touch — it's the entire competitive advantage available to a local operator against a global brand."),
        h2("The two businesses inside one vertical"),
        p("Worth separating, because their customers behave differently:"),
        rich("normal", [run("Car rental serves the independent traveler who wants to explore — the road-tripper heading to Samaná or Barahona, the expat needing a month-long rental, the business visitor. They plan ahead, compare carefully, worry about insurance and road conditions, and want to know whether they need 4x4 for where they're going.")]),
        rich("normal", [run("Private transfers serve almost everyone else: the resort guest who booked a Punta Cana package and needs to get from PUJ to Bávaro, the family that doesn't want to drive at all, the cruise passenger, the business traveler. This customer buys certainty — a named driver, a fixed price, someone holding a sign at arrivals. Transfers are also a natural repeat and referral business, because a good driver becomes \"our guy in the DR\" and gets recommended to friends.")]),
        rich("normal", [run("The websites differ accordingly: rental needs fleet detail, requirements, and insurance clarity; transfers need routes, fixed prices, and vehicle capacity. Most operators do both, which is exactly the case for separate pages per service rather than one generic page — "), link("each service ranks for its own searches", "https://www.dr-webstudio.com/en/blog/one-page-site-vs-multi-page-which-do-you-need"), run(".")]),
        h2("What this website has to do"),
        rich("normal", [run("•  "), run("Take real bookings with a deposit. The highest-value feature by far. A traveler comparing options at 11pm from Toronto should be able to reserve and pay a deposit on the spot, using the "), link("local payment methods", "https://www.dr-webstudio.com/en/blog/how-to-accept-online-payments-dominican-republic"), run(" available in the DR. An inquiry form loses to a competitor's instant confirmation.")]),
        rich("normal", [run("•  "), run("Publish honest, complete pricing. Daily rates, transfer prices by route, what insurance costs, what deposit is held, what's included. Every hidden fee a traveler fears is one you can neutralize by stating it plainly — and the operator who does looks trustworthy next to the one who says \"contact for pricing.\"")]),
        rich("normal", [run("•  "), run("Show the actual vehicles. Real photographs of your real fleet, with year, capacity, air conditioning, luggage space. Stock photos of cars you don't own is the fastest way to lose a careful researcher.")]),
        rich("normal", [run("•  "), run("Be genuinely bilingual. Your customers arrive from the US, Canada, and Europe searching in English, French, and German, while local and diaspora customers search in Spanish. That means "), link("real separate pages per language", "https://www.dr-webstudio.com/en/blog/seo-bilingue-posicionarse-ingles-espanol-sin-perjudicar-ninguno"), run(", not a translate widget.")]),
        rich("normal", [run("•  "), run("Rank for the routes people actually search. \"Punta Cana airport to Bávaro transfer,\" \"SDQ to Las Terrenas,\" \"car rental Puerto Plata airport\" — route-specific and airport-specific pages capture high-intent searches the aggregators cover generically.")]),
        rich("normal", [run("•  "), run("Be fast, and connected to WhatsApp. A traveler with a delayed flight needs to reach you in one tap, and "), link("speed decides whether they wait for your page to load", "https://www.dr-webstudio.com/en/blog/core-web-vitals-como-la-velocidad-afecta-tus-ventas-online"), run(" at all. "), link("WhatsApp on every page", "https://www.dr-webstudio.com/en/blog/how-to-connect-website-whatsapp-google-maps-instagram"), run(" is non-negotiable in this business.")]),
        h2("The B2B side almost everyone forgets"),
        rich("normal", [run("Here's a channel this vertical routinely underuses. Hotels, villa rental companies, tour operators, wedding planners, and relocation services all need transport partners they can hand to clients without worrying. Those businesses find partners the same way tourists do — by searching and evaluating what they find. A professional site with a clear \"for hotels and partners\" page, fleet details, and evidence of reliability turns your operation into the obvious choice for a recurring B2B relationship worth far more than any single booking. It's the same credibility logic that drives "), link("professional services", "https://www.dr-webstudio.com/en/blog/websites-law-firms-accountants-relocation-services"), run(", applied to transport — and it's almost entirely uncontested, because most local operators build for tourists only.")]),
        h2("The seasonal reality, and how content smooths it"),
        p("Transport demand in the DR swings hard with the tourism calendar — high season floods you, low season empties the lot — and your website is the cheapest tool for flattening that curve. Travelers plan road trips months ahead and search for specifics: whether the drive from Punta Cana to Samaná is safe, how long Santo Domingo to Barahona takes, whether you need four-wheel drive for the mountain roads to Jarabacoa, what the tolls cost on the Autopista del Nordeste. Every one of those is a page that ranks all year and catches a customer at the planning stage rather than the booking stage — which is exactly when you can win them away from an aggregator they haven't opened yet. This content also does quiet double duty: a company that explains road conditions and route times honestly reads as expert and local in a way no price table can, which is precisely the trust advantage you hold over a global brand."),
        h2("An honest word on reviews and the platforms"),
        p("Two realities to hold together. First, in this vertical reviews carry unusual weight — travelers researching a rental company read them obsessively, and no website design overcomes a wall of complaints about surprise charges. Your web presence and your service standard have to match; a great site attached to a bad experience just accelerates the bad reviews. Second, keep the aggregators. They deliver genuine volume, particularly from travelers who'd never find you otherwise. The goal is to convert their bookings into direct customers next time: put your website on the paperwork, on the vehicle, in the follow-up message, and make it worth their while to book direct — better price, better vehicle, better flexibility. Volume from the platforms, margin and loyalty from your own channel. Operators who do both build something durable; operators who do only the first are renting their business from an algorithm."),
        h2("Build the channel where the customer is yours"),
        rich("normal", [run("At "), link("DR Web Studio", "https://www.dr-webstudio.com/en"), run(" we build exactly this: fast, bilingual, bookable sites with deposits, route and fleet pages, and WhatsApp wired in — plus the first year of maintenance included. If your cars are moving but the commissions are eating the margin, "), link("contact us for a free consultation", "https://www.dr-webstudio.com/en/contact"), run(" and let's build the direct channel your business is currently renting.")]),
      ],
      es: [
        p("Busca \"renta de autos Punta Cana\" y mira qué llena realmente la primera página. Expedia. EconomyBookings. Airport Rentals. Discover Cars. Una docena de agregadores, cada uno listando a los mismos operadores locales como filas intercambiables en una tabla ordenada por precio. En algún lugar de esas tablas está tu negocio — un nombre, una tarifa, una calificación en estrellas, compitiendo contra todos los demás en la única dimensión que la tabla permite. El cliente reserva, la plataforma se lleva su tajada, y tú nunca sabes quién era. Los negocios de renta de autos y traslados privados en República Dominicana operan en uno de los mercados más intermediados del turismo, y la ruta de escape es la misma que todo operador exprimido encuentra tarde o temprano: tu propia página web reservable, y todas las razones para que el cliente la use."),
        h2("El apretón de los agregadores, dicho claramente"),
        rich("normal", [run("Los sitios de comparación son genuinamente buenos en lo que hacen — agregan demanda y entregan volumen, y una operación nueva batallaría sin ellos. Pero entiende los términos del arreglo. Compites solo por precio, porque es lo que la tabla ordena. La condición de tu flota, tu servicio, tu conocimiento local, tu flexibilidad ante un vuelo retrasado — nada de eso cabe en una fila. Pagas comisión por cada reserva. No obtienes los datos de contacto del cliente, así que a una familia que pasó una gran semana contigo no puedes alcanzarla fácilmente el año siguiente. Y la plataforma se posiciona por encima de ti en Google para las búsquedas sobre tu propia ciudad, lo que significa que incluso un cliente que quiere un operador local muchas veces no puede encontrarlo directamente.")]),
        rich("normal", [run("Nada de eso argumenta por abandonar las plataformas. Argumenta por no ser solamente un listado en ellas — porque en el momento en que un viajero quiere reservar directo, o un hotel quiere un socio confiable de traslados, o un visitante que regresa te recuerda, necesitan a dónde ir. Ese lugar es tu página web, y si no existe o no toma reservas, el agregador gana por defecto.")]),
        h2("La confianza es el producto real aquí"),
        rich("normal", [run("Hay una razón por la que este vertical convierte por algo más que el precio, y vale la pena nombrarla con honestidad: rentar un auto o reservar un traslado en un país desconocido pone nerviosos a los viajeros. Han leído los hilos de foros sobre cargos sorpresa de seguro, retenciones de depósito y cuotas ocultas. Llegan de noche a un lugar que no conocen, a veces con niños, y necesitan creer que un vehículo y un chofer realmente estarán ahí. Los requisitos también son genuinamente confusos — la mayoría de las empresas de renta en RD exige una tarjeta de crédito a nombre del conductor, "), link("el seguro de responsabilidad local es obligatorio sin importar lo que cubra la tarjeta de crédito del viajero en su país", "https://www.jumbocar-dominicanrepublic.com/car-rental-santo-domingo-airport"), run(", y aplican reglas de edad mínima.")]),
        p("Cada una de esas ansiedades es una oportunidad. El operador cuya página web explica la situación del seguro con claridad, indica el depósito y qué se retiene, muestra los vehículos reales, nombra el punto de encuentro en el aeropuerto, y publica un precio todo incluido sin nada oculto convierte al viajero nervioso que una tabla ordenada por precio nunca podría. En este vertical, la transparencia no es un detalle simpático — es toda la ventaja competitiva disponible para un operador local frente a una marca global."),
        h2("Los dos negocios dentro de un vertical"),
        p("Vale la pena separarlos, porque sus clientes se comportan distinto:"),
        rich("normal", [run("La renta de autos sirve al viajero independiente que quiere explorar — el que hace un road trip a Samaná o Barahona, el expatriado que necesita una renta de un mes, el visitante de negocios. Planifican con antelación, comparan con cuidado, se preocupan por el seguro y las condiciones de las carreteras, y quieren saber si necesitan 4x4 para donde van.")]),
        rich("normal", [run("Los traslados privados sirven a casi todos los demás: el huésped de resort que reservó un paquete a Punta Cana y necesita ir de PUJ a Bávaro, la familia que no quiere manejar en absoluto, el crucerista, el viajero de negocios. Este cliente compra certeza — un chofer con nombre, un precio fijo, alguien con un letrero en llegadas. Los traslados son además un negocio natural de recompra y referidos, porque un buen chofer se convierte en \"nuestro hombre en RD\" y lo recomiendan a los amigos.")]),
        rich("normal", [run("Las páginas web difieren en consecuencia: la renta necesita detalle de flota, requisitos y claridad sobre el seguro; los traslados necesitan rutas, precios fijos y capacidad de vehículos. La mayoría de los operadores hace ambos, que es exactamente el argumento para páginas separadas por servicio en vez de una página genérica — "), link("cada servicio posiciona para sus propias búsquedas", "https://www.dr-webstudio.com/es/blog/sitio-de-una-pagina-vs-varias-paginas-cual-necesitas"), run(".")]),
        h2("Qué tiene que hacer esta página web"),
        rich("normal", [run("•  "), run("Tomar reservas reales con depósito. La función de mayor valor por lejos. Un viajero comparando opciones a las 11pm desde Toronto debería poder reservar y pagar un depósito al instante, usando los "), link("métodos de pago locales", "https://www.dr-webstudio.com/es/blog/como-aceptar-pagos-en-linea-republica-dominicana"), run(" disponibles en RD. Un formulario de consulta pierde ante la confirmación instantánea de un competidor.")]),
        rich("normal", [run("•  "), run("Publicar precios honestos y completos. Tarifas diarias, precios de traslado por ruta, cuánto cuesta el seguro, qué depósito se retiene, qué está incluido. Cada cuota oculta que un viajero teme es una que puedes neutralizar diciéndola claramente — y el operador que lo hace se ve confiable junto al que dice \"contáctenos para precios.\"")]),
        rich("normal", [run("•  "), run("Mostrar los vehículos reales. Fotografías reales de tu flota real, con año, capacidad, aire acondicionado, espacio para equipaje. Fotos de banco de autos que no posees es la forma más rápida de perder a un investigador cuidadoso.")]),
        rich("normal", [run("•  "), run("Ser genuinamente bilingüe. Tus clientes llegan de EE.UU., Canadá y Europa buscando en inglés, francés y alemán, mientras los clientes locales y de la diáspora buscan en español. Eso significa "), link("páginas separadas reales por idioma", "https://www.dr-webstudio.com/es/blog/seo-bilingue-posicionarse-ingles-espanol-sin-perjudicar-ninguno"), run(", no un widget de traducción.")]),
        rich("normal", [run("•  "), run("Posicionarte para las rutas que la gente realmente busca. \"Traslado aeropuerto Punta Cana a Bávaro,\" \"SDQ a Las Terrenas,\" \"renta de autos aeropuerto Puerto Plata\" — las páginas por ruta y por aeropuerto capturan búsquedas de alta intención que los agregadores cubren de forma genérica.")]),
        rich("normal", [run("•  "), run("Ser rápida, y conectada a WhatsApp. Un viajero con un vuelo retrasado necesita alcanzarte en un toque, y "), link("la velocidad decide si esperan a que tu página cargue", "https://www.dr-webstudio.com/es/blog/core-web-vitals-como-la-velocidad-afecta-tus-ventas-online"), run(" siquiera. "), link("WhatsApp en cada página", "https://www.dr-webstudio.com/es/blog/como-conectar-sitio-web-whatsapp-google-maps-instagram"), run(" es innegociable en este negocio.")]),
        h2("El lado B2B que casi todos olvidan"),
        rich("normal", [run("Aquí hay un canal que este vertical desaprovecha rutinariamente. Hoteles, empresas de alquiler de villas, operadores de tours, organizadores de bodas y servicios de reubicación todos necesitan socios de transporte que puedan entregarle a sus clientes sin preocuparse. Esos negocios encuentran socios de la misma forma que los turistas — buscando y evaluando lo que encuentran. Un sitio profesional con una página clara de \"para hoteles y socios,\" detalles de flota y evidencia de confiabilidad convierte tu operación en la elección obvia para una relación B2B recurrente que vale mucho más que cualquier reserva individual. Es la misma lógica de credibilidad que impulsa a los "), link("servicios profesionales", "https://www.dr-webstudio.com/es/blog/paginas-web-firmas-legales-contables-y-reubicacion"), run(", aplicada al transporte — y está casi completamente sin disputar, porque la mayoría de los operadores locales construye solo para turistas.")]),
        h2("La realidad estacional, y cómo el contenido la suaviza"),
        p("La demanda de transporte en RD oscila fuerte con el calendario turístico — la temporada alta te inunda, la baja te vacía el patio — y tu página web es la herramienta más barata para aplanar esa curva. Los viajeros planifican road trips con meses de antelación y buscan detalles específicos: si el trayecto de Punta Cana a Samaná es seguro, cuánto toma Santo Domingo a Barahona, si necesitas doble tracción para las carreteras de montaña hacia Jarabacoa, cuánto cuestan los peajes en la Autopista del Nordeste. Cada una de esas es una página que posiciona todo el año y atrapa a un cliente en la etapa de planificación en vez de la de reserva — que es exactamente cuando puedes ganártelo antes de que abra un agregador. Este contenido además hace doble trabajo en silencio: una empresa que explica las condiciones de las carreteras y los tiempos de ruta con honestidad se lee como experta y local de una forma que ninguna tabla de precios logra, que es precisamente la ventaja de confianza que tienes sobre una marca global."),
        h2("Una palabra honesta sobre reseñas y plataformas"),
        p("Dos realidades que hay que sostener juntas. Primera, en este vertical las reseñas pesan de forma inusual — los viajeros que investigan una empresa de renta las leen obsesivamente, y ningún diseño de página web supera un muro de quejas sobre cargos sorpresa. Tu presencia web y tu estándar de servicio tienen que coincidir; un gran sitio pegado a una mala experiencia solo acelera las malas reseñas. Segunda, conserva los agregadores. Entregan volumen genuino, particularmente de viajeros que nunca te encontrarían de otro modo. La meta es convertir sus reservas en clientes directos la próxima vez: pon tu página web en el papeleo, en el vehículo, en el mensaje de seguimiento, y haz que les convenga reservar directo — mejor precio, mejor vehículo, mejor flexibilidad. Volumen de las plataformas, margen y lealtad de tu propio canal. Los operadores que hacen ambas cosas construyen algo duradero; los que solo hacen lo primero le están alquilando su negocio a un algoritmo."),
        h2("Construye el canal donde el cliente es tuyo"),
        rich("normal", [run("En "), link("DR Web Studio", "https://www.dr-webstudio.com/es"), run(" construimos exactamente esto: sitios rápidos, bilingües y reservables con depósitos, páginas de rutas y flota, y WhatsApp integrado — más el primer año de mantenimiento incluido. Si tus autos se están moviendo pero las comisiones se comen el margen, "), link("contáctanos para una consulta gratuita", "https://www.dr-webstudio.com/es/contacto"), run(" y construyamos el canal directo que tu negocio actualmente está alquilando.")]),
      ],
    },
    seo: {
      metaTitle: loc(
        "Car Rental & Transfer Websites in the DR (2026)",
        "Webs para Renta de Autos y Traslados en RD (2026)",
      ),
      ogTitle: loc(
        "Websites for Car Rental & Private Transfer Services",
        "Páginas Web para Renta de Autos y Traslados Privados",
      ),
      ogDescription: loc(
        "Expedia and the aggregators rank above every local operator. Trust, transparent pricing, and instant booking on your own site are how you take the reservation directly.",
        "Expedia y los agregadores se posicionan por encima de todo operador local. Confianza, precios transparentes y reserva instantánea en tu sitio son cómo tomas la reserva directa.",
      ),
      keywords: {
        en: ["car rental website Dominican Republic", "airport transfer website", "private transfer Punta Cana website", "car rental booking site", "transfer service web design"],
        es: ["página web renta de autos República Dominicana", "página web traslados aeropuerto", "página web traslado privado Punta Cana", "sitio de reservas renta de autos", "diseño web servicio de traslados"],
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