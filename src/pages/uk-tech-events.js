import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import UkSeo from "@/components/UkSeo";
import JsonLd, { createWebsiteSchema } from "@/components/JsonLd";
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaExternalLinkAlt,
  FaFilter,
} from "react-icons/fa";

export default function UkTechEvents() {
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // UK events data
  const events = [
    {
      title: "London Tech Week",
      date: "10-14 June 2024",
      location: "London",
      category: "conference",
      description:
        "Europe's largest technology festival, bringing together global leaders, startups, and investors to discuss the latest trends and innovations in tech.",
      link: "https://londontechweek.com/",
      featured: true,
    },
    {
      title: "ReactJS Manchester",
      date: "Last Thursday of each month",
      location: "Manchester",
      category: "meetup",
      description:
        "Monthly meetup for React developers in Manchester, featuring talks, workshops and networking opportunities.",
      link: "https://www.meetup.com/react-manchester/",
      featured: false,
    },
    {
      title: "Leeds Digital Festival",
      date: "23-27 September 2024",
      location: "Leeds",
      category: "conference",
      description:
        "The North's largest digital festival, celebrating digital culture across various sectors and showcasing Leeds as a hub for tech innovation.",
      link: "https://leedsdigitalfestival.org/",
      featured: true,
    },
    {
      title: "Scotland JS",
      date: "July 2024",
      location: "Edinburgh",
      category: "conference",
      description:
        "JavaScript conference covering frameworks, standards, performance, accessibility and tooling in Scotland's beautiful capital city.",
      link: "https://scotlandjs.com/",
      featured: false,
    },
    {
      title: "UX Brighton",
      date: "First Thursday of each month",
      location: "Brighton",
      category: "meetup",
      description:
        "Monthly meetup for UX designers and researchers in Brighton, focusing on user experience design, research methods, and case studies.",
      link: "https://uxbrighton.org.uk/",
      featured: false,
    },
    {
      title: "Full Stack London",
      date: "17-18 October 2024",
      location: "London",
      category: "conference",
      description:
        "A two-day conference for software engineers covering frontend, backend, DevOps, and everything in between.",
      link: "https://skillsmatter.com/",
      featured: true,
    },
    {
      title: "Bristol JS",
      date: "Last Wednesday of each month",
      location: "Bristol",
      category: "meetup",
      description:
        "Bristol's JavaScript community meetup, featuring talks on JavaScript, frameworks, tools, and best practices.",
      link: "https://meetup.com/bristol-js/",
      featured: false,
    },
    {
      title: "Women in Tech UK",
      date: "12 September 2024",
      location: "Manchester",
      category: "conference",
      description:
        "Annual conference celebrating and supporting women in technology across the UK, with inspirational speakers and networking opportunities.",
      link: "https://womenintech.co.uk/",
      featured: true,
    },
    {
      title: "AI UK",
      date: "20-21 March 2024",
      location: "London",
      category: "conference",
      description:
        "The UK's premier AI event, showcasing the latest advances in artificial intelligence research and its applications across industries.",
      link: "https://ai-uk.org/",
      featured: true,
    },
    {
      title: "Glasgow Tech Meetup",
      date: "Second Tuesday of each month",
      location: "Glasgow",
      category: "meetup",
      description:
        "Monthly technology meetup in Glasgow covering various tech topics with speakers from the local tech community.",
      link: "https://www.meetup.com/glasgow-tech-meetup/",
      featured: false,
    },
    {
      title: "DevOpsDays London",
      date: "26-27 September 2024",
      location: "London",
      category: "conference",
      description:
        "A technical conference covering topics of software development, IT infrastructure operations, and the intersection between them.",
      link: "https://devopsdays.org/events/2024-london/welcome/",
      featured: false,
    },
    {
      title: "Cambridge Python User Group",
      date: "First Tuesday of each month",
      location: "Cambridge",
      category: "meetup",
      description:
        "Monthly meetup for Python enthusiasts in Cambridge, with talks, tutorials, and discussions on Python programming.",
      link: "https://www.meetup.com/cambridge-python-user-group/",
      featured: false,
    },
  ];

  // Filter events based on search term and category
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filter === "all" || event.category === filter;

    return matchesSearch && matchesFilter;
  });

  // Featured events
  const featuredEvents = events.filter((event) => event.featured);

  // JSON-LD schema
  const websiteSchema = createWebsiteSchema();
  const eventsSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: events.map((event, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Event",
        name: event.title,
        description: event.description,
        location: {
          "@type": "Place",
          address: {
            "@type": "PostalAddress",
            addressCountry: "UK",
            addressLocality: event.location,
          },
          name: event.location + ", UK",
        },
      },
    })),
  };

  return (
    <>
      <UkSeo
        title="UK Tech Events Calendar 2024 | Web Development Conferences & Meetups"
        description="Comprehensive calendar of tech events across the United Kingdom, including web development conferences, React meetups, JavaScript workshops, and UX design events."
        keywords="UK tech events, British web development conferences, React meetups London, JavaScript events Manchester, UK developer community, tech calendar Britain"
      />

      <JsonLd data={websiteSchema} />
      <JsonLd data={eventsSchema} />

      <div className="min-h-screen bg-slate-50 p-8 relative">
        <div className="max-w-6xl mx-auto space-y-8">
          <Card className="border-none bg-white border border-slate-200 shadow-sm backdrop-blur-sm p-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl font-bold text-slate-900 mb-6 font-calendas">
                UK Tech Events Calendar 2024
              </h1>

              <p className="text-slate-600 mb-8 font-calendas max-w-3xl">
                Stay connected with the UK's vibrant tech community through this
                curated calendar of web development conferences, meetups, and
                workshops across Britain. From London to Edinburgh, discover
                opportunities to learn, network, and grow your skills.
              </p>

              {/* Search and filter section */}
              <div className="mb-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                  <div className="flex items-center bg-white border border-slate-200 rounded-lg px-4 py-2 w-full md:w-auto">
                    <FaFilter className="text-slate-500 mr-2" />
                    <select
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                      className="bg-transparent text-slate-900 focus:outline-none w-full"
                    >
                      <option value="all">All Events</option>
                      <option value="conference">Conferences</option>
                      <option value="meetup">Meetups</option>
                    </select>
                  </div>

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
                      placeholder="Search events or locations..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="bg-transparent text-slate-900 focus:outline-none w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Featured events section */}
              {featuredEvents.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">
                    Featured Events
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {featuredEvents.map((event, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="bg-white border border-slate-200 rounded-lg p-6 h-full flex flex-col"
                      >
                        <h3 className="text-xl font-bold text-slate-900 mb-3">
                          {event.title}
                        </h3>
                        <div className="flex items-center text-slate-500 mb-2">
                          <FaCalendarAlt className="mr-2" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center text-slate-500 mb-4">
                          <FaMapMarkerAlt className="mr-2" />
                          <span>{event.location}</span>
                        </div>
                        <p className="text-slate-600 mb-4 flex-grow">
                          {event.description}
                        </p>
                        <a
                          href={event.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 flex items-center"
                        >
                          Visit Website <FaExternalLinkAlt className="ml-2" />
                        </a>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* All events listing */}
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-6">
                  All Events
                </h2>

                {filteredEvents.length > 0 ? (
                  <div className="space-y-4">
                    {filteredEvents.map((event, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="bg-white border border-slate-200 rounded-lg p-6"
                      >
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                          <div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">
                              {event.title}
                            </h3>
                            <div className="flex items-center text-slate-500 mb-2">
                              <FaCalendarAlt className="mr-2" />
                              <span>{event.date}</span>
                            </div>
                            <div className="flex items-center text-slate-500 mb-4">
                              <FaMapMarkerAlt className="mr-2" />
                              <span>{event.location}</span>
                            </div>
                            <p className="text-slate-600 mb-4">
                              {event.description}
                            </p>
                          </div>
                          <div className="mt-4 md:mt-0 md:ml-6">
                            <a
                              href={event.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition-colors"
                            >
                              View Event
                            </a>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white border border-slate-200 rounded-lg p-8 text-center">
                    <p className="text-slate-600 mb-4">
                      No events found matching your search criteria.
                    </p>
                    <button
                      onClick={() => {
                        setSearchTerm("");
                        setFilter("all");
                      }}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      Clear filters
                    </button>
                  </div>
                )}
              </div>

              {/* Submit event section */}
              <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  Know of an Event?
                </h2>
                <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
                  If you're organizing a tech event in the UK or know of one
                  that should be added to this calendar, please get in touch.
                  We're always looking to help promote the British tech
                  community.
                </p>
                <Link
                  href="/contact"
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-colors"
                >
                  Suggest an Event
                </Link>
              </div>
            </motion.div>
          </Card>
        </div>
      </div>
    </>
  );
}
