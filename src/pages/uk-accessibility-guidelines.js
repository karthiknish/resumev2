import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import UkSeo from "@/components/UkSeo";
import JsonLd, { createWebsiteSchema } from "@/components/JsonLd";
import {
  FaCheck,
  FaFileAlt,
  FaExternalLinkAlt,
  FaInfoCircle,
} from "react-icons/fa";

export default function UkAccessibilityGuidelines() {
  const [activeSection, setActiveSection] = useState("overview");

  // UK accessibility guidelines data
  const guidelines = [
    {
      id: "public-sector",
      title: "Public Sector Bodies Accessibility Regulations",
      description:
        "UK regulations that came into force on 23 September 2018, requiring public sector websites and mobile applications to meet accessibility standards.",
      requirements: [
        "Meet WCAG 2.1 AA standards",
        "Publish an accessibility statement",
        "Address accessibility issues within a reasonable timeframe",
        "Perform regular accessibility audits",
      ],
      link: "https://www.gov.uk/guidance/accessibility-requirements-for-public-sector-websites-and-apps",
    },
    {
      id: "equality-act",
      title: "Equality Act 2010",
      description:
        "UK legislation that protects people from discrimination, including on the basis of disability. It applies to websites operated by service providers.",
      requirements: [
        "Make reasonable adjustments for disabled people",
        "Ensure equal access to services",
        "Remove barriers that might place disabled people at a disadvantage",
        "Provide alternative means of access where necessary",
      ],
      link: "https://www.legislation.gov.uk/ukpga/2010/15/contents",
    },
    {
      id: "wcag",
      title: "Web Content Accessibility Guidelines (WCAG)",
      description:
        "International standards that UK websites should follow. UK regulations specifically reference WCAG 2.1 Level AA as the required standard.",
      requirements: [
        "Perceivable: Information must be presentable to users in ways they can perceive",
        "Operable: User interface components must be operable",
        "Understandable: Information and operation must be understandable",
        "Robust: Content must be robust enough to be interpreted by a wide variety of user agents",
      ],
      link: "https://www.w3.org/WAI/standards-guidelines/wcag/",
    },
    {
      id: "bsi",
      title: "British Standards Institution (BSI)",
      description:
        "The UK's national standards body provides various accessibility-related standards, including BS 8878 Web Accessibility Code of Practice.",
      requirements: [
        "Define clear accessibility policies",
        "Adopt a user-centered design approach",
        "Consider accessibility from the start of development",
        "Test with users with disabilities",
      ],
      link: "https://www.bsigroup.com/en-GB/",
    },
    {
      id: "gds",
      title: "Government Digital Service (GDS) Standards",
      description:
        "Standards and guidance for UK government services that include specific accessibility requirements.",
      requirements: [
        "Follow the Service Standard",
        "Test with assistive technologies",
        "Consider a range of users",
        "Document accessibility decisions and findings",
      ],
      link: "https://www.gov.uk/service-manual/helping-people-to-use-your-service/making-your-service-accessible-an-introduction",
    },
  ];

  // Best practices specifically for UK websites
  const bestPractices = [
    {
      title: "British English",
      description:
        "Use British English spelling and terminology to ensure content is easily understood by UK users with cognitive disabilities.",
      example:
        "Use 'colour' instead of 'color', 'organisation' instead of 'organization'.",
    },
    {
      title: "UK-specific Terms",
      description:
        "Use terminology familiar to UK audiences, especially for government services, healthcare, and education.",
      example:
        "NHS for healthcare services, A-Levels for education, Council Tax for local taxation.",
    },
    {
      title: "UK Phone Format",
      description:
        "Format telephone numbers according to UK conventions to improve readability for all users.",
      example: "Use format 020 1234 5678 or +44 20 1234 5678.",
    },
    {
      title: "UK Date Format",
      description:
        "Use UK date format (day/month/year) consistently to avoid confusion for users with cognitive disabilities.",
      example: "31/01/2023 or 31 January 2023 rather than 01/31/2023.",
    },
    {
      title: "UK Postcodes",
      description:
        "Ensure form fields correctly validate UK postcodes and provide appropriate error messages.",
      example:
        "Validation should accept formats like 'SW1A 1AA' with or without the space.",
    },
    {
      title: "Currency Format",
      description:
        "Display pound sterling with the £ symbol before the amount, with appropriate spacing.",
      example: "£10.99 rather than 10.99£ or GBP 10.99.",
    },
  ];

  // Case studies of UK organizations implementing accessibility
  const caseStudies = [
    {
      organization: "BBC",
      description:
        "The BBC has comprehensive accessibility guidelines and standards that exceed legal requirements, making their content accessible to all UK citizens.",
      achievements: [
        "Fully accessible iPlayer with audio description and subtitles",
        "Mobile apps that work with screen readers and other assistive technologies",
        "Regular user testing with disabled individuals",
      ],
      link: "https://www.bbc.co.uk/accessibility/",
    },
    {
      organization: "GOV.UK",
      description:
        "The UK government's website is a model for accessible design, following rigorous standards to ensure all citizens can access government services.",
      achievements: [
        "Clean, simple design that works with all assistive technologies",
        "Regular accessibility audits and public reporting",
        "Plain English content that scores highly for readability",
      ],
      link: "https://www.gov.uk/help/accessibility-statement",
    },
    {
      organization: "Sainsbury's",
      description:
        "This major UK supermarket chain has made significant improvements to their website accessibility to serve all customers equally.",
      achievements: [
        "Screen reader compatible shopping experience",
        "Keyboard navigable interface",
        "Accessibility statement with clear feedback mechanisms",
      ],
      link: "https://www.sainsburys.co.uk/help/accessibility",
    },
  ];

  // Tools specific to or commonly used in the UK for accessibility
  const tools = [
    {
      name: "AbilityNet",
      description:
        "UK charity providing accessibility services and resources for organizations.",
      website: "https://abilitynet.org.uk/",
    },
    {
      name: "Digital Accessibility Centre",
      description:
        "UK-based accessibility testing service employing people with disabilities.",
      website: "https://digitalaccessibilitycentre.org/",
    },
    {
      name: "RNIB Accessible Website Checker",
      description:
        "Tool developed by the Royal National Institute of Blind People to check website accessibility.",
      website: "https://www.rnib.org.uk/",
    },
    {
      name: "Shaw Trust Accessibility Services",
      description:
        "UK disability charity offering accessibility auditing and consultancy.",
      website: "https://www.shaw-trust.org.uk/",
    },
  ];

  // Create schema for SEO
  const websiteSchema = createWebsiteSchema();
  const guideSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "UK Web Accessibility Guidelines",
    description:
      "A comprehensive guide to web accessibility standards and requirements for UK websites.",
    step: guidelines.map((guideline, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: guideline.title,
      itemListElement: guideline.requirements.map((req, reqIndex) => ({
        "@type": "HowToDirection",
        position: reqIndex + 1,
        text: req,
      })),
    })),
  };

  return (
    <>
      <UkSeo
        title="UK Web Accessibility Guidelines | British Accessibility Standards"
        description="Comprehensive guide to UK web accessibility regulations, standards, and best practices for developers creating websites for British audiences."
        keywords="UK web accessibility, British accessibility standards, WCAG UK, Equality Act 2010 web, Public Sector Bodies Accessibility Regulations, UK accessible design"
      />

      <JsonLd data={websiteSchema} />
      <JsonLd data={guideSchema} />

      <div className="min-h-screen bg-slate-50 p-8 relative">
        <div className="max-w-6xl mx-auto space-y-8">
          <Card className="border-none bg-white border border-slate-200 shadow-sm backdrop-blur-sm p-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl font-bold text-slate-900 mb-6 font-calendas">
                UK Web Accessibility Guidelines
              </h1>

              <p className="text-slate-600 mb-8 font-calendas max-w-3xl">
                A comprehensive guide to accessibility standards, regulations,
                and best practices specifically for websites targeting UK
                audiences. This resource helps developers ensure compliance with
                British accessibility requirements while creating inclusive
                digital experiences.
              </p>

              {/* Navigation tabs */}
              <div className="mb-10 border-b border-slate-200">
                <div className="flex flex-wrap -mb-px">
                  {[
                    { id: "overview", label: "Overview" },
                    { id: "regulations", label: "UK Regulations" },
                    { id: "best-practices", label: "UK Best Practices" },
                    { id: "case-studies", label: "Case Studies" },
                    { id: "tools", label: "Tools & Resources" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      className={`inline-block py-4 px-4 text-sm font-medium ${
                        activeSection === tab.id
                          ? "text-blue-500 border-b-2 border-blue-500"
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                      onClick={() => setActiveSection(tab.id)}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Overview section */}
              {activeSection === "overview" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">
                      Why UK-Specific Accessibility Matters
                    </h2>
                    <p className="text-slate-600 mb-4">
                      While web accessibility is a global concern, the United
                      Kingdom has specific legal requirements, standards, and
                      cultural contexts that developers need to understand.
                      Creating accessible websites for UK audiences involves:
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <FaCheck className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                        <span className="text-slate-600">
                          Complying with UK-specific legislation such as the
                          Equality Act 2010 and the Public Sector Bodies
                          Accessibility Regulations 2018
                        </span>
                      </li>
                      <li className="flex items-start">
                        <FaCheck className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                        <span className="text-slate-600">
                          Understanding the unique expectations of British users
                          regarding language, formatting, and cultural
                          references
                        </span>
                      </li>
                      <li className="flex items-start">
                        <FaCheck className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                        <span className="text-slate-600">
                          Working with UK-specific organizations and resources
                          that support web accessibility
                        </span>
                      </li>
                      <li className="flex items-start">
                        <FaCheck className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                        <span className="text-slate-600">
                          Following best practices from successful British
                          websites and digital services
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white border border-slate-200 rounded-lg p-6">
                      <h3 className="text-xl font-bold text-slate-900 mb-3">
                        UK Legal Requirements
                      </h3>
                      <p className="text-slate-600 mb-4">
                        The UK has specific legislation that mandates web
                        accessibility, particularly for public sector websites
                        and services provided to the public. Failure to comply
                        can result in legal consequences and reputational
                        damage.
                      </p>
                      <button
                        onClick={() => setActiveSection("regulations")}
                        className="text-blue-400 hover:text-blue-300 flex items-center"
                      >
                        View UK regulations{" "}
                        <FaExternalLinkAlt className="ml-2" />
                      </button>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-lg p-6">
                      <h3 className="text-xl font-bold text-slate-900 mb-3">
                        UK User Expectations
                      </h3>
                      <p className="text-slate-600 mb-4">
                        British users have specific expectations regarding
                        language, terminology, date formats, and other cultural
                        elements. Meeting these expectations improves usability
                        for all users, including those with disabilities.
                      </p>
                      <button
                        onClick={() => setActiveSection("best-practices")}
                        className="text-blue-400 hover:text-blue-300 flex items-center"
                      >
                        View UK best practices{" "}
                        <FaExternalLinkAlt className="ml-2" />
                      </button>
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-lg p-6 mb-8">
                    <h3 className="text-xl font-bold text-slate-900 mb-3">
                      Accessibility in the UK: Key Statistics
                    </h3>
                    <ul className="space-y-4">
                      <li className="text-slate-600">
                        <span className="font-bold text-blue-400">
                          14.6 million
                        </span>{" "}
                        people in the UK have a disability (22% of the
                        population)
                      </li>
                      <li className="text-slate-600">
                        <span className="font-bold text-blue-400">
                          4.1 million
                        </span>{" "}
                        disabled adults in the UK never use the internet
                      </li>
                      <li className="text-slate-600">
                        <span className="font-bold text-blue-400">71%</span> of
                        users with disabilities will leave a website if it's not
                        accessible
                      </li>
                      <li className="text-slate-600">
                        <span className="font-bold text-blue-400">98%</span> of
                        UK home pages have at least one WCAG 2.0 failure
                      </li>
                      <li className="text-slate-600">
                        <span className="font-bold text-blue-400">
                          £11.75 billion
                        </span>{" "}
                        is the estimated spending power of disabled people in
                        the UK
                      </li>
                    </ul>
                  </div>
                </motion.div>
              )}

              {/* UK Regulations section */}
              {activeSection === "regulations" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">
                    UK Accessibility Regulations & Standards
                  </h2>

                  <div className="space-y-8">
                    {guidelines.map((guideline, index) => (
                      <motion.div
                        key={guideline.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="bg-white border border-slate-200 rounded-lg p-6"
                      >
                        <h3 className="text-xl font-bold text-slate-900 mb-3">
                          {guideline.title}
                        </h3>
                        <p className="text-slate-600 mb-4">
                          {guideline.description}
                        </p>

                        <h4 className="text-lg font-semibold text-slate-900 mb-3">
                          Key Requirements:
                        </h4>
                        <ul className="space-y-2 mb-4">
                          {guideline.requirements.map((req, idx) => (
                            <li key={idx} className="flex items-start">
                              <FaCheck className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                              <span className="text-slate-600">{req}</span>
                            </li>
                          ))}
                        </ul>

                        <a
                          href={guideline.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 flex items-center"
                        >
                          Official documentation{" "}
                          <FaExternalLinkAlt className="ml-2" />
                        </a>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* UK Best Practices section */}
              {activeSection === "best-practices" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">
                    UK Accessibility Best Practices
                  </h2>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                    <h3 className="text-xl font-bold text-slate-900 mb-3">
                      UK-Specific Considerations
                    </h3>
                    <p className="text-slate-600 mb-4">
                      Beyond general accessibility guidelines, these UK-specific
                      best practices will help make your site more accessible
                      and user-friendly for British users:
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {bestPractices.map((practice, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="bg-white border border-slate-200 rounded-lg p-6"
                      >
                        <h3 className="text-xl font-bold text-slate-900 mb-3">
                          {practice.title}
                        </h3>
                        <p className="text-slate-600 mb-3">
                          {practice.description}
                        </p>
                        <div className="bg-slate-100 p-3 rounded">
                          <p className="text-slate-500 text-sm mb-1">Example:</p>
                          <p className="text-slate-600">{practice.example}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="bg-white border border-slate-200 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-slate-900 mb-4">
                      UK Accessibility Statement Requirements
                    </h3>
                    <p className="text-slate-600 mb-4">
                      UK websites, especially public sector sites, must include
                      an accessibility statement that includes:
                    </p>
                    <ul className="space-y-3 mb-6">
                      <li className="flex items-start">
                        <FaCheck className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                        <span className="text-slate-600">
                          Statement of commitment to providing an accessible
                          website
                        </span>
                      </li>
                      <li className="flex items-start">
                        <FaCheck className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                        <span className="text-slate-600">
                          Detailed information about the site's accessibility
                          level
                        </span>
                      </li>
                      <li className="flex items-start">
                        <FaCheck className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                        <span className="text-slate-600">
                          Known accessibility issues with explanations
                        </span>
                      </li>
                      <li className="flex items-start">
                        <FaCheck className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                        <span className="text-slate-600">
                          Methods for users to report accessibility problems
                        </span>
                      </li>
                      <li className="flex items-start">
                        <FaCheck className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                        <span className="text-slate-600">
                          Enforcement procedure information
                        </span>
                      </li>
                    </ul>
                    <a
                      href="https://www.gov.uk/guidance/model-accessibility-statement"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 flex items-center"
                    >
                      View UK model accessibility statement{" "}
                      <FaExternalLinkAlt className="ml-2" />
                    </a>
                  </div>
                </motion.div>
              )}

              {/* Case Studies section */}
              {activeSection === "case-studies" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">
                    UK Accessibility Case Studies
                  </h2>

                  <p className="text-slate-600 mb-8">
                    Learn from these UK organizations that have successfully
                    implemented accessibility standards and created inclusive
                    digital experiences:
                  </p>

                  <div className="space-y-8">
                    {caseStudies.map((study, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="bg-white border border-slate-200 rounded-lg p-6"
                      >
                        <h3 className="text-xl font-bold text-slate-900 mb-3">
                          {study.organization}
                        </h3>
                        <p className="text-slate-600 mb-4">
                          {study.description}
                        </p>

                        <h4 className="text-lg font-semibold text-slate-900 mb-3">
                          Key Achievements:
                        </h4>
                        <ul className="space-y-2 mb-4">
                          {study.achievements.map((achievement, idx) => (
                            <li key={idx} className="flex items-start">
                              <FaCheck className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                              <span className="text-slate-600">
                                {achievement}
                              </span>
                            </li>
                          ))}
                        </ul>

                        <a
                          href={study.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 flex items-center"
                        >
                          View accessibility approach{" "}
                          <FaExternalLinkAlt className="ml-2" />
                        </a>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Tools & Resources section */}
              {activeSection === "tools" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">
                    UK Accessibility Tools & Resources
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {tools.map((tool, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="bg-white border border-slate-200 rounded-lg p-6"
                      >
                        <h3 className="text-xl font-bold text-slate-900 mb-3">
                          {tool.name}
                        </h3>
                        <p className="text-slate-600 mb-4">{tool.description}</p>
                        <a
                          href={tool.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 flex items-center"
                        >
                          Visit website <FaExternalLinkAlt className="ml-2" />
                        </a>
                      </motion.div>
                    ))}
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                    <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                      <FaInfoCircle className="mr-2" /> Official UK Guidance
                      Documents
                    </h3>
                    <ul className="space-y-4">
                      <li>
                        <a
                          href="https://www.gov.uk/service-manual/helping-people-to-use-your-service/making-your-service-accessible-an-introduction"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 flex items-start"
                        >
                          <FaFileAlt className="mt-1 mr-2 flex-shrink-0" />
                          <span>GDS Accessibility Guide - UK Government</span>
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://www.equalityhumanrights.com/en/advice-and-guidance/creating-website-accessible-disabled-people"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 flex items-start"
                        >
                          <FaFileAlt className="mt-1 mr-2 flex-shrink-0" />
                          <span>
                            Equality and Human Rights Commission Website
                            Guidance
                          </span>
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://www.rnib.org.uk/about-rnib/web-accessibility-guidelines"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 flex items-start"
                        >
                          <FaFileAlt className="mt-1 mr-2 flex-shrink-0" />
                          <span>RNIB Web Accessibility Guidelines</span>
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://www.scope.org.uk/advice-and-support/make-your-website-accessible/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 flex items-start"
                        >
                          <FaFileAlt className="mt-1 mr-2 flex-shrink-0" />
                          <span>Scope UK Website Accessibility Guide</span>
                        </a>
                      </li>
                    </ul>
                  </div>
                </motion.div>
              )}

              {/* Call to action section */}
              <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  Need Help With UK Accessibility Compliance?
                </h2>
                <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
                  If you need assistance ensuring your website meets UK
                  accessibility standards or would like to share accessibility
                  resources, please get in touch.
                </p>
                <Link
                  href="/contact"
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-colors"
                >
                  Contact For Accessibility Consultation
                </Link>
              </div>
            </motion.div>
          </Card>
        </div>
      </div>
    </>
  );
}
