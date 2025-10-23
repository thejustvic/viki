import type {NextConfig} from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/cards',
        permanent: true
      }
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com'
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com'
      },
      {
        protocol: 'https',
        hostname: 'creazilla-store.fra1.digitaloceanspaces.com'
      }
    ]
  },
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js'
      }
    }
  }
}

export default nextConfig
