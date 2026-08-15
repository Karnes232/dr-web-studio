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
    slug: "websites-schools-language-academies",
    slugEs: "paginas-web-colegios-y-academias-de-idiomas",
    title: loc(
      "Websites for Schools & Language Academies in the DR",
      "Páginas Web para Colegios y Academias de Idiomas en RD",
    ),
    description: loc(
      "Schools and language academies in the DR are chosen by parents researching online, often from abroad. Why transparency, bilingual pages and the enrollment calendar decide it.",
      "Los colegios y academias de idiomas en RD los eligen padres que investigan en línea, muchas veces desde el extranjero. Por qué la transparencia y las páginas bilingües deciden.",
    ),
    readTime: 9,
    featured: false,
    tags: {
      en: ["schools", "education", "language academies", "admissions", "enrollment", "expats", "bilingual", "Dominican Republic"],
      es: ["colegios", "educación", "academias de idiomas", "admisiones", "matrícula", "expatriados", "bilingüe", "República Dominicana"],
    },
    categories: ["business-tips"],
    publishedAt: "2026-08-12T13:00:00.000Z",
    body: {
      en: [
        p("A family is relocating to Santo Domingo in August. In February, one parent is at a kitchen table three thousand kilometers away, doing the single most anxious piece of research the whole move requires: finding a school. They compare curricula, they read about accreditation, they try to work out class sizes, and above all they try to find out what it costs — and they hit a wall, because most Dominican international schools don't publish their fees. Whatever school answers those questions clearly, in the parent's own language, gets the inquiry. That's the entire competitive dynamic of this vertical, and most schools are losing it on their own website."),
        h2("An enrollment decision is made online, months early"),
        p("Schools sometimes think of a website as an information board for current families — a calendar, a uniform list, a newsletter. It's really an admissions tool aimed at families who don't know you yet, and their behavior is specific: the research happens far in advance, it's done by parents comparing three to five schools side by side, and it's driven by anxiety about getting a high-stakes decision right. Nobody enrolls a child impulsively. They read everything, they cross-check, and they eliminate options that feel opaque or unprofessional long before they ever schedule a visit."),
        rich("normal", [run("That research pattern makes this vertical unusually website-dependent. The campus tour is decisive, but the website decides who takes the tour — and a school that never makes the shortlist never gets to make its real case. In a country where "), link("expats overwhelmingly choose private international and bilingual schools for curriculum familiarity and language support", "https://www.expatfocus.com/dominican-republic/guide/dominican-republic-education-and-schools"), run(", and where those families arrive from abroad, the website is the admissions office for everyone not already in town.")]),
        h2("The transparency problem — and the opportunity in it"),
        p("Here's the specific gap worth exploiting. Tuition at Dominican international schools broadly runs from around US$5,000 to US$15,000 a year, with the most prestigious exceeding US$20,000 — but school after school declines to publish any figure, listing fees as \"inquire at school.\" Meanwhile \"how much does school X cost\" is one of the most-searched questions a parent has."),
        rich("normal", [run("Every school withholding this is making the same bet: that vagueness keeps options open and forces a conversation. In practice it does the opposite. The parent comparing five schools from abroad doesn't call all five — they eliminate the opaque ones and investigate the transparent ones. Publishing a clear fee structure, or at minimum an honest range with what's included, is the single highest-conversion change most Dominican schools could make to their website, precisely because competitors won't do it. The same logic applies to everything parents ask and few schools answer plainly: class sizes, the actual daily schedule, the language ratio by grade, uniform and book costs, the bus routes, what the admissions timeline actually looks like month by month.")]),
        h2("Language academies: a different customer, same principle"),
        rich("normal", [run("The vertical splits into two related businesses. Schools serve families making a multi-year commitment. Language academies — Spanish schools for foreigners, English academies for Dominicans, exam-prep centers — serve a faster-moving customer with a shorter decision cycle, and often two very different audiences at once.")]),
        rich("normal", [run("A Spanish academy in Santo Domingo or Sosúa serves tourists and expats searching in English for immersion courses, while an English academy serves Dominican professionals and students searching in Spanish for evening classes and certification. Both need what the schools need — transparency, credibility, easy enquiry — but with faster booking, published course schedules and prices, and the ability to enroll and pay online, using the "), link("local payment tools", "https://www.dr-webstudio.com/en/blog/how-to-accept-online-payments-dominican-republic"), run(" that make an immediate sign-up possible. For an academy serving foreign students, the site is also the reassurance that the school is real, established, and worth flying in for.")]),
        h2("What an education website has to do"),
        rich("normal", [run("•  "), run("Answer the money question. Fees or an honest range, what's included, what's extra. If you genuinely can't publish figures, publish the structure and the process — anything is better than silence on the question every parent has.")]),
        rich("normal", [run("•  "), run("Be genuinely bilingual, both directions. International schools need real English pages for relocating families and real Spanish pages for local ones — "), link("separate indexed pages per language", "https://www.dr-webstudio.com/en/blog/seo-bilingue-posicionarse-ingles-espanol-sin-perjudicar-ninguno"), run(", since a school that can't run a bilingual website is unpersuasive as a bilingual school.")]),
        rich("normal", [run("•  "), run("Make the curriculum and accreditation legible. American, IB, IGCSE, Dominican national, or a combination — parents are comparing exactly this, and vague \"excellence\" language tells them nothing. Name the curriculum, the accreditations, and what it means for university admission later.")]),
        rich("normal", [run("•  "), run("Show the school honestly. Real photographs of real classrooms, labs, sports facilities, and — carefully and with proper consent — school life. This is the emotional half of the decision, and stock imagery reads as concealment.")]),
        rich("normal", [run("•  "), run("Publish the admissions calendar and process. Step by step, with dates, documents required, and deadlines. Relocating families are planning against a moving date and need to know whether they've already missed something.")]),
        rich("normal", [run("•  "), run("Be fast and mobile-first. A parent researching on a phone during a lunch break is the norm, and "), link("speed determines whether they stay", "https://www.dr-webstudio.com/en/blog/core-web-vitals-como-la-velocidad-afecta-tus-ventas-online"), run(".")]),
        rich("normal", [run("•  "), run("Make contact effortless. A clear inquiry form, a real email, a phone number, and "), link("WhatsApp", "https://www.dr-webstudio.com/en/blog/how-to-connect-website-whatsapp-google-maps-instagram"), run(" — which is how Dominican parents will actually reach you.")]),
        h2("The content that wins enrollment"),
        rich("normal", [run("Here's the strategy almost no Dominican school uses, and it maps perfectly onto how parents research. They search practical questions months ahead: how school enrollment works for foreign children, what documents are needed, how the Dominican academic calendar runs, whether a child with no Spanish can cope, how bilingual programs actually work by grade. Answering these thoroughly on your own site does three things at once — it ranks for searches your competitors ignore, it establishes you as the school that understands relocating families, and it reaches parents at the exact moment they're forming a shortlist. It's the same content advantage that works for "), link("professional services serving relocating clients", "https://www.dr-webstudio.com/en/blog/websites-law-firms-accountants-relocation-services"), run(", and it's just as uncontested in education.")]),
        h2("The parents already inside your school"),
        p("Admissions gets all the attention, but a school's website serves a second audience continuously: the families already enrolled. Calendars, schedules, uniform and book lists, payment dates, event announcements, weather closures, forms — a parent looking for any of these on a phone at seven in the morning is a genuine daily use case, and a school that handles it well saves its administrative staff hours of repeated phone calls every week. This matters for admissions too, more than it looks: current families are the single biggest source of referrals in education, and a school that feels organized and communicative to the parents inside it generates exactly the word-of-mouth that fills the next intake. The practical implication is that the site needs a clearly separated space for current families alongside the admissions-facing pages, so neither audience has to wade through content meant for the other."),
        h2("An honest word on privacy and the limits"),
        p("Education carries responsibilities other verticals don't, and the constraints are real. Photographing children requires proper consent and care, which means the visual storytelling has to be handled thoughtfully rather than casually — wide shots, activity over identifiable faces, documented permissions. Claims about outcomes and accreditation must be accurate and current, because parents verify them. And a school's website can't overpromise what the campus delivers; the tour will expose any gap immediately, and in a small market word travels. None of this prevents an excellent site — it means the winning approach is substance, clarity, and honesty rather than marketing gloss. Which, again, is exactly what this particular audience is looking for."),
        h2("Build the admissions tool your school needs"),
        rich("normal", [run("At "), link("DR Web Studio", "https://www.dr-webstudio.com/en"), run(" we build genuinely bilingual, fast, clearly structured websites for schools and academies — with the admissions information parents actually search for, easy enquiry and enrollment, WhatsApp connected, and the first year of maintenance included. If families are discovering your school by word of mouth but your website isn't converting the ones who find it, "), link("contact us for a free consultation", "https://www.dr-webstudio.com/en/contact"), run(" and let's build the one that fills your seats.")]),
      ],
      es: [
        p("Una familia se muda a Santo Domingo en agosto. En febrero, uno de los padres está en la mesa de la cocina a tres mil kilómetros de distancia, haciendo la investigación más angustiante de toda la mudanza: encontrar un colegio. Comparan currículos, leen sobre acreditaciones, tratan de averiguar el tamaño de los grupos, y sobre todo tratan de saber cuánto cuesta — y chocan con un muro, porque la mayoría de los colegios internacionales dominicanos no publica sus cuotas. Cualquier colegio que responda esas preguntas con claridad, en el idioma del padre, se lleva la consulta. Esa es toda la dinámica competitiva de este vertical, y la mayoría de los colegios la está perdiendo en su propia página web."),
        h2("Una decisión de matrícula se toma en línea, con meses de antelación"),
        p("Los colegios a veces piensan en su página web como un tablón de información para las familias actuales — un calendario, una lista de uniformes, un boletín. En realidad es una herramienta de admisiones dirigida a familias que todavía no te conocen, y su comportamiento es específico: la investigación ocurre con mucha antelación, la hacen padres comparando de tres a cinco colegios lado a lado, y la impulsa la ansiedad de acertar en una decisión de alto riesgo. Nadie matricula a un hijo por impulso. Leen todo, contrastan, y eliminan las opciones que se sienten opacas o poco profesionales mucho antes de siquiera agendar una visita."),
        rich("normal", [run("Ese patrón de investigación hace a este vertical inusualmente dependiente de la página web. El recorrido por el campus es decisivo, pero la página web decide quién hace el recorrido — y un colegio que nunca entra en la lista corta nunca llega a presentar su verdadero caso. En un país donde "), link("los expatriados eligen abrumadoramente colegios privados internacionales y bilingües por la familiaridad del currículo y el apoyo lingüístico", "https://www.expatfocus.com/dominican-republic/guide/dominican-republic-education-and-schools"), run(", y donde esas familias llegan del extranjero, la página web es la oficina de admisiones para todos los que no están ya en el país.")]),
        h2("El problema de la transparencia — y la oportunidad que esconde"),
        p("Aquí está la brecha específica que vale la pena aprovechar. La colegiatura en los colegios internacionales dominicanos va aproximadamente de US$5,000 a US$15,000 al año, con los más prestigiosos superando los US$20,000 — pero colegio tras colegio se niega a publicar cifra alguna, listando las cuotas como \"consultar con el colegio.\" Mientras tanto, \"cuánto cuesta el colegio X\" es una de las preguntas más buscadas que tiene un padre."),
        rich("normal", [run("Cada colegio que retiene esta información hace la misma apuesta: que la vaguedad mantiene las opciones abiertas y fuerza una conversación. En la práctica hace lo contrario. El padre que compara cinco colegios desde el extranjero no llama a los cinco — elimina los opacos e investiga los transparentes. Publicar una estructura de cuotas clara, o al menos un rango honesto con lo que incluye, es el cambio de mayor conversión que la mayoría de los colegios dominicanos podría hacerle a su página web, precisamente porque los competidores no lo harán. La misma lógica aplica a todo lo que los padres preguntan y pocos colegios responden claramente: tamaño de los grupos, el horario diario real, la proporción de idiomas por grado, costos de uniformes y libros, las rutas de transporte, y cómo se ve realmente el calendario de admisiones mes por mes.")]),
        h2("Academias de idiomas: cliente distinto, mismo principio"),
        rich("normal", [run("El vertical se divide en dos negocios relacionados. Los colegios sirven a familias que hacen un compromiso de varios años. Las academias de idiomas — escuelas de español para extranjeros, academias de inglés para dominicanos, centros de preparación de exámenes — sirven a un cliente que se mueve más rápido con un ciclo de decisión más corto, y muchas veces a dos audiencias muy distintas a la vez.")]),
        rich("normal", [run("Una academia de español en Santo Domingo o Sosúa sirve a turistas y expatriados buscando en inglés cursos de inmersión, mientras una academia de inglés sirve a profesionales y estudiantes dominicanos buscando en español clases nocturnas y certificaciones. Ambas necesitan lo que necesitan los colegios — transparencia, credibilidad, consulta fácil — pero con reserva más rápida, horarios y precios de cursos publicados, y la capacidad de inscribirse y pagar en línea, usando las "), link("herramientas de pago locales", "https://www.dr-webstudio.com/es/blog/como-aceptar-pagos-en-linea-republica-dominicana"), run(" que hacen posible una inscripción inmediata. Para una academia que sirve a estudiantes extranjeros, el sitio es además la garantía de que la escuela es real, establecida y vale la pena volar hasta allá.")]),
        h2("Qué tiene que hacer una página web educativa"),
        rich("normal", [run("•  "), run("Responder la pregunta del dinero. Cuotas o un rango honesto, qué incluye, qué es extra. Si genuinamente no puedes publicar cifras, publica la estructura y el proceso — cualquier cosa es mejor que el silencio sobre la pregunta que todo padre tiene.")]),
        rich("normal", [run("•  "), run("Ser genuinamente bilingüe, en ambas direcciones. Los colegios internacionales necesitan páginas reales en inglés para familias que se mudan y páginas reales en español para las locales — "), link("páginas separadas e indexadas por idioma", "https://www.dr-webstudio.com/es/blog/seo-bilingue-posicionarse-ingles-espanol-sin-perjudicar-ninguno"), run(", ya que un colegio que no puede manejar una página web bilingüe resulta poco convincente como colegio bilingüe.")]),
        rich("normal", [run("•  "), run("Hacer legibles el currículo y la acreditación. Americano, IB, IGCSE, nacional dominicano, o una combinación — los padres están comparando exactamente esto, y el lenguaje vago de \"excelencia\" no les dice nada. Nombra el currículo, las acreditaciones, y qué significan para la admisión universitaria después.")]),
        rich("normal", [run("•  "), run("Mostrar el colegio con honestidad. Fotografías reales de aulas, laboratorios e instalaciones deportivas reales y — con cuidado y con el consentimiento adecuado — la vida escolar. Esta es la mitad emocional de la decisión, y las imágenes de banco se leen como ocultamiento.")]),
        rich("normal", [run("•  "), run("Publicar el calendario y el proceso de admisiones. Paso a paso, con fechas, documentos requeridos y plazos. Las familias que se mudan planifican contra una fecha de traslado y necesitan saber si ya se les pasó algo.")]),
        rich("normal", [run("•  "), run("Ser rápida y mobile-first. Un padre investigando en el teléfono durante su hora de almuerzo es la norma, y "), link("la velocidad determina si se queda", "https://www.dr-webstudio.com/es/blog/core-web-vitals-como-la-velocidad-afecta-tus-ventas-online"), run(".")]),
        rich("normal", [run("•  "), run("Hacer el contacto sin esfuerzo. Un formulario de consulta claro, un correo real, un teléfono, y "), link("WhatsApp", "https://www.dr-webstudio.com/es/blog/como-conectar-sitio-web-whatsapp-google-maps-instagram"), run(" — que es como los padres dominicanos realmente te van a contactar.")]),
        h2("El contenido que gana matrículas"),
        rich("normal", [run("Aquí está la estrategia que casi ningún colegio dominicano usa, y encaja perfectamente con cómo investigan los padres. Buscan preguntas prácticas con meses de antelación: cómo funciona la matrícula escolar para niños extranjeros, qué documentos se necesitan, cómo corre el calendario académico dominicano, si un niño sin español puede adaptarse, cómo funcionan realmente los programas bilingües por grado. Responder esto a fondo en tu propio sitio hace tres cosas a la vez — posiciona para búsquedas que tus competidores ignoran, te establece como el colegio que entiende a las familias que se mudan, y alcanza a los padres en el momento exacto en que están armando una lista corta. Es la misma ventaja de contenido que funciona para los "), link("servicios profesionales que atienden clientes que se mudan", "https://www.dr-webstudio.com/es/blog/paginas-web-firmas-legales-contables-y-reubicacion"), run(", e igual de poco disputada en educación.")]),
        h2("Los padres que ya están dentro de tu colegio"),
        p("Las admisiones se llevan toda la atención, pero la página web de un colegio sirve continuamente a una segunda audiencia: las familias ya matriculadas. Calendarios, horarios, listas de uniformes y libros, fechas de pago, anuncios de eventos, cierres por clima, formularios — un padre buscando cualquiera de estos en el teléfono a las siete de la mañana es un caso de uso diario genuino, y un colegio que lo maneja bien le ahorra a su personal administrativo horas de llamadas repetidas cada semana. Esto importa para las admisiones también, más de lo que parece: las familias actuales son la fuente individual más grande de referidos en educación, y un colegio que se siente organizado y comunicativo para los padres de adentro genera exactamente el boca a boca que llena la siguiente promoción. La implicación práctica es que el sitio necesita un espacio claramente separado para las familias actuales junto a las páginas dirigidas a admisiones, para que ninguna audiencia tenga que abrirse paso entre contenido pensado para la otra."),
        h2("Una palabra honesta sobre la privacidad y los límites"),
        p("La educación carga responsabilidades que otros verticales no tienen, y las restricciones son reales. Fotografiar niños requiere consentimiento y cuidado adecuados, lo que significa que la narrativa visual debe manejarse con reflexión en vez de casualmente — tomas amplias, actividad por encima de rostros identificables, permisos documentados. Las afirmaciones sobre resultados y acreditaciones deben ser precisas y vigentes, porque los padres las verifican. Y la página web de un colegio no puede prometer más de lo que el campus entrega; el recorrido expondrá cualquier brecha de inmediato, y en un mercado pequeño la voz corre. Nada de esto impide un sitio excelente — significa que el enfoque ganador es sustancia, claridad y honestidad en vez de brillo de marketing. Que, de nuevo, es exactamente lo que esta audiencia particular está buscando."),
        h2("Construye la herramienta de admisiones que tu colegio necesita"),
        rich("normal", [run("En "), link("DR Web Studio", "https://www.dr-webstudio.com/es"), run(" construimos páginas web genuinamente bilingües, rápidas y claramente estructuradas para colegios y academias — con la información de admisiones que los padres realmente buscan, consulta e inscripción fáciles, WhatsApp conectado, y el primer año de mantenimiento incluido. Si las familias están descubriendo tu colegio de boca en boca pero tu página web no está convirtiendo a las que la encuentran, "), link("contáctanos para una consulta gratuita", "https://www.dr-webstudio.com/es/contacto"), run(" y construyamos la que llene tus cupos.")]),
      ],
    },
    seo: {
      metaTitle: loc(
        "School & Academy Websites in the DR (2026)",
        "Webs para Colegios y Academias en RD (2026)",
      ),
      ogTitle: loc(
        "Websites for Schools & Language Academies",
        "Páginas Web para Colegios y Academias de Idiomas",
      ),
      ogDescription: loc(
        "Most DR international schools do not publish their fees — and every relocating parent searches for exactly that. The school that answers wins the inquiry.",
        "La mayoría de los colegios internacionales de RD no publica sus cuotas — y cada padre que se muda busca exactamente eso. El colegio que responde gana la consulta.",
      ),
      keywords: {
        en: ["school website Dominican Republic", "international school Santo Domingo", "language academy website", "school admissions website", "bilingual school DR"],
        es: ["página web colegio República Dominicana", "colegio internacional Santo Domingo", "página web academia de idiomas", "página web admisiones colegio", "colegio bilingüe RD"],
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