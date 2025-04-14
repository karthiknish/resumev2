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
      className="fixed bottom-0 left-0 right-0 z-[2000] bg-gray-900 border-t border-gray-700 text-white p-4 shadow-lg"
    >
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-300 text-center md:text-left">
          We use cookies to enhance your browsing experience and analyze site
          traffic. By clicking "Accept", you consent to our use of cookies. Read
          our{" "}
          <Link href="/cookie-policy" className="underline hover:text-blue-300">
            Cookie Policy
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy-policy"
            className="underline hover:text-blue-300"
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
            className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            Decline
          </Button>
          <Button
            variant="default" // Or your primary variant
            size="sm"
            onClick={onAccept}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Accept
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

export default CookieConsentBanner;
