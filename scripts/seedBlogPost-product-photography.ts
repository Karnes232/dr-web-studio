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
    slug: "product-photography-that-sells",
    slugEs: "fotografia-de-producto-que-vende",
    title: loc(
      "Product Photography That Sells: A Practical Guide for Dominican Stores",
      "Fotografía de Producto Que Vende: Guía Práctica para Tiendas Dominicanas",
    ),
    description: loc(
      "Product photography that sells: how Dominican stores can shoot photos that convert — on a phone, with good light — and keep them loading fast on mobile.",
      "Fotografía de producto que vende: cómo las tiendas dominicanas pueden tomar fotos que convierten — con un teléfono y buena luz — y mantenerlas cargando rápido en móvil.",
    ),
    readTime: 8,
    featured: false,
    tags: {
      en: ["product photography", "e-commerce", "online store", "conversion", "images", "photos", "Dominican Republic"],
      es: ["fotografía de producto", "e-commerce", "tienda en línea", "conversión", "imágenes", "fotos", "República Dominicana"],
    },
    categories: ["business-tips"],
    publishedAt: "2026-07-16T14:00:00.000Z",
    body: {
      en: [
        rich("normal", [run("Online, your customer can't pick the product up. They can't feel the fabric, smell the candle, try on the ring, or taste the sauce. Everything a shopper would learn in your physical store, they have to learn from your photos — which means the photos aren't decorating your product pages; they are the product, as far as the buyer is concerned. The data backs this up emphatically: "), link("90% of shoppers say the quality of product photos is extremely or very important to their purchase decision — ahead of price, shipping costs, and reviews", "https://www.liquidweb.com/blog/ecommerce-statistics/"), run(". For a Dominican store, that's both a warning and an enormous opportunity, because most of your local competitors are still selling with dark, blurry, cluttered phone snaps. Here's how to shoot product photos that actually sell — without a professional studio — and the technical half most guides skip: keeping them fast.")]),
        h2("Why photos outsell descriptions"),
        rich("normal", [run("A shopper's trust works visually. Before they read a single word, they've already judged your product — and your store — from the image: does it look real, does it look cared-for, does this seller seem legitimate? Good photos answer questions before they're asked and objections before they're raised. Bad photos raise a question no description can answer: \"if they didn't bother photographing it properly, what else didn't they bother with?\" This is why photography punches so far above its weight in conversion. It's also why photos are one of the biggest levers behind returns and disputes: a customer who received exactly what the photo showed is a happy customer; one who received something that \"didn't look like the picture\" is a refund and a bad review. Honest, clear, complete photography sells more and generates fewer problems — a rare double win.")]),
        h2("The shot list every product needs"),
        p("You don't need dozens of images per product. You need the right four to six:"),
        rich("normal", [run("•  "), run("The clean hero. The product alone on a plain, uncluttered background — this is the main image, the one that appears in listings, search results, and your WhatsApp catalog. Simple background, product filling most of the frame, sharp focus.")]),
        rich("normal", [run("•  "), run("The detail shots. Close-ups of what quality looks like on your product: the stitching, the texture, the label, the clasp, the ingredients. These are the photos that substitute for touch.")]),
        rich("normal", [run("•  "), run("The context shot. The product in use or in scale — the bag on a shoulder, the plate on a set table, the plant in a room. Context lets the buyer imagine owning it, and it silently answers the most common question in e-commerce: \"how big is it actually?\"")]),
        rich("normal", [run("•  "), run("The honest shot. If the product has a quirk — a natural variation, a texture that surprises people — show it. The sale you \"lose\" by being honest is a return you avoided.")]),
        rich("normal", [run("•  "), run("Every variation. If it comes in four colors, photograph four colors. \"Color may vary\" is a phrase that costs sales.")]),
        h2("You can shoot this on your phone"),
        p("Here's the liberating truth: a modern phone camera is more than good enough for product photography that sells. What separates professional-looking photos from amateur ones isn't the camera — it's light, background, and consistency, and all three are free."),
        rich("normal", [run("•  "), run("Light: use a window, skip the flash. The single biggest upgrade available to any Dominican store owner is shooting beside a big window with indirect daylight — and in this country, there is no shortage of it. Direct hard sun creates harsh shadows; a bright window out of direct sun creates the soft, even light that makes products look premium. Never use the phone's flash; it flattens everything and creates glare.")]),
        rich("normal", [run("•  "), run("Background: plain and repeatable. A sheet of white poster board curved behind the product costs almost nothing and instantly looks professional. The rule is that nothing in the frame should compete with the product.")]),
        rich("normal", [run("•  "), run("Consistency: same setup, every product. Shoot your whole catalog with the same light, background, and angles. A store where every product photo matches looks organized and trustworthy; a store where each photo has different lighting and backgrounds looks like a flea market — even if the products are excellent.")]),
        rich("normal", [run("•  "), run("Editing: restraint. Brighten slightly, straighten, crop. Do not saturate colors beyond reality — the photo's job is to promise exactly what the box will contain.")]),
        h2("The technical half: beautiful photos that load fast"),
        rich("normal", [run("This is the part most photography guides skip, and in the Dominican market it's half the battle. Your customers are shopping on phones, often on mobile data, and product photos are by far the heaviest thing on a store page. Upload your images straight off the camera and you get a store that looks gorgeous on your Wi-Fi and takes eight seconds to load on your customer's data plan — and "), link("slow pages lose sales directly", "https://www.dr-webstudio.com/en/blog/core-web-vitals-como-la-velocidad-afecta-tus-ventas-online"), run(", through abandonment and through Google rankings alike. The craft of serving photos that are both beautiful and fast — modern formats, correct sizing, compression that's invisible to the eye, lazy loading — is exactly what we cover in "), link("image optimization for business websites", "https://www.dr-webstudio.com/en/blog/optimizacion-imagenes-sitios-web-turismo-fotos-alta-calidad-carga-rapida"), run(", and it's the difference between photography that converts and photography that quietly drives customers away before it even renders. A properly built store handles this automatically: you upload the big beautiful original, and the site serves each visitor the right size for their screen.")]),
        h2("The same photos work everywhere"),
        rich("normal", [run("One more practical payoff: shoot this shot list once and it powers every channel you sell on. The clean hero becomes your WhatsApp catalog image and your Instagram grid; the context shots become your stories and posts; the full set lives on your product pages where Google can find them. This matters because image search is a real acquisition channel — product photos on a real website can appear in Google's image results and shopping surfaces, which a photo trapped inside a chat app never will. If your store "), link("isn't selling the way it should", "https://www.dr-webstudio.com/en/blog/why-your-online-store-isnt-selling-dominican-republic"), run(", the photography is one of the first three things to audit — and if you're still selling entirely through WhatsApp, upgraded photos are also the moment to consider the storefront that lets strangers find them.")]),
        h2("The five mistakes that quietly kill sales"),
        rich("normal", [run("If you audit struggling Dominican product pages, the same five photography mistakes appear again and again. First, darkness — shooting indoors at night under a yellow bulb, which makes even new products look secondhand; daylight fixes this for free. Second, clutter — the product photographed on a bed, a car seat, or a busy counter, forcing the buyer to find it in the frame; the poster-board background fixes this for pennies. Third, the single photo — one image where the shot list above needs five, leaving the buyer's questions unanswered and the sale unclosed. Fourth, stolen images — using the manufacturer's or a competitor's photos, which shoppers recognize instantly and which scream \"reseller you can't verify,\" destroying the trust that original photos of your actual stock build automatically. And fifth, the WhatsApp compression spiral — photos forwarded chat to chat until the listing image is a smeared artifact of itself; always upload originals from the camera roll, never re-saved copies from a conversation. None of these mistakes costs money to fix. Every one of them costs sales daily until it's fixed.")]),
        h2("An honest word on when to hire a photographer"),
        p("Phone photography done carefully covers most Dominican stores brilliantly — but not all. If your product is jewelry, high-end fashion, or anything whose entire value proposition is visual luxury, a professional shoot is an investment that pays back, because at the premium tier your photos are competing with international brands' imagery. Similarly, if you have hundreds of products, a pro with a repeatable setup may cost less than the weeks of your own time. The honest rule: start with the phone-and-window method — it will already put you ahead of most local competition — and hire a professional when the math of your price point or your catalog size says so, not because a guide shamed you into it."),
        h2("Photos that sell, on a store built to serve them"),
        rich("normal", [run("At "), link("DR Web Studio", "https://www.dr-webstudio.com/en"), run(" we build the other half of this equation: fast, bilingual online stores where your photography looks stunning and loads instantly, with the image optimization handled automatically and WhatsApp and local payments wired in. Bring the photos; we'll build the store that does them justice. "), link("Contact us for a free consultation", "https://www.dr-webstudio.com/en/contact"), run(" and let's make what you sell look as good online as it does in your hands.")]),
      ],
      es: [
        rich("normal", [run("En línea, tu cliente no puede tomar el producto en sus manos. No puede sentir la tela, oler la vela, probarse el anillo ni degustar la salsa. Todo lo que un comprador aprendería en tu tienda física, tiene que aprenderlo de tus fotos — lo que significa que las fotos no están decorando tus páginas de producto; son el producto, en lo que al comprador respecta. Los datos lo respaldan con énfasis: "), link("el 90% de los compradores dice que la calidad de las fotos de producto es extremadamente o muy importante para su decisión de compra — por encima del precio, los costos de envío y las reseñas", "https://www.liquidweb.com/blog/ecommerce-statistics/"), run(". Para una tienda dominicana, eso es una advertencia y una oportunidad enorme a la vez, porque la mayoría de tus competidores locales todavía venden con fotos de celular oscuras, borrosas y desordenadas. Aquí está cómo tomar fotos de producto que realmente venden — sin un estudio profesional — y la mitad técnica que la mayoría de las guías omite: mantenerlas rápidas.")]),
        h2("Por qué las fotos venden más que las descripciones"),
        rich("normal", [run("La confianza de un comprador funciona visualmente. Antes de leer una sola palabra, ya juzgó tu producto — y tu tienda — desde la imagen: ¿se ve real, se ve cuidado, este vendedor parece legítimo? Las buenas fotos responden preguntas antes de que se hagan y objeciones antes de que se levanten. Las malas fotos levantan una pregunta que ninguna descripción puede responder: \"si no se molestaron en fotografiarlo bien, ¿en qué más no se molestaron?\" Por esto la fotografía pesa tanto más de lo que parece en la conversión. También es por esto que las fotos son una de las palancas más grandes detrás de las devoluciones y disputas: un cliente que recibió exactamente lo que la foto mostraba es un cliente feliz; uno que recibió algo que \"no se veía como en la foto\" es un reembolso y una mala reseña. La fotografía honesta, clara y completa vende más y genera menos problemas — una doble victoria rara.")]),
        h2("La lista de tomas que todo producto necesita"),
        p("No necesitas docenas de imágenes por producto. Necesitas las cuatro a seis correctas:"),
        rich("normal", [run("•  "), run("La toma principal limpia. El producto solo sobre un fondo plano y despejado — esta es la imagen principal, la que aparece en listados, resultados de búsqueda y tu catálogo de WhatsApp. Fondo simple, producto llenando la mayor parte del encuadre, enfoque nítido.")]),
        rich("normal", [run("•  "), run("Las tomas de detalle. Primeros planos de cómo se ve la calidad en tu producto: la costura, la textura, la etiqueta, el broche, los ingredientes. Estas son las fotos que sustituyen al tacto.")]),
        rich("normal", [run("•  "), run("La toma de contexto. El producto en uso o a escala — el bolso en un hombro, el plato en una mesa puesta, la planta en una habitación. El contexto deja al comprador imaginarse siendo dueño, y responde en silencio la pregunta más común del e-commerce: \"¿qué tan grande es en realidad?\"")]),
        rich("normal", [run("•  "), run("La toma honesta. Si el producto tiene una particularidad — una variación natural, una textura que sorprende — muéstrala. La venta que \"pierdes\" por ser honesto es una devolución que evitaste.")]),
        rich("normal", [run("•  "), run("Cada variación. Si viene en cuatro colores, fotografía los cuatro colores. \"El color puede variar\" es una frase que cuesta ventas.")]),
        h2("Puedes tomar esto con tu teléfono"),
        p("Aquí está la verdad liberadora: la cámara de un teléfono moderno es más que suficiente para fotografía de producto que vende. Lo que separa las fotos de aspecto profesional de las amateur no es la cámara — es la luz, el fondo y la consistencia, y las tres son gratis."),
        rich("normal", [run("•  "), run("Luz: usa una ventana, olvida el flash. La mejora más grande disponible para cualquier dueño de tienda dominicano es fotografiar junto a una ventana grande con luz de día indirecta — y en este país, de eso no hay escasez. El sol directo y duro crea sombras ásperas; una ventana luminosa fuera del sol directo crea la luz suave y pareja que hace que los productos se vean premium. Nunca uses el flash del teléfono; aplana todo y crea reflejos.")]),
        rich("normal", [run("•  "), run("Fondo: plano y repetible. Una cartulina blanca curvada detrás del producto cuesta casi nada y se ve profesional al instante. La regla es que nada en el encuadre debe competir con el producto.")]),
        rich("normal", [run("•  "), run("Consistencia: la misma configuración, cada producto. Fotografía todo tu catálogo con la misma luz, fondo y ángulos. Una tienda donde cada foto de producto coincide se ve organizada y confiable; una tienda donde cada foto tiene iluminación y fondos distintos se ve como un mercado de pulgas — aunque los productos sean excelentes.")]),
        rich("normal", [run("•  "), run("Edición: contención. Aclara un poco, endereza, recorta. No satures los colores más allá de la realidad — el trabajo de la foto es prometer exactamente lo que la caja va a contener.")]),
        h2("La mitad técnica: fotos hermosas que cargan rápido"),
        rich("normal", [run("Esta es la parte que la mayoría de las guías de fotografía omite, y en el mercado dominicano es la mitad de la batalla. Tus clientes compran desde teléfonos, muchas veces con datos móviles, y las fotos de producto son por lejos lo más pesado de una página de tienda. Sube tus imágenes directo de la cámara y obtienes una tienda que se ve preciosa en tu Wi-Fi y tarda ocho segundos en cargar en el plan de datos de tu cliente — y "), link("las páginas lentas pierden ventas directamente", "https://www.dr-webstudio.com/es/blog/core-web-vitals-como-la-velocidad-afecta-tus-ventas-online"), run(", por abandono y por el posicionamiento de Google por igual. El oficio de servir fotos que son hermosas y rápidas a la vez — formatos modernos, tamaños correctos, compresión invisible al ojo, carga diferida — es exactamente lo que cubrimos en "), link("optimización de imágenes para páginas web de negocios", "https://www.dr-webstudio.com/es/blog/optimizacion-imagenes-sitios-web-turismo-fotos-alta-calidad-carga-rapida"), run(", y es la diferencia entre fotografía que convierte y fotografía que silenciosamente espanta a los clientes antes de siquiera renderizar. Una tienda bien construida maneja esto automáticamente: subes el original grande y hermoso, y el sitio le sirve a cada visitante el tamaño correcto para su pantalla.")]),
        h2("Las mismas fotos funcionan en todas partes"),
        rich("normal", [run("Un beneficio práctico más: toma esta lista de fotos una vez y alimenta cada canal donde vendes. La toma principal limpia se convierte en tu imagen de catálogo de WhatsApp y tu cuadrícula de Instagram; las tomas de contexto se convierten en tus historias y publicaciones; el conjunto completo vive en tus páginas de producto donde Google puede encontrarlas. Esto importa porque la búsqueda de imágenes es un canal de adquisición real — las fotos de producto en una página web real pueden aparecer en los resultados de imágenes y las superficies de compras de Google, cosa que una foto atrapada dentro de una app de chat nunca hará. Si tu tienda "), link("no está vendiendo como debería", "https://www.dr-webstudio.com/es/blog/por-que-tu-tienda-en-linea-no-vende-republica-dominicana"), run(", la fotografía es una de las primeras tres cosas que auditar — y si todavía vendes enteramente por WhatsApp, las fotos mejoradas son también el momento de considerar la vitrina que deja que los desconocidos las encuentren.")]),
        h2("Los cinco errores que matan ventas en silencio"),
        rich("normal", [run("Si auditas páginas de producto dominicanas que no venden, los mismos cinco errores de fotografía aparecen una y otra vez. Primero, la oscuridad — fotografiar de noche bajo un bombillo amarillo, que hace que hasta los productos nuevos se vean de segunda mano; la luz de día lo arregla gratis. Segundo, el desorden — el producto fotografiado sobre una cama, un asiento de carro o un mostrador lleno, obligando al comprador a encontrarlo en el encuadre; el fondo de cartulina lo arregla por centavos. Tercero, la foto única — una imagen donde la lista de tomas de arriba necesita cinco, dejando las preguntas del comprador sin responder y la venta sin cerrar. Cuarto, las imágenes robadas — usar las fotos del fabricante o de un competidor, que los compradores reconocen al instante y que gritan \"revendedor que no puedes verificar,\" destruyendo la confianza que las fotos originales de tu inventario real construyen automáticamente. Y quinto, la espiral de compresión de WhatsApp — fotos reenviadas de chat en chat hasta que la imagen del listado es una mancha de sí misma; sube siempre originales del carrete de la cámara, nunca copias re-guardadas de una conversación. Ninguno de estos errores cuesta dinero arreglar. Cada uno de ellos cuesta ventas a diario hasta que se arregla.")]),
        h2("Una palabra honesta sobre cuándo contratar a un fotógrafo"),
        p("La fotografía con teléfono hecha con cuidado cubre a la mayoría de las tiendas dominicanas brillantemente — pero no a todas. Si tu producto es joyería, moda de alta gama, o cualquier cosa cuya propuesta de valor entera es lujo visual, una sesión profesional es una inversión que se paga sola, porque en el nivel premium tus fotos compiten con las imágenes de marcas internacionales. Igualmente, si tienes cientos de productos, un profesional con una configuración repetible puede costar menos que las semanas de tu propio tiempo. La regla honesta: empieza con el método de teléfono-y-ventana — ya te pondrá por delante de la mayoría de la competencia local — y contrata a un profesional cuando la matemática de tu precio o el tamaño de tu catálogo lo diga, no porque una guía te avergonzó para hacerlo."),
        h2("Fotos que venden, en una tienda construida para servirlas"),
        rich("normal", [run("En "), link("DR Web Studio", "https://www.dr-webstudio.com/es"), run(" construimos la otra mitad de esta ecuación: tiendas en línea rápidas y bilingües donde tu fotografía se ve impresionante y carga al instante, con la optimización de imágenes manejada automáticamente y WhatsApp y pagos locales integrados. Trae las fotos; nosotros construimos la tienda que les hace justicia. "), link("Contáctanos para una consulta gratuita", "https://www.dr-webstudio.com/es/contacto"), run(" y hagamos que lo que vendes se vea tan bien en línea como se ve en tus manos.")]),
      ],
    },
    seo: {
      metaTitle: loc(
        "Product Photography That Sells (2026 Guide)",
        "Fotografía de Producto Que Vende (Guía 2026)",
      ),
      ogTitle: loc(
        "Product Photography That Sells",
        "Fotografía de Producto Que Vende",
      ),
      ogDescription: loc(
        "9 in 10 shoppers say photo quality shapes their buying decision. The practical guide to product photos that sell — shot on a phone, optimized to load fast.",
        "9 de cada 10 compradores dicen que la calidad de las fotos define su decisión de compra. La guía práctica de fotos de producto que venden — con un teléfono, optimizadas para cargar rápido.",
      ),
      keywords: {
        en: ["product photography ecommerce", "product photos that sell", "how to photograph products phone", "product photography tips online store", "product images conversion"],
        es: ["fotografía de producto e-commerce", "fotos de producto que venden", "cómo fotografiar productos con teléfono", "consejos fotografía de producto tienda", "imágenes de producto conversión"],
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