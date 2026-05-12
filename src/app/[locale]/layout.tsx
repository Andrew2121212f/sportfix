import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales, isRtlLocale } from "@/i18n/config";
import Providers from "@/components/providers";
import Sidebar from "@/components/layout/sidebar";
import Topbar from "@/components/layout/topbar";
import BottomNav from "@/components/layout/bottom-nav";
import Footer from "@/components/layout/footer";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as never)) {
    notFound();
  }

  const messages = await getMessages();
  const rtl = isRtlLocale(locale);

  // RTL для арабского: на главном wrapper-div выставляем dir="rtl".
  // Sidebar становится справа за счёт lg:ml-[272px] → lg:mr-[272px] через
  // logical-CSS свойства; используем Tailwind ms-/me- утилиты в компонентах.
  // <html lang> остаётся "en" из root layout — это нормально, dir работает локально.
  return (
    <NextIntlClientProvider messages={messages}>
      <Providers>
        <div
          dir={rtl ? "rtl" : "ltr"}
          lang={locale}
          className="flex min-h-screen overflow-x-hidden w-full"
        >
          <Sidebar />
          <div
            className={
              rtl
                ? "flex-1 lg:mr-[272px] flex flex-col min-h-screen w-full min-w-0"
                : "flex-1 lg:ml-[272px] flex flex-col min-h-screen w-full min-w-0"
            }
          >
            <Topbar />
            <main className="flex-1 p-3 sm:p-4 pb-24 lg:p-6 lg:pb-6 min-w-0">{children}</main>
            <Footer />
          </div>
          <BottomNav />
        </div>
      </Providers>
    </NextIntlClientProvider>
  );
}
