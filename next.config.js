/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com'
      
      },{
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com'
      },
    ],
    
  },
}

module.exports = nextConfig