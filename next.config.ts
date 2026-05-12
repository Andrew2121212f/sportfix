import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  reactCompiler: true,
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  // standalone output включаем ТОЛЬКО когда задана env BUILD_STANDALONE=1
  // (Docker self-hosted деплой). На Vercel — стандартная сборка, потому что
  // standalone там ломает обработку i18n-routes (страницы возвращали пустой HTML).
  // Dockerfile передаёт BUILD_STANDALONE=1 в Stage 2 (builder).
  ...(process.env.BUILD_STANDALONE === "1" ? { output: "standalone" as const } : {}),
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
