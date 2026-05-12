"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Shield, Settings, BarChart3 } from "lucide-react";

export default function CookiePolicyPage() {
  const t = useTranslations("cookiePolicy");

  const cookieTypes = [
    { icon: Shield, title: t("essential"), text: t("essentialText"), color: "text-accent-green" },
    { icon: Settings, title: t("functional"), text: t("functionalText"), color: "text-accent-blue" },
    { icon: BarChart3, title: t("analytics"), text: t("analyticsText"), color: "text-accent-purple" },
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

      <div className="card p-5">
        <h2 className="text-sm font-bold mb-2">1. {t("section1Title")}</h2>
        <p className="text-xs text-text-secondary leading-relaxed">{t("section1Text")}</p>
      </div>

      <div className="card p-5">
        <h2 className="text-sm font-bold mb-2">2. {t("section2Title")}</h2>
        <p className="text-xs text-text-secondary leading-relaxed">{t("section2Text")}</p>
      </div>

      <div>
        <h2 className="text-sm font-bold mb-3">3. {t("section3Title")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {cookieTypes.map((type, i) => (
            <motion.div
              key={type.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="card p-4"
            >
              <type.icon className={`h-4 w-4 ${type.color} mb-2`} />
              <h3 className="text-xs font-bold mb-1">{type.title}</h3>
              <p className="text-xs text-text-secondary leading-relaxed">{type.text}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="card p-5">
        <h2 className="text-sm font-bold mb-2">4. {t("section4Title")}</h2>
        <p className="text-xs text-text-secondary leading-relaxed">{t("section4Text")}</p>
      </div>
    </div>
  );
}
