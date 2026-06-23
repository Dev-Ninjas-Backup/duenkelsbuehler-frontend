/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "alexis-api.saikat.com.bd" },
      { protocol: "https", hostname: "aristopay.co" },
      { protocol: "https", hostname: "*.aristopay.co" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
};

export default nextConfig;
