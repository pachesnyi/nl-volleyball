import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  compiler: {
    // Add React component names in development
    reactRemoveProperties: process.env.NODE_ENV === 'production' ? { properties: ['^data-'] } : false,
  },
  experimental: {
    // Better debugging in development
    optimizePackageImports: ['@mui/material', '@mui/icons-material'],
  },
};

export default nextConfig;
