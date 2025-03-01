/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@splinetool/react-spline", "@splinetool/runtime"],
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
    ],
  },
  // Add headers for audio files
  async headers() {
    return [
      {
        source: "/uploads/audio/:path*",
        headers: [
          {
            key: "Content-Type",
            value: "audio/mpeg",
          },
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
  // Simplified webpack config
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      child_process: false,
    };
    return config;
  },
};

module.exports = nextConfig;
