"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

export default function PrivacyPage() {
  const t = useTranslations("privacy");

  const sections = [
    { title: t("section1Title"), text: t("section1Text") },
    { title: t("section2Title"), text: t("section2Text") },
    { title: t("section3Title"), text: t("section3Text") },
    { title: t("section4Title"), text: t("section4Text") },
    { title: t("section5Title"), text: t("section5Text") },
    { title: t("section6Title"), text: t("section6Text") },
  ];

  return (
    <div className="space-y-4 max-w-3xl">
      <div>
        <h1 className="text-2xl font-black tracking-tight mb-1">{t("title")}</h1>
        <p className="text-xs text-text-muted">{t("lastUpdated")}: March 2025</p>
      </div>

      <div className="card p-5">
        <p className="text-sm text-text-secondary leading-relaxed">{t("intro")}</p>
      </div>

      <div className="space-y-3">
        {sections.map((section, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="card p-5"
          >
            <h2 className="text-sm font-bold mb-2">{i + 1}. {section.title}</h2>
            <p className="text-xs text-text-secondary leading-relaxed">{section.text}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
