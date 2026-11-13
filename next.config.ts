import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /**
     * AllPastels imagery is served from Unsplash during development.
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
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**",
        port: "",
        pathname: "/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
