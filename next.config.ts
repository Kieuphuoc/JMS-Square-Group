import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  allowedDevOrigins: [
    'localhost:3060',
    'localhost:3050',
    '10.5.1.84',
    '10.5.1.84:3060',
    '10.5.1.137',
    '10.5.1.137:3060',
  ],
};

export default nextConfig;
