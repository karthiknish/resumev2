// Converted to TypeScript - migrated
import Head from "next/head";
import Link from "next/link";
import PageContainer from "@/components/PageContainer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Archive, Calendar, Mail, ChevronLeft, ChevronRight } from "lucide-react";

// Mock data for newsletter issues
const mockNewsletterIssues = [
  {
    id: 1,
    title: "The Future of Web Development in 2025",
    date: "2025-07-15",
    description: "Exploring the latest trends and technologies shaping the future of web development.",
    readTime: "5 min read",
  },
  {
    id: 2,
    title: "Building Scalable React Applications",
    date: "2025-07-01",
    description: "Best practices for creating maintainable and scalable React applications.",
    readTime: "8 min read",
  },
  {
    id: 3,
    title: "AI Integration in Modern Web Apps",
    date: "2025-06-15",
    description: "How to seamlessly integrate AI features into your web applications.",
    readTime: "6 min read",
  },
  {
    id: 4,
    title: "Optimizing Performance for Mobile Users",
    date: "2025-06-01",
    description: "Techniques to improve load times and user experience on mobile devices.",
    readTime: "7 min read",
  },
  {
    id: 5,
    title: "The Rise of Edge Computing",
    date: "2025-05-15",
    description: "Understanding edge computing and its impact on web development.",
    readTime: "9 min read",
  },
  {
    id: 6,
    title: "Mastering CSS Grid and Flexbox",
    date: "2025-05-01",
    description: "Advanced layout techniques for creating responsive designs.",
    readTime: "10 min read",
  },
];

interface NewsletterIssue {
  id: number;
  title: string;
  date: string;
  description: string;
  readTime: string;
}

export default function NewsletterArchive() {
  const [issues, setIssues] = useState<NewsletterIssue[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const issuesPerPage = 4;

  useEffect(() => {
    // Simulate API call to fetch newsletter issues
    const fetchIssues = async () => {
      setIsLoading(true);
      try {
        // In a real implementation, you would fetch from your API
        // const response = await fetch('/api/newsletter/issues');
        // const data = await response.json();
        // setIssues(data.issues);
        
        // For now, using mock data
        setTimeout(() => {
          setIssues(mockNewsletterIssues);
          setIsLoading(false);
        }, 800);
      } catch (error) {
        toast.error("Failed to load newsletter archive.");
        setIsLoading(false);
      }
    };

    fetchIssues();
  }, []);

  // Get current issues
  const indexOfLastIssue = currentPage * issuesPerPage;
  const indexOfFirstIssue = indexOfLastIssue - issuesPerPage;
  const currentIssues = issues.slice(indexOfFirstIssue, indexOfLastIssue);
  const totalPages = Math.ceil(issues.length / issuesPerPage);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
      <Head>
        <title>Newsletter Archive - Karthik Nishanth</title>
        <meta
          name="description"
          content="Browse our collection of past newsletter issues"
        />
        <meta name="robots" content="noindex, nofollow" />

        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <PageContainer>
        <div
          className="min-h-screen relative flex items-center justify-center"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          {/* Modern Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-brandSecondary/10"></div>

          {/* Decorative Color Splashes */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-amber-200/20 to-orange-200/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-blue-200/20 to-cyan-200/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 w-full max-w-6xl mx-auto px-8"
          >
            <div className="text-center mb-12">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-200 rounded-full text-amber-700 text-sm font-semibold mb-6 shadow-lg"
              >
                <Archive className="w-4 h-4" />
                <span>Newsletter Archive</span>
              </motion.div>

              <h1
                className="text-4xl md:text-5xl font-black text-gray-900 mb-6"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent">
                  Past Issues
                </span>
              </h1>

              <p className="text-gray-700 text-lg font-medium max-w-2xl mx-auto">
                Browse through our collection of past newsletter issues. Catch up
                on the content you may have missed.
              </p>
            </div>

            <div className="bg-white/90 backdrop-blur-sm border-2 border-amber-200 p-8 rounded-3xl shadow-2xl">
              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {currentIssues.map((issue) => (
                      <motion.div
                        key={issue.id}
                        whileHover={{ y: -5 }}
                        className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-100 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <div className="flex items-center gap-2 text-amber-600 mb-3">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            {formatDate(issue.date)}
                          </span>
                          <span className="text-amber-300">•</span>
                          <span className="text-sm font-medium">
                            {issue.readTime}
                          </span>
                        </div>
                        <h3
                          className="text-xl font-bold text-gray-900 mb-3"
                          style={{ fontFamily: "Space Grotesk, sans-serif" }}
                        >
                          {issue.title}
                        </h3>
                        <p className="text-gray-700 mb-4">{issue.description}</p>
                        <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-2 px-4 rounded-xl">
                          Read Issue
                        </Button>
                      </motion.div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-4 mt-8">
                      <Button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        variant="outline"
                        className="border-amber-300 text-amber-700 hover:bg-amber-50"
                      >
                        <ChevronLeft className="w-4 h-4 mr-2" />
                        Previous
                      </Button>
                      
                      <div className="flex gap-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                          (page) => (
                            <Button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              variant={
                                currentPage === page ? "default" : "outline"
                              }
                              className={
                                currentPage === page
                                  ? "bg-amber-500 hover:bg-amber-600 text-white"
                                  : "border-amber-300 text-amber-700 hover:bg-amber-50"
                              }
                            >
                              {page}
                            </Button>
                          )
                        )}
                      </div>
                      
                      <Button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        variant="outline"
                        className="border-amber-300 text-amber-700 hover:bg-amber-50"
                      >
                        Next
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  )}
                </>
              )}

              <div className="mt-12 pt-8 border-t-2 border-amber-100 text-center">
                <h3
                  className="text-2xl font-bold text-gray-900 mb-4"
                  style={{ fontFamily: "Space Grotesk, sans-serif" }}
                >
                  <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                    Never Miss an Issue
                  </span>
                </h3>
                <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
                  Subscribe to our newsletter to receive future issues directly
                  in your inbox.
                </p>
                <Link href="/">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 mx-auto"
                  >
                    <Mail className="w-5 h-5" />
                    Subscribe Now
                  </motion.button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </PageContainer>
    </>
  );
}
