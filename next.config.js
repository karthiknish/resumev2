/** @type {import('next').NextConfig} */
const path = require("path");

const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@splinetool/react-spline", "@splinetool/runtime"],
  // Enable image optimization
  images: {
    formats: ["image/avif", "image/webp"],
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
    // Optimize image quality vs size
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 60,
  },
  // Add performance-related headers
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
      {
        // Apply to all routes
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
      {
        // Cache static assets
        source: "/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Cache images
        source: "/_next/image/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Cache fonts
        source: "/fonts/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
  // Optimize webpack config
  webpack: (config, { dev, isServer }) => {
    // Optimize bundle size
    config.resolve.fallback = {
      ...config.resolve.fallback,
      child_process: false,
    };

    // Resolve Ajv module issues
    config.resolve.alias = {
      ...config.resolve.alias,
      ajv$: path.resolve(__dirname, "node_modules/ajv"),
    };

    // Add bundle analyzer in non-production builds
    if (process.env.ANALYZE === "true") {
      const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: "server",
          analyzerPort: isServer ? 8888 : 8889,
          openAnalyzer: true,
        })
      );
    }

    // Optimize CSS
    if (!dev && !isServer) {
      // Minify CSS
      config.optimization.minimizer.push(
        new (require("css-minimizer-webpack-plugin"))({})
      );
    }

    return config;
  },
  // Enable compression
  compress: true,
  // Enable production source maps for better debugging
  productionBrowserSourceMaps: false,
  // Optimize build output
  output: "standalone",
  // Disable powered by header
  poweredByHeader: false,
  // Enable strict mode
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Optimize build time
  // swcMinify: true, // This option is no longer needed in Next.js 15
};

module.exports = nextConfig;
