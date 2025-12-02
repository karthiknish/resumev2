import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import UkSeo from "@/components/UkSeo";
import JsonLd, { createWebsiteSchema } from "@/components/JsonLd";

export default function UkWebDevGlossary() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeLetter, setActiveLetter] = useState("All");
  const [filteredTerms, setFilteredTerms] = useState([]);

  // Glossary terms data with UK-specific content
  const glossaryTerms = [
    {
      term: "Accessibility",
      definition:
        "The practice of making websites usable by as many people as possible. In the UK, websites must comply with the Equality Act 2010, which includes providing accessible websites for people with disabilities.",
      category: "general",
    },
    {
      term: "API (Application Programming Interface)",
      definition:
        "A set of rules that allows different software applications to communicate with each other. UK businesses often use APIs to connect their systems with government services like HMRC for tax purposes.",
      category: "technical",
    },
    {
      term: "Back-end Development",
      definition:
        "The development of server-side logic that powers websites and apps, typically involving databases, APIs, and application logic. Popular in the UK job market, especially in London's financial technology sector.",
      category: "technical",
    },
    {
      term: "Brexit Impact Assessment",
      definition:
        "A review process for websites and digital services to identify and address changes needed due to the UK's exit from the European Union, including data protection, hosting requirements, and legal compliance.",
      category: "uk-specific",
    },
    {
      term: "CMS (Content Management System)",
      definition:
        "Software that helps users create, manage, and modify content on a website without specialized technical knowledge. WordPress is the most popular CMS in the UK, powering over 40% of British websites.",
      category: "technical",
    },
    {
      term: "Cookies Consent",
      definition:
        "A mechanism for obtaining user permission to store cookies on their device. UK websites must comply with the Privacy and Electronic Communications Regulations (PECR) and UK GDPR for cookie consent.",
      category: "uk-specific",
    },
    {
      term: "Crown Copyright",
      definition:
        "Copyright owned by the British monarch and applies to works made by UK government employees. Developers working with UK government websites need to understand Crown Copyright rules.",
      category: "uk-specific",
    },
    {
      term: "CSS (Cascading Style Sheets)",
      definition:
        "A styling language used to control the presentation and layout of HTML documents. UK web designers often emphasize responsive design to accommodate the high percentage of mobile users in Britain.",
      category: "technical",
    },
    {
      term: "DevOps",
      definition:
        "A set of practices combining software development and IT operations to shorten the development lifecycle. London is a major DevOps hub in Europe with many UK companies adopting this approach.",
      category: "technical",
    },
    {
      term: "Digital Service Standard",
      definition:
        "A set of criteria to help UK government create and run good digital services. All public-facing transactional services must meet this standard.",
      category: "uk-specific",
    },
    {
      term: "E-commerce",
      definition:
        "The buying and selling of goods and services online. UK e-commerce is regulated by the Consumer Rights Act 2015 and the Electronic Commerce Regulations 2002.",
      category: "general",
    },
    {
      term: "Framework",
      definition:
        "A platform for developing software applications. React and Angular are particularly popular in UK development teams, with React dominating the London job market.",
      category: "technical",
    },
    {
      term: "Front-end Development",
      definition:
        "The practice of converting data to a graphical interface for users to view and interact with. A high-demand skill in the UK tech industry, especially with experience in React or Vue.js.",
      category: "technical",
    },
    {
      term: "GDPR (General Data Protection Regulation)",
      definition:
        "EU regulation on data protection and privacy, which has been incorporated into UK law as the UK GDPR following Brexit. UK websites must comply with both the Data Protection Act 2018 and the UK GDPR.",
      category: "uk-specific",
    },
    {
      term: "Git",
      definition:
        "A distributed version control system for tracking changes in source code. GitHub and GitLab are widely used by UK development teams for collaboration.",
      category: "technical",
    },
    {
      term: "HTML (Hypertext Markup Language)",
      definition:
        "The standard markup language for documents designed to be displayed in a web browser. HTML5 is widely adopted across UK web development projects.",
      category: "technical",
    },
    {
      term: "ICO (Information Commissioner's Office)",
      definition:
        "The UK's independent authority set up to uphold information rights in the public interest. Web developers in the UK must ensure sites comply with ICO guidelines on data protection.",
      category: "uk-specific",
    },
    {
      term: "JAMstack",
      definition:
        "A modern web development architecture based on client-side JavaScript, reusable APIs, and prebuilt Markup. This approach is gaining popularity in the UK for its performance benefits.",
      category: "technical",
    },
    {
      term: "JavaScript",
      definition:
        "A programming language that allows dynamic content on web pages. The UK has a vibrant JavaScript community with regular meetups in London, Manchester, and Edinburgh.",
      category: "technical",
    },
    {
      term: "Localisation",
      definition:
        "The process of adapting a website for a specific region or language. For UK audiences, this includes using British English spelling, date formats (DD/MM/YYYY), and pound sterling (£) currency.",
      category: "uk-specific",
    },
    {
      term: "Mobile-First Design",
      definition:
        "A design approach where websites are designed for mobile devices first, then adapted for desktop. Essential in the UK where mobile internet usage exceeds desktop.",
      category: "general",
    },
    {
      term: "Node.js",
      definition:
        "A JavaScript runtime built on Chrome's V8 JavaScript engine. Widely used in UK tech startups and established companies for building scalable network applications.",
      category: "technical",
    },
    {
      term: "Open Banking",
      definition:
        "A UK initiative requiring banks to provide regulated API access to account data. Created unique opportunities for UK fintech developers to build innovative financial applications.",
      category: "uk-specific",
    },
    {
      term: "Progressive Web App (PWA)",
      definition:
        "Web applications that provide a native app-like experience. Gaining popularity in the UK as a cost-effective alternative to native mobile apps.",
      category: "technical",
    },
    {
      term: "React",
      definition:
        "A JavaScript library for building user interfaces. The most in-demand front-end skill in UK job listings, particularly in London and Manchester tech hubs.",
      category: "technical",
    },
    {
      term: "Responsive Design",
      definition:
        "An approach to web design that makes web pages render well on a variety of devices and window or screen sizes. Essential for UK websites due to the diverse range of devices used by British consumers.",
      category: "general",
    },
    {
      term: "SEO (Search Engine Optimisation)",
      definition:
        "The practice of increasing the quantity and quality of traffic to a website through organic search engine results. UK SEO often requires specific strategies to target google.co.uk and regional UK search patterns.",
      category: "general",
    },
    {
      term: "Server-Side Rendering (SSR)",
      definition:
        "The process of rendering web pages on the server instead of in the browser. Popular in UK e-commerce sites for improved SEO and performance.",
      category: "technical",
    },
    {
      term: "TypeScript",
      definition:
        "A strict syntactical superset of JavaScript that adds static typing. Increasingly popular in UK enterprise development for its improved code quality and maintainability.",
      category: "technical",
    },
    {
      term: "UI/UX Design",
      definition:
        "User Interface and User Experience design focuses on creating meaningful and relevant experiences for users. London is a major hub for UI/UX design in Europe with many specialist agencies.",
      category: "general",
    },
    {
      term: "Vercel",
      definition:
        "A cloud platform for static sites and serverless functions. Popular hosting choice for Next.js projects in the UK tech sector.",
      category: "technical",
    },
    {
      term: "WCAG (Web Content Accessibility Guidelines)",
      definition:
        "Guidelines for making web content more accessible. UK public sector websites must meet WCAG 2.1 AA standards to comply with UK accessibility regulations.",
      category: "uk-specific",
    },
  ];

  // Alphabet array for navigation
  const alphabet = [
    "All",
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ];

  // Filter terms based on search and active letter
  useEffect(() => {
    const filtered = glossaryTerms.filter((item) => {
      const matchesSearch = item.term
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesLetter =
        activeLetter === "All" || item.term.charAt(0) === activeLetter;
      return matchesSearch && matchesLetter;
    });

    // Sort alphabetically
    filtered.sort((a, b) => a.term.localeCompare(b.term));

    setFilteredTerms(filtered);
  }, [searchTerm, activeLetter]);

  // Get terms by category
  const ukSpecificTerms = glossaryTerms.filter(
    (term) => term.category === "uk-specific"
  );

  // Create a glossary schema for SEO
  const websiteSchema = createWebsiteSchema();
  const glossarySchema = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    name: "UK Web Development Glossary",
    description:
      "A comprehensive glossary of web development terms with UK-specific context and references.",
    definedTerm: glossaryTerms.map((term) => ({
      "@type": "DefinedTerm",
      name: term.term,
      description: term.definition,
    })),
  };

  return (
    <>
      <UkSeo
        title="UK Web Development Glossary | British Tech Terminology Guide"
        description="Comprehensive glossary of web development terms with UK-specific context, regulations, and British industry standards. Essential reference for developers working in the United Kingdom."
        keywords="UK web development terminology, British tech glossary, UK GDPR web compliance, web accessibility UK regulations, British coding terms, UK digital terminology"
      />

      <JsonLd data={websiteSchema} />
      <JsonLd data={glossarySchema} />

      <div className="min-h-screen bg-slate-50 p-8 relative">
        <div className="max-w-6xl mx-auto space-y-8">
          <Card className="border-none bg-white border border-slate-200 shadow-sm backdrop-blur-sm p-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl font-bold text-slate-900 mb-6 font-calendas">
                UK Web Development Glossary
              </h1>

              <p className="text-slate-600 mb-8 font-calendas max-w-3xl">
                A comprehensive reference of web development terminology with
                UK-specific context, regulatory information, and British
                industry standards. This glossary is tailored for developers
                working in the United Kingdom.
              </p>

              {/* UK-specific terms highlight */}
              <div className="mb-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  UK-Specific Terms
                </h2>
                <p className="text-slate-600 mb-6">
                  These terms have particular relevance to web development in
                  the United Kingdom, covering UK regulations, standards, and
                  practices.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {ukSpecificTerms.map((term, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="bg-white border border-slate-200 rounded-lg p-4"
                    >
                      <h3 className="text-lg font-bold text-slate-900 mb-2">
                        {term.term}
                      </h3>
                      <p className="text-slate-600 text-sm">
                        {term.definition.substring(0, 100)}...
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Search and alphabet navigation */}
              <div className="mb-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                  <div className="flex items-center bg-white border border-slate-200 rounded-lg px-4 py-2 w-full md:w-auto">
                    <svg
                      className="w-4 h-4 text-slate-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    <input
                      type="text"
                      placeholder="Search terms..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="bg-transparent text-slate-900 focus:outline-none w-full"
                    />
                  </div>
                </div>

                {/* Alphabet navigation */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {alphabet.map((letter) => (
                    <button
                      key={letter}
                      onClick={() => setActiveLetter(letter)}
                      className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${
                        activeLetter === letter
                          ? "bg-blue-600 text-white"
                          : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {letter}
                    </button>
                  ))}
                </div>
              </div>

              {/* Glossary terms */}
              <div>
                {filteredTerms.length > 0 ? (
                  <div className="space-y-8">
                    {filteredTerms.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className={`p-6 rounded-lg ${
                          item.category === "uk-specific"
                            ? "bg-blue-50 border border-blue-200 border-l-4 border-l-blue-500"
                            : "bg-white border border-slate-200"
                        }`}
                      >
                        <h2 className="text-xl font-bold text-slate-900 mb-3">
                          {item.term}
                        </h2>
                        <p className="text-slate-600">{item.definition}</p>
                        {item.category === "uk-specific" && (
                          <div className="mt-3">
                            <span className="inline-block bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                              UK-Specific
                            </span>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white border border-slate-200 rounded-lg p-8 text-center">
                    <p className="text-slate-600 mb-4">
                      No terms found matching your search criteria.
                    </p>
                    <button
                      onClick={() => {
                        setSearchTerm("");
                        setActiveLetter("All");
                      }}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      Clear filters
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </Card>
        </div>
      </div>
    </>
  );
}
