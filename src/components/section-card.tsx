"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface SectionCardProps {
  title: string;
  subtitle?: string;
  accent?: ReactNode;
  children: ReactNode;
}

export function SectionCard({ title, subtitle, accent, children }: SectionCardProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-3xl border border-white/5 bg-white/5 bg-gradient-to-br from-white/10 to-white/5 p-6 backdrop-blur"
    >
      <header className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          {subtitle ? (
            <p className="text-sm text-white/60">{subtitle}</p>
          ) : null}
        </div>
        {accent}
      </header>
      <div className="space-y-4 text-sm text-white/80">{children}</div>
    </motion.section>
  );
}
