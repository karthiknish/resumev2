// Converted to TypeScript - migrated
// Resource data for the resources page
const resources = [
  {
    title: "React Performance Optimization Techniques",
    description:
      "Learn how to optimize your React applications for better performance with practical techniques and examples.",
    link: "https://reactjs.org/docs/optimizing-performance.html",
    category: "tutorials",
    tags: ["react", "performance", "optimization"],
    featured: true,
  },
  {
    title: "Next.js Documentation",
    description:
      "Comprehensive documentation for Next.js, the React framework for production.",
    link: "https://nextjs.org/docs",
    category: "tutorials",
    tags: ["nextjs", "react", "documentation"],
    featured: true,
  },
  {
    title: "VS Code Extensions for Web Developers",
    description:
      "A curated list of essential VS Code extensions that every web developer should consider using.",
    link: "https://marketplace.visualstudio.com/",
    category: "tools",
    tags: ["vscode", "extensions", "productivity"],
    featured: false,
  },
  {
    title: "Modern JavaScript Explained For Dinosaurs",
    description:
      "A comprehensive guide to modern JavaScript development for those who might feel left behind by the rapid evolution of the ecosystem.",
    link: "https://medium.com/the-node-js-collection/modern-javascript-explained-for-dinosaurs-f695e9747b70",
    category: "tutorials",
    tags: ["javascript", "ecosystem", "beginners"],
    featured: true,
  },
  {
    title: "CSS Grid Complete Guide",
    description:
      "Everything you need to know about CSS Grid Layout in one comprehensive guide.",
    link: "https://css-tricks.com/snippets/css/complete-guide-grid/",
    category: "tutorials",
    tags: ["css", "grid", "layout"],
    featured: false,
  },
  {
    title: "Figma - Design Tool",
    description:
      "A collaborative interface design tool that's taking the design world by storm.",
    link: "https://www.figma.com/",
    category: "tools",
    tags: ["design", "ui", "collaboration"],
    featured: true,
  },
  {
    title: "JavaScript Testing Best Practices",
    description:
      "Comprehensive and exhaustive JavaScript & Node.js testing best practices.",
    link: "https://github.com/goldbergyoni/javascript-testing-best-practices",
    category: "tutorials",
    tags: ["testing", "javascript", "best practices"],
    featured: false,
  },
  {
    title: "Full Stack Open",
    description:
      "Deep dive into modern web development with React, Redux, Node.js, MongoDB, GraphQL and TypeScript.",
    link: "https://fullstackopen.com/en/",
    category: "tutorials",
    tags: ["fullstack", "react", "nodejs", "mongodb"],
    featured: true,
  },
  {
    title: "React Hooks Explained",
    description:
      "A comprehensive video course on React Hooks with practical examples.",
    link: "https://www.youtube.com/watch?v=dpw9EHDh2bM",
    category: "videos",
    tags: ["react", "hooks", "functional components"],
    featured: false,
  },
  {
    title: "Responsive Navigation Bar",
    description:
      "A responsive navigation bar implementation with HTML, CSS, and JavaScript.",
    link: "/code-snippets/responsive-navbar",
    category: "code",
    tags: ["html", "css", "javascript", "responsive"],
    featured: false,
  },
  {
    title: "JWT Authentication in Node.js",
    description:
      "A complete guide to implementing JWT authentication in Node.js applications.",
    link: "https://www.digitalocean.com/community/tutorials/nodejs-jwt-expressjs",
    category: "tutorials",
    tags: ["nodejs", "authentication", "jwt", "security"],
    featured: false,
  },
  {
    title: "Tailwind CSS",
    description:
      "A utility-first CSS framework for rapidly building custom user interfaces.",
    link: "https://tailwindcss.com/",
    category: "tools",
    tags: ["css", "framework", "utility-first"],
    featured: true,
  },
  {
    title: "Advanced React Patterns",
    description:
      "Learn advanced React patterns to build more flexible and reusable components.",
    link: "https://www.youtube.com/watch?v=WV0UUcSPk-0",
    category: "videos",
    tags: ["react", "patterns", "advanced"],
    featured: false,
  },
  {
    title: "Infinite Scroll Component",
    description:
      "A reusable infinite scroll component implementation in React.",
    link: "/code-snippets/infinite-scroll",
    category: "code",
    tags: ["react", "infinite scroll", "performance"],
    featured: false,
  },
  {
    title: "MongoDB Atlas",
    description:
      "Cloud-hosted MongoDB service with free tier for small projects.",
    link: "https://www.mongodb.com/cloud/atlas",
    category: "tools",
    tags: ["database", "mongodb", "cloud"],
    featured: false,
  },
  {
    title: "TypeScript Handbook",
    description:
      "The official TypeScript documentation and guide for learning the language from basics to advanced concepts.",
    link: "https://www.typescriptlang.org/docs/handbook/intro.html",
    category: "tutorials",
    tags: ["typescript", "javascript", "documentation"],
    featured: true,
  },
  {
    title: "Storybook",
    description:
      "A frontend workshop for building UI components and pages in isolation. It streamlines UI development, testing, and documentation.",
    link: "https://storybook.js.org/",
    category: "tools",
    tags: ["ui", "components", "documentation", "testing"],
    featured: false,
  },
  {
    title: "Web.dev by Google",
    description:
      "Guidance and analysis to help developers build modern web experiences that are fast, reliable, and accessible.",
    link: "https://web.dev/",
    category: "tutorials",
    tags: ["performance", "accessibility", "best practices", "pwa"],
    featured: true,
  },
  {
    title: "Framer Motion Documentation",
    description:
      "Comprehensive guide to using Framer Motion for adding animations to React applications.",
    link: "https://www.framer.com/motion/",
    category: "tutorials",
    tags: ["react", "animation", "ui", "framer"],
    featured: false,
  },
  {
    title: "Vercel",
    description:
      "Platform for frontend frameworks and static sites, built to integrate with your headless content, commerce, or database.",
    link: "https://vercel.com/",
    category: "tools",
    tags: ["deployment", "hosting", "serverless", "nextjs"],
    featured: true,
  },
  {
    title: "CSS Flexbox Guide",
    description:
      "A complete guide to CSS flexbox layout with visual examples and code snippets.",
    link: "https://css-tricks.com/snippets/css/a-guide-to-flexbox/",
    category: "tutorials",
    tags: ["css", "flexbox", "layout"],
    featured: false,
  },
  {
    title: "GitHub Copilot",
    description:
      "AI pair programmer that helps you write code faster with less work.",
    link: "https://github.com/features/copilot",
    category: "tools",
    tags: ["ai", "productivity", "coding", "pair programming"],
    featured: true,
  },
  {
    title: "Responsive Image Gallery",
    description:
      "A responsive image gallery implementation with CSS Grid and JavaScript.",
    link: "/code-snippets/responsive-gallery",
    category: "code",
    tags: ["css", "javascript", "responsive", "gallery"],
    featured: false,
  },
  {
    title: "Docker for Beginners",
    description:
      "A comprehensive guide to getting started with Docker containerization.",
    link: "https://docker-curriculum.com/",
    category: "tutorials",
    tags: ["docker", "containers", "devops", "deployment"],
    featured: false,
  },
  {
    title: "Postman",
    description:
      "API platform for building and using APIs. Simplifies each step of the API lifecycle and streamlines collaboration.",
    link: "https://www.postman.com/",
    category: "tools",
    tags: ["api", "testing", "development", "collaboration"],
    featured: false,
  },
  {
    title: "The Net Ninja - Full React Tutorial",
    description:
      "Complete React tutorial series covering all the fundamentals and advanced concepts.",
    link: "https://www.youtube.com/playlist?list=PL4cUxeGkcC9gZD-Tvwfod2gaISzfRiP9d",
    category: "videos",
    tags: ["react", "javascript", "frontend", "tutorial"],
    featured: false,
  },
  {
    title: "Dark Mode Toggle",
    description:
      "Implementation of a dark mode toggle with CSS variables and JavaScript.",
    link: "/code-snippets/dark-mode-toggle",
    category: "code",
    tags: ["css", "javascript", "dark mode", "accessibility"],
    featured: false,
  },
  {
    title: "GraphQL Documentation",
    description:
      "Learn about GraphQL, a query language for APIs and a runtime for fulfilling those queries with your existing data.",
    link: "https://graphql.org/learn/",
    category: "tutorials",
    tags: ["graphql", "api", "query language", "data fetching"],
    featured: false,
  },
  {
    title: "Cypress",
    description:
      "Fast, easy and reliable testing for anything that runs in a browser.",
    link: "https://www.cypress.io/",
    category: "tools",
    tags: ["testing", "automation", "e2e", "integration"],
    featured: false,
  },
  {
    title: "Traversy Media - MERN Stack Front To Back",
    description:
      "Full stack development with MongoDB, Express, React, and Node.js.",
    link: "https://www.youtube.com/watch?v=PBTYxXADG_k&list=PLillGF-RfqbbiTGgA77tGO426V3hRF9iE",
    category: "videos",
    tags: ["mern", "mongodb", "express", "react", "nodejs"],
    featured: true,
  },
  {
    title: "Custom React Hooks Collection",
    description:
      "A collection of useful custom React hooks for common functionalities.",
    link: "/code-snippets/custom-react-hooks",
    category: "code",
    tags: ["react", "hooks", "reusable", "javascript"],
    featured: true,
  },
  {
    title: "MDN Web Docs",
    description:
      "Resources for developers, by developers. Comprehensive documentation for web technologies.",
    link: "https://developer.mozilla.org/",
    category: "tutorials",
    tags: ["documentation", "web", "html", "css", "javascript"],
    featured: true,
  },
  {
    title: "Netlify",
    description:
      "Platform that automates your code to create high-performant, easily maintainable sites and web apps.",
    link: "https://www.netlify.com/",
    category: "tools",
    tags: ["deployment", "hosting", "serverless", "jamstack"],
    featured: false,
  },
  {
    title: "Fireship - 100 Seconds of Code",
    description:
      "Learn various programming concepts and technologies in just 100 seconds each.",
    link: "https://www.youtube.com/playlist?list=PL0vfts4VzfNiI1BsIq5fA8ESY4Td7oAwL",
    category: "videos",
    tags: ["quick learning", "programming", "concepts", "technologies"],
    featured: false,
  },
  {
    title: "Responsive CSS Grid Dashboard",
    description: "A responsive dashboard layout implementation using CSS Grid.",
    link: "/code-snippets/grid-dashboard",
    category: "code",
    tags: ["css", "grid", "dashboard", "responsive"],
    featured: false,
  },
  {
    title: "Gov.uk Design System",
    description:
      "The UK Government Design System helps teams in the UK public sector create accessible, consistent digital services.",
    link: "https://design-system.service.gov.uk/",
    category: "tools",
    tags: ["uk", "design", "accessibility", "government"],
    featured: true,
  },
  {
    title: "UK Web Archive",
    description:
      "The UK Web Archive contains websites that publish research, reflect the diversity of lives, interests and activities throughout the UK.",
    link: "https://www.webarchive.org.uk/",
    category: "tools",
    tags: ["uk", "archive", "research", "history"],
    featured: false,
  },
  {
    title: "JavaScript Manchester",
    description:
      "One of the largest JavaScript communities in the UK, with regular meetups and talks from industry experts.",
    link: "https://www.meetup.com/javascript-manchester/",
    category: "resources",
    tags: ["uk", "javascript", "community", "manchester"],
    featured: false,
  },
  {
    title: "London React Meetup",
    description:
      "Regular meetups for React developers in London, featuring talks, workshops and networking opportunities.",
    link: "https://www.meetup.com/london-react/",
    category: "resources",
    tags: ["uk", "react", "london", "community"],
    featured: true,
  },
  {
    title: "UK Tech Tax Relief Guide",
    description:
      "A comprehensive guide to R&D tax credits and other tax incentives for UK tech businesses and freelancers.",
    link: "https://www.gov.uk/guidance/corporation-tax-research-and-development-rd-relief",
    category: "tutorials",
    tags: ["uk", "tax", "business", "finance"],
    featured: false,
  },
  {
    title: "ICO GDPR Guidance for UK Websites",
    description:
      "Official guidance from the UK's Information Commissioner's Office on GDPR compliance for websites and apps.",
    link: "https://ico.org.uk/for-organisations/guide-to-data-protection/guide-to-the-general-data-protection-regulation-gdpr/",
    category: "tutorials",
    tags: ["uk", "gdpr", "compliance", "privacy"],
    featured: true,
  },
  {
    title: "BBC GEL (Global Experience Language)",
    description:
      "The BBC's design system, a great resource for UK-focused design patterns and accessibility standards.",
    link: "https://www.bbc.co.uk/gel",
    category: "tools",
    tags: ["uk", "design", "accessibility", "patterns"],
    featured: false,
  },
  {
    title: "UK Postcode and Address Validation",
    description:
      "Implementation guide for UK address validation using the Royal Mail Postcode Lookup API.",
    link: "/code-snippets/uk-postcode-validation",
    category: "code",
    tags: ["uk", "validation", "postcode", "royal mail"],
    featured: true,
  },
  {
    title: "British English Dictionary API",
    description:
      "API for checking British English spelling and definitions, ensuring UK-appropriate content.",
    link: "https://dictionaryapi.dev/",
    category: "tools",
    tags: ["uk", "spelling", "language", "api"],
    featured: false,
  },
  {
    title: "UK Bank Holidays Calendar Integration",
    description:
      "Code snippet for integrating the UK Government's Bank Holidays API into your applications.",
    link: "/code-snippets/uk-bank-holidays",
    category: "code",
    tags: ["uk", "calendar", "holidays", "integration"],
    featured: false,
  },
];

export const categories = [
  { id: "all", name: "All Resources" },
  { id: "uk", name: "UK Resources", icon: "FaFlag" },
  { id: "tools", name: "Development Tools", icon: "FaTools" },
  { id: "tutorials", name: "Tutorials & Guides", icon: "FaBook" },
  { id: "videos", name: "Video Courses", icon: "FaVideo" },
  { id: "code", name: "Code Snippets", icon: "FaCode" },
  { id: "resources", name: "Community Resources", icon: "FaUsers" },
];

export default resources;

