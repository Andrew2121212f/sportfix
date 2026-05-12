"use client";

import { type LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    href: string;
  };
}

/**
 * Компонент пустого состояния — иконка + текст + опциональная кнопка.
 */
export default function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      className="card p-10 flex flex-col items-center justify-center text-center"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-surface to-surface-hover ring-1 ring-border mb-4">
        <Icon className="h-7 w-7 text-text-muted" />
      </div>
      <h3 className="text-sm font-bold text-foreground mb-1">{title}</h3>
      {description && (
        <p className="text-xs text-text-muted max-w-xs">{description}</p>
      )}
      {action && (
        <a
          href={action.href}
          className="mt-4 px-5 py-2.5 bg-brand-orange text-white text-xs font-bold rounded-xl hover:brightness-110 transition-all shadow-sm shadow-brand-orange/20"
        >
          {action.label}
        </a>
      )}
    </motion.div>
  );
}
