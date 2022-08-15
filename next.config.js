/** @type {import('next').NextConfig} */

const debug = process.env.NODE_ENV !== "production";

const nextConfig = {
  assetPrefix: !debug ? 'https://mehatab.github.io/fettle/' : '',
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = nextConfig
