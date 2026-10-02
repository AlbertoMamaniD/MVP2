import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // La presentación vive en public/pitch/ y se abre en /pitch
  async rewrites() {
    return [
      {
        source: "/pitch",
        destination: "/pitch/index.html",
      },
    ];
  },
};

export default nextConfig;
