import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone', // Enable standalone output for Docker
  experimental: {
    // Optimize for production
    optimizePackageImports: ['lucide-react'],
  },
  // Ensure WASM files are served with correct MIME types
  async headers() {
    return [
      {
        source: '/onnx/:path*.wasm',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/wasm',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
        ],
      },
      {
        source: '/onnx/:path*.mjs',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/javascript',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
