import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["@fortawesome/free-solid-svg-icons"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "japqotgppxkifjchmntq.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
