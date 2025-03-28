/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || "https://karthiknish.com", // Your production site URL
  generateRobotsTxt: false, // Set to false to keep the manually edited robots.txt
  // Optional: Add rules to exclude pages if needed
  // exclude: ['/admin/*', '/api/*'], // Example: Exclude admin and api routes
  // Optional: Add dynamic routes if not automatically detected (e.g., from a CMS)
  // additionalPaths: async (config) => {
  //   // Example: Fetch dynamic blog post slugs
  //   // const res = await fetch('https://api.example.com/posts')
  //   // const posts = await res.json()
  //   // return posts.map((post) => ({ loc: `/blog/${post.slug}`, lastmod: post.updatedAt, changefreq: 'weekly', priority: 0.7 }))
  //   return []
  // },
};
