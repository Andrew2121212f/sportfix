import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { Zap } from "lucide-react";

export default function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const tSport = useTranslations("sport");
  const locale = useLocale();
  const year = new Date().getFullYear();

  const quickLinks = [
    { label: tNav("live"), href: `/${locale}/live` },
    { label: tNav("matches"), href: `/${locale}/matches` },
    { label: tNav("news"), href: `/${locale}/news` },
    { label: t("about"), href: `/${locale}/about` },
    { label: t("contact"), href: `/${locale}/contact` },
  ];

  const sports = [
    tSport("football"),
    tSport("basketball"),
    tSport("hockey"),
    tSport("tennis"),
    tSport("volleyball"),
  ];

  const legalLinks = [
    { label: t("privacy"), href: `/${locale}/privacy` },
    { label: t("terms"), href: `/${locale}/terms` },
    { label: t("cookies"), href: `/${locale}/cookies` },
  ];

  return (
    <footer className="bg-surface border-t border-border mt-auto">
      <div className="container-main py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link href={`/${locale}`} className="flex items-center gap-2.5 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-linear-to-br from-brand-orange to-orange-600">
                <Zap className="h-4 w-4 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-lg font-bold tracking-tight">
                Fast<span className="text-brand-orange">Score</span>
              </span>
            </Link>
            <p className="text-sm text-text-muted leading-relaxed max-w-xs mb-4">
              {t("disclaimer")}
            </p>
            <span className="inline-block text-xs font-semibold text-text-muted bg-surface px-3 py-1 rounded-full border border-border">
              {t("responsible")}
            </span>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-foreground mb-4">{t("quickLinks")}</h4>
            <div className="flex flex-col gap-2.5">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-text-secondary hover:text-brand-orange transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Sports */}
          <div>
            <h4 className="text-sm font-bold text-foreground mb-4">{t("sports")}</h4>
            <div className="flex flex-col gap-2.5">
              {sports.map((sport) => (
                <Link
                  key={sport}
                  href={`/${locale}/live`}
                  className="text-sm text-text-secondary hover:text-brand-orange transition-colors"
                >
                  {sport}
                </Link>
              ))}
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-bold text-foreground mb-4">{t("legal")}</h4>
            <div className="flex flex-col gap-2.5">
              {legalLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-text-secondary hover:text-brand-orange transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-text-muted">
            &copy; {year} SportFix.be — {t("rights")}
          </span>
          <div className="flex items-center gap-4 text-xs text-text-muted">
            <span>Powered by SportFix</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
