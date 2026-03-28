// Pillar Page Data: Complete Guide to Modern Web Development for Business (ENGLISH)

export interface PillarPageSection {
  id: string
  title: string
  subtitle?: string
  content: string[]
  subsections?: Subsection[]
}

export interface Subsection {
  title: string
  content: string[]
  list?: ListItem[]
  highlight?: HighlightBox
}

export interface ListItem {
  icon?: string
  title: string
  description: string
}

export interface HighlightBox {
  type: "info" | "warning" | "success" | "tip"
  title: string
  content: string
}

export interface ComparisonItem {
  feature: string
  traditional: {
    value: string
    icon: string
    description?: string
  }
  modern: {
    value: string
    icon: string
    description?: string
  }
}

export interface TechStackItem {
  name: string
  category: "frontend" | "backend" | "database" | "devops" | "tools"
  description: string
  icon: string
  benefits: string[]
  useCases: string[]
  popularity?: number
}

export interface ROIMetric {
  metric: string
  traditional: number
  modern: number
  improvement: string
  unit: string
}

export interface CaseStudy {
  id: string
  client: string
  industry: string
  challenge: string
  solution: string[]
  results: {
    metric: string
    before: string
    after: string
    improvement: string
  }[]
  technologies: string[]
  timeline: string
  testimonial?: {
    quote: string
    author: string
    role: string
  }
}

export interface ProcessStep {
  step: number
  title: string
  description: string
  duration: string
  deliverables: string[]
  icon: string
}

// ============================================
// HERO SECTION
// ============================================

export const heroData = {
  headline: "Complete Guide to Modern Web Development for Business",
  subheadline:
    "Everything you need to know to transform your digital presence and accelerate your company's growth with cutting-edge technology",
  stats: [
    { value: "300%", label: "Average increase in conversions" },
    { value: "5x", label: "Faster than traditional sites" },
    { value: "70%", label: "Reduction in maintenance costs" },
  ],
  readingTime: "15 min read",
  lastUpdated: "March 2026",
}

// ============================================
// TABLE OF CONTENTS
// ============================================

export const tableOfContents = [
  {
    id: "what-is-modern-web-development",
    title: "What is Modern Web Development?",
    subsections: [
      { id: "definition", title: "Definition and Key Concepts" },
      { id: "characteristics", title: "Main Characteristics" },
      { id: "evolution", title: "Historical Evolution" },
    ],
  },
  {
    id: "benefits-vs-traditional",
    title: "Benefits vs Traditional Development",
    subsections: [
      { id: "performance", title: "Speed and Performance" },
      { id: "user-experience", title: "User Experience" },
      { id: "maintainability", title: "Maintainability and Scalability" },
      { id: "seo-conversion", title: "SEO and Conversion" },
    ],
  },
  {
    id: "tech-stack",
    title: "Modern Technology Stack",
    subsections: [
      { id: "frontend", title: "Frontend: React, Next.js and More" },
      { id: "backend", title: "Backend and Modern APIs" },
      { id: "infrastructure", title: "Cloud Infrastructure" },
      { id: "tools", title: "Development Tools" },
    ],
  },
  {
    id: "roi-analysis",
    title: "ROI Analysis and Profitability",
    subsections: [
      { id: "investment", title: "Initial Investment vs Long Term" },
      { id: "metrics", title: "Success Metrics" },
      { id: "calculator", title: "ROI Calculator" },
    ],
  },
  {
    id: "case-studies",
    title: "Real Case Studies",
  },
  {
    id: "getting-started",
    title: "How to Start Your Project",
    subsections: [
      { id: "initial-steps", title: "First Steps" },
      { id: "process", title: "Our Process" },
      { id: "next-step", title: "Your Next Step" },
    ],
  },
]

// ============================================
// MAIN CONTENT SECTIONS
// ============================================

export const sections: PillarPageSection[] = [
  {
    id: "what-is-modern-web-development",
    title: "What is Modern Web Development?",
    subtitle: "Beyond static pages: the new era of web development",
    content: [
      "Modern web development represents a fundamental shift in how we build digital experiences. It's no longer simply about creating pages that display information, but about developing complex, interactive, and highly optimized web applications that function like native software.",
      "Unlike traditional websites that require reloading the entire page with each interaction, modern web applications use advanced JavaScript to update only the necessary parts of the interface, offering a smooth and fast experience similar to mobile apps.",
    ],
    subsections: [
      {
        title: "Main Characteristics",
        content: [
          "Modern web development is characterized by a set of practices and technologies that work together to create superior experiences:",
        ],
        list: [
          {
            icon: "Zap",
            title: "Single Page Applications (SPA)",
            description:
              "Interfaces that load once and dynamically update content without full reloads, offering instant speed.",
          },
          {
            icon: "Smartphone",
            title: "Mobile-First Responsive Design",
            description:
              "Interfaces designed first for mobile and adapted to all screen sizes, ensuring a perfect experience on any device.",
          },
          {
            icon: "Server",
            title: "API-First Architecture",
            description:
              "Clear separation between frontend and backend through RESTful or GraphQL APIs, enabling flexibility and scalability.",
          },
          {
            icon: "Gauge",
            title: "Performance Optimization",
            description:
              "Advanced techniques like lazy loading, code splitting and caching for load times under 2 seconds.",
          },
          {
            icon: "Shield",
            title: "Integrated Security",
            description:
              "Modern authentication, end-to-end encryption and protection against common vulnerabilities from design.",
          },
          {
            icon: "TrendingUp",
            title: "SEO and Accessibility",
            description:
              "Server-side rendering (SSR) for better indexing and WCAG standards compliance for all users.",
          },
        ],
      },
      {
        title: "Evolution of Web Development",
        content: [
          "To understand the true value of modern web development, it's important to see how we got here:",
        ],
        highlight: {
          type: "info",
          title: "Digital Transformation",
          content:
            "From static HTML in the 90s to progressive web apps in 2026, each evolution has responded to growing user expectations and business needs.",
        },
      },
    ],
  },
  {
    id: "benefits-vs-traditional",
    title: "Benefits vs Traditional Development",
    subtitle: "Why companies are migrating to modern technologies",
    content: [
      "The difference between a traditional website and a modern web application isn't just technical, it's strategic. Companies adopting modern web development report significant improvements in key business metrics.",
    ],
    subsections: [
      {
        title: "Speed and Performance",
        content: [
          "Web performance has a direct impact on business results. Studies show that each second of delay in loading can reduce conversions by up to 7%.",
        ],
        list: [
          {
            icon: "Rocket",
            title: "Ultra-Fast Load Times",
            description:
              "Modern sites load in under 2 seconds vs 5-8 seconds for traditional sites. 53% of mobile users abandon sites that take more than 3 seconds.",
          },
          {
            icon: "RefreshCw",
            title: "Instant Navigation",
            description:
              "Page transitions are immediate without full reloads, improving user experience and reducing bounce rate by up to 40%.",
          },
          {
            icon: "BarChart",
            title: "Better Core Web Vitals",
            description:
              "Automatic optimization of LCP, FID and CLS, factors Google uses for ranking. Modern sites consistently score 90+ on Lighthouse.",
          },
        ],
      },
      {
        title: "Superior User Experience",
        content: [
          "Modern users expect digital experiences that rival native applications. Modern web development makes this possible:",
        ],
        list: [
          {
            icon: "Heart",
            title: "Intuitive and Interactive Interfaces",
            description:
              "Reusable components and fluid animations that naturally guide users toward conversion.",
          },
          {
            icon: "Wifi",
            title: "Offline Functionality",
            description:
              "Progressive Web Apps (PWA) allow basic use without connection, crucial for markets with unstable connectivity.",
          },
          {
            icon: "Palette",
            title: "Real-Time Personalization",
            description:
              "Dynamic content based on user behavior, location, preferences and context for unique experiences.",
          },
        ],
      },
      {
        title: "Maintainability and Scalability",
        content: [
          "Modern architecture drastically reduces maintenance costs and allows scaling the business without technical limitations:",
        ],
        list: [
          {
            icon: "Code",
            title: "Modular and Reusable Code",
            description:
              "Components used in multiple places reduce duplication and facilitate updates. One change automatically replicates across the entire site.",
          },
          {
            icon: "GitBranch",
            title: "Continuous Deployments",
            description:
              "Continuous integration and deployment (CI/CD) allows multiple updates per day without downtime.",
          },
          {
            icon: "Users",
            title: "Horizontal Scalability",
            description:
              "Cloud-native infrastructure that grows automatically with traffic, supporting from 100 to millions of users without redesign.",
          },
        ],
      },
    ],
  },
  {
    id: "tech-stack",
    title: "Modern Web Development Technology Stack",
    subtitle: "The tools that power the world's best web applications",
    content: [
      "The modern technology stack is an integrated ecosystem of tools that work together to create exceptional web experiences. Each component has a specific purpose and together they form a robust and flexible architecture.",
    ],
  },
  {
    id: "roi-analysis",
    title: "ROI Analysis: Is the Investment Worth It?",
    subtitle: "Real numbers on return on investment in modern web development",
    content: [
      "The question every director or business owner asks: does it justify the cost? Data shows that modern web development isn't an expense, it's an investment with measurable and significant returns.",
      "Companies migrating to modern technologies report returns on investment between 200% and 500% in the first year, with continuing benefits in subsequent years.",
    ],
    subsections: [
      {
        title: "Initial Investment vs Long-Term Value",
        content: [
          "While the initial investment in modern web development may be higher than a traditional site, the total cost of ownership (TCO) over 3 years is typically 40-60% lower.",
        ],
        highlight: {
          type: "success",
          title: "Average 3-Year Savings",
          content:
            "Companies investing in modern web development save between $50,000 and $200,000 in maintenance costs, updates and lost conversions compared to traditional solutions.",
        },
      },
    ],
  },
  {
    id: "getting-started",
    title: "How to Start Your Modern Web Development Project",
    subtitle: "A clear roadmap from idea to launch",
    content: [
      "Starting a modern web development project may seem intimidating, but with the right approach and the right partner, the process is clear and manageable.",
    ],
  },
]

// ============================================
// COMPARISON DATA
// ============================================

export const comparisonData: ComparisonItem[] = [
  {
    feature: "Initial Load Time",
    traditional: {
      value: "5-8 seconds",
      icon: "Turtle",
      description: "Full page load on every visit",
    },
    modern: {
      value: "< 2 seconds",
      icon: "Rocket",
      description: "Automatic optimization and intelligent caching",
    },
  },
  {
    feature: "Page Navigation",
    traditional: {
      value: "3-5 seconds",
      icon: "Clock",
      description: "Full reload with every click",
    },
    modern: {
      value: "Instant",
      icon: "Zap",
      description: "Transitions without full reloads (SPA)",
    },
  },
  {
    feature: "Mobile Experience",
    traditional: {
      value: "Adapted",
      icon: "Smartphone",
      description: "Desktop design shrunk for mobile",
    },
    modern: {
      value: "Mobile-First",
      icon: "Heart",
      description: "Designed mobile-first, perfect on all devices",
    },
  },
  {
    feature: "SEO",
    traditional: {
      value: "Basic",
      icon: "Search",
      description: "Manual meta tags, no automatic optimization",
    },
    modern: {
      value: "Optimized",
      icon: "TrendingUp",
      description: "SSR, dynamic meta tags, automatic structured data",
    },
  },
  {
    feature: "Scalability",
    traditional: {
      value: "Limited",
      icon: "AlertTriangle",
      description: "Requires redesign to grow",
    },
    modern: {
      value: "Unlimited",
      icon: "Layers",
      description: "Grows automatically with your business",
    },
  },
  {
    feature: "Maintenance Cost",
    traditional: {
      value: "$2,000-5,000/mo",
      icon: "DollarSign",
      description: "Frequent manual updates",
    },
    modern: {
      value: "$500-1,500/mo",
      icon: "PiggyBank",
      description: "Automated updates, less intervention",
    },
  },
  {
    feature: "Update Time",
    traditional: {
      value: "1-2 weeks",
      icon: "Calendar",
      description: "Manual development and deployment process",
    },
    modern: {
      value: "Minutes",
      icon: "RefreshCw",
      description: "CI/CD enables instant changes",
    },
  },
  {
    feature: "Security",
    traditional: {
      value: "Reactive",
      icon: "Shield",
      description: "Manual patches when issues arise",
    },
    modern: {
      value: "Proactive",
      icon: "ShieldCheck",
      description: "Automatic updates and continuous monitoring",
    },
  },
]

// ============================================
// TECH STACK DATA
// ============================================

export const techStack: TechStackItem[] = [
  {
    name: "Next.js 14+",
    category: "frontend",
    description:
      "Production React framework with hybrid rendering (SSR + SSG + CSR)",
    icon: "▲",
    benefits: [
      "Exceptional SEO with Server-Side Rendering",
      "Extreme speed with Static Site Generation",
      "Automatic file-based routing",
      "Automatic image and font optimization",
      "Integrated API routes",
    ],
    useCases: [
      "High-traffic e-commerce",
      "Corporate sites with heavy content",
      "SaaS and complex web applications",
      "High-conversion landing pages",
    ],
    popularity: 98,
  },
  {
    name: "React 18+",
    category: "frontend",
    description: "JavaScript library for building interactive user interfaces",
    icon: "⚛️",
    benefits: [
      "Reusable components = faster development",
      "Virtual DOM for ultra-fast updates",
      "Massive ecosystem of libraries",
      "Concurrent rendering for better UX",
      "React Server Components for performance",
    ],
    useCases: [
      "Interactive dashboards",
      "Single Page Applications (SPA)",
      "Complex interfaces with many states",
      "Real-time collaborative platforms",
    ],
    popularity: 95,
  },
  {
    name: "TypeScript",
    category: "frontend",
    description:
      "JavaScript with static types for greater safety and maintainability",
    icon: "TS",
    benefits: [
      "Fewer bugs in production",
      "Intelligent autocomplete in editors",
      "Safe large-scale refactoring",
      "Automatic code documentation",
      "Better team collaboration",
    ],
    useCases: [
      "Long-term projects",
      "Large development teams",
      "Applications with complex logic",
      "Gradual migration from JavaScript",
    ],
    popularity: 92,
  },
  {
    name: "Tailwind CSS",
    category: "frontend",
    description: "Utility-first CSS framework for fast and consistent design",
    icon: "🎨",
    benefits: [
      "3x faster UI development",
      "Consistent design without effort",
      "Minimal CSS bundle in production",
      "Simplified responsive design",
      "Integrated dark mode",
    ],
    useCases: [
      "Rapid prototyping",
      "Scalable design systems",
      "Projects with tight deadlines",
      "Teams with designers and developers",
    ],
    popularity: 88,
  },
  {
    name: "Node.js",
    category: "backend",
    description:
      "JavaScript runtime for building scalable APIs and backend services",
    icon: "🟢",
    benefits: [
      "Same language in frontend and backend",
      "Event-driven ideal for real-time",
      "NPM: largest package ecosystem",
      "Excellent for microservices",
      "Performance comparable to compiled languages",
    ],
    useCases: [
      "RESTful and GraphQL APIs",
      "Real-time applications (chat, notifications)",
      "Microservices",
      "Serverless functions",
    ],
    popularity: 90,
  },
  {
    name: "NestJS",
    category: "backend",
    description:
      "Progressive Node.js framework for building efficient and scalable server-side applications",
    icon: "🐈",
    benefits: [
      "TypeScript-first with full type safety",
      "Modular architecture inspired by Angular",
      "Built-in dependency injection",
      "Extensive CLI for rapid development",
      "Native support for microservices and GraphQL",
    ],
    useCases: [
      "Enterprise-grade applications",
      "Microservices architectures",
      "Real-time applications with WebSockets",
      "GraphQL APIs",
    ],
    popularity: 86,
  },
  {
    name: "Express.js",
    category: "backend",
    description: "Fast, unopinionated, minimalist web framework for Node.js",
    icon: "🚂",
    benefits: [
      "Minimal and flexible",
      "Huge middleware ecosystem",
      "Simple and easy to learn",
      "Fast routing system",
      "Industry standard for Node.js APIs",
    ],
    useCases: [
      "RESTful APIs",
      "Simple web servers",
      "Backend for SPAs",
      "Prototyping and MVPs",
    ],
    popularity: 91,
  },
  {
    name: "PostgreSQL",
    category: "database",
    description: "Advanced relational database with JSON support",
    icon: "🐘",
    benefits: [
      "ACID compliance for data integrity",
      "JSON support (NoSQL flexibility)",
      "Integrated full-text search",
      "Proven scalability in production",
      "Powerful extensions (PostGIS, TimescaleDB)",
    ],
    useCases: [
      "E-commerce (critical transactions)",
      "Multi-tenant SaaS",
      "Applications with geospatial data",
      "Analytics and reporting",
    ],
    popularity: 85,
  },
  {
    name: "Supabase",
    category: "database",
    description: "Open source Firebase alternative with PostgreSQL database",
    icon: "⚡",
    benefits: [
      "PostgreSQL database with real-time subscriptions",
      "Built-in authentication and authorization",
      "Auto-generated REST and GraphQL APIs",
      "File storage included",
      "Open source with self-hosting option",
    ],
    useCases: [
      "Rapid MVP development",
      "Real-time collaborative apps",
      "Mobile and web applications",
      "Projects requiring authentication",
    ],
    popularity: 82,
  },
  {
    name: "Firebase",
    category: "database",
    description:
      "Google's platform with real-time NoSQL database and backend services",
    icon: "🔥",
    benefits: [
      "Real-time data synchronization",
      "Serverless architecture",
      "Built-in authentication providers",
      "Hosting and analytics included",
      "Excellent mobile SDK support",
    ],
    useCases: [
      "Mobile applications",
      "Real-time chat and collaboration",
      "Rapid prototyping",
      "Small to medium web apps",
    ],
    popularity: 84,
  },
  {
    name: "MongoDB",
    category: "database",
    description: "Flexible NoSQL document database for modern applications",
    icon: "🍃",
    benefits: [
      "Schema-less flexibility",
      "Horizontal scaling with sharding",
      "Rich query language",
      "Native JSON document storage",
      "Excellent for unstructured data",
    ],
    useCases: [
      "Content management systems",
      "Real-time analytics",
      "IoT and time-series data",
      "Applications with evolving schemas",
    ],
    popularity: 87,
  },
  {
    name: "Vercel / AWS",
    category: "devops",
    description:
      "Cloud platforms for deployment and hosting of modern applications",
    icon: "☁️",
    benefits: [
      "Automatic deploy from Git",
      "Global CDN included",
      "Automatic scaling",
      "Free SSL/HTTPS",
      "Preview deployments for each PR",
    ],
    useCases: [
      "Next.js applications (Vercel)",
      "Enterprise infrastructure (AWS)",
      "Serverless applications",
      "Sites with variable traffic",
    ],
    popularity: 87,
  },
  {
    name: "Netlify",
    category: "devops",
    description:
      "Modern web development platform with instant deployment and serverless functions",
    icon: "💎",
    benefits: [
      "One-click deploy from Git",
      "Built-in CI/CD pipelines",
      "Edge functions for serverless logic",
      "Form handling and identity management",
      "Instant rollbacks and branch previews",
    ],
    useCases: [
      "Static sites and JAMstack apps",
      "React, Vue, and Angular projects",
      "Serverless applications",
      "Frontend with serverless backend",
    ],
    popularity: 83,
  },
  {
    name: "Prisma",
    category: "backend",
    description: "Next-gen ORM for TypeScript with complete type-safety",
    icon: "🔷",
    benefits: [
      "Type-safe queries (no SQL errors)",
      "Automatic migrations",
      "Existing database introspection",
      "IDE autocomplete",
      "Automatically optimized performance",
    ],
    useCases: [
      "New TypeScript projects",
      "Migration from legacy ORMs",
      "Applications with complex schemas",
      "Teams that value developer experience",
    ],
    popularity: 82,
  },
  {
    name: "Stripe / PayPal",
    category: "tools",
    description: "Modern payment gateways for e-commerce",
    icon: "💳",
    benefits: [
      "Integration in days, not months",
      "PCI compliance included",
      "Multiple currency support",
      "Webhooks for automation",
      "Complete analytics dashboard",
    ],
    useCases: [
      "E-commerce and marketplaces",
      "SaaS subscriptions",
      "Donations and crowdfunding",
      "International payments",
    ],
    popularity: 93,
  },
  {
    name: "Resend",
    category: "tools",
    description:
      "Modern email API designed for developers with React Email integration",
    icon: "📧",
    benefits: [
      "Simple and intuitive API",
      "React Email for component-based emails",
      "Built-in email validation",
      "Detailed analytics and logs",
      "Free tier for development",
    ],
    useCases: [
      "Transactional emails",
      "Marketing campaigns",
      "User notifications",
      "Password resets and auth emails",
    ],
    popularity: 78,
  },
  {
    name: "shadcn/ui",
    category: "frontend",
    description: "Collection of accessible and customizable UI components",
    icon: "🎭",
    benefits: [
      "Copy-paste components (no NPM dependency)",
      "Fully customizable",
      "Accessibility (WCAG) integrated",
      "Based on Radix UI (battle-tested)",
      "Professional design out-of-the-box",
    ],
    useCases: [
      "Enterprise dashboards",
      "SaaS and internal applications",
      "Projects requiring accessibility",
      "Teams wanting full UI control",
    ],
    popularity: 79,
  },
  {
    name: "Gatsby",
    category: "frontend",
    description: "React-based static site generator with powerful data layer",
    icon: "🚀",
    benefits: [
      "Blazing fast performance with pre-rendering",
      "GraphQL data layer for any source",
      "Rich plugin ecosystem",
      "Automatic code splitting and optimization",
      "Built-in progressive image loading",
    ],
    useCases: [
      "Marketing websites and landing pages",
      "Blogs and documentation sites",
      "E-commerce storefronts",
      "Portfolio and agency sites",
    ],
    popularity: 76,
  },
]

// ============================================
// ROI METRICS
// ============================================

export const roiMetrics: ROIMetric[] = [
  {
    metric: "Conversion Rate",
    traditional: 2.3,
    modern: 4.8,
    improvement: "+109%",
    unit: "%",
  },
  {
    metric: "Load Time",
    traditional: 6.5,
    modern: 1.8,
    improvement: "-72%",
    unit: "sec",
  },
  {
    metric: "Bounce Rate",
    traditional: 58,
    modern: 32,
    improvement: "-45%",
    unit: "%",
  },
  {
    metric: "Pages per Session",
    traditional: 2.1,
    modern: 4.7,
    improvement: "+124%",
    unit: "pages",
  },
  {
    metric: "Time on Site",
    traditional: 1.3,
    modern: 3.8,
    improvement: "+192%",
    unit: "min",
  },
  {
    metric: "Cost per Lead",
    traditional: 85,
    modern: 32,
    improvement: "-62%",
    unit: "$",
  },
  {
    metric: "Checkout Speed",
    traditional: 180,
    modern: 45,
    improvement: "-75%",
    unit: "sec",
  },
  {
    metric: "Mobile Conversion Rate",
    traditional: 1.2,
    modern: 3.9,
    improvement: "+225%",
    unit: "%",
  },
]

export const costBreakdown = {
  traditional: {
    initial: 15000,
    monthly: 3500,
    yearly: 42000,
    threeYear: 141000,
    items: [
      { category: "Initial Development", cost: 15000 },
      { category: "Hosting", monthly: 300 },
      { category: "Maintenance", monthly: 1200 },
      { category: "Security Updates", monthly: 800 },
      { category: "Technical Support", monthly: 600 },
      { category: "Bug Fixes", monthly: 400 },
      { category: "Content Updates", monthly: 200 },
    ],
  },
  modern: {
    initial: 28000,
    monthly: 1200,
    yearly: 14400,
    threeYear: 71200,
    items: [
      { category: "Initial Development", cost: 28000 },
      { category: "Cloud Hosting", monthly: 150 },
      { category: "Automated Maintenance", monthly: 400 },
      { category: "Automatic Updates", monthly: 0 },
      { category: "Technical Support", monthly: 350 },
      { category: "Monitoring", monthly: 100 },
      { category: "CDN", monthly: 200 },
    ],
  },
  savings: {
    threeYear: 69800,
    percentage: 49,
  },
}

// ============================================
// CASE STUDIES
// ============================================

export const caseStudies: CaseStudy[] = [
  {
    id: "ecommerce-fashion",
    client: "Premium Fashion Boutique",
    industry: "E-commerce / Fashion",
    challenge:
      "Online store with 68% bounce rate, 8-second mobile load time, and only 1.8% conversion. Legacy platform difficult to update.",
    solution: [
      "Migration to Next.js 14 with App Router",
      "Stripe implementation for optimized checkout",
      "PWA with offline functionality for catalog",
      "Image optimization with Sharp and CDN",
      "Smart search implementation with Algolia",
    ],
    results: [
      {
        metric: "Conversion",
        before: "1.8%",
        after: "5.2%",
        improvement: "+189%",
      },
      {
        metric: "Load Time",
        before: "8.3 sec",
        after: "1.6 sec",
        improvement: "-81%",
      },
      {
        metric: "Revenue",
        before: "$52k/mo",
        after: "$167k/mo",
        improvement: "+221%",
      },
      {
        metric: "Mobile Sales",
        before: "23%",
        after: "61%",
        improvement: "+165%",
      },
    ],
    technologies: ["Next.js", "TypeScript", "Stripe", "PostgreSQL", "Vercel"],
    timeline: "12 weeks",
    testimonial: {
      quote:
        "In 3 months we recovered the investment. Now we can update products in minutes instead of days, and our mobile sales tripled.",
      author: "María Rodríguez",
      role: "CEO, Premium Boutique",
    },
  },
  {
    id: "saas-platform",
    client: "SaaS Management Platform",
    industry: "SaaS / B2B",
    challenge:
      "Slow dashboard with 12+ second load, difficult to scale beyond 500 concurrent users. High server costs ($8k/mo).",
    solution: [
      "Complete rewrite in React 18 with Server Components",
      "Migration to serverless architecture on AWS",
      "Strategic caching implementation with Redis",
      "GraphQL API to reduce overfetching",
      "Real-time updates with WebSockets",
    ],
    results: [
      {
        metric: "Dashboard Load",
        before: "12.4 sec",
        after: "2.1 sec",
        improvement: "-83%",
      },
      {
        metric: "Concurrent Users",
        before: "500",
        after: "15,000",
        improvement: "+2900%",
      },
      {
        metric: "Server Costs",
        before: "$8,000/mo",
        after: "$2,100/mo",
        improvement: "-74%",
      },
      {
        metric: "Customer Satisfaction",
        before: "6.8/10",
        after: "9.3/10",
        improvement: "+37%",
      },
    ],
    technologies: [
      "React 18",
      "Node.js",
      "GraphQL",
      "PostgreSQL",
      "AWS Lambda",
      "Redis",
    ],
    timeline: "16 weeks",
    testimonial: {
      quote:
        "The new platform allowed us to scale from 500 to 15,000 concurrent users while reducing costs by 74%. ROI was 420% in the first year.",
      author: "Carlos Méndez",
      role: "CTO, SaaS Platform",
    },
  },
  {
    id: "corporate-website",
    client: "Professional Services Firm",
    industry: "Corporate Services",
    challenge:
      "Outdated corporate site, generating only 3-5 qualified leads per month. No mobile strategy, declining SEO ranking.",
    solution: [
      "Next.js site with SSG for maximum SEO",
      "Mobile-first design with Tailwind CSS",
      "Headless CMS (Sanity) for content management",
      "Optimized forms with advanced validation",
      "Integrated blog with SEO content strategy",
    ],
    results: [
      {
        metric: "Monthly Leads",
        before: "4 leads",
        after: "47 leads",
        improvement: "+1075%",
      },
      {
        metric: "Organic Traffic",
        before: "1,200/mo",
        after: "8,900/mo",
        improvement: "+642%",
      },
      {
        metric: "Keyword Rankings",
        before: "23 top 10",
        after: "187 top 10",
        improvement: "+713%",
      },
      {
        metric: "Load Time",
        before: "7.2 sec",
        after: "1.3 sec",
        improvement: "-82%",
      },
    ],
    technologies: [
      "Next.js",
      "Sanity CMS",
      "Tailwind CSS",
      "TypeScript",
      "Vercel",
    ],
    timeline: "8 weeks",
    testimonial: {
      quote:
        "We went from 4 leads a month to over 45. The site became our best sales tool. The investment paid off in less than 2 months.",
      author: "Ana Martínez",
      role: "Marketing Director",
    },
  },
]

// ============================================
// PROCESS STEPS
// ============================================

export const processSteps: ProcessStep[] = [
  {
    step: 1,
    title: "Audit and Strategy",
    description:
      "We analyze your current situation, business goals, audience and competition to create a personalized digital strategy.",
    duration: "1-2 weeks",
    deliverables: [
      "Complete technical audit of current site",
      "Competition and market analysis",
      "Definition of objectives and KPIs",
      "Detailed project roadmap",
      "Budget and timeline estimation",
    ],
    icon: "Search",
  },
  {
    step: 2,
    title: "Design and User Experience",
    description:
      "We create wireframes, interactive prototypes and visual design that maximize conversion and reflect your brand.",
    duration: "2-3 weeks",
    deliverables: [
      "Information architecture",
      "Wireframes of key pages",
      "UI design in Figma (desktop, tablet, mobile)",
      "Clickable interactive prototype",
      "Design system and style guide",
    ],
    icon: "Palette",
  },
  {
    step: 3,
    title: "Frontend Development",
    description:
      "Building the interface with the most modern technologies, optimized for speed, SEO and conversion.",
    duration: "4-6 weeks",
    deliverables: [
      "React/Next.js code with TypeScript",
      "Reusable and modular components",
      "CMS integration (if applicable)",
      "Performance and SEO optimization",
      "Perfect responsive design on all devices",
    ],
    icon: "Code",
  },
  {
    step: 4,
    title: "Backend Development and Integrations",
    description:
      "Robust APIs, external service integrations and scalable infrastructure configuration.",
    duration: "3-4 weeks",
    deliverables: [
      "RESTful or GraphQL API",
      "Database configuration",
      "Integrations (payments, CRM, analytics, etc.)",
      "Authentication and security",
      "Hosting and CI/CD configuration",
    ],
    icon: "Server",
  },
  {
    step: 5,
    title: "Testing and Optimization",
    description:
      "Comprehensive testing on multiple devices, browsers and scenarios. Final performance optimization.",
    duration: "1-2 weeks",
    deliverables: [
      "Complete functional testing",
      "Usability and accessibility testing",
      "Core Web Vitals optimization",
      "Security and penetration testing",
      "Bug fixing and refinement",
    ],
    icon: "CheckCircle",
  },
  {
    step: 6,
    title: "Launch and Monitoring",
    description:
      "Production deployment with launch strategy, content migration and post-launch monitoring.",
    duration: "1 week",
    deliverables: [
      "Content and data migration",
      "Production deployment",
      "Analytics and monitoring configuration",
      "Team training",
      "Post-launch support (30 days)",
    ],
    icon: "Rocket",
  },
]

// ============================================
// FAQS
// ============================================

export const faqs = [
  {
    question: "How long does it take to develop a website?",
    answer:
      "It depends on the project type. A landing page takes 2-3 weeks, a custom business website 6-8 weeks, and complex web applications 5-8 weeks. We use an agile process that allows you to see progress each week and make adjustments as needed.",
  },
  {
    question: "What is the cost of a professional website?",
    answer:
      "Our projects start from $400 for landing pages up to $1,250+ for custom web applications. Complete business websites from $950. We offer payment plans (50% upfront, 50% on completion) and free hosting for 1 year included in all projects.",
  },
  {
    question: "What if I need to make changes to the site?",
    answer:
      "We include up to 2 revision rounds during development to ensure the site is perfect. After launch, we offer 30 days of free support for minor adjustments. We also implement a CMS (Sanity) that allows you to update content without coding.",
  },
  {
    question: "Do you include hosting and domain?",
    answer:
      "Yes. All our projects include professional hosting free for 1 year. We also help with domain registration and business email setup if needed. We recommend reliable services and guide you through the entire process.",
  },
  {
    question: "What kind of maintenance do you offer after launch?",
    answer:
      "We offer maintenance plans from $95/month that include: regular security updates, speed optimizations, quick bug fixes, security monitoring, and uptime monitoring. All projects also include 30 days of free post-launch support.",
  },
  {
    question: "What technologies do you use to develop sites?",
    answer:
      "We use modern, proven technologies: Next.js for the framework, TypeScript for robust code, Tailwind CSS for responsive design, and Sanity CMS for easy content management. This ensures fast, secure, and easy-to-maintain websites.",
  },
  {
    question: "Will I receive training to manage my site?",
    answer:
      "Absolutely! We provide complete training on how to update content, add pages, upload images, and more. We also include detailed documentation and 30 days of free support after launch for any questions.",
  },
  {
    question:
      "Can you integrate my site with other tools (email, payments, CRM)?",
    answer:
      "Yes. We have experience integrating payment systems (Stripe, PayPal), email marketing platforms, CRMs, Google Analytics, and more. Our API integrations service from $500 connects your site with the tools you already use to automate your business.",
  },
]

// ============================================
// LEAD MAGNET
// ============================================

export const leadMagnet = {
  title: "Free Checklist: Is Your Website Ready for 2026?",
  description:
    "Download our 47-point checklist used by Fortune 500 companies to audit their digital presence. Includes sections on: Performance, SEO, UX, Security, Conversion and Mobile.",
  benefits: [
    "Evaluate your site in 20 minutes",
    "Identify exactly what to improve first",
    "Industry benchmarks included",
    "Specific tool recommendations",
    "Stakeholder presentation template",
  ],
  preview: [
    "✓ Performance: 8 critical checks (Core Web Vitals, TTFB, etc.)",
    "✓ SEO: 12 technical and content checks",
    "✓ UX: 9 usability and accessibility checks",
    "✓ Security: 7 common vulnerability checks",
    "✓ Conversion: 11 CRO optimization checks",
  ],
}

// ============================================
// CTAS
// ============================================

export const ctas = {
  primary: {
    text: "Request Free Audit",
    description:
      "Complete analysis of your current site + 30-min consultation with specific recommendations. No obligation.",
  },
  secondary: {
    text: "Talk to an Expert",
    description: "Schedule a call to discuss your specific project",
  },
  leadMagnet: {
    text: "Download Free Checklist",
    description:
      "Receive the complete 47-point checklist in your email in less than 1 minute",
  },
}

// ============================================
// STATISTICS
// ============================================

export const statistics = {
  hero: [
    { value: "300%", label: "Average increase in conversions" },
    { value: "5x", label: "Faster than traditional sites" },
    { value: "70%", label: "Reduction in maintenance costs" },
  ],
  impact: [
    { value: "2.1 sec", label: "Average load time", trend: "down" },
    { value: "4.8%", label: "Average conversion rate", trend: "up" },
    { value: "49%", label: "TCO savings over 3 years", trend: "down" },
    { value: "225%", label: "Increase in mobile conversion", trend: "up" },
  ],
}

// ============================================
// EXPORT DEFAULT
// ============================================

export default {
  heroData,
  tableOfContents,
  sections,
  comparisonData,
  techStack,
  roiMetrics,
  costBreakdown,
  caseStudies,
  processSteps,
  faqs,
  leadMagnet,
  ctas,
  statistics,
}
