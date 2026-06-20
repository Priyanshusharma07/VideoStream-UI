import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // NOTE: Do NOT set output: "standalone" for Amplify Web Compute.
  // Amplify auto-detects Next.js SSR and handles Lambda packaging itself.
  // "standalone" is only for self-hosted / Docker deployments.
  
  // Forward /api requests to the real backend if NEXT_PUBLIC_API_BASE isn't set
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        // Map everything after /api/ to the backend without the /api prefix
        destination: "https://cineview-api.priyanshusharma015.in/:path*", 
      },
    ];
  },

  images: {
    remotePatterns: [
      // Primary S3 bucket (path-style)
      {
        protocol: "https",
        hostname: "priyanshu-streaming-platform.s3.ap-south-1.amazonaws.com",
        pathname: "/**",
      },
      // S3 virtual-hosted style (signed URLs use this)
      {
        protocol: "https",
        hostname: "*.s3.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.s3.*.amazonaws.com",
        pathname: "/**",
      },
      // YouTube thumbnails
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        pathname: "/**",
      },
      // Local dev backend
      {
        protocol: "http",
        hostname: "localhost",
        pathname: "/**",
      },
      // Google images
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;