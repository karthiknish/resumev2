/** @type {import('next').NextConfig} */
const withPlugins = require("next-compose-plugins");
const withTM = require("next-transpile-modules")(["pdfjs-dist"]);

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["images.unsplash.com"],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.alias["pdfjs-dist"] = "pdfjs-dist/build/pdf";
    }
    return config;
  },
};

module.exports = nextConfig
