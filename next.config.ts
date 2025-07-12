/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',           // genera HTML plano en /out
  images: { unoptimized: true } // desactiva Image Optimization (no hay SSR)
};
export default nextConfig;
