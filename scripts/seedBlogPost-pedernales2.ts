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
    slug: "pedernales-cabo-rojo-southwest-digital-frontier",
    slugEs: "pedernales-y-cabo-rojo-suroeste-proxima-frontera-digital",
    title: loc(
      "Pedernales and Cabo Rojo: Why the Southwest Is the DR's Next Digital Frontier",
      "Pedernales y Cabo Rojo: Por Qué el Suroeste es la Próxima Frontera Digital de RD",
    ),
    description: loc(
      "Pedernales and Cabo Rojo are the DR's biggest tourism megaproject — and its next digital frontier. Why local businesses should build their web presence now, before the wave.",
      "Pedernales y Cabo Rojo son el mayor megaproyecto turístico de RD — y su próxima frontera digital. Por qué los negocios locales deben construir su web ahora, antes de la ola.",
    ),
    readTime: 9,
    featured: false,
    tags: {
      en: [
        "Pedernales",
        "Cabo Rojo",
        "southwest",
        "tourism",
        "cruise",
        "first mover",
        "Dominican Republic",
        "bilingual",
      ],
      es: [
        "Pedernales",
        "Cabo Rojo",
        "suroeste",
        "turismo",
        "cruceros",
        "primer movimiento",
        "República Dominicana",
        "bilingüe",
      ],
    },
    categories: ["web-design", "business-tips"],
    publishedAt: "2026-07-07T12:00:00.000Z",
    body: {
      en: [
        p(
          "For twenty years, \"Dominican tourism\" has meant the east coast — Punta Cana, Bávaro, La Romana. That's changing, fast, and it's changing in the one corner of the country almost no web developer is paying attention to: the southwest. Pedernales and Cabo Rojo are the site of the largest tourism development project in the nation's history, and while the hotels are still rising, a rare window has opened for the local businesses already there. This is why the southwest is the Dominican Republic's next digital frontier — and why the businesses that build their web presence now, before the wave fully lands, are the ones that will own it.",
        ),
        h2("The wave isn't a forecast — it's under construction"),
        rich("normal", [
          run(
            "The numbers are not speculative. The Pedernales–Cabo Rojo project is a roughly US$2.2 billion development led by a consortium including Grupo Puntacana, designed to build around 12,000 hotel rooms by 2033. The cruise port at Cabo Rojo opened in January 2024 and moved fast: according to ",
          ),
          link(
            "Caribbean Journal's reporting on the Ministry of Tourism's 2025 figures",
            "https://www.caribjournal.com/2026/01/12/dominican-republic-cruises-booming/",
          ),
          run(
            ", it handled 176,690 cruise passengers in 2025 across 42 cruise operations — more than Samaná and Santo Domingo combined, in a region that had historically seen almost no tourism traffic, with major lines including Norwegian, Royal Caribbean, MSC, and Holland America now calling there. A new international airport with a runway long enough for the largest wide-body jets is being paved for an expected opening in late 2026, and international chains including Iberostar, Hyatt, Hilton, and Marriott have committed to the first phase, with the first large all-inclusive expected to open around the end of 2026. This is not a region hoping tourists might come someday. They are already arriving by the shipload.",
          ),
        ]),
        h2("The gap nobody is filling"),
        p(
          "Here's what makes this a genuine opportunity rather than just news: the tourists have arrived, but the digital infrastructure hasn't. On the ground, Pedernales is still a cash-first economy with a single, frequently-empty ATM in town, taxis without meters or fixed rates, and local businesses that exist online — if at all — only as Facebook profiles and word-of-mouth phone numbers passed around in traveler groups. When a cruise passenger wants to visit Bahía de las Águilas — regularly called one of the finest beaches in the Caribbean — the ones who get the independent booking are the handful of operators established enough to be found and trusted online. Everyone else competes for scraps or works through the cruise lines at a commission. The demand has outrun the web presence by a wide margin, and that gap is precisely where a well-built website turns a small local business into the obvious choice.",
        ),
        h2('Why "first mover" means something real here'),
        rich("normal", [
          run(
            'In Punta Cana, ranking on Google for a tourism keyword means fighting hundreds of established, well-optimized competitors who have spent a decade building authority — a hard, slow, expensive battle. The southwest is the opposite. Most valuable searches — "Bahía de las Águilas tour," "things to do in Pedernales," "Cabo Rojo excursions," and their Spanish equivalents — have only a small number of serious local sites competing for them today. That means a properly built, genuinely bilingual website can reach the first page of Google for meaningful terms in months rather than the years those same terms demand in the east. It\'s the same competitive math that makes the ',
          ),
          link(
            "La Romana and Bayahíbe corridor",
            "https://www.dr-webstudio.com/en/blog/websites-la-romana-bayahibe-businesses",
          ),
          run(
            " such an opening, amplified — because Pedernales is even earlier in its curve. First-mover advantage in search compounds: every month a page ranks, it gathers reviews, links, and history that make it progressively harder to unseat. The businesses that plant their flag now will be defending page one when the competition finally arrives with the hotels.",
          ),
        ]),
        h2("Who has the biggest opening"),
        p(
          "The southwest's digital vacuum isn't uniform — some business types have almost no real online competition at all:",
        ),
        rich("normal", [
          run("•  "),
          run(
            "Tour and excursion operators. This is the clearest opportunity in the region. Bahía de las Águilas, Laguna de Oviedo and its flamingos, the Hoyo de Pelempito viewpoint, birding in the Sierra de Bahoruco, and the only larimar mines on Earth are world-class draws, and cruise passengers actively research independent alternatives to overpriced ship excursions. An operator with real, bookable, bilingual excursion pages can capture that demand directly — exactly the playbook we lay out for ",
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
            "Guesthouses and the coming vacation rentals. Today's lodging is independent and family-run; tomorrow's will include villas and rentals riding the development. Both need what a website provides — legitimacy, direct booking, and independence from platform commissions.",
          ),
        ]),
        rich("normal", [
          run("•  "),
          run(
            'Restaurants in Pedernales town. As overnight and fly-in visitors grow, the restaurants findable on Google Maps with a real menu and location will win the "where do we eat" moment that currently defaults to guesswork.',
          ),
        ]),
        rich("normal", [
          run("•  "),
          run(
            "Transport and transfer services. The route from Santo Domingo, the port transfers, the airport transfers to come — all are searched constantly and served today mostly through informal channels. A bookable bilingual site is a structural advantage.",
          ),
        ]),
        rich("normal", [
          run("•  "),
          run(
            "Real estate. Land near Cabo Rojo and Bahía de las Águilas is appreciating on the strength of the development, and foreign buyers researching it do so entirely online, in English. That's a vertical almost nobody local is serving well yet.",
          ),
        ]),
        h2("What a southwest website actually has to do"),
        p(
          "The formula that wins on the east coast applies here, with the region's specific realities sharpening a few points:",
        ),
        rich("normal", [
          run("•  "),
          run(
            "English-first, built bilingual. The current market is cruise passengers and international independent travelers researching in English, with the fly-in market — and its French and German segments — arriving with the airport. Each language needs its own real, indexed pages, built the way we describe in ",
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
            "Fast on mobile, above all. Every one of these visitors is researching on a phone, often on a ship's connection or roaming data. A slow site loses them before it loads, and ",
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
            "Photo-forward, without the weight. The southwest sells itself on imagery — turquoise water, cactus-and-limestone desert coast, flamingos — but heavy galleries kill mobile speed, so the ",
          ),
          link(
            "image-optimization craft",
            "https://www.dr-webstudio.com/en/blog/optimizacion-imagenes-sitios-web-turismo-fotos-alta-calidad-carga-rapida",
          ),
          run(" matters even more here."),
        ]),
        rich("normal", [
          run("•  "),
          run(
            "WhatsApp-connected. Bookings close in a chat; the site's job is to start that conversation in one tap, alongside Google Maps and Instagram, as we cover in ",
          ),
          link(
            "connecting your site to WhatsApp, Maps, and Instagram",
            "https://www.dr-webstudio.com/en/blog/how-to-connect-website-whatsapp-google-maps-instagram",
          ),
          run("."),
        ]),
        rich("normal", [
          run("•  "),
          run(
            "Prices published and deposits online — the region-specific edge. This is where the southwest's cash-first reality becomes an opportunity. In a destination with one unreliable ATM, the operator whose site publishes prices and accepts a card or a deposit link removes the single biggest friction a nervous visitor feels. The ability to secure a booking with an online deposit, using the local payment tools we detail in ",
          ),
          link(
            "accepting online payments in the DR",
            "https://www.dr-webstudio.com/en/blog/how-to-accept-online-payments-dominican-republic",
          ),
          run(
            ', is a genuine competitive weapon where most competitors still say "cash only."',
          ),
        ]),
        h2("The timing play: build before the airport"),
        rich("normal", [
          run(
            "Search engine visibility is not instant — Google needs weeks to months to index new pages and rank them for competitive terms. That single fact dictates the strategy: the businesses that are indexed and ranking before the airport opens and the fly-in market arrives in force are the ones that will capture it. A site launched the month the first hotel opens is already late; a site launched now spends 2026 accumulating the rankings, reviews, and authority that will be worth their weight when the visitor volume steps up. The cruise market is here to practice on and profit from today; the fly-in market is the prize, and the runway to rank for it is closing as the literal runway is being paved.",
          ),
        ]),
        h2("An honest word on the risks"),
        p(
          "This is a frontier, and frontiers are uncertain — pretending otherwise would be a disservice. Megaprojects slip: the airport's opening has already moved from an earlier target to late 2026, and infrastructure timelines in the region have a history of stretching. The province borders Haiti, whose instability introduces a real perception risk that can affect investor and traveler confidence. And large-scale tourism in an ecologically sensitive area — Jaragua National Park, a UNESCO Biosphere Reserve, sits at the heart of it — carries genuine sustainability questions. None of this is a reason to dismiss the opportunity; it's a reason to size the bet correctly. And here the math actually favors moving early: a professional website is a modest, one-time investment, while the upside if the project delivers even part of its promise is a decade of compounding first-mover advantage. Building now isn't betting the business on Pedernales — it's making a small, smart wager on a region that already has a working cruise port and international capital committed to it.",
        ),
        h2("Build for the frontier, from anywhere"),
        rich("normal", [
          run(
            "Web development is remote work, which means a business in Pedernales or Cabo Rojo doesn't need a developer down the street — it needs one who understands the Dominican tourism market, the bilingual cruise-and-fly-in audience, and the local tools that make a site actually convert. That's exactly what we do at ",
          ),
          link("DR Web Studio", "https://www.dr-webstudio.com/en"),
          run(
            ": fast, bilingual, bookable websites for Dominican tourism businesses, built once and working around the clock, with WhatsApp and local payments wired in and the first year of maintenance included. If your business is anywhere in the southwest and you can see the wave coming, the smartest time to build was before everyone else did — which is right now. ",
          ),
          link(
            "Contact us for a free consultation",
            "https://www.dr-webstudio.com/en/contact",
          ),
          run(" and let's put your flag on page one before the crowd arrives."),
        ]),
      ],
      es: [
        p(
          'Durante veinte años, "turismo dominicano" ha significado la costa este — Punta Cana, Bávaro, La Romana. Eso está cambiando, rápido, y está cambiando en el único rincón del país al que casi ningún desarrollador web presta atención: el suroeste. Pedernales y Cabo Rojo son el sitio del proyecto de desarrollo turístico más grande en la historia de la nación, y mientras los hoteles todavía se levantan, se ha abierto una ventana rara para los negocios locales que ya están ahí. Por esto el suroeste es la próxima frontera digital de República Dominicana — y por esto los negocios que construyen su presencia web ahora, antes de que la ola aterrice por completo, son los que la van a dominar.',
        ),
        h2("La ola no es un pronóstico — está en construcción"),
        rich("normal", [
          run(
            "Los números no son especulativos. El proyecto Pedernales–Cabo Rojo es un desarrollo de aproximadamente US$2.2 mil millones liderado por un consorcio que incluye a Grupo Puntacana, diseñado para construir alrededor de 12,000 habitaciones de hotel para 2033. El puerto de cruceros de Cabo Rojo abrió en enero de 2024 y se movió rápido: según ",
          ),
          link(
            "el reporte de Caribbean Journal sobre las cifras de 2025 del Ministerio de Turismo",
            "https://www.caribjournal.com/2026/01/12/dominican-republic-cruises-booming/",
          ),
          run(
            ", manejó 176,690 cruceristas en 2025 a través de 42 operaciones de crucero — más que Samaná y Santo Domingo combinados, en una región que históricamente casi no había visto tráfico turístico, con líneas mayores como Norwegian, Royal Caribbean, MSC y Holland America atracando ahora ahí. Un nuevo aeropuerto internacional con una pista lo bastante larga para los aviones de fuselaje ancho más grandes se está pavimentando para una apertura esperada a finales de 2026, y cadenas internacionales como Iberostar, Hyatt, Hilton y Marriott se han comprometido con la primera fase, con el primer gran todo-incluido esperado a abrir cerca del final de 2026. Esta no es una región esperando que quizás algún día lleguen turistas. Ya están llegando por barcos enteros.",
          ),
        ]),
        h2("El vacío que nadie está llenando"),
        p(
          "Aquí está lo que hace de esto una oportunidad genuina en vez de solo una noticia: los turistas llegaron, pero la infraestructura digital no. En el terreno, Pedernales sigue siendo una economía de efectivo primero con un solo cajero automático en el pueblo, frecuentemente vacío, taxis sin taxímetro ni tarifas fijas, y negocios locales que existen en línea — si acaso — solo como perfiles de Facebook y números de teléfono de boca en boca que circulan en grupos de viajeros. Cuando un crucerista quiere visitar Bahía de las Águilas — llamada regularmente una de las mejores playas del Caribe — los que se llevan la reserva independiente son el puñado de operadores lo bastante establecidos como para ser encontrados y confiables en línea. Todos los demás compiten por las migajas o trabajan a través de las líneas de crucero por una comisión. La demanda ha superado a la presencia web por un margen amplio, y ese vacío es exactamente donde una página web bien construida convierte a un pequeño negocio local en la opción obvia.",
        ),
        h2('Por qué "primer movimiento" significa algo real aquí'),
        rich("normal", [
          run(
            'En Punta Cana, posicionarse en Google para una palabra clave de turismo significa pelear contra cientos de competidores establecidos y bien optimizados que han pasado una década construyendo autoridad — una batalla dura, lenta y cara. El suroeste es lo opuesto. La mayoría de las búsquedas valiosas — "Bahía de las Águilas tour", "qué hacer en Pedernales", "excursiones Cabo Rojo" y sus equivalentes en inglés — tienen hoy solo un número pequeño de sitios locales serios compitiendo por ellas. Eso significa que una página web bien construida y genuinamente bilingüe puede llegar a la primera página de Google para términos significativos en meses en vez de los años que esos mismos términos exigen en el este. Es la misma matemática competitiva que hace del ',
          ),
          link(
            "corredor de La Romana y Bayahíbe",
            "https://www.dr-webstudio.com/es/blog/paginas-web-para-negocios-en-la-romana-y-bayahibe",
          ),
          run(
            " una apertura semejante, amplificada — porque Pedernales está aún más temprano en su curva. La ventaja del primer movimiento en la búsqueda se acumula: cada mes que una página posiciona, reúne reseñas, enlaces e historial que la hacen progresivamente más difícil de destronar. Los negocios que plantan su bandera ahora estarán defendiendo la primera página cuando la competencia finalmente llegue con los hoteles.",
          ),
        ]),
        h2("Quién tiene la apertura más grande"),
        p(
          "El vacío digital del suroeste no es uniforme — algunos tipos de negocio casi no tienen competencia real en línea:",
        ),
        rich("normal", [
          run("•  "),
          run(
            "Operadores de tours y excursiones. Esta es la oportunidad más clara de la región. Bahía de las Águilas, la Laguna de Oviedo y sus flamencos, el mirador del Hoyo de Pelempito, la observación de aves en la Sierra de Bahoruco y las únicas minas de larimar de la Tierra son atracciones de clase mundial, y los cruceristas investigan activamente alternativas independientes a las excursiones sobrevaloradas de los barcos. Un operador con páginas de excursión reales, reservables y bilingües puede capturar esa demanda directamente — exactamente el playbook que exponemos para ",
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
            "Casas de huéspedes y los alquileres vacacionales que vienen. El alojamiento de hoy es independiente y familiar; el de mañana incluirá villas y alquileres montados sobre el desarrollo. Ambos necesitan lo que provee una página web — legitimidad, reserva directa e independencia de las comisiones de plataformas.",
          ),
        ]),
        rich("normal", [
          run("•  "),
          run(
            'Restaurantes en el pueblo de Pedernales. A medida que crecen los visitantes que pernoctan y los que llegan en avión, los restaurantes encontrables en Google Maps con un menú y una ubicación reales ganarán el momento de "¿dónde comemos?" que hoy se decide por adivinanza.',
          ),
        ]),
        rich("normal", [
          run("•  "),
          run(
            "Servicios de transporte y traslados. La ruta desde Santo Domingo, los traslados del puerto, los traslados del aeropuerto que vienen — todos se buscan constantemente y hoy se sirven mayormente por canales informales. Un sitio reservable y bilingüe es una ventaja estructural.",
          ),
        ]),
        rich("normal", [
          run("•  "),
          run(
            "Bienes raíces. La tierra cerca de Cabo Rojo y Bahía de las Águilas se está revalorizando por la fuerza del desarrollo, y los compradores extranjeros que la investigan lo hacen enteramente en línea, en inglés. Es un vertical que casi nadie local está sirviendo bien todavía.",
          ),
        ]),
        h2("Qué tiene que hacer realmente una página web del suroeste"),
        p(
          "La fórmula que gana en la costa este aplica aquí, con las realidades específicas de la región afilando algunos puntos:",
        ),
        rich("normal", [
          run("•  "),
          run(
            "Inglés primero, construida bilingüe. El mercado actual son cruceristas y viajeros independientes internacionales investigando en inglés, con el mercado de avión — y sus segmentos francés y alemán — llegando con el aeropuerto. Cada idioma necesita sus propias páginas reales e indexadas, construidas como describimos en ",
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
            "Rápida en móvil, ante todo. Cada uno de estos visitantes investiga en un teléfono, muchas veces con la conexión de un barco o datos de roaming. Un sitio lento los pierde antes de cargar, y ",
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
            "Protagonizada por fotos, sin el peso. El suroeste se vende con imágenes — agua turquesa, costa desértica de cactus y piedra caliza, flamencos — pero las galerías pesadas matan la velocidad móvil, así que el ",
          ),
          link(
            "oficio de optimización de imágenes",
            "https://www.dr-webstudio.com/es/blog/optimizacion-imagenes-sitios-web-turismo-fotos-alta-calidad-carga-rapida",
          ),
          run(" importa aún más aquí."),
        ]),
        rich("normal", [
          run("•  "),
          run(
            "Conectada a WhatsApp. Las reservas se cierran en un chat; el trabajo del sitio es iniciar esa conversación en un toque, junto a Google Maps e Instagram, como cubrimos en ",
          ),
          link(
            "conectar tu sitio con WhatsApp, Maps e Instagram",
            "https://www.dr-webstudio.com/es/blog/como-conectar-sitio-web-whatsapp-google-maps-instagram",
          ),
          run("."),
        ]),
        rich("normal", [
          run("•  "),
          run(
            "Precios publicados y depósitos en línea — la ventaja específica de la región. Aquí es donde la realidad de efectivo-primero del suroeste se vuelve una oportunidad. En un destino con un solo cajero poco confiable, el operador cuyo sitio publica precios y acepta una tarjeta o un enlace de depósito elimina la fricción más grande que siente un visitante nervioso. La capacidad de asegurar una reserva con un depósito en línea, usando las herramientas de pago locales que detallamos en ",
          ),
          link(
            "aceptar pagos en línea en RD",
            "https://www.dr-webstudio.com/es/blog/como-aceptar-pagos-en-linea-republica-dominicana",
          ),
          run(
            ', es un arma competitiva genuina donde la mayoría de los competidores todavía dice "solo efectivo".',
          ),
        ]),
        h2("La jugada de tiempo: construir antes del aeropuerto"),
        rich("normal", [
          run(
            "La visibilidad en buscadores no es instantánea — Google necesita de semanas a meses para indexar páginas nuevas y posicionarlas para términos competidos. Ese solo hecho dicta la estrategia: los negocios que están indexados y posicionados antes de que abra el aeropuerto y el mercado de avión llegue con fuerza son los que lo van a capturar. Un sitio lanzado el mes que abre el primer hotel ya llega tarde; un sitio lanzado ahora pasa 2026 acumulando el posicionamiento, las reseñas y la autoridad que valdrán su peso cuando el volumen de visitantes suba. El mercado de cruceros está aquí para practicar y ganar hoy; el mercado de avión es el premio, y la pista para posicionarse para él se está cerrando a medida que la pista literal se está pavimentando.",
          ),
        ]),
        h2("Una palabra honesta sobre los riesgos"),
        p(
          "Esto es una frontera, y las fronteras son inciertas — fingir lo contrario sería un flaco favor. Los megaproyectos se atrasan: la apertura del aeropuerto ya se movió de una meta anterior a finales de 2026, y los cronogramas de infraestructura en la región tienen un historial de estirarse. La provincia limita con Haití, cuya inestabilidad introduce un riesgo de percepción real que puede afectar la confianza de inversores y viajeros. Y el turismo a gran escala en una zona ecológicamente sensible — el Parque Nacional Jaragua, una Reserva de la Biosfera de la UNESCO, está en el corazón de todo — carga preguntas de sostenibilidad genuinas. Nada de esto es razón para descartar la oportunidad; es razón para dimensionar la apuesta correctamente. Y aquí la matemática en realidad favorece moverse temprano: una página web profesional es una inversión modesta y de una sola vez, mientras que el potencial si el proyecto entrega aunque sea parte de su promesa es una década de ventaja de primer movimiento acumulándose. Construir ahora no es apostar el negocio a Pedernales — es hacer una apuesta pequeña e inteligente sobre una región que ya tiene un puerto de cruceros funcionando y capital internacional comprometido con ella.",
        ),
        h2("Construye para la frontera, desde donde sea"),
        rich("normal", [
          run(
            "El desarrollo web es trabajo remoto, lo que significa que un negocio en Pedernales o Cabo Rojo no necesita un desarrollador en la esquina — necesita uno que entienda el mercado turístico dominicano, la audiencia bilingüe de crucero-y-avión, y las herramientas locales que hacen que un sitio realmente convierta. Eso es exactamente lo que hacemos en ",
          ),
          link("DR Web Studio", "https://www.dr-webstudio.com/es"),
          run(
            ": páginas web rápidas, bilingües y reservables para negocios de turismo dominicanos, construidas una vez y trabajando las veinticuatro horas, con WhatsApp y pagos locales integrados y el primer año de mantenimiento incluido. Si tu negocio está en cualquier parte del suroeste y puedes ver venir la ola, el momento más inteligente para construir fue antes que todos los demás — que es justo ahora. ",
          ),
          link(
            "Contáctanos para una consulta gratuita",
            "https://www.dr-webstudio.com/es/contacto",
          ),
          run(
            " y pongamos tu bandera en la primera página antes de que llegue la multitud.",
          ),
        ]),
      ],
    },
    seo: {
      metaTitle: loc(
        "Pedernales & Cabo Rojo: The DR's Next Digital Frontier",
        "Pedernales y Cabo Rojo: La Próxima Frontera Digital de RD",
      ),
      ogTitle: loc(
        "Why the Southwest Is the DR's Next Digital Frontier",
        "Por Qué el Suroeste es la Próxima Frontera Digital de RD",
      ),
      ogDescription: loc(
        "A $2.2B project, a cruise port already third-busiest in the country, an airport opening in 2026 — and almost no local competition online yet. The first-mover window in the DR's southwest.",
        "Un proyecto de $2.2 mil millones, un puerto de cruceros ya tercero del país, un aeropuerto abriendo en 2026 — y casi sin competencia local en línea. La ventana de primer movimiento del suroeste.",
      ),
      keywords: {
        en: [
          "Pedernales tourism",
          "Cabo Rojo development",
          "web design southwest Dominican Republic",
          "Pedernales business website",
          "Cabo Rojo cruise port business",
        ],
        es: [
          "turismo Pedernales",
          "desarrollo Cabo Rojo",
          "diseño web suroeste República Dominicana",
          "página web negocio Pedernales",
          "negocio puerto cruceros Cabo Rojo",
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
