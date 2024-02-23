/** @type {import('next').NextConfig} */

const production = process.env.NODE_ENV === "production";

const nextConfig = {
  assetPrefix: production ? "/" : "",
  reactStrictMode: true,
  swcMinify: true,
  env: {
    branch: "feature/testing",
    repo: "ausaccessfed/status",
    updateTimer: 60 * 10,
  },
};

module.exports = nextConfig;
