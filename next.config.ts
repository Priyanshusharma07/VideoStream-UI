import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",  // ← ADD THIS for Amplify SSR
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