"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Mail, MapPin, Clock, Send } from "lucide-react";

export default function ContactPage() {
  const t = useTranslations("contact");

  return (
    <div className="space-y-6 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-black tracking-tight mb-1">{t("title")}</h1>
        <p className="text-sm text-text-secondary">{t("subtitle")}</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <form onSubmit={(e) => e.preventDefault()} className="lg:col-span-3 card p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5">{t("name")}</label>
              <input
                type="text"
                className="w-full px-3 py-2.5 rounded-xl bg-surface border border-border text-sm text-foreground placeholder:text-text-muted focus:outline-none focus:border-brand-orange/50 focus:ring-1 focus:ring-brand-orange/20 transition-all"
                placeholder={t("name")}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5">{t("email")}</label>
              <input
                type="email"
                className="w-full px-3 py-2.5 rounded-xl bg-surface border border-border text-sm text-foreground placeholder:text-text-muted focus:outline-none focus:border-brand-orange/50 focus:ring-1 focus:ring-brand-orange/20 transition-all"
                placeholder={t("email")}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5">{t("subject")}</label>
            <input
              type="text"
              className="w-full px-3 py-2.5 rounded-xl bg-surface border border-border text-sm text-foreground placeholder:text-text-muted focus:outline-none focus:border-brand-orange/50 focus:ring-1 focus:ring-brand-orange/20 transition-all"
              placeholder={t("subject")}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5">{t("message")}</label>
            <textarea
              rows={4}
              className="w-full px-3 py-2.5 rounded-xl bg-surface border border-border text-sm text-foreground placeholder:text-text-muted focus:outline-none focus:border-brand-orange/50 focus:ring-1 focus:ring-brand-orange/20 transition-all resize-none"
              placeholder={t("message")}
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-orange text-white text-sm font-bold rounded-xl hover:brightness-110 transition-all"
          >
            <Send className="h-3.5 w-3.5" />
            {t("sendMessage")}
          </button>
        </form>

        <div className="lg:col-span-2 card p-5">
          <h3 className="text-sm font-bold mb-4">{t("info")}</h3>
          <div className="space-y-4">
            {[
              { icon: Mail, label: t("emailLabel"), value: "info@fastscore.be" },
              { icon: MapPin, label: t("locationLabel"), value: t("location") },
              { icon: Clock, label: t("hoursLabel"), value: t("hours") },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-lg bg-brand-orange/10 flex items-center justify-center shrink-0">
                  <item.icon className="h-4 w-4 text-brand-orange" />
                </div>
                <div>
                  <p className="text-xs font-semibold">{item.label}</p>
                  <p className="text-xs text-text-secondary">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
