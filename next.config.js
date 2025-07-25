/** @type {import('next').NextConfig} */

const production = process.env.NODE_ENV === "production";

const nextConfig = {
  assetPrefix:'',
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = nextConfig
