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
        // Add Pexels
        protocol: "https",
        hostname: "images.pexels.com",
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
    // Disable Sharp in production if causing issues
    disableStaticImages: process.env.NODE_ENV === "production",
    // Use squoosh instead of Sharp in production
    loader: process.env.NODE_ENV === "production" ? "default" : "default",
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
      try {
        const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
        config.plugins.push(
          new BundleAnalyzerPlugin({
            analyzerMode: "server",
            analyzerPort: isServer ? 8888 : 8889,
            openAnalyzer: true,
          })
        );
      } catch (e) {
        console.warn(
          "webpack-bundle-analyzer not found, skipping bundle analysis"
        );
      }
    }

    // Optimize CSS
    if (!dev && !isServer) {
      // Minify CSS - only if the plugin is available
      try {
        const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
        config.optimization.minimizer.push(new CssMinimizerPlugin({}));
      } catch (e) {
        console.warn(
          "css-minimizer-webpack-plugin not found, skipping CSS optimization"
        );
      }
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
