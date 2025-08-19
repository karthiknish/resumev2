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
    try {
      // Load DB and Blog model directly to avoid calling /api/blog (which may be protected by middleware)
      console.log("Sitemap: Querying database for blog slugs...");
      const dbConnect = require("./src/lib/dbConnect");
      const Blog = require("./src/models/Blog");

      // Ensure DB connection
      await dbConnect();

      // Fetch all published blog slugs and updatedAt timestamps
      const posts = await Blog.find({ isPublished: true })
        .select("slug updatedAt")
        .lean();
      if (Array.isArray(posts) && posts.length > 0) {
        posts.forEach((post) => {
          paths.push({
            loc: `/blog/${post.slug}`,
            lastmod: post.updatedAt
              ? new Date(post.updatedAt).toISOString()
              : new Date().toISOString(),
            changefreq: "weekly",
            priority: 0.7,
          });
        });
        console.log(`Sitemap: Added ${posts.length} blog paths.`);
      } else {
        console.log("Sitemap: No published blog posts found.");
      }

      // Add Project Paths from projectsData
      console.log("Sitemap: Adding project paths...");
      if (projectsData && Array.isArray(projectsData)) {
        projectsData.forEach((project) => {
          const lastModified = project.updatedAt || new Date();
          paths.push({
            loc: `/projects/${project.id}`,
            lastmod: new Date(lastModified).toISOString(),
            changefreq: "monthly",
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
