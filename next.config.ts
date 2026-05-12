import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  reactCompiler: true,
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  // standalone output — нужен для Docker self-hosted деплоя.
  // Создаёт .next/standalone/ с минимальным набором node_modules для запуска.
  // На Vercel игнорируется (Vercel использует свой формат).
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "**.com",
      },
      {
        protocol: "https",
        hostname: "flagcdn.com",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
