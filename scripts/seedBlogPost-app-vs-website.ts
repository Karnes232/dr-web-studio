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
    slug: "do-i-need-an-app-or-a-website",
    slugEs: "necesito-una-app-o-una-pagina-web",
    title: loc(
      "Do I Need an App or a Website? The Honest Answer for Dominican Businesses",
      "¿Necesito una App o una Página Web? La Respuesta Honesta para Negocios Dominicanos",
    ),
    description: loc(
      "Do you need an app or a website? For almost every Dominican business the honest answer is a website — here is the real comparison of cost, reach, and what customers actually do.",
      "¿Necesitas una app o una página web? Para casi todo negocio dominicano la respuesta honesta es una página web — la comparación real de costo, alcance y lo que hacen los clientes.",
    ),
    readTime: 8,
    featured: false,
    tags: {
      en: ["app vs website", "mobile", "web design", "costs", "small business", "Dominican Republic"],
      es: ["app vs página web", "móvil", "diseño web", "costos", "pequeño negocio", "República Dominicana"],
    },
    categories: ["business-tips"],
    publishedAt: "2026-07-28T12:00:00.000Z",
    body: {
      en: [
        p("\"Should I get an app made?\" It's one of the most common questions Dominican business owners ask when they decide to get serious about their digital presence — and it usually comes from a good instinct: everyone's on their phone, apps live on phones, so a business needs an app, right? The honest answer, for almost every small and medium business in the Dominican Republic, is no — you need a website, and probably not an app at all. That's not a knock on apps; it's what the math, the customer behavior, and the economics actually say. Here's the real comparison, so you can spend your money where it works."),
        h2("The question behind the question"),
        rich("normal", [run("When a business owner says \"app,\" what they usually mean is \"I want customers to find me and buy from me on their phones.\" That goal is exactly right — in the Dominican Republic, "), link("around 70% of online activity happens on smartphones", "https://paymentscmi.com/insights/comercio-electronico-republica-dominicana-datos-clave/"), run(", so mobile is not a channel, it's the market. The confusion is about the tool. A mobile-friendly website delivers your business to every phone instantly, through the browser, with nothing to install. An app delivers it only to the people who take several deliberate steps to put it there. Both live on the phone; only one has to be invited.")]),
        h2("What an app actually costs"),
        p("The first reality check is economic. A properly built app is not one project — it's three. You need an iOS version, an Android version, and the backend that powers both, and then you need ongoing updates every time Apple or Google changes their rules, which is constantly. Development costs for even a modest custom app run to multiples of what a professional website costs, and the spending never stops: app store review cycles, compatibility updates for new phones and OS versions, and maintenance across three codebases instead of one. For a business whose actual need is \"customers find me, see what I offer, and contact or buy,\" that's paying for a truck to do a bicycle's job. The website delivers the goal for a fraction of the cost, in one project, on every device at once."),
        h2("The download wall"),
        rich("normal", [run("The second reality is behavioral, and it's the one that kills most small-business apps: people don't download them. Think about your own phone. When did you last install an app for a local business — a restaurant, a store, a barbershop? A customer has to find your app in a store, tap install, wait, create an account, and grant permissions — five points of friction before they see your menu. A website has none: they search, they tap, they're there, in seconds, whether they came from Google, Instagram, or a WhatsApp link. And the app they did install has to survive on their phone — competing for space and attention against the giants, and one \"storage full\" cleanup away from deletion. The hard truth: an app is something your most loyal existing customers might use. A website is how new customers find you at all — and new customers are what most businesses actually need.")]),
        h2("The invisibility problem"),
        rich("normal", [run("Here's the strategic difference that matters most: apps are invisible to search. Your app's content doesn't appear when someone Googles \"restaurant near me\" or \"tour operator Punta Cana\" — search engines can't see inside it, exactly the same blindness we described for WhatsApp catalogs. Your website is the opposite: every page is a door Google can open, in Spanish and English, for locals and tourists alike. In a market where being found is the whole battle, the app locks your content in a box, and the website puts it in the window. The website also feeds every other channel — it's where your Instagram bio points, where your WhatsApp conversations link, where your "), link("Google Maps profile connects", "https://www.dr-webstudio.com/en/blog/how-to-connect-website-whatsapp-google-maps-instagram"), run(" — the hub the spokes need.")]),
        h2("\"But apps let me stay in touch with customers\""),
        rich("normal", [run("The strongest genuine argument for an app is retention — push notifications, a persistent icon, a direct line to your customer. It's a real advantage for the Netflixes of the world. But look at what a Dominican business already has: WhatsApp. Your customers voluntarily carry a direct, personal, notification-enabled channel to your business in their pocket, with open rates no app notification dreams of — and unlike an app you'd pay to build and beg people to install, they already use it all day. A website with a one-tap WhatsApp button gives you acquisition (Google finds the site) and retention (the conversation moves to WhatsApp) using tools your customers already love. Add an email list or an Instagram follow for announcements, and you've assembled everything the app's retention promise was selling — for free, on rails that already exist. The app was solving a problem the Dominican market solved years ago.")]),
        h2("When an app genuinely makes sense"),
        rich("normal", [run("Honesty requires the other side. Apps win when the product is the app, or when daily repeated use with personal accounts is the core of the business: banks, delivery platforms, airlines, gyms with class bookings, subscription services with logged-in experiences. If your customers will open your product several times a week, need push notifications that genuinely serve them, or use device features deeply (offline mode, precise location tracking), an app can earn its cost. The test is brutal but clarifying: will a meaningful share of your customers use this weekly? If the honest answer is no — and for restaurants, hotels, tours, shops, clinics, and services it almost always is — the app will be an expensive icon nobody taps.")]),
        h2("The middle path most people don't know about"),
        rich("normal", [run("There's also a technical middle ground worth knowing: a modern, well-built website can do most of what people imagine they need an app for. It can be installed to the home screen with its own icon, load instantly, work beautifully on every screen size, take payments through "), link("local payment methods", "https://www.dr-webstudio.com/en/blog/how-to-accept-online-payments-dominican-republic"), run(", and feel every bit as smooth as a native app when it's "), link("built fast", "https://www.dr-webstudio.com/en/blog/core-web-vitals-como-la-velocidad-afecta-tus-ventas-online"), run(" — because the \"apps feel better\" instinct is really a \"most websites are slow\" problem, and that's a build-quality issue, not a platform one. If your business someday grows into genuine app territory, nothing is lost: the website remains the foundation, and the app becomes an addition for your loyal core, not a replacement for being findable.")]),
        h2("The decision, in one honest framework"),
        rich("normal", [run("Ask three questions. One: do new customers need to find you through search? If yes, the website isn't optional regardless of what else you build. Two: will typical customers interact with you more than once a week with an account? If no, an app can't justify itself. Three: is your budget better spent reaching everyone adequately or a fraction of loyalists deeply? For nearly every Dominican SMB, the answers stack the same way: website first, website fully, and revisit the app question only if the day comes when your customers are asking for one. Consider the typical case — a restaurant weighing an ordering app: its customers order a few times a month at most, they discover it through Google and Instagram, and the ones who want to order already have WhatsApp open. Every peso the app would consume does more work as a fast website with an online menu and a WhatsApp order button. The businesses that get this wrong don't just waste the app budget — they delay the website that would have been producing customers the whole time.")]),
        h2("Build the one that pays for itself"),
        rich("normal", [run("At "), link("DR Web Studio", "https://www.dr-webstudio.com/en"), run(" we build the answer to this question: fast, bilingual, mobile-first websites that do the job people imagine an app doing — findable by every new customer on Google, instant on every phone, connected to WhatsApp and local payments, with the first year of maintenance included. If you've been quoted an eye-watering price for an app you're not sure you need, "), link("contact us for a free consultation", "https://www.dr-webstudio.com/en/contact"), run(" — we'll give you the honest version of which tool your business actually needs, and build it properly.")]),
      ],
      es: [
        p("\"¿Debería mandar a hacer una app?\" Es una de las preguntas más comunes que hacen los dueños de negocios dominicanos cuando deciden tomarse en serio su presencia digital — y usualmente viene de un buen instinto: todo el mundo está en su teléfono, las apps viven en los teléfonos, así que un negocio necesita una app, ¿verdad? La respuesta honesta, para casi todo negocio pequeño y mediano en República Dominicana, es no — necesitas una página web, y probablemente ninguna app. Eso no es un golpe contra las apps; es lo que la matemática, el comportamiento del cliente y la economía realmente dicen. Aquí está la comparación real, para que gastes tu dinero donde funciona."),
        h2("La pregunta detrás de la pregunta"),
        rich("normal", [run("Cuando un dueño de negocio dice \"app,\" lo que usualmente quiere decir es \"quiero que los clientes me encuentren y me compren desde sus teléfonos.\" Esa meta es exactamente correcta — en República Dominicana, "), link("alrededor del 70% de la actividad en línea ocurre desde smartphones", "https://paymentscmi.com/insights/comercio-electronico-republica-dominicana-datos-clave/"), run(", así que el móvil no es un canal, es el mercado. La confusión es sobre la herramienta. Una página web adaptada a móviles entrega tu negocio a cada teléfono al instante, a través del navegador, sin nada que instalar. Una app lo entrega solo a las personas que dan varios pasos deliberados para ponerla ahí. Ambas viven en el teléfono; solo una tiene que ser invitada.")]),
        h2("Lo que una app realmente cuesta"),
        p("La primera dosis de realidad es económica. Una app bien construida no es un proyecto — son tres. Necesitas una versión iOS, una versión Android, y el backend que alimenta ambas, y luego necesitas actualizaciones continuas cada vez que Apple o Google cambian sus reglas, que es constantemente. Los costos de desarrollo de incluso una app modesta llegan a múltiplos de lo que cuesta una página web profesional, y el gasto nunca para: ciclos de revisión de las tiendas de apps, actualizaciones de compatibilidad para teléfonos y versiones nuevas, y mantenimiento de tres bases de código en vez de una. Para un negocio cuya necesidad real es \"que los clientes me encuentren, vean lo que ofrezco, y me contacten o compren,\" eso es pagar un camión para el trabajo de una bicicleta. La página web entrega la meta por una fracción del costo, en un solo proyecto, en cada dispositivo a la vez."),
        h2("El muro de la descarga"),
        rich("normal", [run("La segunda realidad es de comportamiento, y es la que mata la mayoría de las apps de negocios pequeños: la gente no las descarga. Piensa en tu propio teléfono. ¿Cuándo fue la última vez que instalaste la app de un negocio local — un restaurante, una tienda, una barbería? Un cliente tiene que encontrar tu app en una tienda, tocar instalar, esperar, crear una cuenta y otorgar permisos — cinco puntos de fricción antes de ver tu menú. Una página web no tiene ninguno: buscan, tocan, y ya están ahí, en segundos, ya sea que vinieran de Google, Instagram o un enlace de WhatsApp. Y la app que sí instalaron tiene que sobrevivir en su teléfono — compitiendo por espacio y atención contra los gigantes, y a una limpieza de \"almacenamiento lleno\" de ser eliminada. La verdad dura: una app es algo que tus clientes existentes más leales podrían usar. Una página web es cómo los clientes nuevos te encuentran siquiera — y los clientes nuevos son lo que la mayoría de los negocios realmente necesita.")]),
        h2("El problema de la invisibilidad"),
        rich("normal", [run("Aquí está la diferencia estratégica que más importa: las apps son invisibles para la búsqueda. El contenido de tu app no aparece cuando alguien googlea \"restaurante cerca de mí\" u \"operador de tours Punta Cana\" — los buscadores no pueden ver adentro, exactamente la misma ceguera que describimos para los catálogos de WhatsApp. Tu página web es lo opuesto: cada página es una puerta que Google puede abrir, en español y en inglés, para locales y turistas por igual. En un mercado donde ser encontrado es toda la batalla, la app encierra tu contenido en una caja, y la página web lo pone en la vitrina. La página web también alimenta cada otro canal — es a donde apunta tu bio de Instagram, a donde enlazan tus conversaciones de WhatsApp, donde "), link("se conecta tu perfil de Google Maps", "https://www.dr-webstudio.com/es/blog/como-conectar-sitio-web-whatsapp-google-maps-instagram"), run(" — el centro que los radios necesitan.")]),
        h2("\"Pero las apps me dejan mantener el contacto con los clientes\""),
        rich("normal", [run("El argumento genuino más fuerte a favor de una app es la retención — notificaciones push, un ícono persistente, una línea directa a tu cliente. Es una ventaja real para los Netflix del mundo. Pero mira lo que un negocio dominicano ya tiene: WhatsApp. Tus clientes cargan voluntariamente un canal directo, personal y con notificaciones hacia tu negocio en su bolsillo, con tasas de apertura que ninguna notificación de app sueña — y a diferencia de una app que pagarías por construir y rogarías que instalen, ya lo usan todo el día. Una página web con un botón de WhatsApp de un toque te da adquisición (Google encuentra el sitio) y retención (la conversación se mueve a WhatsApp) usando herramientas que tus clientes ya aman. Agrega una lista de correo o un follow de Instagram para los anuncios, y ya ensamblaste todo lo que la promesa de retención de la app vendía — gratis, sobre rieles que ya existen. La app estaba resolviendo un problema que el mercado dominicano resolvió hace años.")]),
        h2("Cuándo una app genuinamente tiene sentido"),
        rich("normal", [run("La honestidad exige el otro lado. Las apps ganan cuando el producto es la app, o cuando el uso diario repetido con cuentas personales es el corazón del negocio: bancos, plataformas de delivery, aerolíneas, gimnasios con reserva de clases, servicios de suscripción con experiencias de usuario registrado. Si tus clientes van a abrir tu producto varias veces por semana, necesitan notificaciones push que genuinamente les sirvan, o usan funciones del dispositivo a fondo (modo sin conexión, rastreo preciso de ubicación), una app puede ganarse su costo. La prueba es brutal pero clarificadora: ¿una porción significativa de tus clientes usará esto semanalmente? Si la respuesta honesta es no — y para restaurantes, hoteles, tours, tiendas, clínicas y servicios casi siempre lo es — la app será un ícono caro que nadie toca.")]),
        h2("El camino intermedio que la mayoría no conoce"),
        rich("normal", [run("También hay un punto medio técnico que vale la pena conocer: una página web moderna y bien construida puede hacer la mayor parte de lo que la gente imagina que necesita una app. Puede instalarse en la pantalla de inicio con su propio ícono, cargar al instante, verse hermosa en cada tamaño de pantalla, cobrar a través de "), link("métodos de pago locales", "https://www.dr-webstudio.com/es/blog/como-aceptar-pagos-en-linea-republica-dominicana"), run(", y sentirse tan fluida como una app nativa cuando está "), link("construida rápida", "https://www.dr-webstudio.com/es/blog/core-web-vitals-como-la-velocidad-afecta-tus-ventas-online"), run(" — porque el instinto de \"las apps se sienten mejor\" es en realidad un problema de \"la mayoría de las páginas web son lentas,\" y eso es un asunto de calidad de construcción, no de plataforma. Si tu negocio algún día crece hacia territorio genuino de app, nada se pierde: la página web sigue siendo la base, y la app se convierte en una adición para tu núcleo leal, no un reemplazo de ser encontrable.")]),
        h2("La decisión, en un marco honesto"),
        rich("normal", [run("Haz tres preguntas. Uno: ¿los clientes nuevos necesitan encontrarte a través de la búsqueda? Si sí, la página web no es opcional sin importar qué más construyas. Dos: ¿los clientes típicos interactuarán contigo más de una vez por semana con una cuenta? Si no, una app no puede justificarse. Tres: ¿tu presupuesto rinde más llegando a todos adecuadamente o a una fracción de leales profundamente? Para casi toda pyme dominicana, las respuestas se apilan igual: página web primero, página web completa, y revisita la pregunta de la app solo si llega el día en que tus clientes la están pidiendo. Los negocios que se equivocan en esto no solo desperdician el presupuesto de la app — retrasan la página web que habría estado produciendo clientes todo ese tiempo.")]),
        h2("Construye la que se paga sola"),
        rich("normal", [run("En "), link("DR Web Studio", "https://www.dr-webstudio.com/es"), run(" construimos la respuesta a esta pregunta: páginas web rápidas, bilingües y mobile-first que hacen el trabajo que la gente imagina que hace una app — encontrables por cada cliente nuevo en Google, instantáneas en cada teléfono, conectadas a WhatsApp y pagos locales, con el primer año de mantenimiento incluido. Si te cotizaron un precio de espanto por una app que no estás seguro de necesitar, "), link("contáctanos para una consulta gratuita", "https://www.dr-webstudio.com/es/contacto"), run(" — te daremos la versión honesta de cuál herramienta necesita realmente tu negocio, y la construiremos bien.")]),
      ],
    },
    seo: {
      metaTitle: loc(
        "App or Website? The Honest Answer (2026)",
        "¿App o Página Web? La Respuesta Honesta (2026)",
      ),
      ogTitle: loc(
        "Do I Need an App or a Website?",
        "¿Necesito una App o una Página Web?",
      ),
      ogDescription: loc(
        "Apps cost multiples more, must be downloaded, and live behind two app stores. A website is found by anyone, instantly. The honest guide to which one your business needs.",
        "Las apps cuestan varias veces más, deben descargarse y viven detrás de dos tiendas. Una web la encuentra cualquiera, al instante. La guía honesta de cuál necesita tu negocio.",
      ),
      keywords: {
        en: ["app or website for business", "do i need an app", "mobile app vs website", "app development cost", "website for small business"],
        es: ["app o página web para negocio", "necesito una app", "app móvil vs página web", "costo desarrollo de app", "página web para pequeño negocio"],
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