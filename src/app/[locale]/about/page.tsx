"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Activity, BarChart3, Trophy, Globe, Zap } from "lucide-react";

export default function AboutPage() {
  const t = useTranslations("about");

  const features = [
    { icon: Activity, title: t("feature1Title"), text: t("feature1Text"), color: "text-accent-green" },
    { icon: BarChart3, title: t("feature2Title"), text: t("feature2Text"), color: "text-accent-blue" },
    { icon: Trophy, title: t("feature3Title"), text: t("feature3Text"), color: "text-brand-orange" },
    { icon: Globe, title: t("feature4Title"), text: t("feature4Text"), color: "text-accent-purple" },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs font-semibold text-brand-orange mb-4">
          <Zap className="h-3 w-3" /> Vivat Sport
        </div>
        <h1 className="text-2xl font-black tracking-tight mb-2">{t("title")}</h1>
        <p className="text-sm text-text-secondary leading-relaxed">{t("subtitle")}</p>
      </motion.div>

      <div className="card p-5">
        <h2 className="text-base font-bold mb-2">{t("mission")}</h2>
        <p className="text-sm text-text-secondary leading-relaxed">{t("missionText")}</p>
      </div>

      <div>
        <h2 className="text-base font-bold mb-3">{t("features")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="card p-4"
            >
              <feature.icon className={`h-5 w-5 ${feature.color} mb-2`} />
              <h3 className="text-sm font-bold mb-1">{feature.title}</h3>
              <p className="text-xs text-text-secondary leading-relaxed">{feature.text}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="card p-5 border-brand-orange/20">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-8 w-8 rounded-lg bg-brand-orange flex items-center justify-center">
            <span className="text-white font-extrabold text-xs">VS</span>
          </div>
          <h2 className="text-base font-bold">{t("poweredBy")}</h2>
        </div>
        <p className="text-sm text-text-secondary leading-relaxed">{t("poweredByText")}</p>
      </div>
    </div>
  );
}
