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
      className="fixed bottom-0 left-0 right-0 z-[2000] bg-white/95 backdrop-blur-sm border-t-2 border-purple-200 text-gray-800 p-4 shadow-2xl"
    >
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-700 text-center md:text-left leading-relaxed">
          We use cookies to enhance your browsing experience and analyze site
          traffic. By clicking "Accept", you consent to our use of cookies. Read
          our{" "}
          <Link href="/cookie-policy" className="text-purple-600 hover:text-purple-700 underline font-medium transition-colors">
            Cookie Policy
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy-policy"
            className="text-purple-600 hover:text-purple-700 underline font-medium transition-colors"
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
            className="border-2 border-purple-200 text-gray-700 hover:bg-purple-50 hover:border-purple-300 transition-all duration-300 rounded-xl"
          >
            Decline
          </Button>
          <Button
            variant="default" // Or your primary variant
            size="sm"
            onClick={onAccept}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
          >
            Accept
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

export default CookieConsentBanner;
