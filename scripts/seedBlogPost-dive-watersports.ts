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
    slug: "websites-dive-shops-watersports-schools",
    slugEs: "paginas-web-tiendas-de-buceo-y-escuelas-de-deportes-acuaticos",
    title: loc(
      "Websites for Dive Shops & Watersports Schools in the DR",
      "Páginas Web para Tiendas de Buceo y Escuelas de Deportes Acuáticos en RD",
    ),
    description: loc(
      "Dive shops and watersports schools are findable through PADI and booking platforms — which own the customer. Why your own site is how you keep the relationship and the margin.",
      "Las tiendas de buceo y escuelas de deportes acuáticos se encuentran vía PADI y plataformas — que se quedan con el cliente. Por qué tu propio sitio conserva la relación y el margen.",
    ),
    readTime: 9,
    featured: false,
    tags: {
      en: ["diving", "dive shops", "kitesurf", "watersports", "PADI", "Bayahibe", "Cabarete", "bookings", "Dominican Republic"],
      es: ["buceo", "tiendas de buceo", "kitesurf", "deportes acuáticos", "PADI", "Bayahíbe", "Cabarete", "reservas", "República Dominicana"],
    },
    categories: ["business-tips"],
    publishedAt: "2026-08-08T14:00:00.000Z",
    body: {
      en: [
        p("Ask a Dominican dive center how customers find them and you'll usually hear a version of the same answer: the resort sends them, or they find us on PADI. Both are real channels and neither is wrong — but both share a structural problem worth understanding clearly. When a diver searches for a course in Bayahíbe, they land on a directory. When they book, the platform owns the transaction, the customer's email, and often a cut of the price. Your dive shop is a listing inside someone else's storefront. That works — until you want to raise prices, sell a multi-day package, build repeat business, or simply be chosen for who you are rather than where you appear in a list. This is the case for owning your own booking channel, and why it matters more in this industry than most."),
        h2("The intermediary problem, stated plainly"),
        rich("normal", [run("Watersports businesses sit inside an unusually crowded set of middlemen. There are the certification agencies, whose directories are genuinely valuable — "), link("PADI lists dive shops across the Dominican Republic with online booking built in", "https://www.padi.com/dive-shops/dominican-republic/"), run(", which is real, qualified demand arriving at your door. There are the OTAs and excursion marketplaces. There are the resort activity desks, which send guests but take a commission and control the relationship. And there are the aggregators that rank above everyone in Google. Each one is useful; collectively they mean that most of your customers never actually encounter your business — they encounter your listing.")]),
        rich("normal", [run("The consequences are practical, not philosophical. You compete on price and star rating inside a list of near-identical entries. You can't easily explain what makes your instruction different, because the format doesn't allow it. You don't get the customer's contact details, so a diver you certified can't easily be sold their advanced course next year. And the margin on every booking is shared. None of that means abandoning the platforms — they work. It means the businesses that thrive have their own channel alongside them, and send everything they can toward it.")]),
        h2("Why trust matters more here than in other tourism verticals"),
        p("There's a second dynamic that makes a proper website unusually valuable in this vertical: your customer is evaluating safety. Someone booking a first dive, a kitesurf lesson, or a certification course is not comparing prices the way they'd compare restaurants — they're deciding whether to trust you with a physically risky activity, often for themselves or their teenage kid. That decision is made almost entirely on evidence of professionalism: are the instructors certified and named, what's the student-to-instructor ratio, how old is the equipment, what's the safety briefing, what do past students say, what exactly is included?"),
        p("A directory listing cannot answer those questions. A website can, and the business that answers them thoroughly wins bookings from the business that just posts a price. This is the rare vertical where more content genuinely converts better, because the customer's underlying question isn't \"how much?\" — it's \"am I safe with you?\" Answer that convincingly and price stops being the deciding factor, which is exactly how you escape competing at the bottom of a list."),
        h2("The Dominican advantage: three coasts, many audiences"),
        p("The DR gives this vertical unusual range, and each market has its own web implications:"),
        rich("normal", [run("•  "), run("Bayahíbe and the southeast — the country's dive heartland, with wrecks, walls, and the Catalina and Saona sites, serving both resort guests and dedicated diving travelers who plan trips around it.")]),
        rich("normal", [run("•  "), run("Cabarete and the north coast — the Caribbean's kitesurf and windsurf capital, where students book multi-day courses in advance and stay for weeks, exactly the "), link("three-audience north coast market", "https://www.dr-webstudio.com/en/blog/north-coast-three-audiences-puerto-plata-sosua-cabarete"), run(" we've written about.")]),
        rich("normal", [run("•  "), run("Sosúa and Puerto Plata — mature dive sites serving cruise day-trippers and the resident expat community alike.")]),
        rich("normal", [run("•  "), run("Las Terrenas and Samaná — diving alongside whale season, plus surf schools, feeding the "), link("peninsula's eco-tourism market", "https://www.dr-webstudio.com/en/blog/samana-peninsula-eco-tourism-property-websites"), run(".")]),
        rich("normal", [run("•  "), run("Punta Cana and Bávaro — the highest-volume market, and the most intermediated, where standing out demands the most from your own channel.")]),
        p("Different coasts, different mixes of walk-up versus planned-ahead customers — but the same conclusion: the further in advance your customer plans, the more your own website matters, because planning happens on Google months before arrival."),
        h2("What a dive or watersports website must do"),
        rich("normal", [run("•  "), run("Take real bookings, with deposits. The single highest-value feature. A course is a scheduled commitment, and letting a customer reserve a slot and pay a deposit online — using the "), link("local payment tools", "https://www.dr-webstudio.com/en/blog/how-to-accept-online-payments-dominican-republic"), run(" available in the DR — converts interest at the moment of enthusiasm and drastically reduces no-shows.")]),
        rich("normal", [run("•  "), run("Prove safety and credibility. Named, certified instructors with real photos; ratios; equipment age and servicing; safety procedures; genuine reviews. This is the content that converts in this vertical.")]),
        rich("normal", [run("•  "), run("Explain each course as its own page. Discover-scuba, open water, advanced, night dives, kitesurf beginner camps, private lessons — each is a distinct search with a distinct customer. That's precisely the "), link("multi-page structure", "https://www.dr-webstudio.com/en/blog/websites-for-tour-operators-excursions"), run(" that lets you rank for each rather than one generic term.")]),
        rich("normal", [run("•  "), run("Be genuinely multilingual. Diving in the DR draws English, Spanish, German, and French speakers — the Puerto Plata dive scene has long advertised instruction in four languages. Real per-language pages built with "), link("proper bilingual architecture", "https://www.dr-webstudio.com/en/blog/seo-bilingue-posicionarse-ingles-espanol-sin-perjudicar-ninguno"), run(" mean each of those markets can find and trust you.")]),
        rich("normal", [run("•  "), run("Be fast, with photos that don't sink it. Underwater and action photography is your best sales tool and your biggest performance risk, which is what "), link("image optimization", "https://www.dr-webstudio.com/en/blog/optimizacion-imagenes-sitios-web-turismo-fotos-alta-calidad-carga-rapida"), run(" solves — because "), link("a slow page loses the booking", "https://www.dr-webstudio.com/en/blog/core-web-vitals-como-la-velocidad-afecta-tus-ventas-online"), run(" before the photo even appears.")]),
        rich("normal", [run("•  "), run("Connect to WhatsApp. Questions about conditions, skill level, and logistics get asked and answered in chat — "), link("one tap from every course page", "https://www.dr-webstudio.com/en/blog/how-to-connect-website-whatsapp-google-maps-instagram"), run(".")]),
        h2("Capture the customer you already earned"),
        rich("normal", [run("Here's the strategic move that costs nothing extra. Every student you certify and every guest you take out is a customer the platform introduced but you actually served. With your own site and a simple email list, that relationship becomes yours: the open-water student becomes next year's advanced student, the holiday kitesurfer becomes a returning guest, and the satisfied diver becomes a review and a referral you can point future customers to. Businesses that live entirely on platforms restart from zero every season; businesses with their own channel compound. The website isn't just for acquiring strangers — it's for keeping the people the platforms already sent you.")]),
        h2("Content that fills the quiet weeks"),
        rich("normal", [run("Watersports demand is uneven — conditions, seasons, and school holidays all move it around — and your website is the cheapest tool for smoothing that curve. Divers and kitesurfers plan trips around specifics, and they search for them: when the visibility is best in Bayahíbe, whether Cabarete's wind works for a beginner in October, what a first-timer needs to bring, whether certification can be completed in three days. Every one of those questions is a page that ranks year-round and reaches a customer months before they book — which is precisely how you fill the shoulder season instead of hoping for walk-ups. It's also the content that makes the safety case implicitly: a business that explains conditions honestly, including when not to come, reads as expert and trustworthy in a way no promotional copy achieves. Directory listings can't do this at all, which makes it one of the clearest advantages your own site holds over the platforms sending you customers today.")]),
        h2("An honest word on not abandoning the platforms"),
        rich("normal", [run("To be clear, because the balanced position is the correct one: keep your PADI listing, keep your marketplace presence, keep the resort relationships. They deliver genuine volume, especially from customers who'd never find you otherwise, and a new operation without them would struggle. The goal isn't independence from intermediaries — it's not being only an intermediary's listing. Point your listings at your site, let your site do the persuading and the repeat business, and use the platforms for what they're good at: reach. Businesses that do both get the volume and the margin. Businesses that do only the first get whatever the algorithm leaves them.")]),
        h2("Build the channel you own"),
        rich("normal", [run("At "), link("DR Web Studio", "https://www.dr-webstudio.com/en"), run(" we build exactly this kind of site: fast, multilingual, bookable, with deposits and WhatsApp wired in and a page for every course you teach — plus the first year of maintenance included. If your dive shop or watersports school is busy but the margin keeps going somewhere else, "), link("contact us for a free consultation", "https://www.dr-webstudio.com/en/contact"), run(" and let's build the channel where the customer is yours.")]),
      ],
      es: [
        p("Pregúntale a un centro de buceo dominicano cómo lo encuentran los clientes y usualmente oirás una versión de la misma respuesta: el resort los manda, o nos encuentran en PADI. Ambos son canales reales y ninguno está mal — pero ambos comparten un problema estructural que vale la pena entender con claridad. Cuando un buzo busca un curso en Bayahíbe, aterriza en un directorio. Cuando reserva, la plataforma se queda con la transacción, el correo del cliente, y muchas veces una tajada del precio. Tu tienda de buceo es un listado dentro de la vitrina de otro. Eso funciona — hasta que quieres subir precios, vender un paquete de varios días, construir clientela recurrente, o simplemente ser elegido por quién eres en vez de por dónde apareces en una lista. Este es el argumento para ser dueño de tu propio canal de reservas, y por qué importa más en esta industria que en la mayoría."),
        h2("El problema del intermediario, dicho claramente"),
        rich("normal", [run("Los negocios de deportes acuáticos viven dentro de un conjunto inusualmente denso de intermediarios. Están las agencias de certificación, cuyos directorios son genuinamente valiosos — "), link("PADI lista tiendas de buceo por toda República Dominicana con reserva en línea integrada", "https://www.padi.com/dive-shops/dominican-republic/"), run(", lo que es demanda real y calificada llegando a tu puerta. Están las OTAs y los marketplaces de excursiones. Están los mostradores de actividades de los resorts, que mandan huéspedes pero cobran comisión y controlan la relación. Y están los agregadores que se posicionan por encima de todos en Google. Cada uno es útil; en conjunto significan que la mayoría de tus clientes nunca se encuentra realmente con tu negocio — se encuentra con tu listado.")]),
        rich("normal", [run("Las consecuencias son prácticas, no filosóficas. Compites por precio y estrellas dentro de una lista de entradas casi idénticas. No puedes explicar fácilmente qué hace distinta tu enseñanza, porque el formato no lo permite. No obtienes los datos de contacto del cliente, así que a un buzo que certificaste no puedes venderle fácilmente su curso avanzado el año que viene. Y el margen de cada reserva se comparte. Nada de eso significa abandonar las plataformas — funcionan. Significa que los negocios que prosperan tienen su propio canal junto a ellas, y dirigen hacia él todo lo que pueden.")]),
        h2("Por qué la confianza importa más aquí que en otros verticales turísticos"),
        p("Hay una segunda dinámica que hace a una buena página web inusualmente valiosa en este vertical: tu cliente está evaluando seguridad. Alguien que reserva un primer buceo, una clase de kitesurf o un curso de certificación no está comparando precios como compararía restaurantes — está decidiendo si confiarte una actividad físicamente riesgosa, muchas veces para sí mismo o para su hijo adolescente. Esa decisión se toma casi enteramente sobre evidencia de profesionalismo: ¿los instructores están certificados y tienen nombre, cuál es la proporción de estudiantes por instructor, qué edad tiene el equipo, cómo es la charla de seguridad, qué dicen los estudiantes anteriores, qué incluye exactamente?"),
        p("Un listado de directorio no puede responder esas preguntas. Una página web sí, y el negocio que las responde a fondo le gana reservas al negocio que solo publica un precio. Este es el raro vertical donde más contenido genuinamente convierte mejor, porque la pregunta de fondo del cliente no es \"¿cuánto?\" — es \"¿estoy seguro contigo?\" Responde eso de forma convincente y el precio deja de ser el factor decisivo, que es exactamente cómo escapas de competir al fondo de una lista."),
        h2("La ventaja dominicana: tres costas, muchas audiencias"),
        p("RD le da a este vertical un rango inusual, y cada mercado tiene sus propias implicaciones web:"),
        rich("normal", [run("•  "), run("Bayahíbe y el sureste — el corazón del buceo del país, con naufragios, paredes, y los sitios de Catalina y Saona, sirviendo tanto a huéspedes de resort como a viajeros buceadores dedicados que planifican viajes en torno a ello.")]),
        rich("normal", [run("•  "), run("Cabarete y la costa norte — la capital del kitesurf y windsurf del Caribe, donde los estudiantes reservan cursos de varios días por adelantado y se quedan semanas, exactamente el "), link("mercado de tres audiencias de la costa norte", "https://www.dr-webstudio.com/es/blog/costa-norte-tres-audiencias-puerto-plata-sosua-cabarete"), run(" sobre el que hemos escrito.")]),
        rich("normal", [run("•  "), run("Sosúa y Puerto Plata — sitios de buceo maduros que sirven a cruceristas de un día y a la comunidad expatriada residente por igual.")]),
        rich("normal", [run("•  "), run("Las Terrenas y Samaná — buceo junto a la temporada de ballenas, más escuelas de surf, alimentando el "), link("mercado eco-turístico de la península", "https://www.dr-webstudio.com/es/blog/peninsula-de-samana-paginas-web-eco-turismo-y-propiedades"), run(".")]),
        rich("normal", [run("•  "), run("Punta Cana y Bávaro — el mercado de mayor volumen, y el más intermediado, donde destacar exige lo máximo de tu propio canal.")]),
        p("Costas distintas, mezclas distintas de clientes espontáneos frente a los que planifican — pero la misma conclusión: mientras más por adelantado planifica tu cliente, más importa tu propia página web, porque la planificación ocurre en Google meses antes de llegar."),
        h2("Qué debe hacer una página web de buceo o deportes acuáticos"),
        rich("normal", [run("•  "), run("Tomar reservas reales, con depósitos. La función de mayor valor. Un curso es un compromiso agendado, y dejar que un cliente reserve un cupo y pague un depósito en línea — usando las "), link("herramientas de pago locales", "https://www.dr-webstudio.com/es/blog/como-aceptar-pagos-en-linea-republica-dominicana"), run(" disponibles en RD — convierte el interés en el momento del entusiasmo y reduce drásticamente las ausencias.")]),
        rich("normal", [run("•  "), run("Probar seguridad y credibilidad. Instructores certificados con nombre y fotos reales; proporciones; edad y mantenimiento del equipo; procedimientos de seguridad; reseñas genuinas. Este es el contenido que convierte en este vertical.")]),
        rich("normal", [run("•  "), run("Explicar cada curso como su propia página. Bautizo de buceo, open water, avanzado, inmersiones nocturnas, campamentos de kitesurf para principiantes, clases privadas — cada uno es una búsqueda distinta con un cliente distinto. Esa es precisamente la "), link("estructura de varias páginas", "https://www.dr-webstudio.com/es/blog/paginas-web-para-operadores-de-tours-y-excursiones"), run(" que te deja posicionar para cada uno en vez de para un término genérico.")]),
        rich("normal", [run("•  "), run("Ser genuinamente multilingüe. El buceo en RD atrae hablantes de inglés, español, alemán y francés — la escena de buceo de Puerto Plata lleva mucho tiempo anunciando instrucción en cuatro idiomas. Páginas reales por idioma construidas con "), link("arquitectura bilingüe adecuada", "https://www.dr-webstudio.com/es/blog/seo-bilingue-posicionarse-ingles-espanol-sin-perjudicar-ninguno"), run(" significan que cada uno de esos mercados puede encontrarte y confiar en ti.")]),
        rich("normal", [run("•  "), run("Ser rápida, con fotos que no la hundan. La fotografía submarina y de acción es tu mejor herramienta de venta y tu mayor riesgo de rendimiento, que es lo que resuelve la "), link("optimización de imágenes", "https://www.dr-webstudio.com/es/blog/optimizacion-imagenes-sitios-web-turismo-fotos-alta-calidad-carga-rapida"), run(" — porque "), link("una página lenta pierde la reserva", "https://www.dr-webstudio.com/es/blog/core-web-vitals-como-la-velocidad-afecta-tus-ventas-online"), run(" antes de que la foto siquiera aparezca.")]),
        rich("normal", [run("•  "), run("Conectarse a WhatsApp. Las preguntas sobre condiciones, nivel y logística se hacen y responden en el chat — "), link("a un toque desde cada página de curso", "https://www.dr-webstudio.com/es/blog/como-conectar-sitio-web-whatsapp-google-maps-instagram"), run(".")]),
        h2("Captura al cliente que ya te ganaste"),
        rich("normal", [run("Aquí está la jugada estratégica que no cuesta nada extra. Cada estudiante que certificas y cada huésped que sacas es un cliente que la plataforma presentó pero al que tú realmente serviste. Con tu propio sitio y una lista de correo simple, esa relación se vuelve tuya: el estudiante de open water se convierte en el estudiante avanzado del año que viene, el kitesurfista de vacaciones se convierte en huésped que regresa, y el buzo satisfecho se convierte en una reseña y una referencia a la que puedes apuntar a futuros clientes. Los negocios que viven enteramente de plataformas empiezan de cero cada temporada; los negocios con su propio canal acumulan. La página web no es solo para adquirir desconocidos — es para conservar a la gente que las plataformas ya te mandaron.")]),
        h2("Contenido que llena las semanas tranquilas"),
        rich("normal", [run("La demanda de deportes acuáticos es desigual — las condiciones, las temporadas y las vacaciones escolares la mueven — y tu página web es la herramienta más barata para suavizar esa curva. Los buzos y kitesurfistas planifican viajes alrededor de detalles específicos, y los buscan: cuándo hay mejor visibilidad en Bayahíbe, si el viento de Cabarete sirve para un principiante en octubre, qué necesita traer alguien que va por primera vez, si la certificación se puede completar en tres días. Cada una de esas preguntas es una página que posiciona todo el año y alcanza a un cliente meses antes de que reserve — que es precisamente cómo llenas la temporada media en vez de esperar a los que llegan sin cita. Es también el contenido que hace el argumento de seguridad implícitamente: un negocio que explica las condiciones con honestidad, incluyendo cuándo no venir, se lee como experto y confiable de una forma que ningún texto promocional logra. Los listados de directorio no pueden hacer esto en absoluto, lo que lo convierte en una de las ventajas más claras que tu propio sitio tiene sobre las plataformas que hoy te mandan clientes.")]),
        h2("Una palabra honesta sobre no abandonar las plataformas"),
        rich("normal", [run("Para ser claros, porque la posición equilibrada es la correcta: mantén tu listado de PADI, mantén tu presencia en marketplaces, mantén las relaciones con los resorts. Entregan volumen genuino, especialmente de clientes que nunca te encontrarían de otro modo, y una operación nueva sin ellos batallaría. La meta no es la independencia de los intermediarios — es no ser solamente el listado de un intermediario. Apunta tus listados hacia tu sitio, deja que tu sitio haga el convencimiento y la recompra, y usa las plataformas para lo que son buenas: alcance. Los negocios que hacen ambas cosas obtienen el volumen y el margen. Los que solo hacen lo primero obtienen lo que el algoritmo les deje.")]),
        h2("Construye el canal que sí es tuyo"),
        rich("normal", [run("En "), link("DR Web Studio", "https://www.dr-webstudio.com/es"), run(" construimos exactamente este tipo de sitio: rápido, multilingüe, reservable, con depósitos y WhatsApp integrados y una página para cada curso que enseñas — más el primer año de mantenimiento incluido. Si tu tienda de buceo o escuela de deportes acuáticos está ocupada pero el margen sigue yéndose a otro lado, "), link("contáctanos para una consulta gratuita", "https://www.dr-webstudio.com/es/contacto"), run(" y construyamos el canal donde el cliente es tuyo.")]),
      ],
    },
    seo: {
      metaTitle: loc(
        "Dive Shop & Watersports Websites in the DR (2026)",
        "Webs para Buceo y Deportes Acuáticos en RD (2026)",
      ),
      ogTitle: loc(
        "Websites for Dive Shops & Watersports Schools",
        "Páginas Web para Buceo y Deportes Acuáticos",
      ),
      ogDescription: loc(
        "Certification agencies and booking platforms send you students — and keep the customer relationship. Your own bookable, multilingual site is how you stop renting your own demand.",
        "Las agencias de certificación y plataformas te envían estudiantes — y se quedan con la relación. Tu propio sitio reservable y multilingüe es cómo dejas de alquilar tu demanda.",
      ),
      keywords: {
        en: ["dive shop website", "kitesurf school website", "PADI dive center Dominican Republic", "watersports booking website", "Bayahibe diving website"],
        es: ["página web tienda de buceo", "página web escuela de kitesurf", "centro de buceo PADI República Dominicana", "página web reservas deportes acuáticos", "página web buceo Bayahíbe"],
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