/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    deviceSizes: [320, 420, 768, 1024, 1200],
    loader: "default",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.headpat.de",
      },
      {
        protocol: "https",
        hostname: "placekitten.com",
      }
    ]
  },
};
module.exports = nextConfig;
