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
    slug: "cap-cana-website-must-match-luxury-standard",
    slugEs: "cap-cana-tu-web-debe-estar-a-la-altura-del-lujo",
    title: loc(
      "Cap Cana: Why Your Website Must Match the Luxury Standard",
      "Cap Cana: Por Qué Tu Página Web Debe Estar a la Altura del Lujo",
    ),
    description: loc(
      "At Cap Cana, ultra-luxury clients judge your business by your website in seconds. Why design, speed, and multilingual polish are the price of being taken seriously.",
      "En Cap Cana, los clientes de ultra lujo juzgan tu negocio por tu página web en segundos. Por qué diseño, velocidad y pulido multilingüe son el precio de ser tomado en serio.",
    ),
    readTime: 9,
    featured: false,
    tags: {
      en: ["Cap Cana", "luxury", "real estate", "villas", "concierge", "St. Regis", "high-net-worth", "Punta Cana", "Dominican Republic"],
      es: ["Cap Cana", "lujo", "bienes raíces", "villas", "concierge", "St. Regis", "alto patrimonio", "Punta Cana", "República Dominicana"],
    },
    categories: ["web-design", "business-tips"],
    publishedAt: "2026-07-07T15:00:00.000Z",
    body: {
      en: [
        p("A client considering a US$5 million villa at Cap Cana, a yacht charter from the Caribbean's largest marina, or a private chef for a week at a St. Regis residence has one thing in common across all three: before they ever speak to you, they will look at your website — and they will judge you by it in seconds. Cap Cana is not an ordinary market, and it does not forgive an ordinary web presence. This is the 30,000-acre gated enclave inside Punta Cana where St. Regis residences sell from one to over twenty million dollars, where the marina berths yachts up to 150 feet, and where the client's baseline expectation for service was set by a butler. For the businesses serving this world, a website isn't a brochure. It's the first impression, and at this level, the first impression has to be flawless."),
        h2("The Cap Cana standard"),
        p("To understand why the web bar is so high here, you have to understand the place. Cap Cana spans 30,000 acres of gated, master-planned luxury just seven minutes from Punta Cana International Airport. Inside it: the St. Regis Resort and Residences, with 200 hotel rooms, 70 branded residences, and 24/7 concierge and butler service; the Eden Roc; the Jack Nicklaus-designed Punta Espada golf course, ranked among the finest in the world; the largest marina in the Caribbean and the largest equestrian center; Scape Park; and the beaches and dining of Juanillo. Median asking prices run around US$389,000 for a condo and US$1.1 million for a villa, with dozens of new luxury developments underway. The people who buy, rent, and vacation here are ultra-high-net-worth, globally mobile, and surrounded at every turn by five-star execution. Their standard for \"good\" is not the local average — it's the St. Regis average. Any business hoping to serve them is measured against that, whether it wants to be or not."),
        h2("Your website is judged before you are"),
        rich("normal", [run("Here's the uncomfortable mechanic of a luxury market: the client forms a verdict about the quality of your service from the quality of your website, before any human contact. It's a proxy, and an unfair-feeling one, but it's how discerning buyers filter. A villa-rental company with a slow, dated, or clumsy site tells a $10,000-a-week renter that the villa experience will be slow, dated, and clumsy too. A concierge whose website looks amateur signals amateur service, no matter how excellent the service actually is. In a normal market a mediocre website costs you some conversions; in the luxury market it disqualifies you before the conversation starts, because the client has ten other options and no reason to gamble on the one that couldn't be bothered to look the part. The website isn't representing your business to this client. For the crucial first minute, the website is your business.")]),
        h2("What \"matching the standard\" actually requires"),
        p("Meeting the Cap Cana bar isn't about adding gold accents and the word \"luxury\" to a template. It's a set of concrete, non-negotiable qualities the discerning client reads instantly, consciously or not:"),
        rich("normal", [run("•  "), run("Design that signals quality without trying too hard. Restraint, generous space, refined typography, and photography that's genuinely beautiful — the visual language of the brands this client already trusts. A cluttered or dated design reads as a lack of quality control, which is the last thing a luxury buyer will tolerate.")]),
        rich("normal", [run("•  "), run("Speed that feels instant. A luxury client's patience is short and their expectation is immediate. A site that hesitates for even a couple of seconds breaks the spell of effortlessness that luxury depends on, and "), link("speed is directly tied to whether they stay or leave", "https://www.dr-webstudio.com/en/blog/core-web-vitals-como-la-velocidad-afecta-tus-ventas-online"), run(".")]),
        rich("normal", [run("•  "), run("Photography that does the property justice, without slowing the site. This market is sold on imagery — the villa, the yacht, the sunset over Punta Espada — but enormous unoptimized images betray an amateur build and destroy speed, which is exactly the tension the "), link("image-optimization craft", "https://www.dr-webstudio.com/en/blog/optimizacion-imagenes-sitios-web-turismo-fotos-alta-calidad-carga-rapida"), run(" resolves.")]),
        rich("normal", [run("•  "), run("Flawless multilingual polish. The Cap Cana client is international — American, European, Latin American — and a site that's fluent in their language, genuinely and not through a clumsy auto-translate, is a baseline courtesy at this level, built the way we describe in "), link("bilingual and multilingual SEO", "https://www.dr-webstudio.com/en/blog/seo-bilingue-posicionarse-ingles-espanol-sin-perjudicar-ninguno"), run(". A grammatical error in the client's own language is a quiet disqualification.")]),
        rich("normal", [run("•  "), run("Frictionless, discreet contact. The luxury client expects to reach a human easily and privately — a direct, elegant path to WhatsApp or a concierge line, integrated cleanly the way we cover in "), link("connecting your site to WhatsApp and other channels", "https://www.dr-webstudio.com/en/blog/how-to-connect-website-whatsapp-google-maps-instagram"), run(", never a clumsy form that feels like a mass-market funnel.")]),
        h2("Who this matters most for"),
        p("Every business serving the Cap Cana clientele lives or dies by this standard, but a few feel it most acutely:"),
        rich("normal", [run("•  "), run("Luxury real estate and villa sales. With a median villa around US$1.1 million and residences reaching eight figures, the buyer researches extensively online before ever flying in. The listing site is the showroom, and it competes with St. Regis's own marketing — the formula we detail for "), link("real estate websites", "https://www.dr-webstudio.com/en/blog/real-estate-websites-punta-cana"), run(", executed at the highest tier.")]),
        rich("normal", [run("•  "), run("Villa rental and property management. The renter paying premium weekly rates chooses from photos and a website alone, often from another continent. Trust is built entirely through the screen.")]),
        rich("normal", [run("•  "), run("Concierge, private chefs, and lifestyle services. These businesses sell an experience of effortless quality, and the website is the first and most important demonstration that they can deliver it.")]),
        rich("normal", [run("•  "), run("Yacht and charter operators. Serving a marina that berths 150-foot yachts means serving clients for whom presentation is everything; the booking experience must feel as premium as the vessel.")]),
        rich("normal", [run("•  "), run("Fine dining and wellness. The restaurant or spa that looks exquisite online and books seamlessly captures the guest who could just as easily stay inside the resort.")]),
        h2("An honest word on the trade-offs"),
        p("Serving the luxury market is genuinely rewarding — higher margins, better clients, work that lets you take real pride in craft — but it's worth being clear-eyed. The standard is unforgiving: there's little tolerance for \"good enough,\" and a website at this level has to be built and maintained with real care, not launched and forgotten. The audience is smaller than the mass tourism market, so the strategy is depth over volume — converting a few high-value clients rather than capturing many low-value ones — which rewards quality and punishes corner-cutting. And meeting this bar is an investment; a truly premium site costs more to build than a basic one, for the simple reason that the polish is the point. But the math of luxury forgives that easily: when a single villa sale or a season of premium rentals dwarfs the cost of the website that won it, under-investing in that website is the only expensive mistake."),
        h2("Being found is different here — and still matters"),
        p("There's a nuance worth naming: the ultra-luxury client often doesn't discover you through a generic Google search the way a mass-market tourist does. They arrive by referral, through a broker, from the resort's own network, or via a targeted search for something specific and high-intent — \"Cap Cana villa rental with staff,\" \"private chef St. Regis Cap Cana,\" \"Punta Espada real estate.\" That changes the SEO priority but doesn't remove it. It means the goal isn't ranking for broad, high-volume tourism terms; it's owning the narrow, high-value searches a serious buyer actually types, and having a site polished enough that when a referral does look you up — which they always do — what they find confirms the recommendation rather than undermining it. In luxury, search and reputation work together: the referral gets them to your site, and the site has to finish the job. A business that's invisible for its high-intent terms loses the buyer who was ready; a business that ranks for them but looks cheap loses the buyer at the door. You need both, and both are buildable."),
        h2("Build to the standard, from anywhere"),
        rich("normal", [run("Web development is remote work, so a business serving Cap Cana doesn't need a developer inside the gates — it needs one who understands both the Dominican market and the exacting standard the luxury client brings. That's exactly what we do at "), link("DR Web Studio", "https://www.dr-webstudio.com/en"), run(": fast, beautiful, multilingual websites built with the polish this clientele expects, with elegant contact and the technical craft that keeps a photo-rich site loading instantly. We build for tourism businesses across the Dominican Republic, from the emerging frontiers to the luxury enclaves, and Cap Cana is where the quality of the build matters most. If your business serves this market and your website doesn't yet match the standard your clients expect, "), link("contact us for a free consultation", "https://www.dr-webstudio.com/en/contact"), run(" — let's make your first impression as flawless as the experience you deliver.")]),
      ],
      es: [
        p("Un cliente que considera una villa de US$5 millones en Cap Cana, un charter de yate desde la marina más grande del Caribe, o un chef privado por una semana en una residencia St. Regis tiene una cosa en común en los tres casos: antes de siquiera hablar contigo, mirará tu página web — y te juzgará por ella en segundos. Cap Cana no es un mercado ordinario, y no perdona una presencia web ordinaria. Este es el enclave cerrado de 30,000 acres dentro de Punta Cana donde las residencias St. Regis se venden desde uno hasta más de veinte millones de dólares, donde la marina alberga yates de hasta 150 pies, y donde la expectativa base del cliente para el servicio fue establecida por un mayordomo. Para los negocios que sirven a este mundo, una página web no es un folleto. Es la primera impresión, y a este nivel, la primera impresión tiene que ser impecable."),
        h2("El estándar Cap Cana"),
        p("Para entender por qué la barra web es tan alta aquí, hay que entender el lugar. Cap Cana abarca 30,000 acres de lujo cerrado y planificado a solo siete minutos del Aeropuerto Internacional de Punta Cana. Dentro: el St. Regis Resort and Residences, con 200 habitaciones de hotel, 70 residencias de marca, y servicio de concierge y mayordomo 24/7; el Eden Roc; el campo de golf Punta Espada diseñado por Jack Nicklaus, clasificado entre los mejores del mundo; la marina más grande del Caribe y el centro ecuestre más grande; Scape Park; y las playas y la gastronomía de Juanillo. Los precios medianos de venta rondan los US$389,000 para un condominio y US$1.1 millones para una villa, con decenas de nuevos desarrollos de lujo en marcha. Las personas que compran, alquilan y vacacionan aquí son de patrimonio ultra alto, globalmente móviles, y rodeadas a cada paso de ejecución de cinco estrellas. Su estándar para \"bueno\" no es el promedio local — es el promedio St. Regis. Cualquier negocio que espere servirles es medido contra eso, quiéralo o no."),
        h2("Tu página web es juzgada antes que tú"),
        rich("normal", [run("Aquí está la mecánica incómoda de un mercado de lujo: el cliente forma un veredicto sobre la calidad de tu servicio a partir de la calidad de tu página web, antes de cualquier contacto humano. Es un indicador, y uno que se siente injusto, pero es cómo filtran los compradores exigentes. Una empresa de alquiler de villas con un sitio lento, anticuado o torpe le dice a un inquilino de $10,000 por semana que la experiencia de la villa también será lenta, anticuada y torpe. Un concierge cuya página web se ve amateur señala servicio amateur, sin importar cuán excelente sea el servicio en realidad. En un mercado normal una página web mediocre te cuesta algunas conversiones; en el mercado de lujo te descalifica antes de que empiece la conversación, porque el cliente tiene otras diez opciones y ninguna razón para apostar por la que no se molestó en verse a la altura. La página web no está representando tu negocio ante este cliente. Durante el primer minuto crucial, la página web es tu negocio.")]),
        h2("Qué requiere realmente \"estar a la altura del estándar\""),
        p("Alcanzar la barra de Cap Cana no se trata de agregar acentos dorados y la palabra \"lujo\" a una plantilla. Es un conjunto de cualidades concretas e innegociables que el cliente exigente lee al instante, consciente o no:"),
        rich("normal", [run("•  "), run("Un diseño que señala calidad sin esforzarse demasiado. Contención, espacio generoso, tipografía refinada, y fotografía genuinamente hermosa — el lenguaje visual de las marcas en las que este cliente ya confía. Un diseño recargado o anticuado se lee como una falta de control de calidad, que es lo último que un comprador de lujo tolerará.")]),
        rich("normal", [run("•  "), run("Una velocidad que se siente instantánea. La paciencia de un cliente de lujo es corta y su expectativa es inmediata. Un sitio que titubea aunque sea un par de segundos rompe el hechizo de naturalidad del que depende el lujo, y "), link("la velocidad está directamente ligada a si se queda o se va", "https://www.dr-webstudio.com/es/blog/core-web-vitals-como-la-velocidad-afecta-tus-ventas-online"), run(".")]),
        rich("normal", [run("•  "), run("Fotografía que le hace justicia a la propiedad, sin ralentizar el sitio. Este mercado se vende con imágenes — la villa, el yate, el atardecer sobre Punta Espada — pero las imágenes enormes sin optimizar delatan una construcción amateur y destruyen la velocidad, que es exactamente la tensión que resuelve el "), link("oficio de optimización de imágenes", "https://www.dr-webstudio.com/es/blog/optimizacion-imagenes-sitios-web-turismo-fotos-alta-calidad-carga-rapida"), run(".")]),
        rich("normal", [run("•  "), run("Un pulido multilingüe impecable. El cliente de Cap Cana es internacional — estadounidense, europeo, latinoamericano — y un sitio fluido en su idioma, genuinamente y no a través de una autotraducción torpe, es una cortesía base a este nivel, construido como describimos en "), link("SEO bilingüe y multilingüe", "https://www.dr-webstudio.com/es/blog/seo-bilingue-posicionarse-ingles-espanol-sin-perjudicar-ninguno"), run(". Un error gramatical en el propio idioma del cliente es una descalificación silenciosa.")]),
        rich("normal", [run("•  "), run("Contacto discreto y sin fricción. El cliente de lujo espera alcanzar a un humano con facilidad y privacidad — un camino directo y elegante a WhatsApp o a una línea de concierge, integrado limpiamente como cubrimos en "), link("conectar tu sitio con WhatsApp y otros canales", "https://www.dr-webstudio.com/es/blog/como-conectar-sitio-web-whatsapp-google-maps-instagram"), run(", nunca un formulario torpe que se siente como un embudo de mercado masivo.")]),
        h2("Para quién importa esto más"),
        p("Todo negocio que sirve a la clientela de Cap Cana vive o muere por este estándar, pero algunos lo sienten más agudamente:"),
        rich("normal", [run("•  "), run("Bienes raíces de lujo y venta de villas. Con una villa mediana alrededor de US$1.1 millones y residencias que alcanzan las ocho cifras, el comprador investiga extensamente en línea antes de siquiera volar. El sitio de listados es la sala de exhibición, y compite con el propio marketing de St. Regis — la fórmula que detallamos para "), link("páginas web inmobiliarias", "https://www.dr-webstudio.com/es/blog/paginas-web-para-inmobiliarias-en-punta-cana"), run(", ejecutada en el nivel más alto.")]),
        rich("normal", [run("•  "), run("Alquiler de villas y administración de propiedades. El inquilino que paga tarifas semanales premium elige solo a partir de fotos y una página web, muchas veces desde otro continente. La confianza se construye enteramente a través de la pantalla.")]),
        rich("normal", [run("•  "), run("Concierge, chefs privados y servicios de estilo de vida. Estos negocios venden una experiencia de calidad sin esfuerzo, y la página web es la primera y más importante demostración de que pueden entregarla.")]),
        rich("normal", [run("•  "), run("Operadores de yates y charters. Servir a una marina que alberga yates de 150 pies significa servir a clientes para quienes la presentación lo es todo; la experiencia de reserva debe sentirse tan premium como la embarcación.")]),
        rich("normal", [run("•  "), run("Alta gastronomía y bienestar. El restaurante o spa que se ve exquisito en línea y reserva sin fricción captura al huésped que igual de fácil podría quedarse dentro del resort.")]),
        h2("Una palabra honesta sobre las concesiones"),
        p("Servir al mercado de lujo es genuinamente gratificante — mejores márgenes, mejores clientes, un trabajo que te deja sentir verdadero orgullo por el oficio — pero vale la pena ser claros. El estándar es implacable: hay poca tolerancia para el \"suficientemente bueno\", y una página web a este nivel tiene que construirse y mantenerse con verdadero cuidado, no lanzarse y olvidarse. La audiencia es más pequeña que el mercado de turismo masivo, así que la estrategia es profundidad sobre volumen — convertir a unos pocos clientes de alto valor en vez de capturar a muchos de bajo valor — lo que premia la calidad y castiga los atajos. Y alcanzar esta barra es una inversión; un sitio verdaderamente premium cuesta más de construir que uno básico, por la simple razón de que el pulido es el punto. Pero la matemática del lujo perdona eso con facilidad: cuando una sola venta de villa o una temporada de alquileres premium empequeñece el costo de la página web que la ganó, subinvertir en esa página web es el único error caro."),
        h2("Ser encontrado es diferente aquí — y aún importa"),
        p("Hay un matiz que vale la pena nombrar: el cliente de ultra lujo muchas veces no te descubre a través de una búsqueda genérica en Google como lo hace un turista de mercado masivo. Llega por referencia, a través de un bróker, desde la propia red del resort, o vía una búsqueda dirigida por algo específico y de alta intención — \"alquiler de villa en Cap Cana con personal\", \"chef privado St. Regis Cap Cana\", \"bienes raíces Punta Espada\". Eso cambia la prioridad del SEO pero no lo elimina. Significa que la meta no es posicionarse para términos de turismo amplios y de alto volumen; es adueñarse de las búsquedas estrechas y de alto valor que un comprador serio realmente escribe, y tener un sitio lo bastante pulido para que cuando una referencia sí te busque — cosa que siempre hacen — lo que encuentren confirme la recomendación en vez de socavarla. En el lujo, la búsqueda y la reputación trabajan juntas: la referencia los lleva a tu sitio, y el sitio tiene que terminar el trabajo. Un negocio invisible para sus términos de alta intención pierde al comprador que estaba listo; un negocio que se posiciona para ellos pero se ve barato pierde al comprador en la puerta. Necesitas ambos, y ambos son construibles."),
        h2("Construye a la altura del estándar, desde donde sea"),
        rich("normal", [run("El desarrollo web es trabajo remoto, así que un negocio que sirve a Cap Cana no necesita un desarrollador dentro de las rejas — necesita uno que entienda tanto el mercado dominicano como el exigente estándar que trae el cliente de lujo. Eso es exactamente lo que hacemos en "), link("DR Web Studio", "https://www.dr-webstudio.com/es"), run(": páginas web rápidas, hermosas y multilingües construidas con el pulido que esta clientela espera, con contacto elegante y el oficio técnico que mantiene un sitio rico en fotos cargando al instante. Construimos para negocios de turismo en toda República Dominicana, desde las fronteras emergentes hasta los enclaves de lujo, y Cap Cana es donde la calidad de la construcción más importa. Si tu negocio sirve a este mercado y tu página web todavía no está a la altura del estándar que tus clientes esperan, "), link("contáctanos para una consulta gratuita", "https://www.dr-webstudio.com/es/contacto"), run(" — hagamos tu primera impresión tan impecable como la experiencia que entregas.")]),
      ],
    },
    seo: {
      metaTitle: loc(
        "Cap Cana Websites: Match the Luxury Standard (2026)",
        "Webs Cap Cana: A la Altura del Lujo (2026)",
      ),
      ogTitle: loc(
        "Your Website Must Match the Luxury Standard",
        "Tu Página Web Debe Estar a la Altura del Lujo",
      ),
      ogDescription: loc(
        "St. Regis residences from $1M to $20M+, yachts to 150 feet, a butler-set standard. In an ultra-luxury market, your website is the first impression — and it must be flawless.",
        "Residencias St. Regis de $1M a $20M+, yates de 150 pies, un estándar de mayordomo. En un mercado de ultra lujo, tu web es la primera impresión — y debe ser impecable.",
      ),
      keywords: {
        en: ["Cap Cana luxury website", "Cap Cana real estate website", "luxury villa rental website", "Cap Cana concierge website", "luxury web design Punta Cana"],
        es: ["página web lujo Cap Cana", "página web inmobiliaria Cap Cana", "página web alquiler villas lujo", "página web concierge Cap Cana", "diseño web lujo Punta Cana"],
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