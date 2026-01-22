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
      console.log("Sitemap: Querying Firestore REST API for blog slugs...");
      const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
      const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

      if (!projectId || !apiKey) {
        console.warn("Sitemap: Firebase credentials missing (NEXT_PUBLIC_FIREBASE_PROJECT_ID or NEXT_PUBLIC_FIREBASE_API_KEY). Skipping blog paths.");
      } else {
        const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents:runQuery?key=${apiKey}`;
        
        const query = {
          structuredQuery: {
            from: [{ collectionId: "blogs" }],
            where: {
              fieldFilter: {
                field: { fieldPath: "isPublished" },
                op: "EQUAL",
                value: { booleanValue: true }
              }
            }
          }
        };

        const response = await fetch(firestoreUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(query)
        });

        if (response.ok) {
          const results = await response.json();
          const blogPaths = (Array.isArray(results) ? results : [])
            .filter(r => r.document)
            .map(r => {
              const doc = r.document;
              const fields = doc.fields || {};
              const slug = fields.slug?.stringValue;
              const updatedAt = fields.updatedAt?.timestampValue || fields.createdAt?.timestampValue;

              if (slug) {
                return {
                  loc: `/blog/${slug}`,
                  lastmod: updatedAt ? new Date(updatedAt).toISOString() : new Date().toISOString(),
                  changefreq: "weekly",
                  priority: 0.7,
                };
              }
              return null;
            })
            .filter(Boolean);

          paths.push(...blogPaths);
          console.log(`Sitemap: Added ${blogPaths.length} blog paths.`);
        } else {
          const err = await response.json();
          console.error("Sitemap: Firestore REST API error:", err);
        }
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
