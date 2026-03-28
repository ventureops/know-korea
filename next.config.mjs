/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: "/life-in-korea/:path*", destination: "/living-in-korea/:path*", permanent: true },
      { source: "/comparison/:path*", destination: "/korea-in-the-world/:path*", permanent: true },
      { source: "/practical-guide/:path*", destination: "/", permanent: true },
      { source: "/real-stories/:path*", destination: "/", permanent: true },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
