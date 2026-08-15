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
    slug: "what-is-hreflang-bilingual-dominican-websites",
    slugEs: "que-es-hreflang-sitios-dominicanos-bilingues",
    title: loc(
      "What Is Hreflang, and Why Bilingual Dominican Sites Need It",
      "Qué Es Hreflang y Por Qué lo Necesitan los Sitios Dominicanos Bilingües",
    ),
    description: loc(
      "What is hreflang? The tag that tells Google which language version of your page to show which visitor — and why bilingual Dominican sites break without it.",
      "¿Qué es hreflang? La etiqueta que le dice a Google qué versión de idioma mostrar a cada visitante — y por qué los sitios dominicanos bilingües fallan sin ella.",
    ),
    readTime: 8,
    featured: false,
    tags: {
      en: ["hreflang", "bilingual SEO", "technical SEO", "Google", "languages", "Dominican Republic"],
      es: ["hreflang", "SEO bilingüe", "SEO técnico", "Google", "idiomas", "República Dominicana"],
    },
    categories: ["business-tips"],
    publishedAt: "2026-08-12T14:00:00.000Z",
    body: {
      en: [
        p("You did the right thing. You built your Dominican business website in both Spanish and English, wrote real content for each, and expected to reach both markets. Then the odd results started: American tourists finding your Spanish page, your English page appearing for Spanish searches, or one language version simply vanishing from Google while the other ranks. The site isn't broken and the translations aren't the problem. What's missing is a small technical signal called hreflang — the tag that tells search engines which version of a page belongs to which audience. It's invisible, it takes minutes to implement correctly, and on a bilingual Dominican website it's the difference between two markets working and two versions fighting each other."),
        h2("What hreflang actually does"),
        p("When you publish the same page in two languages, you create a genuine problem for a search engine: two URLs, similar content, and no obvious way to know they're intentional counterparts rather than duplicates — or which one to show a given searcher. Hreflang solves exactly that. It's an annotation on each page that says, in effect, \"this is the Spanish version, here is the English version, and here's who each is for.\""),
        rich("normal", [run("Google's own documentation is direct about the purpose: "), link("use hreflang to tell Google about localized versions of your page, so it can serve the correct language or regional URL in search results", "https://developers.google.com/search/docs/specialty/international/localized-versions"), run(". Two consequences follow. First, Google knows your two pages are a set, not competing duplicates, so they stop diluting each other. Second, Google can match the right version to the right person — a searcher in the United States gets your English page, a searcher in Santo Domingo gets your Spanish one, automatically.")]),
        h2("Why this matters more in the DR than almost anywhere"),
        p("Plenty of businesses worldwide never need hreflang because they operate in one language. A Dominican tourism, hospitality, real estate, or professional services business is the opposite case — serving Dominican customers in Spanish and North American and European visitors in English is not an edge case here, it's the whole business model. That means the bilingual setup isn't a bonus feature; it's core infrastructure, and getting it wrong has a specific, measurable cost."),
        p("Without hreflang, the failure modes are predictable. Your two versions compete for the same searches and both rank worse than either would alone. Google picks one version as canonical and effectively hides the other, so half your market can't find you. Visitors land on the wrong-language page and leave immediately, which sends Google a signal that your page didn't satisfy the search — compounding the problem. None of these look like technical failures from the outside. They look like \"our English pages just don't get traffic,\" which is why so many Dominican businesses never diagnose it."),
        h2("How it works, in plain terms"),
        p("Every page in the set points to every other page in the set, including itself. If you have a Spanish page and an English page for your tours, each of them carries a small list saying: \"the Spanish version is at this address, the English version is at that address.\" The tags live in the page's code where visitors never see them, and they're generated automatically by a properly built site rather than hand-written page by page."),
        rich("normal", [run("Two rules matter. The references must be reciprocal — if the Spanish page points to the English one, the English one must point back, or Google ignores the whole set. And each page must include a reference to itself, which surprises people but is part of the specification. This is precisely the kind of detail that gets fumbled in manual implementations and handled correctly by a framework that generates it from your content structure.")]),
        p("You'll also see language codes with regions attached — `es` for Spanish generally, `en` for English generally, or something like `es-do` to target Spanish speakers specifically in the Dominican Republic. For most Dominican businesses serving both a local Spanish audience and an international English one, plain language codes are the right choice; regional targeting only helps when you genuinely have different content for different countries."),
        h2("The mistakes that break it"),
        p("In practice, hreflang fails for a handful of recurring reasons, all avoidable:"),
        rich("normal", [run("•  "), run("Missing return links. The most common failure. One page references the other but not vice versa, and Google discards the relationship entirely.")]),
        rich("normal", [run("•  "), run("Pointing at the wrong URLs. References to pages that redirect, 404, or are blocked from indexing invalidate the set. If a page can't be indexed, it can't be an hreflang target.")]),
        rich("normal", [run("•  "), run("Fighting with canonical tags. If a page's canonical tag points to the other language version, you're telling Google two contradictory things — that these are separate versions and that one is the master copy of the other. The canonical on each page should point to itself.")]),
        rich("normal", [run("•  "), run("Translate widgets instead of real pages. This is the big one in the Dominican market. A browser-side translation button doesn't create a second URL, so there's nothing for hreflang to reference and nothing for Google to index — which is exactly why "), link("genuine bilingual SEO requires separate real pages per language", "https://www.dr-webstudio.com/en/blog/seo-bilingue-posicionarse-ingles-espanol-sin-perjudicar-ninguno"), run(" rather than a plugin.")]),
        rich("normal", [run("•  "), run("Wrong or invented codes. Using a country code where a language code belongs, or inventing combinations, silently invalidates the tag.")]),
        h2("How to check your own site"),
        rich("normal", [run("You don't need to read code to get a rough answer. Search Google for `site:yourdomain.com` and see whether both language versions appear at all — if only one does, that's a strong signal something is wrong. Then search a distinctive phrase from your English page and see whether the English URL comes back rather than the Spanish one. For a proper diagnosis, Google Search Console reports international targeting issues directly, including missing return links, and it's free. If your English pages exist but get essentially no impressions while the Spanish ones perform, hreflang is one of the first things to examine — alongside the more basic possibility that "), link("something is blocking indexing entirely", "https://www.dr-webstudio.com/en/blog/que-es-robots-txt-esta-bloqueando-google-sitio-web-dominicano"), run(".")]),
        h2("What hreflang is not"),
        rich("normal", [run("Three quick clarifications, because the tag attracts more confusion than almost any other technical topic. First, hreflang is not translation — it tells Google that translated versions exist and how they relate, but it does nothing to create or improve them. A badly machine-translated English page correctly tagged with hreflang is still a badly translated page that will lose the visitor in seconds. Second, it is not a redirect — it doesn't send anyone anywhere. A visitor arriving on the wrong-language version stays there unless your site offers them a clear way to switch, which is why a visible, obvious language toggle remains necessary regardless of your tags. Third, it is not only about countries — plenty of businesses assume hreflang is for targeting different nations, when for most Dominican companies the useful distinction is purely linguistic: Spanish speakers and English speakers, wherever they happen to be sitting. Getting these three straight prevents the most common wasted effort, which is implementing regional targeting nobody needed while the actual language relationship stays broken.")]),
        h2("An honest word on how much to worry"),
        rich("normal", [run("Perspective matters here, because it's easy to over-focus on one tag. Hreflang is not a ranking boost — it won't lift you up the results, and adding it to a slow, thin, or poorly structured site changes very little. It's a disambiguation signal: it makes sure the ranking you've already earned goes to the right page for the right person, and stops your own versions from undermining each other. So the honest order of priority is: build genuinely good content in both languages, make the site fast, get the structure right — then make sure hreflang is correct so all of that reaches the audience it was written for. It's plumbing, not marketing. But when the plumbing is wrong, everything downstream leaks.")]),
        h2("Get the bilingual foundation right"),
        rich("normal", [run("At "), link("DR Web Studio", "https://www.dr-webstudio.com/en"), run(" every bilingual site we build generates hreflang automatically from the content structure — reciprocal, self-referencing, and consistent with canonicals, so your Spanish and English pages reinforce each other instead of competing. If you already have a bilingual site and one language is quietly invisible, "), link("contact us for a free consultation", "https://www.dr-webstudio.com/en/contact"), run(" — we'll check the tags, the indexing, and the structure, and tell you exactly what's happening.")]),
      ],
      es: [
        p("Hiciste lo correcto. Construiste la página web de tu negocio dominicano en español e inglés, escribiste contenido real para cada idioma, y esperabas alcanzar ambos mercados. Luego empezaron los resultados extraños: turistas estadounidenses encontrando tu página en español, tu página en inglés apareciendo para búsquedas en español, o una versión de idioma simplemente desapareciendo de Google mientras la otra posiciona. El sitio no está roto y las traducciones no son el problema. Lo que falta es una pequeña señal técnica llamada hreflang — la etiqueta que le dice a los buscadores qué versión de una página le corresponde a qué audiencia. Es invisible, toma minutos implementarla correctamente, y en una página web dominicana bilingüe es la diferencia entre dos mercados funcionando y dos versiones peleándose entre sí."),
        h2("Qué hace realmente hreflang"),
        p("Cuando publicas la misma página en dos idiomas, creas un problema genuino para un buscador: dos URLs, contenido similar, y ninguna forma obvia de saber que son contrapartes intencionales en vez de duplicados — ni cuál mostrarle a un buscador determinado. Hreflang resuelve exactamente eso. Es una anotación en cada página que dice, en efecto: \"esta es la versión en español, aquí está la versión en inglés, y este es el público de cada una.\""),
        rich("normal", [run("La propia documentación de Google es directa sobre el propósito: "), link("usa hreflang para informarle a Google sobre las versiones localizadas de tu página, para que pueda servir la URL del idioma o región correcta en los resultados de búsqueda", "https://developers.google.com/search/docs/specialty/international/localized-versions"), run(". Siguen dos consecuencias. Primera, Google sabe que tus dos páginas son un conjunto, no duplicados compitiendo, así que dejan de diluirse mutuamente. Segunda, Google puede emparejar la versión correcta con la persona correcta — alguien que busca desde Estados Unidos recibe tu página en inglés, alguien en Santo Domingo recibe la de español, automáticamente.")]),
        h2("Por qué esto importa más en RD que en casi cualquier lugar"),
        p("Muchísimos negocios en el mundo nunca necesitan hreflang porque operan en un solo idioma. Un negocio dominicano de turismo, hospitalidad, bienes raíces o servicios profesionales es el caso opuesto — atender a clientes dominicanos en español y a visitantes norteamericanos y europeos en inglés no es un caso raro aquí, es todo el modelo de negocio. Eso significa que la configuración bilingüe no es una función adicional; es infraestructura central, y hacerla mal tiene un costo específico y medible."),
        p("Sin hreflang, los modos de falla son predecibles. Tus dos versiones compiten por las mismas búsquedas y ambas posicionan peor de lo que cualquiera lo haría sola. Google elige una versión como canónica y efectivamente esconde la otra, así que la mitad de tu mercado no puede encontrarte. Los visitantes aterrizan en la página del idioma equivocado y se van de inmediato, lo que le envía a Google la señal de que tu página no satisfizo la búsqueda — agravando el problema. Ninguno de estos se ve como una falla técnica desde afuera. Se ven como \"nuestras páginas en inglés simplemente no reciben tráfico,\" que es por lo que tantos negocios dominicanos nunca lo diagnostican."),
        h2("Cómo funciona, en términos simples"),
        p("Cada página del conjunto apunta a todas las demás del conjunto, incluida ella misma. Si tienes una página en español y una en inglés para tus tours, cada una lleva una pequeña lista que dice: \"la versión en español está en esta dirección, la versión en inglés está en aquella dirección.\" Las etiquetas viven en el código de la página donde los visitantes nunca las ven, y las genera automáticamente un sitio bien construido en vez de escribirse a mano página por página."),
        rich("normal", [run("Dos reglas importan. Las referencias deben ser recíprocas — si la página en español apunta a la de inglés, la de inglés debe apuntar de vuelta, o Google ignora el conjunto entero. Y cada página debe incluir una referencia a sí misma, lo que sorprende a la gente pero es parte de la especificación. Este es precisamente el tipo de detalle que se estropea en implementaciones manuales y se maneja correctamente con un framework que lo genera desde tu estructura de contenido.")]),
        p("También verás códigos de idioma con regiones adjuntas — `es` para español en general, `en` para inglés en general, o algo como `es-do` para apuntar a hispanohablantes específicamente en República Dominicana. Para la mayoría de los negocios dominicanos que sirven tanto a una audiencia local en español como a una internacional en inglés, los códigos de idioma simples son la elección correcta; la segmentación regional solo ayuda cuando genuinamente tienes contenido distinto para países distintos."),
        h2("Los errores que lo rompen"),
        p("En la práctica, hreflang falla por un puñado de razones recurrentes, todas evitables:"),
        rich("normal", [run("•  "), run("Enlaces de retorno faltantes. La falla más común. Una página referencia a la otra pero no al revés, y Google descarta la relación por completo.")]),
        rich("normal", [run("•  "), run("Apuntar a URLs equivocadas. Referencias a páginas que redirigen, dan 404 o están bloqueadas de la indexación invalidan el conjunto. Si una página no puede indexarse, no puede ser un destino de hreflang.")]),
        rich("normal", [run("•  "), run("Pelear con las etiquetas canónicas. Si la etiqueta canónica de una página apunta a la versión en el otro idioma, le estás diciendo a Google dos cosas contradictorias — que son versiones separadas y que una es la copia maestra de la otra. La canónica de cada página debe apuntar a sí misma.")]),
        rich("normal", [run("•  "), run("Widgets de traducción en vez de páginas reales. Este es el grande en el mercado dominicano. Un botón de traducción del lado del navegador no crea una segunda URL, así que no hay nada que hreflang referencie ni nada que Google indexe — que es exactamente por qué el "), link("SEO bilingüe genuino requiere páginas reales separadas por idioma", "https://www.dr-webstudio.com/es/blog/seo-bilingue-posicionarse-ingles-espanol-sin-perjudicar-ninguno"), run(" en vez de un plugin.")]),
        rich("normal", [run("•  "), run("Códigos equivocados o inventados. Usar un código de país donde va un código de idioma, o inventar combinaciones, invalida la etiqueta en silencio.")]),
        h2("Cómo revisar tu propio sitio"),
        rich("normal", [run("No necesitas leer código para obtener una respuesta aproximada. Busca en Google `site:tudominio.com` y mira si ambas versiones de idioma aparecen siquiera — si solo aparece una, esa es una señal fuerte de que algo anda mal. Luego busca una frase distintiva de tu página en inglés y mira si regresa la URL en inglés en vez de la de español. Para un diagnóstico adecuado, Google Search Console reporta los problemas de segmentación internacional directamente, incluidos los enlaces de retorno faltantes, y es gratis. Si tus páginas en inglés existen pero no reciben prácticamente impresiones mientras las de español rinden, hreflang es de lo primero que hay que examinar — junto a la posibilidad más básica de que "), link("algo esté bloqueando la indexación por completo", "https://www.dr-webstudio.com/es/blog/que-es-robots-txt-esta-bloqueando-google-sitio-web-dominicano"), run(".")]),
        h2("Qué no es hreflang"),
        rich("normal", [run("Tres aclaraciones rápidas, porque la etiqueta atrae más confusión que casi cualquier otro tema técnico. Primera, hreflang no es traducción — le dice a Google que existen versiones traducidas y cómo se relacionan, pero no hace nada por crearlas ni mejorarlas. Una página en inglés mal traducida por máquina y correctamente etiquetada con hreflang sigue siendo una página mal traducida que perderá al visitante en segundos. Segunda, no es una redirección — no manda a nadie a ningún lado. Un visitante que aterriza en la versión del idioma equivocado se queda ahí a menos que tu sitio le ofrezca una forma clara de cambiar, y por eso un selector de idioma visible y obvio sigue siendo necesario sin importar tus etiquetas. Tercera, no se trata solo de países — muchos negocios asumen que hreflang es para apuntar a naciones distintas, cuando para la mayoría de las empresas dominicanas la distinción útil es puramente lingüística: hispanohablantes y angloparlantes, dondequiera que estén sentados. Tener claras estas tres cosas evita el esfuerzo desperdiciado más común, que es implementar segmentación regional que nadie necesitaba mientras la relación de idiomas real sigue rota.")]),
        h2("Una palabra honesta sobre cuánto preocuparse"),
        rich("normal", [run("La perspectiva importa aquí, porque es fácil obsesionarse con una sola etiqueta. Hreflang no es un impulso de posicionamiento — no te va a subir en los resultados, y agregarlo a un sitio lento, pobre o mal estructurado cambia muy poco. Es una señal de desambiguación: se asegura de que el posicionamiento que ya ganaste llegue a la página correcta para la persona correcta, y evita que tus propias versiones se saboteen entre sí. Así que el orden honesto de prioridad es: construye contenido genuinamente bueno en ambos idiomas, haz el sitio rápido, acierta la estructura — y luego asegúrate de que hreflang esté correcto para que todo eso alcance a la audiencia para la que se escribió. Es plomería, no marketing. Pero cuando la plomería está mal, todo lo que va después gotea.")]),
        h2("Acierta la base bilingüe"),
        rich("normal", [run("En "), link("DR Web Studio", "https://www.dr-webstudio.com/es"), run(" cada sitio bilingüe que construimos genera hreflang automáticamente desde la estructura del contenido — recíproco, auto-referenciado y consistente con las canónicas, para que tus páginas en español e inglés se refuercen en vez de competir. Si ya tienes un sitio bilingüe y un idioma está silenciosamente invisible, "), link("contáctanos para una consulta gratuita", "https://www.dr-webstudio.com/es/contacto"), run(" — revisamos las etiquetas, la indexación y la estructura, y te decimos exactamente qué está pasando.")]),
      ],
    },
    seo: {
      metaTitle: loc(
        "What Is Hreflang? Bilingual SEO Explained (2026)",
        "¿Qué Es Hreflang? SEO Bilingüe Explicado (2026)",
      ),
      ogTitle: loc(
        "What Is Hreflang, and Why Bilingual Sites Need It",
        "Qué Es Hreflang y Por Qué lo Necesitan los Sitios Bilingües",
      ),
      ogDescription: loc(
        "Without hreflang, your Spanish and English pages compete with each other and Google shows the wrong one. The plain-language guide for bilingual Dominican websites.",
        "Sin hreflang, tus páginas en español e inglés compiten entre sí y Google muestra la equivocada. La guía en lenguaje simple para sitios dominicanos bilingües.",
      ),
      keywords: {
        en: ["what is hreflang", "hreflang tags", "bilingual website SEO", "hreflang implementation", "spanish english website google"],
        es: ["qué es hreflang", "etiquetas hreflang", "SEO sitio bilingüe", "implementar hreflang", "sitio español inglés google"],
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