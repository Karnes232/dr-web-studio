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
    slug: "miches-all-inclusive-trap-local-business-websites",
    slugEs: "miches-la-trampa-del-todo-incluido-y-los-negocios-locales",
    title: loc(
      "Miches and the All-Inclusive Trap: Why Local Businesses Need Websites",
      "Miches y la Trampa del Todo-Incluido: Por Qué los Negocios Locales Necesitan una Web",
    ),
    description: loc(
      "Miches is booming with all-inclusive resorts — but that model keeps guests inside. Why local businesses need a website to pull them out, and win the searches first.",
      "Miches está en auge con resorts todo-incluido — pero ese modelo mantiene a los huéspedes adentro. Por qué los negocios locales necesitan una web para sacarlos.",
    ),
    readTime: 9,
    featured: false,
    tags: {
      en: [
        "Miches",
        "tourism",
        "all-inclusive",
        "eco-luxury",
        "first mover",
        "Dominican Republic",
        "bilingual",
        "tour operators",
      ],
      es: [
        "Miches",
        "turismo",
        "todo-incluido",
        "eco-lujo",
        "primer movimiento",
        "República Dominicana",
        "bilingüe",
        "operadores de tours",
      ],
    },
    categories: ["web-design", "business-tips"],
    publishedAt: "2026-07-07T13:00:00.000Z",
    body: {
      en: [
        p(
          "Miches has arrived. A decade ago it was a quiet fishing town on the Dominican Republic's northeast coast; today it's one of the most talked-about new destinations in the Caribbean, named to The New York Times' list of 52 Places to Go in 2026 and backed by more than a billion dollars of hotel investment. Club Med, Viva by Wyndham, Zemi by Hilton, Marriott, and Hyatt's Secrets and Dreams are already open and filling with guests, and Four Seasons opens at Tropicalia by the end of 2026. But for the local businesses of Miches, this boom comes with a catch that almost nobody is talking about — and a website is the tool that solves it.",
        ),
        h2("The all-inclusive trap"),
        p(
          "Here's the uncomfortable truth about Miches' particular kind of tourism boom: it's built almost entirely on all-inclusive resorts. That model is wonderful for the guest and the resort, but it's designed, quite deliberately, to keep visitors and their money inside the property. Meals, drinks, entertainment, even many excursions are bundled into the price the guest already paid, so the default behavior is to never leave. For a local restaurant, tour operator, villa, or shop in and around Miches, this is the central challenge: the guests are physically nearby but economically walled off. Unlike a cruise passenger who steps off the ship looking for something to do, an all-inclusive guest has every reason to stay put — unless something pulls them out.",
        ),
        p(
          'That "something" is almost always found online, before or during the trip. A guest doesn\'t wander out of a resort on a whim; they research "best things to do in Miches," "Montaña Redonda tour," "restaurants near Playa Esmeralda," or "whale watching Samaná from Miches," and they book with whoever shows up, looks professional, and makes it easy. If your business isn\'t there when they search, you don\'t exist to them — the resort keeps their entire budget, and you never knew the guest was two kilometers away. This is why, in an all-inclusive destination specifically, a website isn\'t marketing. It\'s the only door out of the resort that leads to you.',
        ),
        h2("The traveler Miches attracts is your best customer"),
        p(
          "The good news is that Miches doesn't attract the typical all-inclusive crowd that never leaves the pool. By design and by branding, it draws the eco-luxury traveler — the visitor who chose Miches precisely because it's the un-Punta-Cana: virgin beaches, mountains, sustainability, authentic local culture. The tourism ministry itself markets Miches on being eco-friendly, luxurious, and full of virgin spaces, and that positioning self-selects for exactly the guest most likely to venture out for a genuine experience. This traveler will absolutely leave the resort for the highest waterfall in the country, a hilltop swing at Montaña Redonda, a turtle-nesting tour, or a farm-to-table Dominican meal — but only if they can find and book it in advance, in their language, from their phone. The demand to leave the resort exists; the businesses that capture it are simply the ones that are findable.",
        ),
        h2("Who has the biggest opening in Miches"),
        p(
          "The all-inclusive dynamic means some local business types have an especially clear opportunity to pull guests out:",
        ),
        rich("normal", [
          run("•  "),
          run(
            "Tour and excursion operators. This is the sharpest opportunity in Miches. Montaña Redonda, Salto de La Jalda (the DR's highest waterfall), the Redonda and Limón lagoons, whale watching in Samaná Bay, and turtle-nesting experiences are world-class draws that resorts can't fully contain. An operator with real, bookable, bilingual excursion pages captures guests researching independent alternatives — exactly the playbook we lay out for ",
          ),
          link(
            "tour operators and excursion companies",
            "https://www.dr-webstudio.com/en/blog/websites-for-tour-operators-excursions",
          ),
          run("."),
        ]),
        rich("normal", [
          run("•  "),
          run(
            "Independent restaurants. An all-inclusive guest who leaves for one authentic Dominican meal is choosing from whatever they can find on Google Maps with a real menu and photos. The restaurants that are findable win a market their competitors don't even know is searching.",
          ),
        ]),
        rich("normal", [
          run("•  "),
          run(
            "Villas and boutique rentals. As Miches matures beyond the big resorts, independent villas and residences — including the branded residences at Four Seasons' Tropicalia — need direct-booking websites to reach the traveler who wants Miches without the all-inclusive format.",
          ),
        ]),
        rich("normal", [
          run("•  "),
          run(
            "Transport, wellness, and experiences. Private transfers from Punta Cana's airport (90 minutes away), yoga and wellness practitioners, photographers, private chefs — all the premium services an eco-luxury traveler wants, and all invisible without a web presence.",
          ),
        ]),
        h2("What a Miches website has to do"),
        p(
          "The formula that wins across Dominican tourism applies here, sharpened by the eco-luxury, all-inclusive context:",
        ),
        rich("normal", [
          run("•  "),
          run(
            "Genuinely bilingual, English-forward. Miches' guests are heavily international — Canadian, American, and European — researching in English, with a growing French segment. Each language needs its own real, indexed pages, built the way we describe in ",
          ),
          link(
            "bilingual SEO",
            "https://www.dr-webstudio.com/en/blog/seo-bilingue-posicionarse-ingles-espanol-sin-perjudicar-ninguno",
          ),
          run(", not a translate widget."),
        ]),
        rich("normal", [
          run("•  "),
          run(
            "Fast and mobile-first. The guest is researching on a phone, often on resort Wi-Fi, deciding in seconds whether to leave the property. A slow site loses them before it loads, and ",
          ),
          link(
            "speed converts directly into bookings",
            "https://www.dr-webstudio.com/en/blog/core-web-vitals-como-la-velocidad-afecta-tus-ventas-online",
          ),
          run("."),
        ]),
        rich("normal", [
          run("•  "),
          run(
            "Photo-forward, without the weight. Miches sells on its scenery — the emerald beach, the mountain swings, the waterfall — but heavy galleries kill mobile speed, so the ",
          ),
          link(
            "image-optimization craft",
            "https://www.dr-webstudio.com/en/blog/optimizacion-imagenes-sitios-web-turismo-fotos-alta-calidad-carga-rapida",
          ),
          run(" is essential."),
        ]),
        rich("normal", [
          run("•  "),
          run(
            "WhatsApp-connected, with online booking. The booking closes in a chat, and a guest deciding on a whim to leave the resort tomorrow needs to reach you in one tap — alongside Google Maps and Instagram, as we cover in ",
          ),
          link(
            "connecting your site to WhatsApp, Maps, and Instagram",
            "https://www.dr-webstudio.com/en/blog/how-to-connect-website-whatsapp-google-maps-instagram",
          ),
          run(
            ". Better still, let them pay a deposit online to lock it in, using the local tools in ",
          ),
          link(
            "accepting online payments in the DR",
            "https://www.dr-webstudio.com/en/blog/how-to-accept-online-payments-dominican-republic",
          ),
          run("."),
        ]),
        rich("normal", [
          run("•  "),
          run(
            'Content that ranks for the research phase. The guests who leave the resort decided to before they arrived. A business that publishes genuinely useful pages — "how to visit Montaña Redonda," "is Salto de La Jalda worth it," "best time for whale watching from Miches" — ranks for the questions future guests are already Googling, and becomes the name they trust before they land.',
          ),
        ]),
        h2("Why first movers win here — and it's not too late"),
        p(
          'In Punta Cana, ranking for a tourism keyword means fighting hundreds of established competitors. Miches is nearly the opposite: the resorts arrived faster than the local digital economy, so most valuable searches — "Miches excursions," "things to do in Miches," and their Spanish equivalents — have only a handful of serious local sites competing today. A properly built, genuinely bilingual website can reach Google\'s first page for meaningful terms in months rather than years. And because search rankings compound — every month a page ranks, it gathers reviews, links, and authority — the businesses that build now will be defending page one when the Four Seasons crowd arrives and the competition finally wakes up. The window is open, but it narrows with every resort that opens.',
        ),
        h2("An honest word on the risks"),
        p(
          "Miches is real and operating, which makes it a safer bet than a pure frontier — but it isn't risk-free, and pretending otherwise would be a disservice. The all-inclusive model is a genuine structural headwind: some guests will never leave the resort no matter how good your website is, so a Miches business should size its expectations to the share who do, not the whole arrival count. Development timelines can still slip — resort openings across the region have a history of sliding — and the eco-luxury positioning that makes Miches special also depends on the destination protecting the very nature that draws people, an ongoing tension in any fast-growing area. None of this argues against building; it argues for building smart. A professional website is a modest, one-time investment against a decade of tourism growth that is already underway, not merely promised. The guests are already arriving. The only question is whether they can find you when they decide to leave the resort.",
        ),
        h2("Build for the boom, from anywhere"),
        rich("normal", [
          run(
            "Web development is remote work, so a business in Miches doesn't need a developer in town — it needs one who understands the Dominican tourism market, the bilingual eco-luxury traveler, and the specific challenge of pulling guests out of an all-inclusive. That's exactly what we do at ",
          ),
          link("DR Web Studio", "https://www.dr-webstudio.com/en"),
          run(
            ": fast, bilingual, bookable websites for Dominican tourism businesses, with WhatsApp and local payments wired in and the first year of maintenance included. It's the same opportunity we've written about in the emerging ",
          ),
          link(
            "southwest around Pedernales and Cabo Rojo",
            "https://www.dr-webstudio.com/en/blog/pedernales-cabo-rojo-southwest-digital-frontier",
          ),
          run(
            ", now playing out on the northeast coast — and the businesses that move first are the ones that win the searches. If your business is in or around Miches, ",
          ),
          link(
            "contact us for a free consultation",
            "https://www.dr-webstudio.com/en/contact",
          ),
          run(
            " and let's build the door that leads guests out of the resort and straight to you.",
          ),
        ]),
      ],
      es: [
        p(
          "Miches llegó. Hace una década era un tranquilo pueblo de pescadores en la costa noreste de República Dominicana; hoy es uno de los destinos nuevos de los que más se habla en el Caribe, incluido en la lista de The New York Times de 52 Lugares para Visitar en 2026 y respaldado por más de mil millones de dólares en inversión hotelera. Club Med, Viva by Wyndham, Zemi by Hilton, Marriott, y Secrets y Dreams de Hyatt ya están abiertos y llenándose de huéspedes, y Four Seasons abre en Tropicalia para finales de 2026. Pero para los negocios locales de Miches, este auge viene con una trampa de la que casi nadie está hablando — y una página web es la herramienta que la resuelve.",
        ),
        h2("La trampa del todo-incluido"),
        p(
          "Aquí está la verdad incómoda sobre el tipo particular de auge turístico de Miches: está construido casi enteramente sobre resorts todo-incluido. Ese modelo es maravilloso para el huésped y para el resort, pero está diseñado, de forma bastante deliberada, para mantener a los visitantes y su dinero dentro de la propiedad. Comidas, tragos, entretenimiento, incluso muchas excursiones vienen incluidos en el precio que el huésped ya pagó, así que el comportamiento por defecto es nunca salir. Para un restaurante local, un operador de tours, una villa o una tienda en Miches y sus alrededores, este es el desafío central: los huéspedes están físicamente cerca pero económicamente amurallados. A diferencia de un crucerista que baja del barco buscando algo que hacer, un huésped de todo-incluido tiene todas las razones para quedarse — a menos que algo lo saque.",
        ),
        p(
          'Ese "algo" casi siempre se encuentra en línea, antes o durante el viaje. Un huésped no sale de un resort por capricho; investiga "mejores cosas que hacer en Miches", "tour Montaña Redonda", "restaurantes cerca de Playa Esmeralda" o "avistamiento de ballenas Samaná desde Miches", y reserva con quien aparezca, se vea profesional y lo haga fácil. Si tu negocio no está ahí cuando buscan, no existes para ellos — el resort se queda con todo su presupuesto, y nunca supiste que el huésped estaba a dos kilómetros. Por esto, en un destino todo-incluido específicamente, una página web no es marketing. Es la única puerta de salida del resort que lleva hacia ti.',
        ),
        h2("El viajero que atrae Miches es tu mejor cliente"),
        p(
          "La buena noticia es que Miches no atrae a la multitud típica de todo-incluido que nunca sale de la piscina. Por diseño y por marca, atrae al viajero eco-lujo — el visitante que eligió Miches precisamente porque es lo opuesto a Punta Cana: playas vírgenes, montañas, sostenibilidad, cultura local auténtica. El propio ministerio de turismo promociona a Miches por ser eco-amigable, lujoso y lleno de espacios vírgenes, y ese posicionamiento auto-selecciona exactamente al huésped con mayor probabilidad de aventurarse por una experiencia genuina. Este viajero sin duda saldrá del resort por la cascada más alta del país, un columpio en la cima de Montaña Redonda, un tour de anidación de tortugas o una comida dominicana de la granja a la mesa — pero solo si puede encontrarlo y reservarlo por adelantado, en su idioma, desde su teléfono. La demanda de salir del resort existe; los negocios que la capturan son simplemente los que son encontrables.",
        ),
        h2("Quién tiene la apertura más grande en Miches"),
        p(
          "La dinámica del todo-incluido significa que algunos tipos de negocio local tienen una oportunidad especialmente clara de sacar a los huéspedes:",
        ),
        rich("normal", [
          run("•  "),
          run(
            "Operadores de tours y excursiones. Esta es la oportunidad más aguda en Miches. Montaña Redonda, el Salto de La Jalda (la cascada más alta de RD), las lagunas Redonda y Limón, el avistamiento de ballenas en la Bahía de Samaná, y las experiencias de anidación de tortugas son atracciones de clase mundial que los resorts no pueden contener del todo. Un operador con páginas de excursión reales, reservables y bilingües captura a los huéspedes que investigan alternativas independientes — exactamente el playbook que exponemos para ",
          ),
          link(
            "operadores de tours y excursiones",
            "https://www.dr-webstudio.com/es/blog/paginas-web-para-operadores-de-tours-y-excursiones",
          ),
          run("."),
        ]),
        rich("normal", [
          run("•  "),
          run(
            "Restaurantes independientes. Un huésped de todo-incluido que sale por una comida dominicana auténtica elige entre lo que pueda encontrar en Google Maps con un menú y fotos reales. Los restaurantes que son encontrables ganan un mercado que sus competidores ni siquiera saben que está buscando.",
          ),
        ]),
        rich("normal", [
          run("•  "),
          run(
            "Villas y alquileres boutique. A medida que Miches madura más allá de los grandes resorts, las villas y residencias independientes — incluidas las residencias de marca en el Tropicalia de Four Seasons — necesitan páginas web de reserva directa para llegar al viajero que quiere Miches sin el formato todo-incluido.",
          ),
        ]),
        rich("normal", [
          run("•  "),
          run(
            "Transporte, bienestar y experiencias. Traslados privados desde el aeropuerto de Punta Cana (a 90 minutos), practicantes de yoga y bienestar, fotógrafos, chefs privados — todos los servicios premium que un viajero eco-lujo quiere, y todos invisibles sin una presencia web.",
          ),
        ]),
        h2("Qué tiene que hacer una página web de Miches"),
        p(
          "La fórmula que gana en todo el turismo dominicano aplica aquí, afilada por el contexto eco-lujo y todo-incluido:",
        ),
        rich("normal", [
          run("•  "),
          run(
            "Genuinamente bilingüe, con el inglés al frente. Los huéspedes de Miches son fuertemente internacionales — canadienses, estadounidenses y europeos — investigando en inglés, con un segmento francés creciente. Cada idioma necesita sus propias páginas reales e indexadas, construidas como describimos en ",
          ),
          link(
            "SEO bilingüe",
            "https://www.dr-webstudio.com/es/blog/seo-bilingue-posicionarse-ingles-espanol-sin-perjudicar-ninguno",
          ),
          run(", no un widget de traducción."),
        ]),
        rich("normal", [
          run("•  "),
          run(
            "Rápida y mobile-first. El huésped investiga en un teléfono, muchas veces con el Wi-Fi del resort, decidiendo en segundos si sale de la propiedad. Un sitio lento lo pierde antes de cargar, y ",
          ),
          link(
            "la velocidad se convierte directamente en reservas",
            "https://www.dr-webstudio.com/es/blog/core-web-vitals-como-la-velocidad-afecta-tus-ventas-online",
          ),
          run("."),
        ]),
        rich("normal", [
          run("•  "),
          run(
            "Protagonizada por fotos, sin el peso. Miches se vende por su paisaje — la playa esmeralda, los columpios de montaña, la cascada — pero las galerías pesadas matan la velocidad móvil, así que el ",
          ),
          link(
            "oficio de optimización de imágenes",
            "https://www.dr-webstudio.com/es/blog/optimizacion-imagenes-sitios-web-turismo-fotos-alta-calidad-carga-rapida",
          ),
          run(" es esencial."),
        ]),
        rich("normal", [
          run("•  "),
          run(
            "Conectada a WhatsApp, con reserva en línea. La reserva se cierra en un chat, y un huésped que decide por capricho salir del resort mañana necesita alcanzarte en un toque — junto a Google Maps e Instagram, como cubrimos en ",
          ),
          link(
            "conectar tu sitio con WhatsApp, Maps e Instagram",
            "https://www.dr-webstudio.com/es/blog/como-conectar-sitio-web-whatsapp-google-maps-instagram",
          ),
          run(
            ". Mejor aún, deja que paguen un depósito en línea para asegurarlo, usando las herramientas locales de ",
          ),
          link(
            "aceptar pagos en línea en RD",
            "https://www.dr-webstudio.com/es/blog/como-aceptar-pagos-en-linea-republica-dominicana",
          ),
          run("."),
        ]),
        rich("normal", [
          run("•  "),
          run(
            'Contenido que posiciona para la fase de investigación. Los huéspedes que salen del resort lo decidieron antes de llegar. Un negocio que publica páginas genuinamente útiles — "cómo visitar Montaña Redonda", "¿vale la pena el Salto de La Jalda?", "mejor época para avistar ballenas desde Miches" — se posiciona para las preguntas que los futuros huéspedes ya están googleando, y se convierte en el nombre en el que confían antes de aterrizar.',
          ),
        ]),
        h2("Por qué los primeros ganan aquí — y no es demasiado tarde"),
        p(
          'En Punta Cana, posicionarse para una palabra clave de turismo significa pelear contra cientos de competidores establecidos. Miches es casi lo opuesto: los resorts llegaron más rápido que la economía digital local, así que la mayoría de las búsquedas valiosas — "excursiones Miches", "qué hacer en Miches" y sus equivalentes en inglés — tienen hoy solo un puñado de sitios locales serios compitiendo. Una página web bien construida y genuinamente bilingüe puede llegar a la primera página de Google para términos significativos en meses en vez de años. Y como el posicionamiento en búsqueda se acumula — cada mes que una página posiciona, reúne reseñas, enlaces y autoridad — los negocios que construyen ahora estarán defendiendo la primera página cuando llegue la multitud del Four Seasons y la competencia finalmente despierte. La ventana está abierta, pero se estrecha con cada resort que abre.',
        ),
        h2("Una palabra honesta sobre los riesgos"),
        p(
          "Miches es real y está operando, lo que lo hace una apuesta más segura que una frontera pura — pero no está libre de riesgo, y fingir lo contrario sería un flaco favor. El modelo todo-incluido es un obstáculo estructural genuino: algunos huéspedes nunca saldrán del resort por más buena que sea tu página web, así que un negocio de Miches debe dimensionar sus expectativas a la porción que sí sale, no al total de llegadas. Los cronogramas de desarrollo aún pueden atrasarse — las aperturas de resorts en la región tienen historial de deslizarse — y el posicionamiento eco-lujo que hace especial a Miches también depende de que el destino proteja la misma naturaleza que atrae a la gente, una tensión constante en cualquier área de rápido crecimiento. Nada de esto argumenta contra construir; argumenta a favor de construir con inteligencia. Una página web profesional es una inversión modesta y de una sola vez contra una década de crecimiento turístico que ya está en marcha, no meramente prometido. Los huéspedes ya están llegando. La única pregunta es si pueden encontrarte cuando decidan salir del resort.",
        ),
        h2("Construye para el auge, desde donde sea"),
        rich("normal", [
          run(
            "El desarrollo web es trabajo remoto, así que un negocio en Miches no necesita un desarrollador en el pueblo — necesita uno que entienda el mercado turístico dominicano, al viajero eco-lujo bilingüe, y el desafío específico de sacar a los huéspedes de un todo-incluido. Eso es exactamente lo que hacemos en ",
          ),
          link("DR Web Studio", "https://www.dr-webstudio.com/es"),
          run(
            ": páginas web rápidas, bilingües y reservables para negocios de turismo dominicanos, con WhatsApp y pagos locales integrados y el primer año de mantenimiento incluido. Es la misma oportunidad sobre la que escribimos en el emergente ",
          ),
          link(
            "suroeste alrededor de Pedernales y Cabo Rojo",
            "https://www.dr-webstudio.com/es/blog/pedernales-y-cabo-rojo-suroeste-proxima-frontera-digital",
          ),
          run(
            ", ahora desarrollándose en la costa noreste — y los negocios que se mueven primero son los que ganan las búsquedas. Si tu negocio está en Miches o sus alrededores, ",
          ),
          link(
            "contáctanos para una consulta gratuita",
            "https://www.dr-webstudio.com/es/contacto",
          ),
          run(
            " y construyamos la puerta que lleva a los huéspedes fuera del resort y directo a ti.",
          ),
        ]),
      ],
    },
    seo: {
      metaTitle: loc(
        "Miches Websites: Beating the All-Inclusive Trap (2026)",
        "Webs para Miches: Vencer la Trampa del Todo-Incluido",
      ),
      ogTitle: loc(
        "Miches and the All-Inclusive Trap",
        "Miches y la Trampa del Todo-Incluido",
      ),
      ogDescription: loc(
        "Club Med, Hilton, Hyatt and Four Seasons are open or coming — but the all-inclusive model walls guests in. Your website is the only door out that leads to you.",
        "Club Med, Hilton, Hyatt y Four Seasons están abiertos o en camino — pero el todo-incluido amuralla a los huéspedes. Tu web es la única puerta de salida hacia ti.",
      ),
      keywords: {
        en: [
          "Miches tourism",
          "Miches business website",
          "things to do in Miches",
          "Miches excursions website",
          "web design Miches Dominican Republic",
        ],
        es: [
          "turismo Miches",
          "página web negocio Miches",
          "qué hacer en Miches",
          "excursiones Miches",
          "diseño web Miches República Dominicana",
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
