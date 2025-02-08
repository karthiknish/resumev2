/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["package-name-to-transpile"],
  env: { PUPPETEER_CACHE: "/workspace/.cache/puppeteer" },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
      // Add any other domains you need to support
    ],
  },
  webpack: (config) => {
    // Ignore the child_process module
    config.resolve.fallback = {
      ...config.resolve.fallback,
      child_process: false,
    };
    config.externals = [...config.externals, { canvas: "canvas" }]; // required by html-pdf
    return config;
  },
};

module.exports = nextConfig;
