import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: "/app",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
      },
    ],
  },
};

export default nextConfig;