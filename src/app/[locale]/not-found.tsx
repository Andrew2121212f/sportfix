"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { motion } from "framer-motion";
import { Home, AlertTriangle } from "lucide-react";

export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <div className="flex items-center justify-center py-20">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center px-6 max-w-md"
      >
        <div className="mx-auto mb-6 h-20 w-20 rounded-2xl bg-brand-orange/10 flex items-center justify-center">
          <AlertTriangle className="h-10 w-10 text-brand-orange" />
        </div>
        <h1 className="text-6xl font-black tracking-tight mb-2 text-brand-orange">404</h1>
        <h2 className="text-2xl font-bold mb-4">{t("title")}</h2>
        <p className="text-text-secondary mb-8 leading-relaxed">{t("description")}</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-brand-orange text-white font-bold rounded-xl hover:brightness-110 transition-all"
        >
          <Home className="h-4 w-4" />
          {t("backHome")}
        </Link>
      </motion.div>
    </div>
  );
}
