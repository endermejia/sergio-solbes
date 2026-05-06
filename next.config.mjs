/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'personales.ulpgc.es',
      },
      {
        protocol: 'https',
        hostname: 'accedacris.ulpgc.es',
      },
      {
        protocol: 'https',
        hostname: 'www.igme.es',
      }
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion', 'date-fns'],
  },
}

export default nextConfig
