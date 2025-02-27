/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["package-name-to-transpile"],
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
    return config;
  },
};

module.exports = nextConfig;
