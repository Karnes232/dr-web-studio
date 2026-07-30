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
    slug: "whatsapp-catalog-vs-real-online-store",
    slugEs: "catalogo-de-whatsapp-vs-tienda-en-linea-real",
    title: loc(
      "WhatsApp Catalog vs. a Real Online Store: Which Does Your Business Need?",
      "Catálogo de WhatsApp vs. Tienda en Línea Real: ¿Cuál Necesita Tu Negocio?",
    ),
    description: loc(
      "WhatsApp catalogs are where Dominican commerce lives — but a catalog alone is not a store. When each makes sense, where the ceiling is, and how the two work together.",
      "Los catálogos de WhatsApp son donde vive el comercio dominicano — pero un catálogo solo no es una tienda. Cuándo conviene cada uno y cómo trabajan juntos.",
    ),
    readTime: 8,
    featured: false,
    tags: {
      en: ["WhatsApp", "e-commerce", "online store", "WhatsApp Business", "catalog", "selling online", "Dominican Republic"],
      es: ["WhatsApp", "e-commerce", "tienda en línea", "WhatsApp Business", "catálogo", "vender en línea", "República Dominicana"],
    },
    categories: ["business-tips"],
    publishedAt: "2026-07-16T12:00:00.000Z",
    body: {
      en: [
        p("If you sell anything in the Dominican Republic, you already know where your customers are: WhatsApp. The catalog feature in WhatsApp Business has become the default storefront for thousands of Dominican businesses, and for good reason — it's free, it's familiar, and it lives inside the app where every conversation already happens. So when a web developer tells you that you need \"a real online store,\" a fair question is: why? The honest answer is more interesting than either side of the argument usually admits. A WhatsApp catalog and a real online store are not competitors — they're different tools that do different jobs, and the businesses that grow are the ones that understand exactly where the catalog's ceiling is and build past it at the right moment."),
        h2("Why WhatsApp earned its place"),
        rich("normal", [run("Let's start by taking WhatsApp seriously, because it has earned it. In the Dominican Republic, WhatsApp isn't a channel — it's the channel. According to "), link("PCMI's research on Dominican e-commerce, around 82% of online shoppers in the country use WhatsApp to complete purchases", "https://paymentscmi.com/insights/comercio-electronico-republica-dominicana-datos-clave/"), run(", a figure with few parallels anywhere in the world. The catalog feature works with that reality instead of against it: you photograph your products, add prices and descriptions, and a customer browsing your profile can see what you sell and start a conversation in one tap. There's no monthly fee, no technical setup, and no learning curve for a customer base that already lives in the app. For a business that's just starting — testing whether anyone wants the product at all — a WhatsApp catalog is genuinely the right first move. It costs nothing and it answers the only question that matters at that stage: will people buy?")]),
        h2("Where the catalog hits its ceiling"),
        p("The problems don't appear at the start. They appear when the business starts working — and every one of them traces back to the same root: a WhatsApp catalog only exists for people who already have your number."),
        rich("normal", [run("•  "), run("You're invisible to new customers. A catalog doesn't appear on Google. When someone searches \"hair products Santo Domingo\" or \"handmade jewelry Dominican Republic,\" your catalog cannot show up, because search engines can't see inside WhatsApp. Every new customer has to find you some other way — Instagram, referrals, walking past — and then also message you. The single largest source of new customers on the internet, search, is structurally closed to you.")]),
        rich("normal", [run("•  "), run("Every sale is a manual conversation. The catalog shows products, but you still answer every question, confirm every price, arrange every payment, and coordinate every delivery by hand, message by message. That's charming at five orders a week and crushing at fifty. The catalog doesn't scale; your thumbs do.")]),
        rich("normal", [run("•  "), run("Payment is a workaround. WhatsApp in the DR has no built-in checkout, so payment becomes a bank transfer screenshot or cash on delivery — friction that loses impulse buyers and creates disputes, compared with the card and local payment options a store can offer, as we detail in "), link("how to accept online payments in the DR", "https://www.dr-webstudio.com/en/blog/how-to-accept-online-payments-dominican-republic"), run(".")]),
        rich("normal", [run("•  "), run("You don't own the platform. Your entire storefront lives inside an app owned by Meta, subject to its rules, its outages, and its account suspensions. Businesses have lost their number — and with it their whole \"store\" and customer history — overnight, with no appeal that moves quickly. A website is an asset you own; a catalog is a feature you borrow.")]),
        rich("normal", [run("•  "), run("It caps how professional you can look. For a customer deciding whether to trust a business with a larger purchase, \"they have a WhatsApp catalog\" and \"they have a real website\" are different credibility tiers. The catalog format itself — a scrolling list inside a chat app — can't communicate brand, story, policies, or reviews the way a store can.")]),
        h2("What a real online store actually adds"),
        p("A proper online store isn't just a prettier catalog. It changes the mechanics of how the business acquires and serves customers:"),
        rich("normal", [run("•  "), run("Google becomes a salesperson. Every product gets a page that can rank in search results, in both languages. People who have never heard of you find you at the exact moment they're looking to buy — which is the entire growth engine the catalog lacks, and the foundation we describe in "), link("how to start selling online in the DR", "https://www.dr-webstudio.com/en/blog/how-to-start-selling-online-dominican-republic"), run(".")]),
        rich("normal", [run("•  "), run("The store sells while you sleep. Prices, stock, variations, shipping options, and payment happen without you touching your phone. The customer who wants to buy at 11pm buys at 11pm.")]),
        rich("normal", [run("•  "), run("Real payments, at the moment of decision. Cards and local payment methods captured on the spot, instead of a transfer-screenshot dance after the fact.")]),
        rich("normal", [run("•  "), run("Data you can act on. Which products get views, where visitors come from, what gets abandoned — a store tells you; a chat thread doesn't.")]),
        rich("normal", [run("•  "), run("An asset that compounds. Every month your store is live, it accumulates rankings, reviews, and returning customers. It's equity in your business, not rented space in someone else's app.")]),
        h2("The real answer: it was never either/or"),
        rich("normal", [run("Here's the part both camps get wrong: in the Dominican market, the winning setup is not the catalog or the store — it's the store with WhatsApp wired into it. The website does what WhatsApp can't: it gets found on Google by strangers, shows the full catalog beautifully in two languages, takes payment, and looks like a business worth trusting. WhatsApp does what the website shouldn't try to replace: it's where Dominican customers want to ask their questions, negotiate their details, and confirm their orders — the conversation that closes the sale. A well-built Dominican store puts a WhatsApp button on every product page, connected the way we describe in "), link("connecting your website to WhatsApp, Google Maps, and Instagram", "https://www.dr-webstudio.com/en/blog/how-to-connect-website-whatsapp-google-maps-instagram"), run(", so the customer Google delivered lands on your site, falls in love with the product, and taps straight into the chat you already know how to close. The store is the front door the whole internet can find; WhatsApp is the counter where the deal gets done.")]),
        h2("How to know when you've outgrown the catalog"),
        p("A few honest signals that it's time to build:"),
        bulletP("You're spending hours a day answering the same product questions a store page would answer automatically."),
        bulletP("You've lost track of an order, a payment, or a customer in the scroll of chats — more than once."),
        bulletP("New customer growth has flattened because everyone who was going to find you on Instagram already has."),
        bulletP("Customers ask \"do you have a website?\" — which is really a question about whether you're an established business."),
        bulletP("You want to reach tourists or the diaspora, who search Google in English and don't have your number."),
        p("If two or more of those sound familiar, the catalog has done its job — it proved the demand. The next stage needs the next tool."),
        h2("An honest word on cost and effort"),
        p("A real store is an investment where the catalog is free, and it's fair to weigh that honestly. But the comparison people make — \"free versus expensive\" — is the wrong one. The catalog's costs are real; they're just paid in hours of manual work, in the customers who never found you, and in the sales that died waiting for a transfer screenshot. A professionally built store is a one-time project that then works every day for years, and in the Dominican market it doesn't need to be a huge one to do everything above. The right frame isn't the price of the website — it's the price of remaining invisible to every customer who searches instead of scrolls."),
        h2("Build the store, keep the WhatsApp"),
        rich("normal", [run("At "), link("DR Web Studio", "https://www.dr-webstudio.com/en"), run(" this combination is exactly what we build: fast, bilingual online stores with local payments and WhatsApp integrated on every page — the storefront Google can find, feeding the chat you already run, with the first year of maintenance included. If your catalog is full and your days are spent retyping prices into chats, you're ready for the next stage. "), link("Contact us for a free consultation", "https://www.dr-webstudio.com/en/contact"), run(" and we'll map out what your store-plus-WhatsApp setup should look like.")]),
      ],
      es: [
        p("Si vendes cualquier cosa en República Dominicana, ya sabes dónde están tus clientes: en WhatsApp. La función de catálogo de WhatsApp Business se ha convertido en la vitrina por defecto de miles de negocios dominicanos, y con buena razón — es gratis, es familiar, y vive dentro de la app donde ya ocurre cada conversación. Así que cuando un desarrollador web te dice que necesitas \"una tienda en línea de verdad,\" una pregunta justa es: ¿por qué? La respuesta honesta es más interesante de lo que cualquiera de los dos bandos suele admitir. Un catálogo de WhatsApp y una tienda en línea real no son competidores — son herramientas distintas que hacen trabajos distintos, y los negocios que crecen son los que entienden exactamente dónde está el techo del catálogo y construyen más allá de él en el momento correcto."),
        h2("Por qué WhatsApp se ganó su lugar"),
        rich("normal", [run("Empecemos tomando a WhatsApp en serio, porque se lo ha ganado. En República Dominicana, WhatsApp no es un canal — es el canal. Según "), link("la investigación de PCMI sobre el e-commerce dominicano, alrededor del 82% de los compradores en línea del país usa WhatsApp para completar compras", "https://paymentscmi.com/insights/comercio-electronico-republica-dominicana-datos-clave/"), run(", una cifra con pocos paralelos en el mundo. La función de catálogo trabaja con esa realidad en vez de contra ella: fotografías tus productos, agregas precios y descripciones, y un cliente que navega tu perfil puede ver lo que vendes e iniciar una conversación en un toque. No hay cuota mensual, no hay configuración técnica, y no hay curva de aprendizaje para una base de clientes que ya vive en la app. Para un negocio que apenas empieza — probando si alguien quiere el producto siquiera — un catálogo de WhatsApp es genuinamente el primer movimiento correcto. No cuesta nada y responde la única pregunta que importa en esa etapa: ¿la gente va a comprar?")]),
        h2("Dónde el catálogo toca su techo"),
        p("Los problemas no aparecen al principio. Aparecen cuando el negocio empieza a funcionar — y cada uno de ellos se rastrea a la misma raíz: un catálogo de WhatsApp solo existe para la gente que ya tiene tu número."),
        rich("normal", [run("•  "), run("Eres invisible para los clientes nuevos. Un catálogo no aparece en Google. Cuando alguien busca \"productos para el cabello Santo Domingo\" o \"joyería artesanal República Dominicana,\" tu catálogo no puede aparecer, porque los buscadores no pueden ver dentro de WhatsApp. Cada cliente nuevo tiene que encontrarte de otra forma — Instagram, referencias, pasando por el frente — y luego además escribirte. La fuente más grande de clientes nuevos en internet, la búsqueda, está estructuralmente cerrada para ti.")]),
        rich("normal", [run("•  "), run("Cada venta es una conversación manual. El catálogo muestra productos, pero tú sigues respondiendo cada pregunta, confirmando cada precio, coordinando cada pago y cada entrega a mano, mensaje por mensaje. Eso es encantador con cinco pedidos a la semana y aplastante con cincuenta. El catálogo no escala; escalan tus pulgares.")]),
        rich("normal", [run("•  "), run("El pago es un parche. WhatsApp en RD no tiene checkout integrado, así que el pago se vuelve una captura de pantalla de transferencia bancaria o efectivo contra entrega — fricción que pierde a los compradores impulsivos y crea disputas, comparado con las opciones de tarjeta y pagos locales que una tienda puede ofrecer, como detallamos en "), link("cómo aceptar pagos en línea en RD", "https://www.dr-webstudio.com/es/blog/como-aceptar-pagos-en-linea-republica-dominicana"), run(".")]),
        rich("normal", [run("•  "), run("No eres dueño de la plataforma. Toda tu vitrina vive dentro de una app propiedad de Meta, sujeta a sus reglas, sus caídas y sus suspensiones de cuenta. Hay negocios que han perdido su número — y con él toda su \"tienda\" y su historial de clientes — de la noche a la mañana, sin una apelación que se mueva rápido. Una página web es un activo tuyo; un catálogo es una función prestada.")]),
        rich("normal", [run("•  "), run("Limita cuán profesional puedes verte. Para un cliente decidiendo si confiarle a un negocio una compra más grande, \"tienen un catálogo de WhatsApp\" y \"tienen una página web real\" son niveles de credibilidad distintos. El formato mismo del catálogo — una lista dentro de una app de chat — no puede comunicar marca, historia, políticas ni reseñas como lo hace una tienda.")]),
        h2("Qué agrega realmente una tienda en línea"),
        p("Una tienda en línea de verdad no es solo un catálogo más bonito. Cambia la mecánica de cómo el negocio adquiere y atiende clientes:"),
        rich("normal", [run("•  "), run("Google se convierte en un vendedor. Cada producto tiene una página que puede posicionarse en los resultados de búsqueda, en ambos idiomas. Gente que nunca ha oído de ti te encuentra en el momento exacto en que busca comprar — que es todo el motor de crecimiento que al catálogo le falta, y la base que describimos en "), link("cómo empezar a vender en línea en RD", "https://www.dr-webstudio.com/es/blog/como-empezar-a-vender-en-linea-republica-dominicana"), run(".")]),
        rich("normal", [run("•  "), run("La tienda vende mientras duermes. Precios, inventario, variaciones, opciones de envío y pago ocurren sin que toques tu teléfono. El cliente que quiere comprar a las 11pm compra a las 11pm.")]),
        rich("normal", [run("•  "), run("Pagos reales, en el momento de la decisión. Tarjetas y métodos de pago locales capturados al instante, en vez del baile de la captura de transferencia después.")]),
        rich("normal", [run("•  "), run("Datos sobre los que puedes actuar. Qué productos reciben vistas, de dónde vienen los visitantes, qué se abandona — una tienda te lo dice; un hilo de chat no.")]),
        rich("normal", [run("•  "), run("Un activo que se acumula. Cada mes que tu tienda está en línea, acumula posicionamiento, reseñas y clientes que regresan. Es patrimonio de tu negocio, no espacio alquilado en la app de otro.")]),
        h2("La respuesta real: nunca fue lo uno o lo otro"),
        rich("normal", [run("Aquí está la parte en la que ambos bandos se equivocan: en el mercado dominicano, la configuración ganadora no es el catálogo o la tienda — es la tienda con WhatsApp integrado. La página web hace lo que WhatsApp no puede: ser encontrada en Google por desconocidos, mostrar el catálogo completo hermosamente en dos idiomas, cobrar, y verse como un negocio digno de confianza. WhatsApp hace lo que la página web no debería intentar reemplazar: es donde los clientes dominicanos quieren hacer sus preguntas, negociar sus detalles y confirmar sus pedidos — la conversación que cierra la venta. Una tienda dominicana bien construida pone un botón de WhatsApp en cada página de producto, conectado como describimos en "), link("conectar tu sitio con WhatsApp, Google Maps e Instagram", "https://www.dr-webstudio.com/es/blog/como-conectar-sitio-web-whatsapp-google-maps-instagram"), run(", para que el cliente que Google entregó aterrice en tu sitio, se enamore del producto, y toque directo hacia el chat que tú ya sabes cerrar. La tienda es la puerta principal que todo el internet puede encontrar; WhatsApp es el mostrador donde se cierra el trato.")]),
        h2("Cómo saber cuándo superaste el catálogo"),
        p("Algunas señales honestas de que es hora de construir:"),
        bulletP("Pasas horas al día respondiendo las mismas preguntas de producto que una página de tienda respondería automáticamente."),
        bulletP("Has perdido el rastro de un pedido, un pago o un cliente en el scroll de los chats — más de una vez."),
        bulletP("El crecimiento de clientes nuevos se aplanó porque todos los que te iban a encontrar en Instagram ya te encontraron."),
        bulletP("Los clientes preguntan \"¿tienen página web?\" — que en realidad es una pregunta sobre si eres un negocio establecido."),
        bulletP("Quieres llegar a turistas o a la diáspora, que buscan en Google en inglés y no tienen tu número."),
        p("Si dos o más de esas te suenan familiares, el catálogo hizo su trabajo — comprobó la demanda. La siguiente etapa necesita la siguiente herramienta."),
        h2("Una palabra honesta sobre costo y esfuerzo"),
        p("Una tienda real es una inversión mientras el catálogo es gratis, y es justo pesar eso honestamente. Pero la comparación que la gente hace — \"gratis versus caro\" — es la equivocada. Los costos del catálogo son reales; solo que se pagan en horas de trabajo manual, en los clientes que nunca te encontraron, y en las ventas que murieron esperando una captura de transferencia. Una tienda construida profesionalmente es un proyecto de una sola vez que luego trabaja todos los días por años, y en el mercado dominicano no necesita ser enorme para hacer todo lo de arriba. El marco correcto no es el precio de la página web — es el precio de seguir siendo invisible para cada cliente que busca en vez de hacer scroll."),
        h2("Construye la tienda, quédate con el WhatsApp"),
        rich("normal", [run("En "), link("DR Web Studio", "https://www.dr-webstudio.com/es"), run(" esta combinación es exactamente lo que construimos: tiendas en línea rápidas y bilingües con pagos locales y WhatsApp integrado en cada página — la vitrina que Google puede encontrar, alimentando el chat que tú ya manejas, con el primer año de mantenimiento incluido. Si tu catálogo está lleno y tus días se van en reescribir precios en los chats, estás listo para la siguiente etapa. "), link("Contáctanos para una consulta gratuita", "https://www.dr-webstudio.com/es/contacto"), run(" y trazamos cómo debería verse tu configuración de tienda-más-WhatsApp.")]),
      ],
    },
    seo: {
      metaTitle: loc(
        "WhatsApp Catalog vs. Online Store (DR Guide 2026)",
        "Catálogo WhatsApp vs. Tienda en Línea (Guía RD 2026)",
      ),
      ogTitle: loc(
        "WhatsApp Catalog vs. a Real Online Store",
        "Catálogo de WhatsApp vs. Tienda en Línea Real",
      ),
      ogDescription: loc(
        "82% of Dominican online shoppers buy through WhatsApp — but a catalog cannot rank on Google, scale, or run itself. The honest comparison, and why the answer is both.",
        "El 82% de los compradores dominicanos usa WhatsApp — pero un catálogo no posiciona en Google, no escala y no se maneja solo. La comparación honesta, y por qué la respuesta es ambos.",
      ),
      keywords: {
        en: ["whatsapp catalog vs online store", "whatsapp business catalog", "sell on whatsapp dominican republic", "online store dominican republic", "whatsapp store website"],
        es: ["catálogo whatsapp vs tienda en línea", "catálogo whatsapp business", "vender por whatsapp república dominicana", "tienda en línea república dominicana", "tienda whatsapp página web"],
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