import React from "react";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";

export default function FormError({ message, className = "" }) {
  if (!message) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-sm font-medium flex items-start gap-3 ${className}`}
      role="alert"
    >
      <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <span>{message}</span>
    </motion.div>
  );
}
