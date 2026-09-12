import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone', // Enable standalone output for Docker
  experimental: {
    // Optimize for production
    optimizePackageImports: ['lucide-react'],
  },
};

export default nextConfig;
