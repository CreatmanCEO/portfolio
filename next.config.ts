import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // React Compiler
  reactCompiler: true,

  // Enable standalone output for Docker
  output: 'standalone',

  // Disable x-powered-by header
  poweredByHeader: false,

  // Compression
  compress: true,

  // Image optimization domains
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "creatman.site" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "cdn.hashnode.com" },
      { protocol: "https", hostname: "media2.dev.to" },
    ],
  },
};

export default nextConfig;
