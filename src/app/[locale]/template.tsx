"use client";

import { motion } from "framer-motion";

/**
 * Анимация перехода между страницами.
 * template.tsx пересоздаётся при каждой навигации (в отличие от layout.tsx).
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}
