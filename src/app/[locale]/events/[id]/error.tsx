"use client";

import { useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import EmptyState from "@/components/ui/empty-state";

export default function EventDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("match.detail");
  const tCommon = useTranslations("common");

  useEffect(() => {
    console.error("[event detail] render error:", error);
  }, [error]);

  return (
    <div className="max-w-2xl mx-auto">
      <EmptyState
        icon={AlertCircle}
        title={t("errorLoading")}
        description={tCommon("retry")}
        action={{ label: tCommon("retry"), href: "#" }}
      />
      <div className="mt-4 text-center">
        <button
          onClick={reset}
          className="text-xs text-text-muted hover:text-foreground transition-colors"
        >
          {tCommon("retry")}
        </button>
      </div>
    </div>
  );
}
