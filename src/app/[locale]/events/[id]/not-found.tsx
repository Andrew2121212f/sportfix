import Link from "next/link";
import { Search } from "lucide-react";
import { getTranslations } from "next-intl/server";
import EmptyState from "@/components/ui/empty-state";

export default async function EventDetailNotFound() {
  const t = await getTranslations("match.detail");
  const tNotFound = await getTranslations("notFound");

  return (
    <div className="max-w-2xl mx-auto">
      <EmptyState
        icon={Search}
        title={t("notFound")}
        description={tNotFound("description")}
      />
      <div className="mt-4 text-center">
        <Link
          href="/"
          className="inline-flex items-center px-5 py-2.5 bg-brand-orange text-white text-xs font-bold rounded-xl hover:brightness-110 transition-all"
        >
          {tNotFound("backHome")}
        </Link>
      </div>
    </div>
  );
}
