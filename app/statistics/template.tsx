"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export default function StatisticsTemplate({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="overflow-x-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </div>
  );
}
