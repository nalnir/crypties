/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  images: {
    domains: ['cdn.leonardo.ai'],
  },
}

const withTM = require('next-transpile-modules')(['three'])

module.exports = withTM()
module.exports = nextConfig
