/** @type {import('next').NextConfig} */
const nextConfig = {
  assetPrefix: isProd ? 'https://cdn.statically.io/gh/fettle/mehatab.github.io/gh-pages/' : '',
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = nextConfig
