/** @type {import('next-sitemap').IConfig} */
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
  ],
  // Function to generate dynamic paths for blog posts
  additionalPaths: async (config) => {
    const paths = [];
    const baseUrl = process.env.SITE_URL || "https://karthiknish.com"; // Use the same base URL

    try {
      // Fetch published blog posts (only need slug and updatedAt)
      const blogResponse = await fetch(
        `${baseUrl}/api/blog?publishedOnly=true&select=slug,updatedAt`
      );
      if (blogResponse.ok) {
        const blogData = await blogResponse.json();
        if (blogData.success && Array.isArray(blogData.data)) {
          blogData.data.forEach((post) => {
            paths.push({
              loc: `/blog/${post.slug}`, // Construct the full URL path
              lastmod: post.updatedAt
                ? new Date(post.updatedAt).toISOString()
                : new Date().toISOString(),
              changefreq: "weekly", // How often content might change
              priority: 0.7, // Priority relative to other pages (0.0 to 1.0)
            });
          });
        } else {
          console.warn(
            "Sitemap: Failed to fetch or parse blog posts from API."
          );
        }
      } else {
        console.warn(
          `Sitemap: Blog API request failed with status ${blogResponse.status}`
        );
      }

      // TODO: Add fetching for dynamic project paths if /projects/[id] uses dynamic data
      // Example:
      // const projectResponse = await fetch(`${baseUrl}/api/projects?select=id,updatedAt`); // Adjust API endpoint
      // if (projectResponse.ok) { ... similar logic ... }
    } catch (error) {
      console.error("Sitemap: Error fetching additional paths:", error);
    }

    console.log(`Sitemap: Generated ${paths.length} additional paths.`);
    return paths;
  },
};
