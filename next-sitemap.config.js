/** @type {import('next-sitemap').IConfig} */
const { projectsData } = require("./src/lib/projectsData"); // Import project data

module.exports = {
  siteUrl: process.env.SITE_URL || "https://karthiknish.com", // Your production site URL
  generateRobotsTxt: false, // Keep this as false
  // Exclude admin, API routes, and specific utility pages from sitemap
  exclude: [
    "/admin/*",
    "/api/*",
    "/signin",
    "/signup",
    "/success", // Assuming this is a post-action confirmation page
    "/404",
    "/forgot-password",
    "/reset-password",
    "/jostec.php", // Exclude specific non-Next.js files if present
    "/services.php",
    "/newsletter/thank-you", // Exclude newsletter thank you page
  ],
  // Function to generate dynamic paths for blog posts and projects
  additionalPaths: async (config) => {
    const paths = [];
    const baseUrl = process.env.SITE_URL || "https://karthiknish.com"; // Use the same base URL

    try {
      // --- Fetch Blog Posts ---
      console.log("Sitemap: Fetching blog posts...");
      const blogResponse = await fetch(
        `${baseUrl}/api/blog?publishedOnly=true&select=slug,updatedAt`
      );
      if (blogResponse.ok) {
        const blogData = await blogResponse.json();
        if (blogData.success && Array.isArray(blogData.data)) {
          blogData.data.forEach((post) => {
            paths.push({
              loc: `/blog/${post.slug}`,
              lastmod: post.updatedAt
                ? new Date(post.updatedAt).toISOString()
                : new Date().toISOString(),
              changefreq: "weekly",
              priority: 0.7,
            });
          });
          console.log(`Sitemap: Added ${blogData.data.length} blog paths.`);
        } else {
          console.warn(
            "Sitemap: Failed to fetch or parse blog posts from API.",
            blogData
          );
        }
      } else {
        console.warn(
          `Sitemap: Blog API request failed with status ${blogResponse.status}`
        );
      }

      // --- Add Project Paths ---
      console.log("Sitemap: Adding project paths...");
      if (projectsData && Array.isArray(projectsData)) {
        projectsData.forEach((project) => {
          // Assuming projectsData has an 'id' and maybe an 'updatedAt' or similar field
          // If no date field exists, use the current date
          const lastModified = project.updatedAt || new Date();
          paths.push({
            loc: `/projects/${project.id}`, // Use project ID for the path
            lastmod: new Date(lastModified).toISOString(),
            changefreq: "monthly", // Projects might change less often than blog posts
            priority: 0.6,
          });
        });
        console.log(`Sitemap: Added ${projectsData.length} project paths.`);
      } else {
        console.warn("Sitemap: projectsData not found or not an array.");
      }
    } catch (error) {
      console.error("Sitemap: Error fetching additional paths:", error);
    }

    console.log(`Sitemap: Generated total ${paths.length} additional paths.`);
    return paths;
  },
};
