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
    slug: "website-maintenance-why-its-not-optional",
    slugEs: "mantenimiento-web-por-que-no-es-opcional",
    title: loc(
      "Website Maintenance: Why It's Not Optional",
      "Mantenimiento Web: Por Qué No Es Opcional",
    ),
    description: loc(
      "Website maintenance is not optional: updates, security, backups, and speed decay silently until something breaks. What maintenance actually covers and what neglect costs.",
      "El mantenimiento web no es opcional: actualizaciones, seguridad, respaldos y velocidad decaen en silencio hasta que algo se rompe. Qué cubre realmente y qué cuesta descuidarlo.",
    ),
    readTime: 8,
    featured: false,
    tags: {
      en: ["maintenance", "security", "backups", "updates", "website care", "small business", "Dominican Republic"],
      es: ["mantenimiento", "seguridad", "respaldos", "actualizaciones", "cuidado web", "pequeño negocio", "República Dominicana"],
    },
    categories: ["business-tips"],
    publishedAt: "2026-07-28T13:00:00.000Z",
    body: {
      en: [
        p("A website isn't a billboard you paint once. It's closer to a car: it runs on software that ages, parts that need updating, and an environment full of hazards — and like a car, skipping the maintenance doesn't save money, it defers a bigger bill. Yet \"maintenance\" is the line item business owners most often question, because when a site looks fine on the surface, paying to keep it that way feels like paying for nothing. Here's what website maintenance actually covers, what silently goes wrong without it, and why the cheapest website you'll ever own is the one that's properly looked after."),
        h2("Websites decay silently — that's the trap"),
        p("The dangerous thing about website neglect is that nothing announces it. A site doesn't creak or leak; it degrades invisibly on four fronts at once, and by the time the symptom is visible — a hack, a blank page, a form that hasn't delivered a message in months — the damage is already done. Software running the site accumulates known vulnerabilities as new flaws are published. Speed erodes as content piles up and the web's standards move on. Backups that nobody verified turn out to be broken exactly when they're needed. And small breakages — an expired certificate, a payment button that stopped working after a provider update, a contact form silently failing — sit there costing customers until someone happens to notice. Maintenance isn't polishing a working site; it's the ongoing work of keeping \"working\" true."),
        h2("The security half: unpatched sites get hacked"),
        rich("normal", [run("The heart of maintenance is updates, and the case for them is not theoretical. Every piece of software your site runs — the platform, its plugins, its server — regularly publishes security patches for newly discovered flaws, and attackers run automated scanners hunting for sites that haven't applied them. The data on how this ends is stark: "), link("Sucuri's analysis of hacked websites found that roughly 39% were running outdated software at the moment of infection, and nearly half of compromised sites contained a backdoor", "https://sucuri.net/reports/2023-hacked-website-report/"), run(" left behind for repeat access. And a hacked site isn't just an IT problem — it's your customers seeing spam or malware warnings, Google flagging or delisting your pages, your email reputation burning, and days of cleanup that cost more than years of maintenance would have. Small business owners often assume they're too small to target; the scanners disagree, because they don't choose targets — they find them.")]),
        h2("The performance half: speed is perishable"),
        rich("normal", [run("Even a site that's never hacked loses value without care, because performance decays. Images accumulate, plugins multiply, third-party scripts pile on, and the fast site you launched drifts slower month by month — while Google's expectations move the other way. Since "), link("speed is both a ranking factor and a conversion factor", "https://www.dr-webstudio.com/en/blog/core-web-vitals-como-la-velocidad-afecta-tus-ventas-online"), run(", this drift has a real price: positions slip, visitors bounce, and nobody connects the slow decline in inquiries to the site quietly gaining weight. Maintenance keeps the speed you paid for — monitoring performance, keeping images and code lean, and catching regressions when they're introduced rather than a year later.")]),
        h2("The business half: the small breakages that cost the most"),
        rich("normal", [run("The least glamorous maintenance work prevents the most expensive failures. An SSL certificate that lapses turns your site into a browser security warning overnight. A contact form that breaks after an update fails silently — the visitor thinks they wrote to you, you think nobody's writing, and weeks of leads evaporate before anyone notices. A WhatsApp link that stopped working, a menu PDF that 404s, a booking integration a provider changed — each one is a small technical detail and a large business hole. Part of real maintenance is simply checking: verifying the forms deliver, the links resolve, the payments process, and the backups restore. It's unimpressive work with an unbeatable return, because the alternative is finding out from an annoyed customer — the one in ten who bothers to tell you instead of moving on.")]),
        h2("What proper maintenance actually includes"),
        rich("normal", [run("So that \"maintenance\" stops being a vague word, here's what it should concretely cover: software and security updates applied promptly; regular backups that are actually tested by restoring them; uptime and performance monitoring so problems are caught before customers report them; SSL and domain renewals handled before they lapse; periodic checks of forms, links, payments, and integrations; small content updates — hours, prices, staff changes — so the site stays true; and a real person to call when something odd happens. If a maintenance plan can't tell you which of these it includes, it's a subscription, not a service. And there's a bonus most owners never see: a consistently updated, healthy, fresh site sends exactly the signals Google rewards, which means maintenance quietly supports the "), link("visibility you worked to build", "https://www.dr-webstudio.com/en/blog/que-es-robots-txt-esta-bloqueando-google-sitio-web-dominicano"), run(" rather than letting it erode.")]),
        h2("Signs your site is overdue for a checkup"),
        rich("normal", [run("Not sure whether any of this applies to your site? A quick self-diagnosis. When did someone last send a test message through your contact form and confirm it arrived? If you don't know, that's the answer. Does your site's copyright footer still say a year from the previous government? Do your listed hours, prices, or menu match reality? Open your site on a phone with mobile data, not Wi-Fi — does it load in a couple of seconds, or do you find yourself waiting? Has anyone looked at your search rankings since launch, or checked whether Google still indexes all your pages? And the big one: if your site vanished tonight — server failure, hack, expired account — do you know, concretely, who has the backup and how fast it could be restored? If more than a couple of these questions produced a shrug, your site isn't maintained; it's abandoned in place, and it's quietly billing you for it in lost customers. The good news is that every one of these has a simple, inexpensive fix — the entire discipline of maintenance is just answering these questions continuously instead of never.")]),
        h2("The math of neglect"),
        p("Run the honest comparison. Professional maintenance costs a modest, predictable monthly amount. The alternative's costs arrive in lumps: an emergency hack cleanup (routinely several times a year of maintenance fees), a rebuilt site because there was no working backup, the invisible months of a broken form, the slow leak of rankings from a slowing site, and the credibility a security warning burns. None of these is guaranteed to happen this year — that's what makes neglect feel free. All of them become likelier every unpatched month, and any single one costs more than the maintenance that would have prevented it. It's insurance, except better: unlike insurance, maintenance also actively improves the asset while protecting it."),
        h2("An honest word on doing it yourself"),
        p("Can a business owner handle maintenance themselves? Some of it, honestly, yes: many platforms apply basic updates automatically, and anyone can click through their own site monthly to check the forms and links. The catch is consistency and judgment — updates occasionally break things and need someone who can fix what they break; backups need testing, not just existing; security monitoring means knowing what's abnormal. The realistic question isn't capability but attention: maintenance is exactly the kind of important-but-never-urgent task that a busy owner defers indefinitely, and deferred is how sites end up in the statistics above. If you'll genuinely do it on a schedule, do it. If you know yourself better than that, make it someone's paid job."),
        h2("Maintenance the way it should work"),
        rich("normal", [run("At "), link("DR Web Studio", "https://www.dr-webstudio.com/en"), run(", maintenance isn't an upsell — it's how we make sure the site we built keeps doing its job. Every project includes the first year of maintenance at no cost, then continues affordably: updates, monitored backups, security, performance checks, and content tweaks, handled by the people who built the site — the full picture is on our "), link("website maintenance and support service page", "https://www.dr-webstudio.com/en/our-services/ongoing-website-maintenance-and-support"), run(". If your current site hasn't been touched since launch and you're not sure what state it's really in, "), link("contact us for a free consultation", "https://www.dr-webstudio.com/en/contact"), run(" — we'll check, tell you honestly, and keep it healthy from here.")]),
      ],
      es: [
        p("Una página web no es una valla que pintas una vez. Se parece más a un carro: funciona con software que envejece, piezas que necesitan actualización, y un entorno lleno de peligros — y como un carro, saltarse el mantenimiento no ahorra dinero, aplaza una factura más grande. Aun así, el \"mantenimiento\" es la partida que los dueños de negocios más cuestionan, porque cuando un sitio se ve bien en la superficie, pagar por mantenerlo así se siente como pagar por nada. Aquí está lo que el mantenimiento web realmente cubre, lo que sale mal en silencio sin él, y por qué la página web más barata que jamás tendrás es la que está bien cuidada."),
        h2("Las páginas web decaen en silencio — esa es la trampa"),
        p("Lo peligroso del descuido de una página web es que nada lo anuncia. Un sitio no rechina ni gotea; se degrada invisiblemente en cuatro frentes a la vez, y para cuando el síntoma es visible — un hackeo, una página en blanco, un formulario que no ha entregado un mensaje en meses — el daño ya está hecho. El software que corre el sitio acumula vulnerabilidades conocidas a medida que se publican fallas nuevas. La velocidad se erosiona a medida que el contenido se apila y los estándares de la web avanzan. Los respaldos que nadie verificó resultan estar rotos exactamente cuando se necesitan. Y las roturas pequeñas — un certificado vencido, un botón de pago que dejó de funcionar tras una actualización del proveedor, un formulario de contacto fallando en silencio — se quedan ahí costando clientes hasta que alguien las nota por casualidad. El mantenimiento no es pulir un sitio que funciona; es el trabajo continuo de mantener verdadero el \"funciona.\""),
        h2("La mitad de seguridad: los sitios sin parchar son hackeados"),
        rich("normal", [run("El corazón del mantenimiento son las actualizaciones, y el argumento a su favor no es teórico. Cada pieza de software que corre tu sitio — la plataforma, sus plugins, su servidor — publica regularmente parches de seguridad para fallas recién descubiertas, y los atacantes corren escáneres automáticos cazando sitios que no los han aplicado. Los datos de cómo termina esto son crudos: "), link("el análisis de sitios hackeados de Sucuri encontró que cerca del 39% corría software desactualizado al momento de la infección, y casi la mitad de los sitios comprometidos contenía una puerta trasera", "https://sucuri.net/reports/2023-hacked-website-report/"), run(" dejada para el acceso repetido. Y un sitio hackeado no es solo un problema de informática — son tus clientes viendo spam o advertencias de malware, Google marcando o quitando tus páginas, la reputación de tu correo quemándose, y días de limpieza que cuestan más de lo que años de mantenimiento habrían costado. Los dueños de negocios pequeños suelen asumir que son demasiado pequeños para ser objetivo; los escáneres no están de acuerdo, porque no eligen objetivos — los encuentran.")]),
        h2("La mitad de rendimiento: la velocidad es perecedera"),
        rich("normal", [run("Incluso un sitio que nunca es hackeado pierde valor sin cuidado, porque el rendimiento decae. Las imágenes se acumulan, los plugins se multiplican, los scripts de terceros se apilan, y el sitio rápido que lanzaste deriva más lento mes a mes — mientras las expectativas de Google se mueven en dirección contraria. Como "), link("la velocidad es factor de posicionamiento y de conversión a la vez", "https://www.dr-webstudio.com/es/blog/core-web-vitals-como-la-velocidad-afecta-tus-ventas-online"), run(", esta deriva tiene un precio real: las posiciones se resbalan, los visitantes rebotan, y nadie conecta el declive lento de las consultas con el sitio ganando peso silenciosamente. El mantenimiento conserva la velocidad por la que pagaste — monitoreando el rendimiento, manteniendo imágenes y código ligeros, y atrapando las regresiones cuando se introducen en vez de un año después.")]),
        h2("La mitad de negocio: las roturas pequeñas que más cuestan"),
        rich("normal", [run("El trabajo de mantenimiento menos glamoroso previene las fallas más caras. Un certificado SSL que caduca convierte tu sitio en una advertencia de seguridad del navegador de la noche a la mañana. Un formulario de contacto que se rompe tras una actualización falla en silencio — el visitante cree que te escribió, tú crees que nadie escribe, y semanas de prospectos se evaporan antes de que alguien lo note. Un enlace de WhatsApp que dejó de funcionar, un PDF de menú que da 404, una integración de reservas que un proveedor cambió — cada uno es un detalle técnico pequeño y un hoyo de negocio grande. Parte del mantenimiento real es simplemente verificar: comprobar que los formularios entregan, los enlaces resuelven, los pagos procesan y los respaldos restauran. Es trabajo poco impresionante con un retorno imbatible, porque la alternativa es enterarte por un cliente molesto — el uno de cada diez que se molesta en decírtelo en vez de seguir de largo.")]),
        h2("Qué incluye realmente un mantenimiento adecuado"),
        rich("normal", [run("Para que \"mantenimiento\" deje de ser una palabra vaga, esto es lo que debería cubrir concretamente: actualizaciones de software y seguridad aplicadas con prontitud; respaldos regulares que realmente se prueban restaurándolos; monitoreo de disponibilidad y rendimiento para atrapar los problemas antes de que los clientes los reporten; renovaciones de SSL y dominio manejadas antes de que caduquen; revisiones periódicas de formularios, enlaces, pagos e integraciones; actualizaciones pequeñas de contenido — horarios, precios, cambios de personal — para que el sitio siga siendo verdad; y una persona real a quien llamar cuando algo raro pasa. Si un plan de mantenimiento no puede decirte cuáles de estas incluye, es una suscripción, no un servicio. Y hay un bono que la mayoría de los dueños nunca ve: un sitio consistentemente actualizado, sano y fresco envía exactamente las señales que Google premia, lo que significa que el mantenimiento apoya silenciosamente la "), link("visibilidad que trabajaste por construir", "https://www.dr-webstudio.com/es/blog/que-es-robots-txt-esta-bloqueando-google-sitio-web-dominicano"), run(" en vez de dejarla erosionarse.")]),
        h2("Señales de que tu sitio necesita una revisión urgente"),
        rich("normal", [run("¿No estás seguro de si algo de esto aplica a tu sitio? Un auto-diagnóstico rápido. ¿Cuándo fue la última vez que alguien envió un mensaje de prueba por tu formulario de contacto y confirmó que llegó? Si no lo sabes, esa es la respuesta. ¿El pie de página de tu sitio todavía dice un año del gobierno pasado? ¿Tus horarios, precios o menú listados coinciden con la realidad? Abre tu sitio en un teléfono con datos móviles, no Wi-Fi — ¿carga en un par de segundos, o te encuentras esperando? ¿Alguien ha mirado tu posicionamiento en búsqueda desde el lanzamiento, o verificado si Google todavía indexa todas tus páginas? Y la grande: si tu sitio desapareciera esta noche — falla del servidor, hackeo, cuenta vencida — ¿sabes, en concreto, quién tiene el respaldo y qué tan rápido podría restaurarse? Si más de un par de estas preguntas produjo un encogimiento de hombros, tu sitio no está mantenido; está abandonado en su lugar, y te está cobrando en silencio en clientes perdidos. La buena noticia es que cada una de estas tiene un arreglo simple y barato — toda la disciplina del mantenimiento es solo responder estas preguntas continuamente en vez de nunca.")]),
        h2("La matemática del descuido"),
        p("Corre la comparación honesta. El mantenimiento profesional cuesta un monto mensual modesto y predecible. Los costos de la alternativa llegan en golpes: una limpieza de hackeo de emergencia (rutinariamente varias veces un año de cuotas de mantenimiento), un sitio reconstruido porque no había respaldo funcional, los meses invisibles de un formulario roto, la fuga lenta de posicionamiento de un sitio que se ralentiza, y la credibilidad que quema una advertencia de seguridad. Ninguno de estos está garantizado a pasar este año — eso es lo que hace que el descuido se sienta gratis. Todos se vuelven más probables con cada mes sin parchar, y cualquiera de ellos por sí solo cuesta más que el mantenimiento que lo habría prevenido. Es un seguro, pero mejor: a diferencia de un seguro, el mantenimiento también mejora activamente el activo mientras lo protege."),
        h2("Una palabra honesta sobre hacerlo tú mismo"),
        p("¿Puede un dueño de negocio manejar el mantenimiento él mismo? Parte de él, honestamente, sí: muchas plataformas aplican actualizaciones básicas automáticamente, y cualquiera puede recorrer su propio sitio mensualmente para revisar los formularios y enlaces. El truco está en la consistencia y el criterio — las actualizaciones ocasionalmente rompen cosas y necesitan a alguien que pueda arreglar lo que rompen; los respaldos necesitan probarse, no solo existir; el monitoreo de seguridad implica saber qué es anormal. La pregunta realista no es de capacidad sino de atención: el mantenimiento es exactamente el tipo de tarea importante-pero-nunca-urgente que un dueño ocupado aplaza indefinidamente, y aplazado es como los sitios terminan en las estadísticas de arriba. Si genuinamente lo harás con calendario, hazlo. Si te conoces mejor que eso, hazlo el trabajo pagado de alguien."),
        h2("El mantenimiento como debería funcionar"),
        rich("normal", [run("En "), link("DR Web Studio", "https://www.dr-webstudio.com/es"), run(", el mantenimiento no es una venta adicional — es cómo nos aseguramos de que el sitio que construimos siga haciendo su trabajo. Cada proyecto incluye el primer año de mantenimiento sin costo, y luego continúa a precio accesible: actualizaciones, respaldos monitoreados, seguridad, revisiones de rendimiento y ajustes de contenido, manejados por las personas que construyeron el sitio — el panorama completo está en nuestra "), link("página del servicio de mantenimiento y soporte web", "https://www.dr-webstudio.com/es/nuestros-servicios/mantenimiento-y-soporte-web-mensual"), run(". Si tu sitio actual no se ha tocado desde el lanzamiento y no estás seguro de en qué estado está realmente, "), link("contáctanos para una consulta gratuita", "https://www.dr-webstudio.com/es/contacto"), run(" — lo revisamos, te decimos honestamente, y lo mantenemos sano de aquí en adelante.")]),
      ],
    },
    seo: {
      metaTitle: loc(
        "Website Maintenance: Not Optional (2026)",
        "Mantenimiento Web: No Es Opcional (2026)",
      ),
      ogTitle: loc(
        "Website Maintenance: Why It's Not Optional",
        "Mantenimiento Web: Por Qué No Es Opcional",
      ),
      ogDescription: loc(
        "Websites decay silently: outdated software gets hacked, backups go missing, speed erodes, forms break unnoticed. What real maintenance covers — and the price of skipping it.",
        "Las webs decaen en silencio: el software desactualizado es hackeado, los respaldos faltan, la velocidad se erosiona, los formularios se rompen. Qué cubre el mantenimiento real.",
      ),
      keywords: {
        en: ["website maintenance", "website security updates", "website backups", "website maintenance cost", "why website maintenance matters"],
        es: ["mantenimiento de página web", "actualizaciones seguridad web", "respaldos página web", "costo mantenimiento web", "por qué importa el mantenimiento web"],
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