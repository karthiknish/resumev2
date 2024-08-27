/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["package-name-to-transpile"],
  env: { PUPPETEER_CACHE: "/workspace/.cache/puppeteer" },
  images: {
    domains: ["images.unsplash.com", "karthiknish.com"],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.alias["pdfjs-dist"] = "pdfjs-dist/build/pdf";
    }
    return config;
  },
};

module.exports = nextConfig;
