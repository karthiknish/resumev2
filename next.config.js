/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["package-name-to-transpile"],
  env: { PUPPETEER_CACHE: "/workspace/.cache/puppeteer" },
  images: {
    domains: ["images.unsplash.com", "karthiknish.com"],
  },
  webpack: (config) => {
    // Ignore the child_process module
    config.resolve.fallback = {
      ...config.resolve.fallback,
      child_process: false,
    };
    return config;
  },
};

module.exports = nextConfig;
