import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'i.ibb.co' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'drive.google.com' },
      { protocol: 'https', hostname: '**.imgur.com' },
      { protocol: 'https', hostname: '**.unsplash.com' },
    ],
    unoptimized: true, // allows <img> tags with any domain
  },
};

export default nextConfig;
