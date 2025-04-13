// Removed ES imports that cause issues with CommonJS requiring this file
// Icons are only needed for React components, not for the sitemap generation

// Create a simplified version of projectsData with just what's needed for the sitemap
const projectsData = [
  {
    id: "medblocks",
    title: "Medblocks",
    updatedAt: new Date(),
  },
  {
    id: "medblocksui",
    title: "Medblocks UI",
    updatedAt: new Date(),
  },
  {
    id: "covergenerator",
    title: "Cover Letter Generator",
    updatedAt: new Date(),
  },
  {
    id: "initiosolutions",
    title: "Initio Solutions",
    updatedAt: new Date(),
  },
  {
    id: "acaa",
    title: "Afghans and Central Asian Association",
    updatedAt: new Date(),
  },
  {
    id: "dreamedconsultancy",
    title: "Dream Ed Consultancy",
    updatedAt: new Date(),
  },
  {
    id: "creditcard",
    title: "Credit Card Fraud Detection",
    updatedAt: new Date(),
  },
  {
    id: "netflix",
    title: "Historical Stock Price Analysis of Netflix Inc.",
    updatedAt: new Date(),
  },
  {
    id: "analytics-system",
    title: "Analytics System",
    updatedAt: new Date(),
  },
  {
    id: "ai-integration",
    title: "AI Integration",
    updatedAt: new Date(),
  },
  {
    id: "startup-infrastructure",
    title: "Startup Infrastructure",
    updatedAt: new Date(),
  },
];

// Export using CommonJS format
module.exports = { projectsData };

// Keep original data in a different export for use in React components
// The original ES module data can be imported in a separate file if needed
