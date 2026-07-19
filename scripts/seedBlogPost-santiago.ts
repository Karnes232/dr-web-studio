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
    slug: "santiago-economic-engine-business-websites",
    slugEs: "santiago-motor-economico-paginas-web-de-negocios",
    title: loc(
      "Santiago: Websites for the DR's Economic Engine, Not a Resort Town",
      "Santiago: Páginas Web para el Motor Económico de RD, No un Pueblo Turístico",
    ),
    description: loc(
      "Santiago isn't a resort town — it's the DR's industrial and commercial heart. Why business websites here are about B2B credibility and nearshoring, not booking tours.",
      "Santiago no es un pueblo turístico — es el corazón industrial y comercial de RD. Por qué las webs de negocios aquí son sobre credibilidad B2B y nearshoring, no reservar tours.",
    ),
    readTime: 9,
    featured: false,
    tags: {
      en: [
        "Santiago",
        "Cibao",
        "B2B",
        "manufacturing",
        "nearshoring",
        "free zones",
        "professional services",
        "Dominican Republic",
      ],
      es: [
        "Santiago",
        "Cibao",
        "B2B",
        "manufactura",
        "nearshoring",
        "zonas francas",
        "servicios profesionales",
        "República Dominicana",
      ],
    },
    categories: ["web-design", "business-tips"],
    publishedAt: "2026-07-07T16:00:00.000Z",
    body: {
      en: [
        p(
          "Every conversation about doing business online in the Dominican Republic seems to assume the same thing: that the customer is a tourist. Book a tour, reserve a room, rent a villa. But the country's second-largest city runs on a completely different engine. Santiago de los Caballeros is not a resort town — it's the industrial and commercial heart of the Cibao Valley, a metro area of well over a million people whose economy is built on manufacturing, agribusiness, professional services, healthcare, and education. For businesses here, a website isn't about selling sunsets. It's about credibility, lead generation, and reaching buyers who are companies, not vacationers. That changes everything about what the website needs to do.",
        ),
        h2("A different kind of market"),
        rich("normal", [
          run(
            "Santiago is the largest Caribbean city that isn't a capital, with a city population around 771,000 and a metro area past 1.26 million. Unlike the coastal resort zones, ",
          ),
          link(
            "it operates primarily as an economic engine rather than a tourism destination",
            "https://en.wikipedia.org/wiki/Santiago_de_los_Caballeros",
          ),
          run(
            ", which gives it a stability the beach towns don't have — its business doesn't evaporate in the off-season because there is no off-season. The province generates around 14% of the national GDP and anchors the Cibao industrial corridor, home to free-trade-zone parks that manufacture textiles, cigars, medical devices, electronics, and more. It has its own modern airport, Cibao International, with direct flights to the United States. This is a city of factories, clinics, universities, law firms, distributors, and agribusinesses — and every one of them has customers, partners, and talent to reach, most of whom now start that search online.",
          ),
        ]),
        h2("Why B2B websites work differently"),
        p(
          "Here's the core distinction: a tourism website sells an experience to an individual who decides in minutes. A Santiago business website often sells to another business, and that buyer behaves nothing like a vacationer. They research carefully, compare vendors, evaluate credibility, and make decisions over weeks with multiple people involved. They're not looking for a pretty gallery and a \"book now\" button — they're looking for evidence that you're a serious, capable, trustworthy company worth a purchase order or a long-term contract. That means the website's job shifts from selling a moment to building confidence: clear descriptions of capabilities, proof of track record, specifications, certifications, case studies, and an easy path to start a conversation with a real person. The emotional impulse buy of tourism is replaced by the reasoned evaluation of B2B, and the website has to be built for that reasoning.",
        ),
        h2("The nearshoring moment"),
        rich("normal", [
          run(
            "There's a specific and timely reason Santiago businesses should take their web presence seriously right now: nearshoring. As companies move manufacturing and services closer to the United States, the Dominican Republic — and Santiago's free-trade-zone corridor in particular — is actively courting that investment. The country recently sent a ",
          ),
          link(
            "trade and investment roadshow through U.S. cities that drew executives from major firms including Google, Lenovo, and Lockheed Martin",
            "https://dominicantoday.com/dominican-republic-promotes-free-zones-during-u-s-trade-and-investment-roadshow/",
          ),
          run(
            ", with Santiago among the free zones showcased. When a U.S. company evaluates a Dominican supplier, contract manufacturer, logistics partner, or professional-services firm, the first thing they do is look it up — and a supplier whose website is outdated, Spanish-only, or nonexistent looks unready for international business, no matter how capable it actually is. In a moment when foreign buyers are actively looking, being findable and credible in English is a direct competitive advantage, and being invisible is a direct cost.",
          ),
        ]),
        h2("Who has the biggest opening in Santiago"),
        p(
          "The B2B and professional character of Santiago's economy creates strong opportunities for particular business types:",
        ),
        rich("normal", [
          run("•  "),
          run(
            "Manufacturers and free-zone suppliers. Companies seeking contract manufacturing, components, or export partners research suppliers online first. A professional, English-and-Spanish site with clear capabilities, certifications, and a real contact path turns Santiago's cost advantage into actual inquiries.",
          ),
        ]),
        rich("normal", [
          run("•  "),
          run(
            "Professional services. Law firms, accountants, consultants, engineering firms, and agencies serving the region's businesses live on credibility, and a serious website is the foundation of it. A referral will still look you up before they call.",
          ),
        ]),
        rich("normal", [
          run("•  "),
          run(
            "Healthcare and specialty clinics. Santiago is a regional medical hub serving the entire Cibao — the approach we detail for ",
          ),
          link(
            "medical and clinic websites",
            "https://www.dr-webstudio.com/en/blog/websites-for-doctors-dentists-clinics-dominican-republic",
          ),
          run(
            " applies directly, with trust and easy appointments as the priorities.",
          ),
        ]),
        rich("normal", [
          run("•  "),
          run(
            "Agribusiness and distributors. The Cibao Valley's food-processing, packaging, and distribution firms sell to buyers across the country and abroad, and a clear, professional web presence is how modern B2B buyers vet a partner.",
          ),
        ]),
        rich("normal", [
          run("•  "),
          run(
            "Education and training. Universities, technical institutes, and training centers competing for students and corporate partners need websites that inform and convert, not just exist.",
          ),
        ]),
        h2("What a Santiago business website has to do"),
        p(
          "The formula that wins in a professional, B2B-heavy market is different from the tourism playbook, though some fundamentals carry over:",
        ),
        rich("normal", [
          run("•  "),
          run(
            "Credibility first. The site's primary job is to make a serious company look serious — clean, professional design, real information, proof of capability. For a B2B buyer, a weak website raises doubt about the whole operation.",
          ),
        ]),
        rich("normal", [
          run("•  "),
          run(
            "Bilingual, with English as a business tool. In tourism, English serves visitors; in Santiago, English serves international commerce. A manufacturer or service firm courting U.S. nearshoring buyers needs genuine English pages, built the way we describe in ",
          ),
          link(
            "bilingual SEO",
            "https://www.dr-webstudio.com/en/blog/seo-bilingue-posicionarse-ingles-espanol-sin-perjudicar-ninguno",
          ),
          run(", because the buyer evaluating you reads in English."),
        ]),
        rich("normal", [
          run("•  "),
          run(
            "Fast and professional on every device. A decision-maker might first see your site on a phone between meetings and revisit it on a desktop during evaluation. It has to be fast and polished on both, and ",
          ),
          link(
            "speed shapes whether they stay",
            "https://www.dr-webstudio.com/en/blog/core-web-vitals-como-la-velocidad-afecta-tus-ventas-online",
          ),
          run("."),
        ]),
        rich("normal", [
          run("•  "),
          run(
            "Lead generation, not impulse booking. The goal is to start a qualified conversation — clear contact paths, inquiry forms, direct lines to the right people, and yes, WhatsApp, which is as central to Dominican business communication as it is to tourism, integrated the way we cover in ",
          ),
          link(
            "connecting your site to WhatsApp and other channels",
            "https://www.dr-webstudio.com/en/blog/how-to-connect-website-whatsapp-google-maps-instagram",
          ),
          run("."),
        ]),
        rich("normal", [
          run("•  "),
          run(
            "Content that demonstrates expertise. For B2B, content that shows you understand your field — capability pages, technical detail, case studies, answers to the questions buyers ask — is what builds the confidence that closes a deal, and what ranks for the specific searches serious buyers make.",
          ),
        ]),
        h2("An honest word on the differences"),
        p(
          "Selling to a business market rather than a tourism one has real advantages — stability, larger contract values, less seasonality — but it comes with its own realities worth naming. B2B sales cycles are longer, so a Santiago website is a lead-generation and credibility tool that pays off over months, not an overnight booking machine; measured against tourism metrics it can look slow, when in fact it's doing a different and more valuable job. Trust matters more and takes more to establish, which means the site has to be genuinely professional rather than merely present — the bar is higher because the buyer is more discerning. And reaching the nearshoring opportunity specifically requires real English and real professionalism, not a token effort. None of this is a drawback; it's a reason to build deliberately. Santiago rewards the businesses that present themselves as the serious, capable operations they are — because in a B2B market, looking the part is a precondition for being considered at all.",
        ),
        h2("The diaspora and consumer angle too"),
        p(
          "It's worth noting Santiago isn't only a B2B market. The city has a large, prosperous middle class and a deep connection to its diaspora — Santiagueros living in New York, Boston, and beyond who send money home, buy property, and stay closely tied to businesses back in the Cibao. That creates a consumer-facing opportunity layered on top of the B2B one: real estate developers selling to diaspora buyers, retailers and restaurants serving a middle class that shops and researches online, and services that families abroad arrange for relatives at home. This audience behaves more like the online consumer than the B2B buyer, but it shares the same expectation of a professional, bilingual, mobile-fast site — a diaspora buyer evaluating a Santiago apartment from Queens is every bit as remote and research-driven as a foreign tourist, and every bit as easily lost to a competitor whose website inspires more confidence. A Santiago business that serves both the B2B and the diaspora-consumer market with one well-built site is reaching two valuable audiences the coast doesn't have.",
        ),
        h2("Build for business, from anywhere"),
        rich("normal", [
          run(
            "Web development is remote work, so a company in Santiago doesn't need a developer down the street — it needs one who understands both the Dominican market and how B2B and professional buyers actually evaluate a business online. That's exactly what we do at ",
          ),
          link("DR Web Studio", "https://www.dr-webstudio.com/en"),
          run(
            ": fast, bilingual, credibility-building websites for Dominican companies, with lead generation and WhatsApp wired in and the first year of maintenance included. Whether you're a manufacturer courting nearshoring buyers, a professional firm building its reputation, or a clinic serving the Cibao, the website that makes you look as capable as you are is the one that wins the business. ",
          ),
          link(
            "Contact us for a free consultation",
            "https://www.dr-webstudio.com/en/contact",
          ),
          run(" and let's build it."),
        ]),
      ],
      es: [
        p(
          "Cada conversación sobre hacer negocios en línea en República Dominicana parece asumir lo mismo: que el cliente es un turista. Reserva un tour, aparta una habitación, alquila una villa. Pero la segunda ciudad más grande del país funciona con un motor completamente distinto. Santiago de los Caballeros no es un pueblo turístico — es el corazón industrial y comercial del Valle del Cibao, un área metropolitana de bastante más de un millón de personas cuya economía se construye sobre la manufactura, la agroindustria, los servicios profesionales, la salud y la educación. Para los negocios de aquí, una página web no se trata de vender atardeceres. Se trata de credibilidad, generación de prospectos y llegar a compradores que son empresas, no vacacionistas. Eso cambia todo sobre lo que la página web necesita hacer.",
        ),
        h2("Un tipo de mercado distinto"),
        rich("normal", [
          run(
            "Santiago es la ciudad caribeña más grande que no es capital, con una población urbana de alrededor de 771,000 y un área metropolitana que supera los 1.26 millones. A diferencia de las zonas turísticas costeras, ",
          ),
          link(
            "funciona principalmente como un motor económico más que como un destino turístico",
            "https://en.wikipedia.org/wiki/Santiago_de_los_Caballeros",
          ),
          run(
            ", lo que le da una estabilidad que los pueblos de playa no tienen — su negocio no se evapora en la temporada baja porque no hay temporada baja. La provincia genera alrededor del 14% del PIB nacional y ancla el corredor industrial del Cibao, hogar de parques de zona franca que manufacturan textiles, cigarros, dispositivos médicos, electrónica y más. Tiene su propio aeropuerto moderno, el Cibao Internacional, con vuelos directos a Estados Unidos. Esta es una ciudad de fábricas, clínicas, universidades, firmas de abogados, distribuidores y agroindustrias — y cada una de ellas tiene clientes, socios y talento que alcanzar, la mayoría de los cuales ahora empiezan esa búsqueda en línea.",
          ),
        ]),
        h2("Por qué las páginas web B2B funcionan diferente"),
        p(
          'Aquí está la distinción central: una página web turística le vende una experiencia a un individuo que decide en minutos. Una página web de un negocio de Santiago a menudo le vende a otro negocio, y ese comprador no se comporta en nada como un vacacionista. Investiga con cuidado, compara proveedores, evalúa la credibilidad, y toma decisiones a lo largo de semanas con varias personas involucradas. No está buscando una galería bonita y un botón de "reservar ahora" — está buscando evidencia de que eres una empresa seria, capaz y confiable, digna de una orden de compra o un contrato de largo plazo. Eso significa que el trabajo de la página web cambia de vender un momento a construir confianza: descripciones claras de capacidades, prueba de trayectoria, especificaciones, certificaciones, casos de éxito, y un camino fácil para iniciar una conversación con una persona real. La compra impulsiva y emocional del turismo se reemplaza por la evaluación razonada del B2B, y la página web tiene que estar construida para ese razonamiento.',
        ),
        h2("El momento del nearshoring"),
        rich("normal", [
          run(
            "Hay una razón específica y oportuna por la que los negocios de Santiago deberían tomarse en serio su presencia web ahora mismo: el nearshoring. A medida que las empresas mueven manufactura y servicios más cerca de Estados Unidos, República Dominicana — y el corredor de zonas francas de Santiago en particular — está cortejando activamente esa inversión. El país envió recientemente un ",
          ),
          link(
            "roadshow de comercio e inversión por ciudades de EE.UU. que atrajo a ejecutivos de grandes firmas incluyendo Google, Lenovo y Lockheed Martin",
            "https://dominicantoday.com/dominican-republic-promotes-free-zones-during-u-s-trade-and-investment-roadshow/",
          ),
          run(
            ", con Santiago entre las zonas francas mostradas. Cuando una empresa estadounidense evalúa a un proveedor dominicano, un fabricante por contrato, un socio logístico o una firma de servicios profesionales, lo primero que hace es buscarlo — y un proveedor cuya página web está anticuada, es solo en español o no existe, se ve poco preparado para el negocio internacional, sin importar cuán capaz sea en realidad. En un momento en que los compradores extranjeros están buscando activamente, ser encontrable y creíble en inglés es una ventaja competitiva directa, y ser invisible es un costo directo.",
          ),
        ]),
        h2("Quién tiene la apertura más grande en Santiago"),
        p(
          "El carácter B2B y profesional de la economía de Santiago crea oportunidades fuertes para tipos de negocio particulares:",
        ),
        rich("normal", [
          run("•  "),
          run(
            "Fabricantes y proveedores de zona franca. Las empresas que buscan manufactura por contrato, componentes o socios de exportación investigan proveedores en línea primero. Un sitio profesional en inglés y español con capacidades claras, certificaciones y un camino de contacto real convierte la ventaja de costo de Santiago en consultas reales.",
          ),
        ]),
        rich("normal", [
          run("•  "),
          run(
            "Servicios profesionales. Firmas de abogados, contadores, consultores, firmas de ingeniería y agencias que sirven a los negocios de la región viven de la credibilidad, y una página web seria es la base de ella. Una referencia igual te buscará antes de llamar.",
          ),
        ]),
        rich("normal", [
          run("•  "),
          run(
            "Salud y clínicas especializadas. Santiago es un centro médico regional que sirve a todo el Cibao — el enfoque que detallamos para ",
          ),
          link(
            "páginas web de médicos y clínicas",
            "https://www.dr-webstudio.com/es/blog/paginas-web-para-medicos-dentistas-y-clinicas-rd",
          ),
          run(
            " aplica directamente, con la confianza y las citas fáciles como prioridades.",
          ),
        ]),
        rich("normal", [
          run("•  "),
          run(
            "Agroindustria y distribuidores. Las firmas de procesamiento de alimentos, empaque y distribución del Valle del Cibao venden a compradores en todo el país y el extranjero, y una presencia web clara y profesional es cómo los compradores B2B modernos evalúan a un socio.",
          ),
        ]),
        rich("normal", [
          run("•  "),
          run(
            "Educación y capacitación. Universidades, institutos técnicos y centros de capacitación que compiten por estudiantes y socios corporativos necesitan páginas web que informen y conviertan, no que solo existan.",
          ),
        ]),
        h2("Qué tiene que hacer una página web de negocio en Santiago"),
        p(
          "La fórmula que gana en un mercado profesional y fuertemente B2B es distinta del playbook turístico, aunque algunos fundamentos se mantienen:",
        ),
        rich("normal", [
          run("•  "),
          run(
            "Credibilidad primero. El trabajo principal del sitio es hacer que una empresa seria se vea seria — diseño limpio y profesional, información real, prueba de capacidad. Para un comprador B2B, una página web débil genera dudas sobre toda la operación.",
          ),
        ]),
        rich("normal", [
          run("•  "),
          run(
            "Bilingüe, con el inglés como herramienta de negocio. En el turismo, el inglés sirve a los visitantes; en Santiago, el inglés sirve al comercio internacional. Un fabricante o firma de servicios que corteja a compradores de nearshoring estadounidenses necesita páginas reales en inglés, construidas como describimos en ",
          ),
          link(
            "SEO bilingüe",
            "https://www.dr-webstudio.com/es/blog/seo-bilingue-posicionarse-ingles-espanol-sin-perjudicar-ninguno",
          ),
          run(", porque el comprador que te evalúa lee en inglés."),
        ]),
        rich("normal", [
          run("•  "),
          run(
            "Rápida y profesional en cada dispositivo. Un tomador de decisiones podría ver tu sitio primero en un teléfono entre reuniones y revisitarlo en una computadora durante la evaluación. Tiene que ser rápido y pulido en ambos, y ",
          ),
          link(
            "la velocidad determina si se quedan",
            "https://www.dr-webstudio.com/es/blog/core-web-vitals-como-la-velocidad-afecta-tus-ventas-online",
          ),
          run("."),
        ]),
        rich("normal", [
          run("•  "),
          run(
            "Generación de prospectos, no reserva impulsiva. La meta es iniciar una conversación calificada — caminos de contacto claros, formularios de consulta, líneas directas a las personas correctas, y sí, WhatsApp, que es tan central para la comunicación de negocios dominicana como lo es para el turismo, integrado como cubrimos en ",
          ),
          link(
            "conectar tu sitio con WhatsApp y otros canales",
            "https://www.dr-webstudio.com/es/blog/como-conectar-sitio-web-whatsapp-google-maps-instagram",
          ),
          run("."),
        ]),
        rich("normal", [
          run("•  "),
          run(
            "Contenido que demuestra experiencia. Para el B2B, el contenido que muestra que entiendes tu campo — páginas de capacidades, detalle técnico, casos de éxito, respuestas a las preguntas que hacen los compradores — es lo que construye la confianza que cierra un trato, y lo que se posiciona para las búsquedas específicas que hacen los compradores serios.",
          ),
        ]),
        h2("Una palabra honesta sobre las diferencias"),
        p(
          "Vender a un mercado de negocios en vez de a uno turístico tiene ventajas reales — estabilidad, valores de contrato más grandes, menos estacionalidad — pero viene con sus propias realidades que vale la pena nombrar. Los ciclos de venta B2B son más largos, así que una página web de Santiago es una herramienta de generación de prospectos y credibilidad que rinde a lo largo de meses, no una máquina de reservas de la noche a la mañana; medida contra métricas turísticas puede parecer lenta, cuando de hecho está haciendo un trabajo distinto y más valioso. La confianza importa más y toma más establecerla, lo que significa que el sitio tiene que ser genuinamente profesional en vez de meramente presente — la barra es más alta porque el comprador es más exigente. Y alcanzar la oportunidad del nearshoring específicamente requiere inglés real y profesionalismo real, no un esfuerzo simbólico. Nada de esto es una desventaja; es una razón para construir deliberadamente. Santiago premia a los negocios que se presentan como las operaciones serias y capaces que son — porque en un mercado B2B, verse a la altura es una precondición para siquiera ser considerado.",
        ),
        h2("El ángulo de la diáspora y el consumidor también"),
        p(
          "Vale la pena notar que Santiago no es solo un mercado B2B. La ciudad tiene una clase media grande y próspera y una conexión profunda con su diáspora — santiagueros viviendo en Nueva York, Boston y más allá que envían dinero a casa, compran propiedades, y se mantienen estrechamente ligados a los negocios en el Cibao. Eso crea una oportunidad de cara al consumidor superpuesta a la B2B: desarrolladores inmobiliarios vendiendo a compradores de la diáspora, comercios y restaurantes sirviendo a una clase media que compra e investiga en línea, y servicios que las familias en el extranjero arreglan para sus parientes en casa. Esta audiencia se comporta más como el consumidor en línea que como el comprador B2B, pero comparte la misma expectativa de un sitio profesional, bilingüe y rápido en móvil — un comprador de la diáspora evaluando un apartamento en Santiago desde Queens es igual de remoto e impulsado por la investigación que un turista extranjero, e igual de fácilmente perdido ante un competidor cuya página web inspira más confianza. Un negocio de Santiago que sirve tanto al mercado B2B como al de consumidor-diáspora con un solo sitio bien construido está alcanzando dos audiencias valiosas que la costa no tiene.",
        ),
        h2("Construye para el negocio, desde donde sea"),
        rich("normal", [
          run(
            "El desarrollo web es trabajo remoto, así que una empresa en Santiago no necesita un desarrollador en la esquina — necesita uno que entienda tanto el mercado dominicano como la forma en que los compradores B2B y profesionales realmente evalúan un negocio en línea. Eso es exactamente lo que hacemos en ",
          ),
          link("DR Web Studio", "https://www.dr-webstudio.com/es"),
          run(
            ": páginas web rápidas, bilingües y constructoras de credibilidad para empresas dominicanas, con generación de prospectos y WhatsApp integrados y el primer año de mantenimiento incluido. Ya seas un fabricante cortejando compradores de nearshoring, una firma profesional construyendo su reputación, o una clínica sirviendo al Cibao, la página web que te hace ver tan capaz como eres es la que gana el negocio. ",
          ),
          link(
            "Contáctanos para una consulta gratuita",
            "https://www.dr-webstudio.com/es/contacto",
          ),
          run(" y construyámosla."),
        ]),
      ],
    },
    seo: {
      metaTitle: loc(
        "Santiago Business Websites: B2B & Nearshoring (2026)",
        "Páginas Web de Negocios en Santiago: B2B (2026)",
      ),
      ogTitle: loc(
        "Websites for the DR's Economic Engine",
        "Páginas Web para el Motor Económico de RD",
      ),
      ogDescription: loc(
        "The DR's second city runs on manufacturing, free zones, and professional services. In the nearshoring moment, a credible bilingual website is a direct competitive advantage.",
        "La segunda ciudad de RD funciona con manufactura, zonas francas y servicios profesionales. En el momento del nearshoring, una web bilingüe creíble es una ventaja competitiva directa.",
      ),
      keywords: {
        en: [
          "Santiago business website",
          "B2B website Dominican Republic",
          "nearshoring supplier website",
          "Santiago free zone website",
          "web design Santiago Dominican Republic",
        ],
        es: [
          "página web negocio Santiago",
          "página web B2B República Dominicana",
          "página web proveedor nearshoring",
          "diseño web Santiago",
          "página web zona franca Santiago",
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
