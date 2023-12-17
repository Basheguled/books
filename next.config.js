/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "books.google.com",
        port: "",
        pathname: "*",
      },
    ],
  },
};

module.exports = nextConfig;
