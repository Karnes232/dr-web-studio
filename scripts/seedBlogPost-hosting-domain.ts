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
    slug: "what-is-hosting-and-a-domain-explained-simply",
    slugEs: "que-es-el-hosting-y-un-dominio-explicado-simple",
    title: loc(
      "What Is Hosting and a Domain? Explained Simply",
      "¿Qué Es el Hosting y un Dominio? Explicado de Forma Simple",
    ),
    description: loc(
      "What is hosting and a domain? A plain-language explanation for business owners — what you are actually paying for, what it costs, and who should own it. Hint: you.",
      "¿Qué es el hosting y un dominio? Una explicación en lenguaje simple para dueños de negocios — qué estás pagando realmente, cuánto cuesta y quién debe ser el dueño. Pista: tú.",
    ),
    readTime: 8,
    featured: false,
    tags: {
      en: ["hosting", "domain", "DNS", "SSL", "beginners", "website basics", "ownership", "Dominican Republic"],
      es: ["hosting", "dominio", "DNS", "SSL", "principiantes", "básicos web", "propiedad", "República Dominicana"],
    },
    categories: ["web-design", "business-tips"],
    publishedAt: "2026-08-04T13:00:00.000Z",
    body: {
      en: [
        p("Almost every business owner getting their first website hits the same wall of vocabulary: domain, hosting, DNS, SSL, nameservers. Someone quotes you an annual fee for one thing and a monthly fee for another, and you're not entirely sure what either of them is or why you need both. It's a genuinely confusing topic explained badly by an industry that assumes you already know — and that confusion has real consequences, because the most expensive website mistakes Dominican businesses make are ownership mistakes made at this exact stage. So here it is in plain language: what these things actually are, what they should cost, and the one rule that protects you."),
        h2("The simplest way to understand it"),
        p("Forget the jargon and picture a physical business."),
        rich("normal", [run("•  "), run("The domain is your street address. `yourbusiness.com` is what people type to find you — the equivalent of \"Calle El Conde 52, Santo Domingo.\" It doesn't contain anything; it just points to where your business is. You rent it, typically year by year, from a registrar.")]),
        rich("normal", [run("•  "), run("The hosting is the land and the building's utilities. It's a computer somewhere in the world — a server — that's always on, always connected, storing your website's files and delivering them to anyone who asks. Without hosting, your address points to an empty lot.")]),
        rich("normal", [run("•  "), run("The website is the building itself. The design, the pages, the photos, the content — the thing your visitors actually experience, built once and standing on your hosted land.")]),
        p("That's the whole model. The address points to the land, and the building sits on it. Three separate things, three separate costs, and — this is the part that matters most — three things that can end up owned by three different people if you're not careful."),
        h2("What each actually costs"),
        rich("normal", [run("Real numbers, because vagueness here is how people get overcharged. A domain typically runs about US$10–20 per year for a `.com`. Dominican `.do` domains cost more and are administered locally, which is why many Dominican businesses use `.com` for international reach and add `.com.do` if they want the local signal. Domains renew annually and the price is essentially fixed — anyone charging you dramatically more is charging for the service of managing it, which is fine if disclosed and not fine if not.")]),
        rich("normal", [run("Hosting varies enormously because it's genuinely different products. Cheap shared hosting starts around a few dollars a month; better managed hosting for a business site runs more; and modern sites built on current frameworks are often deployed to platforms whose costs are folded into a maintenance arrangement. The honest guidance: hosting is not where to hunt for the last dollar of savings, because it directly determines your site's speed and uptime, and "), link("speed drives both rankings and sales", "https://www.dr-webstudio.com/en/blog/core-web-vitals-como-la-velocidad-afecta-tus-ventas-online"), run(". Cheap, overcrowded shared hosting is one of the most common hidden reasons a Dominican business site feels sluggish on mobile.")]),
        rich("normal", [run("The website is the one-time build cost — the actual project — and it's the number people usually mean when they ask what a website costs. The domain and hosting are the small recurring costs that keep it live.")]),
        h2("The rule that protects you: own everything yourself"),
        rich("normal", [run("Here is the single most important thing in this article. The domain and hosting accounts should be registered in your name, with your email, on accounts you control. Not your developer's account. Not your cousin's. Not \"the guy who set it up.\"")]),
        rich("normal", [run("This is the most common and most painful mistake we see. A business hires someone to build a site; that person registers the domain under their own account for convenience; years later the business wants to change developers, or the developer stops answering messages, moves abroad, or has a falling-out with the owner — and the business discovers it doesn't actually own its own web address. Whoever is listed as the registrant is the one with the rights: "), link("ICANN's registrant rules give the registered name holder the right to transfer, manage, and renew the domain", "https://www.icann.org/registrants"), run(", which is exactly why that name needs to be yours and not your developer's. The site, the email addresses on that domain, the SEO built over years, and the brand identity customers know are all effectively hostage. Sometimes it's resolved with an awkward conversation; sometimes with a payment; sometimes it's simply lost, and the business starts over on a new domain and loses everything it built. A professional developer will set these accounts up in your name and give you the credentials without being asked, because it's your asset. If anyone resists doing that, treat it as the serious warning sign it is.")]),
        h2("The other pieces you'll hear about"),
        p("Three more terms, briefly, so nothing sounds mysterious:"),
        rich("normal", [run("•  "), run("DNS is the directory that connects your domain to your hosting — the system that translates \"yourbusiness.com\" into the actual server location. You don't manage it day to day; you just need to know it exists and that changing it is how a site moves between hosts.")]),
        rich("normal", [run("•  "), run("SSL certificate is what puts the padlock in the browser and the \"s\" in `https://`. It encrypts the connection so data — contact forms, payments — travels privately. It's usually free and automatic these days, and a site without one gets flagged by browsers as \"not secure,\" which frightens customers off instantly. If your site shows that warning, fix it today.")]),
        rich("normal", [run("•  "), run("Email hosting is separate from website hosting, and worth its own line because professional email at your own domain (`info@yourbusiness.com` instead of a generic free address) is one of the cheapest credibility upgrades a Dominican business can buy.")]),
        h2("What can go wrong, and how to avoid it"),
        rich("normal", [run("Most website disasters trace back to this layer. Domains expire because the renewal notice went to an old email — set auto-renew on and keep the contact address current. Sites vanish because hosting lapsed or the host had no working backup — which is exactly why "), link("ongoing maintenance isn't optional", "https://www.dr-webstudio.com/en/blog/website-maintenance-why-its-not-optional"), run(". Businesses get locked out because they never had the logins in the first place — the ownership rule above. And sites run slowly for years because nobody realized the cheapest hosting tier was the cause. None of these are exotic technical failures; they're admin failures, and every one is prevented by knowing what you own and keeping the keys.")]),
        h2("Your five-minute ownership audit"),
        p("Whatever stage you're at, you can verify your position right now. First, look up your own domain in a public WHOIS lookup — many registrars and ICANN itself offer one — and see what registrant and organization it lists. If it's your developer's name, your agency's, or a privacy-service placeholder you didn't set up, that's your first conversation this week. Second, confirm you can actually log in to the registrar account yourself; \"my developer has it\" is not access. Third, check the expiry date and whether auto-renew is on, and make sure the contact email is one you still read — an expired domain can be resold within weeks, and buying it back, if it's even possible, costs vastly more than the renewal did. Fourth, confirm you can log in to the hosting account, or at minimum know who can and how quickly they respond. Fifth, ask where the backups live and whether anyone has ever restored one successfully. Five checks, five minutes, and they cover the failure modes that account for the overwhelming majority of website disasters. If any answer is \"I don't know,\" that's not a crisis — it's just the item to fix before it becomes one."),
        h2("An honest word on how much you need to care"),
        rich("normal", [run("Do you need to become an expert in any of this? No — and any developer who makes you feel you should is doing it wrong. The realistic goal is a business owner who understands the model well enough to ask three questions and recognize good answers: Is the domain registered in my name and do I have the login? Where is the site hosted and is it fast? Who renews these and what happens if that person disappears? If you can ask those, you're protected, and the technical management is a service someone else can competently handle for you. The knowledge isn't so you can do the work — it's so you can never be locked out of your own business's front door.")]),
        h2("Set it up right the first time"),
        rich("normal", [run("At "), link("DR Web Studio", "https://www.dr-webstudio.com/en"), run(" we register domains and set up hosting in the client's own name, hand over every credential as a matter of course, and manage the technical side as part of the "), link("ongoing maintenance and support", "https://www.dr-webstudio.com/en/our-services/ongoing-website-maintenance-and-support"), run(" that comes free for the first year — fast hosting, SSL handled, renewals tracked. If you're not sure who currently owns your domain, or you've inherited a setup nobody can explain, "), link("contact us for a free consultation", "https://www.dr-webstudio.com/en/contact"), run(" and we'll untangle it and put your business back in control of its own address.")]),
      ],
      es: [
        p("Casi todo dueño de negocio que consigue su primera página web choca con el mismo muro de vocabulario: dominio, hosting, DNS, SSL, servidores de nombres. Alguien te cotiza una cuota anual por una cosa y una cuota mensual por otra, y no estás del todo seguro de qué es ninguna de las dos ni por qué necesitas ambas. Es un tema genuinamente confuso explicado mal por una industria que asume que ya sabes — y esa confusión tiene consecuencias reales, porque los errores más caros que cometen los negocios dominicanos con sus páginas web son errores de propiedad cometidos exactamente en esta etapa. Así que aquí está en lenguaje simple: qué son realmente estas cosas, cuánto deberían costar, y la única regla que te protege."),
        h2("La forma más simple de entenderlo"),
        p("Olvida la jerga e imagina un negocio físico."),
        rich("normal", [run("•  "), run("El dominio es tu dirección. `tunegocio.com` es lo que la gente escribe para encontrarte — el equivalente de \"Calle El Conde 52, Santo Domingo.\" No contiene nada; solo apunta a dónde está tu negocio. Lo alquilas, típicamente año por año, de un registrador.")]),
        rich("normal", [run("•  "), run("El hosting es el terreno y los servicios del edificio. Es una computadora en algún lugar del mundo — un servidor — que está siempre encendida, siempre conectada, guardando los archivos de tu página web y entregándolos a quien los pida. Sin hosting, tu dirección apunta a un solar vacío.")]),
        rich("normal", [run("•  "), run("La página web es el edificio en sí. El diseño, las páginas, las fotos, el contenido — lo que tus visitantes realmente experimentan, construido una vez y parado sobre tu terreno alojado.")]),
        p("Ese es todo el modelo. La dirección apunta al terreno, y el edificio se para encima. Tres cosas separadas, tres costos separados, y — esta es la parte que más importa — tres cosas que pueden terminar siendo propiedad de tres personas distintas si no tienes cuidado."),
        h2("Cuánto cuesta realmente cada uno"),
        rich("normal", [run("Números reales, porque la vaguedad aquí es como a la gente le cobran de más. Un dominio típicamente cuesta unos US$10–20 por año para un `.com`. Los dominios dominicanos `.do` cuestan más y se administran localmente, que es por lo que muchos negocios dominicanos usan `.com` para alcance internacional y agregan `.com.do` si quieren la señal local. Los dominios se renuevan anualmente y el precio es esencialmente fijo — cualquiera que te cobre dramáticamente más te está cobrando por el servicio de administrarlo, lo cual está bien si se declara y no está bien si no.")]),
        rich("normal", [run("El hosting varía enormemente porque son productos genuinamente distintos. El hosting compartido barato empieza alrededor de unos dólares al mes; el hosting administrado mejor para un sitio de negocio cuesta más; y los sitios modernos construidos sobre frameworks actuales muchas veces se despliegan en plataformas cuyos costos se integran en un arreglo de mantenimiento. La guía honesta: el hosting no es donde cazar el último peso de ahorro, porque determina directamente la velocidad y disponibilidad de tu sitio, y "), link("la velocidad impulsa tanto el posicionamiento como las ventas", "https://www.dr-webstudio.com/es/blog/core-web-vitals-como-la-velocidad-afecta-tus-ventas-online"), run(". El hosting compartido barato y sobrepoblado es una de las razones ocultas más comunes de que el sitio de un negocio dominicano se sienta lento en móvil.")]),
        rich("normal", [run("La página web es el costo de construcción de una sola vez — el proyecto en sí — y es el número que la gente usualmente quiere decir cuando pregunta cuánto cuesta una página web. El dominio y el hosting son los pequeños costos recurrentes que la mantienen en línea.")]),
        h2("La regla que te protege: sé dueño de todo tú mismo"),
        rich("normal", [run("Aquí está lo más importante de este artículo. El dominio y las cuentas de hosting deben estar registrados a tu nombre, con tu correo, en cuentas que tú controlas. No en la cuenta de tu desarrollador. No en la de tu primo. No en la del \"muchacho que lo configuró.\"")]),
        rich("normal", [run("Este es el error más común y más doloroso que vemos. Un negocio contrata a alguien para construir un sitio; esa persona registra el dominio bajo su propia cuenta por conveniencia; años después el negocio quiere cambiar de desarrollador, o el desarrollador deja de responder mensajes, se muda al extranjero, o tiene un desacuerdo con el dueño — y el negocio descubre que en realidad no es dueño de su propia dirección web. Quien figure como registrante es quien tiene los derechos: "), link("las reglas de registrantes de ICANN otorgan al titular del nombre registrado el derecho de transferir, administrar y renovar el dominio", "https://www.icann.org/registrants"), run(", que es exactamente por qué ese nombre debe ser el tuyo y no el de tu desarrollador. El sitio, las direcciones de correo en ese dominio, el SEO construido durante años, y la identidad de marca que los clientes conocen quedan todos efectivamente de rehenes. A veces se resuelve con una conversación incómoda; a veces con un pago; a veces simplemente se pierde, y el negocio empieza de nuevo en un dominio nuevo y pierde todo lo que construyó. Un desarrollador profesional configurará estas cuentas a tu nombre y te dará las credenciales sin que se lo pidan, porque es tu activo. Si alguien se resiste a hacerlo, trátalo como la seria señal de alerta que es.")]),
        h2("Las otras piezas de las que oirás hablar"),
        p("Tres términos más, brevemente, para que nada suene misterioso:"),
        rich("normal", [run("•  "), run("DNS es el directorio que conecta tu dominio con tu hosting — el sistema que traduce \"tunegocio.com\" a la ubicación real del servidor. No lo administras día a día; solo necesitas saber que existe y que cambiarlo es cómo un sitio se muda entre hostings.")]),
        rich("normal", [run("•  "), run("Certificado SSL es lo que pone el candado en el navegador y la \"s\" en `https://`. Encripta la conexión para que los datos — formularios de contacto, pagos — viajen de forma privada. Hoy en día suele ser gratis y automático, y un sitio sin uno es marcado por los navegadores como \"no seguro,\" lo que espanta a los clientes al instante. Si tu sitio muestra esa advertencia, arréglala hoy.")]),
        rich("normal", [run("•  "), run("Hosting de correo es separado del hosting de la página web, y merece su propia línea porque el correo profesional en tu propio dominio (`info@tunegocio.com` en vez de una dirección gratuita genérica) es una de las mejoras de credibilidad más baratas que un negocio dominicano puede comprar.")]),
        h2("Qué puede salir mal, y cómo evitarlo"),
        rich("normal", [run("La mayoría de los desastres de páginas web se rastrean a esta capa. Los dominios expiran porque el aviso de renovación fue a un correo viejo — activa la renovación automática y mantén la dirección de contacto actualizada. Los sitios desaparecen porque el hosting venció o el proveedor no tenía un respaldo funcional — que es exactamente por qué "), link("el mantenimiento continuo no es opcional", "https://www.dr-webstudio.com/es/blog/mantenimiento-web-por-que-no-es-opcional"), run(". Los negocios quedan bloqueados porque nunca tuvieron los accesos en primer lugar — la regla de propiedad de arriba. Y los sitios corren lento durante años porque nadie se dio cuenta de que el plan de hosting más barato era la causa. Ninguna de estas es una falla técnica exótica; son fallas administrativas, y cada una se previene sabiendo qué posees y guardando las llaves.")]),
        h2("Tu auditoría de propiedad en cinco minutos"),
        p("En cualquier etapa que estés, puedes verificar tu posición ahora mismo. Primero, busca tu propio dominio en una consulta WHOIS pública — muchos registradores y la propia ICANN ofrecen una — y mira qué registrante y organización aparece. Si es el nombre de tu desarrollador, el de tu agencia, o un marcador de servicio de privacidad que tú no configuraste, esa es tu primera conversación de esta semana. Segundo, confirma que puedes realmente entrar a la cuenta del registrador tú mismo; \"mi desarrollador la tiene\" no es acceso. Tercero, revisa la fecha de vencimiento y si la renovación automática está activa, y asegúrate de que el correo de contacto sea uno que todavía leas — un dominio vencido puede revenderse en semanas, y recomprarlo, si acaso es posible, cuesta muchísimo más de lo que costaba la renovación. Cuarto, confirma que puedes entrar a la cuenta de hosting, o al menos saber quién puede y qué tan rápido responde. Quinto, pregunta dónde viven los respaldos y si alguien ha restaurado uno exitosamente alguna vez. Cinco revisiones, cinco minutos, y cubren los modos de falla que explican la abrumadora mayoría de los desastres de páginas web. Si alguna respuesta es \"no sé,\" eso no es una crisis — es simplemente el punto que hay que arreglar antes de que se convierta en una."),
        h2("Una palabra honesta sobre cuánto necesitas preocuparte"),
        rich("normal", [run("¿Necesitas volverte experto en todo esto? No — y cualquier desarrollador que te haga sentir que deberías lo está haciendo mal. La meta realista es un dueño de negocio que entienda el modelo lo bastante bien para hacer tres preguntas y reconocer buenas respuestas: ¿El dominio está registrado a mi nombre y tengo el acceso? ¿Dónde está alojado el sitio y es rápido? ¿Quién renueva esto y qué pasa si esa persona desaparece? Si puedes hacer esas, estás protegido, y la administración técnica es un servicio que alguien más puede manejar competentemente por ti. El conocimiento no es para que hagas el trabajo — es para que nunca te dejen fuera de la puerta principal de tu propio negocio.")]),
        h2("Configúralo bien desde la primera vez"),
        rich("normal", [run("En "), link("DR Web Studio", "https://www.dr-webstudio.com/es"), run(" registramos dominios y configuramos hosting a nombre del propio cliente, entregamos cada credencial como algo natural, y administramos el lado técnico como parte del "), link("mantenimiento y soporte continuo", "https://www.dr-webstudio.com/es/nuestros-servicios/mantenimiento-y-soporte-web-mensual"), run(" que viene gratis el primer año — hosting rápido, SSL manejado, renovaciones monitoreadas. Si no estás seguro de quién es dueño actualmente de tu dominio, o heredaste una configuración que nadie puede explicar, "), link("contáctanos para una consulta gratuita", "https://www.dr-webstudio.com/es/contacto"), run(" y la desenredamos y devolvemos a tu negocio el control de su propia dirección.")]),
      ],
    },
    seo: {
      metaTitle: loc(
        "Hosting & Domains Explained Simply (2026)",
        "Hosting y Dominios Explicados Simple (2026)",
      ),
      ogTitle: loc(
        "What Is Hosting and a Domain?",
        "¿Qué Es el Hosting y un Dominio?",
      ),
      ogDescription: loc(
        "The domain is your address, the hosting is your land, the website is the building. What each costs, why they renew separately, and the ownership mistake that traps businesses.",
        "El dominio es tu dirección, el hosting es tu terreno, la web es el edificio. Qué cuesta cada uno y el error de propiedad que deja atrapados a muchos negocios.",
      ),
      keywords: {
        en: ["what is hosting", "what is a domain", "hosting vs domain", "domain cost", "who owns my domain"],
        es: ["qué es el hosting", "qué es un dominio", "hosting vs dominio", "costo de un dominio", "quién es dueño de mi dominio"],
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