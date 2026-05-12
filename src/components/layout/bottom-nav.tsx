"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Home, Activity, Calendar, Trophy, Newspaper } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { key: "home", href: "", icon: Home, label: "Dashboard" },
  { key: "live", href: "/live", icon: Activity },
  { key: "matches", href: "/matches", icon: Calendar },
  { key: "results", href: "/results", icon: Trophy },
  { key: "news", href: "/news", icon: Newspaper },
] as const;

export default function BottomNav() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const pathnameWithoutLocale = pathname.replace(`/${locale}`, "") || "/";

  const isActive = (href: string) => {
    if (href === "") return pathnameWithoutLocale === "/";
    return pathnameWithoutLocale === href || pathnameWithoutLocale.startsWith(href + "/");
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-background/80 backdrop-blur-xl border-t border-border"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 8px)" }}
      role="navigation"
      aria-label="Mobile navigation"
    >
      <div className="flex items-center justify-around px-2 pt-2 pb-1">
        {navItems.map((item) => {
          const active = isActive(item.href);
          const label = item.key === "home"
            ? (item.label || "Home")
            : t(item.key as "live" | "matches" | "results" | "news");

          return (
            <Link
              key={item.key}
              href={`/${locale}${item.href}`}
              className={cn(
                "relative flex flex-col items-center justify-center gap-0.5 flex-1 min-w-0 min-h-[48px] rounded-xl transition-colors",
                active ? "text-brand-orange" : "text-text-muted"
              )}
            >
              {/* Анимированный фон активного элемента */}
              {active && (
                <motion.div
                  layoutId="bottomnav-active"
                  className="absolute inset-0 rounded-xl bg-brand-orange/10"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}

              <div className="relative z-10">
                <item.icon className="h-5 w-5" />
                {/* Пульсирующая точка для Live */}
                {item.key === "live" && (
                  <span className="absolute -top-0.5 -right-1 flex h-2 w-2 rounded-full bg-accent-green animate-pulse-live" />
                )}
              </div>

              <span className="relative z-10 text-[10px] font-semibold leading-tight">
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
