import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /**
     * AllPatels imagery is served from Unsplash during development.
     * Moving to a production CDN means editing this block and
     * `src/lib/images.ts` only — no component changes required.
     */
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/photo-**",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
