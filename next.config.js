/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'out',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  webpack(config, { isServer }) {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        // evita empaquetar estos módulos en el client bundle
        "sodium-native": false,
        "require-addon": false
      };
    }
    return config;
  }
};

module.exports = nextConfig;
