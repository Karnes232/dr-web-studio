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
    slug: "one-page-site-vs-multi-page-which-do-you-need",
    slugEs: "sitio-de-una-pagina-vs-varias-paginas-cual-necesitas",
    title: loc(
      "One-Page Site vs. Multi-Page: Which Do You Need?",
      "Sitio de Una Página vs. Varias Páginas: ¿Cuál Necesitas?",
    ),
    description: loc(
      "One-page site or multi-page? The honest test is not your budget — it is whether you need to rank for more than one thing. How to choose, and what each actually costs you.",
      "¿Sitio de una página o de varias? La prueba honesta no es tu presupuesto — es si necesitas posicionarte para más de una cosa. Cómo elegir y qué te cuesta cada uno.",
    ),
    readTime: 8,
    featured: false,
    tags: {
      en: ["one-page", "multi-page", "landing page", "SEO", "web design", "site structure", "Dominican Republic"],
      es: ["una página", "varias páginas", "landing page", "SEO", "diseño web", "estructura del sitio", "República Dominicana"],
    },
    categories: ["web-design", "business-tips"],
    publishedAt: "2026-08-08T12:00:00.000Z",
    body: {
      en: [
        p("\"Can't we just do a single page?\" It's a reasonable question, usually asked with budget in mind, and the answer isn't the automatic \"no\" most developers give. One-page sites are a legitimate format that genuinely wins in certain situations. But choosing between one page and many isn't really a budget decision — it's a decision about how many different things you need Google to find you for, and how complex your customer's journey is. Get that framing right and the answer usually becomes obvious. Here's the honest comparison."),
        h2("What each format actually is"),
        rich("normal", [run("A one-page site puts everything on a single scrolling page: your offer, your services, some proof, and a contact section, usually with a menu that scrolls you down rather than loading a new page. Everything the visitor needs is in one continuous story, and the design typically pushes them toward a single action — call, book, message, buy.")]),
        rich("normal", [run("A multi-page site distributes that content across separate pages with their own web addresses: a homepage, a page per service, an about page, a contact page, maybe a blog and a gallery. The visitor navigates rather than scrolls, and each page can go deep on its own topic.")]),
        p("Both can be beautiful, fast, and modern. The difference that matters isn't visual — it's structural, and it shows up mostly in search."),
        h2("The real test: how many things do you need to rank for?"),
        rich("normal", [run("Here's the framing that settles most of these decisions. Google ranks pages, not websites — its "), link("own SEO documentation describes crawlers exploring the web looking for individual pages to add to the index", "https://developers.google.com/search/docs/fundamentals/seo-starter-guide"), run(", each evaluated on its own content. A one-page site is one page, so it can realistically compete for one cluster of related search terms. A ten-page site has ten chances — each service page competing for its own searches, each answering a different customer question.")]),
        p("Think about what that means concretely. A dive shop in Bayahíbe with a single page might rank for \"dive shop Bayahíbe\" and little else. The same business with separate pages for open-water certification, discover-scuba for beginners, advanced courses, and shipwreck dives can appear for each of those searches — every one of which is a different customer with a different intent, and several of which are far less contested than the generic term. That's not a marginal difference; it's the difference between one front door and five. If your business genuinely offers several distinct things people search for separately, a one-page site caps your visibility on purpose."),
        h2("When one page is genuinely the right answer"),
        p("That said, plenty of businesses don't need five doors. A one-page site is the correct choice when:"),
        rich("normal", [run("•  "), run("You do one thing. A single service, a single product, a single message. A yoga instructor, a photographer with one offering, a consultant with one specialty — the whole story fits one page because the business is one page.")]),
        rich("normal", [run("•  "), run("You're running a campaign. A specific promotion, event, or ad campaign needs a focused page with one action and nothing to distract from it. This is the classic landing page, and we cover the distinction in our guide on "), link("whether your business needs a website or a landing page", "https://www.dr-webstudio.com/en/blog/mi-negocio-necesita-sitio-web-o-landing-page-guia-decision"), run(".")]),
        rich("normal", [run("•  "), run("You're validating an idea. You want to be online this month, test whether anyone responds, and expand later. Starting focused and growing is a perfectly sound strategy.")]),
        rich("normal", [run("•  "), run("Your traffic doesn't come from search. If your customers arrive from Instagram, WhatsApp links, printed materials, or a QR code on a table, the SEO argument weakens considerably — they already know who you are, and they need one clear page, not a site map.")]),
        h2("When you need multiple pages"),
        p("Conversely, go multi-page when:"),
        rich("normal", [run("•  "), run("You offer several distinct services, each with its own customers and its own searches. Every service deserves a page that can rank and convert on its own terms.")]),
        rich("normal", [run("•  "), run("You serve more than one location. A business covering Punta Cana, Bávaro, and La Romana needs pages that can rank for each — a single page can't credibly target three places at once.")]),
        rich("normal", [run("•  "), run("Your customer needs to research before deciding. High-consideration purchases — legal services, real estate, medical, anything expensive — require depth: detail, proof, FAQs, credibility. That doesn't fit one screen-scroll without becoming exhausting.")]),
        rich("normal", [run("•  "), run("You want to publish content. A blog, guides, or answers to customer questions are among the strongest SEO assets a business can build, and they need their own pages by definition.")]),
        rich("normal", [run("•  "), run("You're bilingual — which in the DR you should be. This one is underappreciated: proper "), link("bilingual SEO requires separate indexed pages per language", "https://www.dr-webstudio.com/en/blog/seo-bilingue-posicionarse-ingles-espanol-sin-perjudicar-ninguno"), run(", so serving Spanish and English customers well inherently means more pages, not one page with a toggle.")]),
        h2("The mistakes to avoid on both sides"),
        rich("normal", [run("Two failure modes are worth naming. The first is the overstuffed one-pager: a business with six services crams all of them onto one endless page, which loads slowly under the weight of everything, buries every message, and still ranks for nothing in particular. If you're scrolling past four screens of unrelated content, you needed a multi-page site two services ago.")]),
        rich("normal", [run("The second is the empty multi-page site: eight pages created because eight pages sounded professional, each containing two thin paragraphs. Google sees thin pages as low value, visitors see padding, and the site performs worse than a single strong page would have. Pages must earn their existence with real content. The rule that resolves both: build the number of pages your content genuinely fills and your customers genuinely need — no more, and no fewer.")]),
        h2("A word on speed, since it cuts both ways"),
        rich("normal", [run("There's a common belief that one-page sites are automatically faster because there's only one page to load. It's half true and worth correcting. A one-page site loads once and then navigation is instant — genuinely pleasant. But that single page has to load everything up front: every image, every section, the full content of what might have been five pages. Done carelessly, that makes the initial load heavier and slower than a multi-page site, where each page loads only what it needs. Since the first load is the one that determines whether a visitor stays, an overloaded one-pager can be the slower experience where it counts. The practical takeaway is that neither format is inherently fast — build quality decides it. A well-built one-pager lazy-loads its images and stays light; a well-built multi-page site keeps each page lean. If anyone tells you the format alone guarantees speed, they're skipping the part that actually matters.")]),
        h2("The cost question, answered honestly"),
        rich("normal", [run("Since budget is what prompts the question, let's address it directly. Yes, a one-page site costs less to build than a multi-page site — fewer pages is less work. But the gap is smaller than most people expect, because the expensive parts of a professional website (the design system, the technical foundation, mobile performance, the bilingual setup, integrations) are largely fixed costs that don't multiply per page. You can see how this plays out in our breakdown of "), link("what a website actually costs in the Dominican Republic", "https://www.dr-webstudio.com/en/blog/cuanto-cuesta-pagina-web-republica-dominicana-2026"), run(". And the more important cost consideration is what you forgo: if your business genuinely has five things people search for, saving on four pages means giving up four ways to be found — a saving that keeps costing you every month.")]),
        h2("You can start small and grow"),
        p("Worth knowing if you're torn: this isn't a permanent decision when the site is built properly. A well-constructed one-page site can be expanded into a multi-page site later, keeping the design, adding pages as the business grows and the budget allows. The critical requirement is that it's built on a foundation that permits growth — which is exactly where template platforms and cheap builds tend to trap you, forcing a rebuild instead of an extension. If you're starting with one page, make sure you're starting on something that can become more."),
        h2("Not sure which you need? Ask us"),
        rich("normal", [run("At "), link("DR Web Studio", "https://www.dr-webstudio.com/en"), run(" we build both, and the first conversation is always about which one your business actually needs — not which one we'd rather sell. Landing pages start at $400 and full business websites at $950, both fast, bilingual, and built to grow, with the first year of maintenance included. If you're weighing one page against several, "), link("contact us for a free consultation", "https://www.dr-webstudio.com/en/contact"), run(" and we'll map your services against what your customers are actually searching for, then tell you honestly which format wins.")]),
      ],
      es: [
        p("\"¿No podemos hacer una sola página?\" Es una pregunta razonable, usualmente hecha con el presupuesto en mente, y la respuesta no es el \"no\" automático que da la mayoría de los desarrolladores. Los sitios de una página son un formato legítimo que genuinamente gana en ciertas situaciones. Pero elegir entre una página y varias no es realmente una decisión de presupuesto — es una decisión sobre cuántas cosas distintas necesitas que Google encuentre de ti, y qué tan complejo es el recorrido de tu cliente. Acierta ese encuadre y la respuesta usualmente se vuelve obvia. Aquí está la comparación honesta."),
        h2("Qué es realmente cada formato"),
        rich("normal", [run("Un sitio de una página pone todo en una sola página que se desliza: tu oferta, tus servicios, algo de prueba, y una sección de contacto, usualmente con un menú que te baja en vez de cargar una página nueva. Todo lo que el visitante necesita está en una historia continua, y el diseño típicamente lo empuja hacia una sola acción — llamar, reservar, escribir, comprar.")]),
        rich("normal", [run("Un sitio de varias páginas distribuye ese contenido en páginas separadas con sus propias direcciones web: una página de inicio, una página por servicio, una de nosotros, una de contacto, quizás un blog y una galería. El visitante navega en vez de deslizar, y cada página puede profundizar en su propio tema.")]),
        p("Ambos pueden ser hermosos, rápidos y modernos. La diferencia que importa no es visual — es estructural, y se manifiesta sobre todo en la búsqueda."),
        h2("La prueba real: ¿para cuántas cosas necesitas posicionarte?"),
        rich("normal", [run("Aquí está el encuadre que resuelve la mayoría de estas decisiones. Google posiciona páginas, no sitios web — su "), link("propia documentación de SEO describe rastreadores explorando la web en busca de páginas individuales para agregar al índice", "https://developers.google.com/search/docs/fundamentals/seo-starter-guide"), run(", cada una evaluada por su propio contenido. Un sitio de una página es una página, así que realistamente puede competir por un grupo de términos de búsqueda relacionados. Un sitio de diez páginas tiene diez oportunidades — cada página de servicio compitiendo por sus propias búsquedas, cada una respondiendo una pregunta distinta de cliente.")]),
        p("Piensa en lo que eso significa en concreto. Una tienda de buceo en Bayahíbe con una sola página podría posicionarse para \"tienda de buceo Bayahíbe\" y poco más. El mismo negocio con páginas separadas para la certificación open water, el bautizo de buceo para principiantes, los cursos avanzados y las inmersiones en naufragios puede aparecer para cada una de esas búsquedas — cada una de las cuales es un cliente distinto con una intención distinta, y varias de las cuales están mucho menos disputadas que el término genérico. Esa no es una diferencia marginal; es la diferencia entre una puerta de entrada y cinco. Si tu negocio genuinamente ofrece varias cosas que la gente busca por separado, un sitio de una página le pone un techo a tu visibilidad a propósito."),
        h2("Cuándo una página es genuinamente la respuesta correcta"),
        p("Dicho eso, muchos negocios no necesitan cinco puertas. Un sitio de una página es la elección correcta cuando:"),
        rich("normal", [run("•  "), run("Haces una sola cosa. Un solo servicio, un solo producto, un solo mensaje. Un instructor de yoga, un fotógrafo con una sola oferta, un consultor con una especialidad — toda la historia cabe en una página porque el negocio es una página.")]),
        rich("normal", [run("•  "), run("Estás corriendo una campaña. Una promoción, evento o campaña publicitaria específica necesita una página enfocada con una acción y nada que distraiga. Esta es la landing page clásica, y cubrimos la distinción en nuestra guía sobre "), link("si tu negocio necesita un sitio web o una landing page", "https://www.dr-webstudio.com/es/blog/mi-negocio-necesita-sitio-web-o-landing-page-guia-decision"), run(".")]),
        rich("normal", [run("•  "), run("Estás validando una idea. Quieres estar en línea este mes, probar si alguien responde, y expandir después. Empezar enfocado y crecer es una estrategia perfectamente sólida.")]),
        rich("normal", [run("•  "), run("Tu tráfico no viene de la búsqueda. Si tus clientes llegan de Instagram, enlaces de WhatsApp, material impreso o un código QR en una mesa, el argumento de SEO se debilita considerablemente — ya saben quién eres, y necesitan una página clara, no un mapa de sitio.")]),
        h2("Cuándo necesitas varias páginas"),
        p("A la inversa, ve por varias páginas cuando:"),
        rich("normal", [run("•  "), run("Ofreces varios servicios distintos, cada uno con sus propios clientes y sus propias búsquedas. Cada servicio merece una página que pueda posicionar y convertir por sus propios méritos.")]),
        rich("normal", [run("•  "), run("Sirves a más de una ubicación. Un negocio que cubre Punta Cana, Bávaro y La Romana necesita páginas que puedan posicionarse para cada una — una sola página no puede apuntar creíblemente a tres lugares a la vez.")]),
        rich("normal", [run("•  "), run("Tu cliente necesita investigar antes de decidir. Las compras de alta consideración — servicios legales, bienes raíces, medicina, cualquier cosa cara — requieren profundidad: detalle, prueba, preguntas frecuentes, credibilidad. Eso no cabe en un solo deslizamiento sin volverse agotador.")]),
        rich("normal", [run("•  "), run("Quieres publicar contenido. Un blog, guías o respuestas a preguntas de clientes están entre los activos SEO más fuertes que un negocio puede construir, y necesitan sus propias páginas por definición.")]),
        rich("normal", [run("•  "), run("Eres bilingüe — que en RD deberías serlo. Este punto se subestima: el "), link("SEO bilingüe adecuado requiere páginas separadas e indexadas por idioma", "https://www.dr-webstudio.com/es/blog/seo-bilingue-posicionarse-ingles-espanol-sin-perjudicar-ninguno"), run(", así que servir bien a clientes en español e inglés inherentemente significa más páginas, no una página con un botón.")]),
        h2("Los errores que evitar de ambos lados"),
        rich("normal", [run("Vale la pena nombrar dos modos de falla. El primero es el una-página sobrecargado: un negocio con seis servicios los amontona todos en una página interminable, que carga lento bajo el peso de todo, entierra cada mensaje, y aun así no posiciona para nada en particular. Si estás deslizando cuatro pantallas de contenido no relacionado, necesitabas un sitio de varias páginas hace dos servicios.")]),
        rich("normal", [run("El segundo es el sitio de varias páginas vacío: ocho páginas creadas porque ocho páginas sonaban profesionales, cada una con dos párrafos flacos. Google ve las páginas flacas como de bajo valor, los visitantes ven relleno, y el sitio rinde peor de lo que habría rendido una sola página fuerte. Las páginas deben ganarse su existencia con contenido real. La regla que resuelve ambos: construye el número de páginas que tu contenido genuinamente llena y tus clientes genuinamente necesitan — ni más, ni menos.")]),
        h2("Una palabra sobre la velocidad, porque corta en ambos sentidos"),
        rich("normal", [run("Existe la creencia común de que los sitios de una página son automáticamente más rápidos porque solo hay una página que cargar. Es verdad a medias y vale la pena corregirlo. Un sitio de una página carga una vez y luego la navegación es instantánea — genuinamente agradable. Pero esa única página tiene que cargar todo de entrada: cada imagen, cada sección, el contenido completo de lo que podrían haber sido cinco páginas. Hecho sin cuidado, eso hace la carga inicial más pesada y lenta que un sitio de varias páginas, donde cada página carga solo lo que necesita. Como la primera carga es la que determina si un visitante se queda, un una-página sobrecargado puede ser la experiencia más lenta justo donde importa. La conclusión práctica es que ningún formato es inherentemente rápido — la calidad de construcción lo decide. Un una-página bien construido carga sus imágenes de forma diferida y se mantiene ligero; un sitio de varias páginas bien construido mantiene cada página esbelta. Si alguien te dice que el formato por sí solo garantiza velocidad, se está saltando la parte que realmente importa.")]),
        h2("La pregunta del costo, respondida con honestidad"),
        rich("normal", [run("Como el presupuesto es lo que provoca la pregunta, atendámosla directamente. Sí, un sitio de una página cuesta menos de construir que uno de varias páginas — menos páginas es menos trabajo. Pero la brecha es más pequeña de lo que la mayoría espera, porque las partes caras de una página web profesional (el sistema de diseño, la base técnica, el rendimiento móvil, la configuración bilingüe, las integraciones) son en gran medida costos fijos que no se multiplican por página. Puedes ver cómo se comporta esto en nuestro desglose de "), link("cuánto cuesta realmente una página web en República Dominicana", "https://www.dr-webstudio.com/es/blog/cuanto-cuesta-pagina-web-republica-dominicana-2026"), run(". Y la consideración de costo más importante es a qué renuncias: si tu negocio genuinamente tiene cinco cosas que la gente busca, ahorrarte cuatro páginas significa ceder cuatro formas de ser encontrado — un ahorro que te sigue costando cada mes.")]),
        h2("Puedes empezar pequeño y crecer"),
        p("Vale la pena saberlo si estás dudando: esta no es una decisión permanente cuando el sitio está bien construido. Un sitio de una página bien hecho puede expandirse a uno de varias páginas después, conservando el diseño y agregando páginas a medida que el negocio crece y el presupuesto lo permite. El requisito crítico es que esté construido sobre una base que permita crecer — que es exactamente donde las plataformas de plantillas y las construcciones baratas tienden a atraparte, forzando una reconstrucción en vez de una extensión. Si vas a empezar con una página, asegúrate de empezar sobre algo que pueda convertirse en más."),
        h2("¿No estás seguro de cuál necesitas? Pregúntanos"),
        rich("normal", [run("En "), link("DR Web Studio", "https://www.dr-webstudio.com/es"), run(" construimos ambos, y la primera conversación siempre es sobre cuál necesita realmente tu negocio — no cuál preferiríamos vender. Las landing pages empiezan en $400 y los sitios web de negocio completos en $950, ambos rápidos, bilingües y construidos para crecer, con el primer año de mantenimiento incluido. Si estás pesando una página contra varias, "), link("contáctanos para una consulta gratuita", "https://www.dr-webstudio.com/es/contacto"), run(" y mapeamos tus servicios contra lo que tus clientes realmente están buscando, y luego te decimos honestamente cuál formato gana.")]),
      ],
    },
    seo: {
      metaTitle: loc(
        "One-Page vs. Multi-Page Websites (2026 Guide)",
        "Una Página vs. Varias Páginas (Guía 2026)",
      ),
      ogTitle: loc(
        "One-Page vs. Multi-Page: Which Do You Need?",
        "Una Página vs. Varias Páginas: ¿Cuál Necesitas?",
      ),
      ogDescription: loc(
        "A one-page site can rank for one thing. A multi-page site can rank for fifty. The real decision is about SEO reach, not budget — here is how to tell which you need.",
        "Un sitio de una página posiciona para una cosa. Uno de varias, para cincuenta. La decisión real es de alcance SEO, no de presupuesto — así sabes cuál necesitas.",
      ),
      keywords: {
        en: ["one page website vs multi page", "single page website", "how many pages website needs", "landing page vs website", "website structure SEO"],
        es: ["sitio de una página vs varias", "página web de una sola página", "cuántas páginas necesita una web", "landing page vs sitio web", "estructura de sitio web SEO"],
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