import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "api.nike.com",
      "static.nike.com",
      "images.nike.com",
      "c.static-nike.com",
      "secure-images.nike.com",
    ],
  },
};

export default nextConfig;
