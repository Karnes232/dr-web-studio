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
    slug: "ai-search-chatgpt-gemini-how-your-business-shows-up",
    slugEs: "busqueda-con-ia-chatgpt-gemini-como-aparece-tu-negocio",
    title: loc(
      "AI Search: How Your Business Shows Up in ChatGPT, Gemini & AI Overviews",
      "Búsqueda con IA: Cómo Aparece Tu Negocio en ChatGPT, Gemini y AI Overviews",
    ),
    description: loc(
      "AI search is here: ChatGPT, Gemini, and AI Overviews now answer your customers directly. How a Dominican business shows up in AI answers — and why the fundamentals still win.",
      "La búsqueda con IA llegó: ChatGPT, Gemini y AI Overviews ahora responden a tus clientes directamente. Cómo aparece un negocio dominicano en las respuestas de IA.",
    ),
    readTime: 9,
    featured: false,
    tags: {
      en: ["AI search", "ChatGPT", "Gemini", "AI Overviews", "GEO", "SEO", "Dominican Republic"],
      es: ["búsqueda con IA", "ChatGPT", "Gemini", "AI Overviews", "GEO", "SEO", "República Dominicana"],
    },
    categories: ["business-tips"],
    publishedAt: "2026-07-28T14:00:00.000Z",
    body: {
      en: [
        p("Something fundamental is changing in how your customers find businesses. Instead of typing into Google and scanning ten blue links, a growing share of people now ask an AI directly — ChatGPT, Gemini, Google's AI Overviews at the top of the results page — and get one synthesized answer, with a handful of businesses named in it. If your business is one of the names, you win a customer who arrives already convinced. If it isn't, you were never in the running and never knew the question was asked. This isn't a future to prepare for; it's the present to show up in. Here's what AI search means for a Dominican business, and how to become the kind of business AI answers recommend."),
        h2("What actually changed"),
        rich("normal", [run("For twenty years, search meant a ranked list: you fought for position, the user clicked, and your website made the case. AI search compresses that journey. The user asks a full question in plain language — \"what's the best tour operator for Saona Island?\", \"recommend a dentist in Santiago that takes foreign patients\" — and the AI reads across many sources, forms an answer, and cites or names a few businesses. Two consequences follow. First, fewer clicks overall: many users take the answer and never visit anyone's site. Second — and this is the part that should get your attention — the visitors who do click through arrive far more committed, because the AI already did their comparison shopping. Industry data bears this out: "), link("AI search referrals convert at roughly four to nine times the rate of traditional search traffic for service businesses, and the majority of citations in Google's AI Overviews come from pages that aren't even in the organic top ten", "https://seosherpa.com/ai-search-statistics/"), run(". Fewer visits, better visits — and a door that's open to businesses that never won the old ranking war.")]),
        h2("The good news hiding in this"),
        rich("normal", [run("That last statistic deserves a second look, because it's the strategic heart of the matter: most of the sources AI answers cite are not the pages sitting at #1 on Google. AI systems select for something slightly different than the old algorithm — clear, well-structured, genuinely informative content from credibly presented businesses — and that reshuffles the deck. A Dominican tour operator, clinic, or hotel that could never outrank TripAdvisor for a broad keyword can absolutely be the business an AI names when someone asks a specific, high-intent question, if its website actually contains the clear answers the AI is looking for. The old game had entrenched winners. The new one is still being decided — which is precisely why now is the moment to position for it.")]),
        h2("How AI systems choose who to mention"),
        rich("normal", [run("Nobody outside these companies knows the algorithms exactly, but the pattern across platforms is consistent and, honestly, refreshingly fair: AI systems recommend businesses they can understand and trust. Understanding comes from your website — clear statements of what you do, where you are, who you serve, what you charge, written in real sentences a machine can extract (\"We run daily catamaran tours to Saona Island from Bayahíbe, with hotel pickup across Punta Cana\"). Trust comes from the wider web agreeing with you — consistent information across your site and Google Business Profile, real reviews, mentions from other credible sites. And technical accessibility ties it together: a fast, crawlable, properly structured site that machines can read without struggle. Notice what this list is: it's good SEO, honestly executed. AI search doesn't replace the fundamentals — it rewards them harder, because an AI composing one answer is far pickier about its sources than an algorithm assembling ten links.")]),
        h2("What to actually do — the practical checklist"),
        p("Concretely, for a Dominican business that wants to show up in AI answers:"),
        rich("normal", [run("•  "), run("Answer real questions in plain language. Write pages that directly answer what customers actually ask — \"how much does a Saona tour cost?\", \"do you accept walk-ins?\", \"is the clinic English-speaking?\" — with the answer stated clearly in the first sentences, not buried in marketing prose. Question-shaped headings with direct answers underneath are exactly the format AI systems extract.")]),
        rich("normal", [run("•  "), run("Say plainly what you are. Every important page should state, in extractable sentences, what the business does, where, and for whom. Vague slogans (\"experiences beyond imagination\") are invisible to a machine deciding whether you're a tour operator in Bayahíbe.")]),
        rich("normal", [run("•  "), run("Mark it up with structured data. Schema markup — the machine-readable labels for your business type, location, hours, services, reviews, and FAQs — is how you speak the machines' native language, exactly as we describe in "), link("structured data for Dominican businesses", "https://www.dr-webstudio.com/en/blog/datos-estructurados-negocios-dominicanos-resultados-enriquecidos-google"), run(".")]),
        rich("normal", [run("•  "), run("Keep your Google Business Profile immaculate. Gemini in particular leans on Google's ecosystem, and every platform cross-checks basic facts. Your profile, "), link("connected properly to your site", "https://www.dr-webstudio.com/en/blog/por-que-negocio-punta-cana-no-aparece-google-maps-como-solucionarlo"), run(", needs to agree with your website on name, location, hours, and services.")]),
        rich("normal", [run("•  "), run("Do it in both languages. AI answers are composed in the language of the question. A tourist asking ChatGPT in English gets sources that answer in English; the same for Spanish. "), link("Real bilingual pages", "https://www.dr-webstudio.com/en/blog/seo-bilingue-posicionarse-ingles-espanol-sin-perjudicar-ninguno"), run(" — not a translate widget — mean you exist in both conversations.")]),
        rich("normal", [run("•  "), run("Stay technically clean and current. Fast, crawlable, no accidental blocks, and content that's actually up to date — AI systems favor fresh, accurate sources, and there are emerging conventions for signaling to them, as we covered in "), link("what llms.txt is and whether you need it", "https://www.dr-webstudio.com/en/blog/what-is-llms-txt-and-do-you-need-it"), run(".")]),
        h2("How to see where you stand today"),
        rich("normal", [run("Before optimizing anything, run the five-minute audit any business owner can do right now. Open ChatGPT or Gemini and ask, as a customer would: \"recommend a [your type of business] in [your town]\" — in English and in Spanish. Then ask directly: \"what do you know about [your business name]?\" The results are instantly diagnostic. If the AI recommends competitors and has never heard of you, you've found the gap. If it knows you but describes you wrongly — old address, wrong services, outdated prices — you've found stale or inconsistent information across the web that needs correcting. If it describes you accurately and even recommends you, you're ahead; note which sources it seems to draw on and keep them strong. Repeat quarterly, because these systems update continuously. This little exercise does something valuable beyond the diagnosis: it shows you exactly what your potential customers are being told about you, in a channel you may never have looked at — and for most Dominican business owners who try it, that first look is the moment this topic stops being abstract.")]),
        h2("What not to do"),
        rich("normal", [run("A quick word of caution, because a cottage industry of \"GEO hacks\" is already selling snake oil. Don't stuff pages with robotic question-and-answer spam, don't fabricate reviews, and don't chase tricks that promise to \"rank in ChatGPT\" — the platforms adjust constantly, and manipulation that works this month is filtered next month, sometimes with your credibility as the casualty. The durable strategy is unglamorous: be genuinely clear, genuinely useful, and genuinely consistent everywhere your business appears online. That's the one approach that gets more effective as AI systems get smarter, because their entire trajectory is getting better at telling the real thing from the performance of it.")]),
        h2("An honest word on how much this matters right now"),
        rich("normal", [run("Perspective, honestly held: traditional Google search still delivers the large majority of visits today, and for a Dominican business the fundamentals — ranking well, a fast bilingual site, a complete Business Profile, reviews — remain the main event. AI search is the fastest-growing slice, not yet the biggest one. But here's why acting early matters anyway: everything on the checklist above is the fundamentals, executed with more clarity and structure. There's no trade-off between optimizing for Google and optimizing for AI — the same well-built site wins both, today's traffic and tomorrow's answers. The businesses that treat this as a reason to finally do their web presence properly will own the AI answers in their niche before their competitors have heard the acronyms.")]),
        h2("Build a site both humans and AI recommend"),
        rich("normal", [run("At "), link("DR Web Studio", "https://www.dr-webstudio.com/en"), run(" this is how we build by default: fast, bilingual sites with clean structure, real answers on real pages, full structured data, and the technical hygiene that makes a business legible to Google's crawler and ChatGPT alike — with the first year of maintenance included so it stays that way. If you want to know whether an AI would recommend your business today — and what it would say — "), link("contact us for a free consultation", "https://www.dr-webstudio.com/en/contact"), run("; we'll check, show you, and build you into the answer.")]),
      ],
      es: [
        p("Algo fundamental está cambiando en cómo tus clientes encuentran negocios. En vez de escribir en Google y escanear diez enlaces azules, una porción creciente de la gente ahora le pregunta a una IA directamente — ChatGPT, Gemini, los AI Overviews de Google en la cima de la página de resultados — y recibe una sola respuesta sintetizada, con un puñado de negocios nombrados en ella. Si tu negocio es uno de los nombres, ganas un cliente que llega ya convencido. Si no lo es, nunca estuviste en la carrera y nunca supiste que la pregunta se hizo. Esto no es un futuro para el cual prepararse; es el presente en el cual aparecer. Aquí está lo que la búsqueda con IA significa para un negocio dominicano, y cómo convertirte en el tipo de negocio que las respuestas de IA recomiendan."),
        h2("Qué cambió realmente"),
        rich("normal", [run("Durante veinte años, buscar significó una lista ordenada: peleabas por posición, el usuario hacía clic, y tu página web presentaba el caso. La búsqueda con IA comprime ese recorrido. El usuario hace una pregunta completa en lenguaje natural — \"¿cuál es el mejor operador de tours para Isla Saona?\", \"recomiéndame un dentista en Santiago que atienda pacientes extranjeros\" — y la IA lee a través de muchas fuentes, forma una respuesta, y cita o nombra unos pocos negocios. Siguen dos consecuencias. Primera, menos clics en general: muchos usuarios toman la respuesta y nunca visitan el sitio de nadie. Segunda — y esta es la parte que debería captar tu atención — los visitantes que sí hacen clic llegan mucho más comprometidos, porque la IA ya hizo su comparación por ellos. Los datos de la industria lo confirman: "), link("las referencias de búsqueda con IA convierten a un ritmo de aproximadamente cuatro a nueve veces el del tráfico de búsqueda tradicional para negocios de servicios, y la mayoría de las citas en los AI Overviews de Google provienen de páginas que ni siquiera están en el top diez orgánico", "https://seosherpa.com/ai-search-statistics/"), run(". Menos visitas, mejores visitas — y una puerta abierta para negocios que nunca ganaron la vieja guerra del ranking.")]),
        h2("La buena noticia escondida en esto"),
        rich("normal", [run("Esa última estadística merece una segunda mirada, porque es el corazón estratégico del asunto: la mayoría de las fuentes que las respuestas de IA citan no son las páginas sentadas en el #1 de Google. Los sistemas de IA seleccionan por algo ligeramente distinto que el viejo algoritmo — contenido claro, bien estructurado y genuinamente informativo de negocios presentados con credibilidad — y eso rebaraja el mazo. Un operador de tours, una clínica o un hotel dominicano que nunca pudo superar a TripAdvisor por una palabra clave amplia puede absolutamente ser el negocio que una IA nombra cuando alguien hace una pregunta específica y de alta intención, si su página web realmente contiene las respuestas claras que la IA está buscando. El juego viejo tenía ganadores atrincherados. El nuevo todavía se está decidiendo — que es precisamente por qué ahora es el momento de posicionarse para él.")]),
        h2("Cómo los sistemas de IA eligen a quién mencionar"),
        rich("normal", [run("Nadie fuera de estas empresas conoce los algoritmos exactamente, pero el patrón entre plataformas es consistente y, honestamente, refrescantemente justo: los sistemas de IA recomiendan negocios que pueden entender y en los que pueden confiar. El entendimiento viene de tu página web — declaraciones claras de qué haces, dónde estás, a quién sirves, qué cobras, escritas en oraciones reales que una máquina puede extraer (\"Operamos tours diarios en catamarán a Isla Saona desde Bayahíbe, con recogida en hoteles de todo Punta Cana\"). La confianza viene de que la web más amplia esté de acuerdo contigo — información consistente entre tu sitio y tu Perfil de Negocio de Google, reseñas reales, menciones de otros sitios creíbles. Y la accesibilidad técnica lo amarra todo: un sitio rápido, rastreable y bien estructurado que las máquinas puedan leer sin esfuerzo. Nota qué es esta lista: es buen SEO, ejecutado honestamente. La búsqueda con IA no reemplaza los fundamentos — los premia con más fuerza, porque una IA componiendo una sola respuesta es mucho más exigente con sus fuentes que un algoritmo ensamblando diez enlaces.")]),
        h2("Qué hacer realmente — el checklist práctico"),
        p("En concreto, para un negocio dominicano que quiere aparecer en las respuestas de IA:"),
        rich("normal", [run("•  "), run("Responde preguntas reales en lenguaje simple. Escribe páginas que respondan directamente lo que los clientes realmente preguntan — \"¿cuánto cuesta un tour a Saona?\", \"¿aceptan pacientes sin cita?\", \"¿la clínica habla inglés?\" — con la respuesta declarada claramente en las primeras oraciones, no enterrada en prosa de marketing. Encabezados con forma de pregunta con respuestas directas debajo son exactamente el formato que los sistemas de IA extraen.")]),
        rich("normal", [run("•  "), run("Di claramente qué eres. Cada página importante debería declarar, en oraciones extraíbles, qué hace el negocio, dónde y para quién. Los eslóganes vagos (\"experiencias más allá de la imaginación\") son invisibles para una máquina decidiendo si eres un operador de tours en Bayahíbe.")]),
        rich("normal", [run("•  "), run("Márcalo con datos estructurados. El marcado schema — las etiquetas legibles por máquina de tu tipo de negocio, ubicación, horarios, servicios, reseñas y preguntas frecuentes — es cómo hablas el idioma nativo de las máquinas, exactamente como describimos en "), link("datos estructurados para negocios dominicanos", "https://www.dr-webstudio.com/es/blog/datos-estructurados-negocios-dominicanos-resultados-enriquecidos-google"), run(".")]),
        rich("normal", [run("•  "), run("Mantén tu Perfil de Negocio de Google inmaculado. Gemini en particular se apoya en el ecosistema de Google, y cada plataforma verifica los hechos básicos. Tu perfil, "), link("conectado correctamente a tu sitio", "https://www.dr-webstudio.com/es/blog/por-que-negocio-punta-cana-no-aparece-google-maps-como-solucionarlo"), run(", necesita coincidir con tu página web en nombre, ubicación, horarios y servicios.")]),
        rich("normal", [run("•  "), run("Hazlo en ambos idiomas. Las respuestas de IA se componen en el idioma de la pregunta. Un turista preguntándole a ChatGPT en inglés recibe fuentes que responden en inglés; lo mismo en español. "), link("Páginas bilingües reales", "https://www.dr-webstudio.com/es/blog/seo-bilingue-posicionarse-ingles-espanol-sin-perjudicar-ninguno"), run(" — no un widget de traducción — significan que existes en ambas conversaciones.")]),
        rich("normal", [run("•  "), run("Mantente técnicamente limpio y al día. Rápido, rastreable, sin bloqueos accidentales, y contenido realmente actualizado — los sistemas de IA favorecen fuentes frescas y precisas, y hay convenciones emergentes para señalizarles, como cubrimos en "), link("qué es llms.txt y si lo necesitas", "https://www.dr-webstudio.com/es/blog/que-es-llms-txt-y-lo-necesita-tu-negocio"), run(".")]),
        h2("Cómo ver dónde estás parado hoy"),
        rich("normal", [run("Antes de optimizar nada, corre la auditoría de cinco minutos que cualquier dueño de negocio puede hacer ahora mismo. Abre ChatGPT o Gemini y pregunta, como lo haría un cliente: \"recomiéndame un [tu tipo de negocio] en [tu ciudad]\" — en español y en inglés. Luego pregunta directamente: \"¿qué sabes de [el nombre de tu negocio]?\" Los resultados son diagnósticos al instante. Si la IA recomienda a competidores y nunca ha oído de ti, encontraste la brecha. Si te conoce pero te describe mal — dirección vieja, servicios equivocados, precios desactualizados — encontraste información rancia o inconsistente en la web que hay que corregir. Si te describe con precisión e incluso te recomienda, vas adelante; nota de cuáles fuentes parece nutrirse y mantenlas fuertes. Repite trimestralmente, porque estos sistemas se actualizan continuamente. Este pequeño ejercicio hace algo valioso más allá del diagnóstico: te muestra exactamente qué se les está diciendo a tus clientes potenciales sobre ti, en un canal al que quizás nunca has mirado — y para la mayoría de los dueños de negocios dominicanos que lo intentan, esa primera mirada es el momento en que este tema deja de ser abstracto.")]),
        h2("Qué no hacer"),
        rich("normal", [run("Una palabra rápida de precaución, porque una industria casera de \"trucos GEO\" ya está vendiendo aceite de serpiente. No rellenes páginas con spam robótico de preguntas y respuestas, no fabriques reseñas, y no persigas trucos que prometan \"posicionarte en ChatGPT\" — las plataformas se ajustan constantemente, y la manipulación que funciona este mes se filtra el próximo, a veces con tu credibilidad como la baja. La estrategia duradera es poco glamorosa: sé genuinamente claro, genuinamente útil y genuinamente consistente en cada lugar donde tu negocio aparece en línea. Ese es el único enfoque que se vuelve más efectivo a medida que los sistemas de IA se vuelven más inteligentes, porque toda su trayectoria es volverse mejores en distinguir lo real de la actuación de lo real.")]),
        h2("Una palabra honesta sobre cuánto importa esto ahora mismo"),
        rich("normal", [run("Perspectiva, sostenida con honestidad: la búsqueda tradicional de Google todavía entrega la gran mayoría de las visitas hoy, y para un negocio dominicano los fundamentos — posicionarse bien, un sitio bilingüe rápido, un Perfil de Negocio completo, reseñas — siguen siendo el evento principal. La búsqueda con IA es la rebanada de más rápido crecimiento, no todavía la más grande. Pero aquí está por qué actuar temprano importa de todos modos: todo lo del checklist de arriba son los fundamentos, ejecutados con más claridad y estructura. No hay disyuntiva entre optimizar para Google y optimizar para la IA — el mismo sitio bien construido gana ambos, el tráfico de hoy y las respuestas de mañana. Los negocios que traten esto como la razón para finalmente hacer bien su presencia web serán los dueños de las respuestas de IA en su nicho antes de que sus competidores hayan oído las siglas.")]),
        h2("Construye un sitio que humanos e IA recomienden"),
        rich("normal", [run("En "), link("DR Web Studio", "https://www.dr-webstudio.com/es"), run(" así es como construimos por defecto: sitios rápidos y bilingües con estructura limpia, respuestas reales en páginas reales, datos estructurados completos, y la higiene técnica que hace a un negocio legible para el rastreador de Google y para ChatGPT por igual — con el primer año de mantenimiento incluido para que se mantenga así. Si quieres saber si una IA recomendaría tu negocio hoy — y qué diría — "), link("contáctanos para una consulta gratuita", "https://www.dr-webstudio.com/es/contacto"), run("; lo revisamos, te lo mostramos, y te construimos dentro de la respuesta.")]),
      ],
    },
    seo: {
      metaTitle: loc(
        "AI Search: Show Up in ChatGPT & Gemini (2026)",
        "Búsqueda con IA: Aparece en ChatGPT y Gemini",
      ),
      ogTitle: loc(
        "How Your Business Shows Up in AI Search",
        "Cómo Aparece Tu Negocio en la Búsqueda con IA",
      ),
      ogDescription: loc(
        "Your next customer may ask ChatGPT instead of Google. AI referrals convert up to 9x higher — and the way to get cited is clear structure, real answers, and a trustworthy site.",
        "Tu próximo cliente puede preguntarle a ChatGPT en vez de a Google. Las referencias de IA convierten hasta 9x más — y la vía para ser citado es estructura clara y un sitio confiable.",
      ),
      keywords: {
        en: ["ai search optimization", "show up in chatgpt", "gemini business visibility", "ai overviews seo", "geo generative engine optimization"],
        es: ["optimización búsqueda ia", "aparecer en chatgpt", "visibilidad negocio gemini", "seo ai overviews", "geo optimización motores generativos"],
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