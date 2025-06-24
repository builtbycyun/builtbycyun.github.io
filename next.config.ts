/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Remove or comment out these lines since you're using username.github.io
  // basePath: '/terminal-portfolio',
  // assetPrefix: '/terminal-portfolio',
}

module.exports = nextConfig