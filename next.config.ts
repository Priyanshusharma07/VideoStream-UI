import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
      // YouTube thumbnails (used in search results etc.)
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        pathname: "/**",
      },
      // Local dev backend (e.g. thumbnails served by the API)
      {
        protocol: "http",
        hostname: "localhost",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
