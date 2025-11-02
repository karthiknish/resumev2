import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button"; // Assuming Shadcn button
import { motion, AnimatePresence } from "framer-motion";

function CookieConsentBanner({ onAccept, onDecline }) {
  return (
    <motion.div
      initial={{ y: "100%", opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: "100%", opacity: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 40 }}
      className="fixed bottom-0 left-0 right-0 z-[2000] bg-white/95 backdrop-blur-md border-t border-slate-200 text-slate-800 p-4 shadow-[0_-8px_30px_rgba(15,23,42,0.08)]"
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-slate-600 text-center md:text-left leading-relaxed">
          We use cookies to understand traffic and keep the experience running smoothly. Review our{" "}
          <Link href="/cookie-policy" className="text-slate-900 underline decoration-slate-300 hover:decoration-slate-500">
            Cookie Policy
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy-policy"
            className="text-slate-900 underline decoration-slate-300 hover:decoration-slate-500"
          >
            Privacy Policy
          </Link>
          .
        </p>
        <div className="flex-shrink-0 flex gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onDecline}
            className="border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-xl"
          >
            Decline
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={onAccept}
            className="bg-slate-900 hover:bg-slate-800 text-slate-100 shadow-sm hover:shadow-lg rounded-xl"
          >
            Accept
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

export default CookieConsentBanner;
