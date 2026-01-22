"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2, Mail, Sparkles } from "lucide-react";
import { FORM_ERRORS } from "@/lib/formErrors";

export default function NewsletterCTA() {
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [formLoadTime, setFormLoadTime] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Track form load time for spam detection
  useEffect(() => {
    setFormLoadTime(Date.now());
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      toast.error(FORM_ERRORS.INVALID_EMAIL);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          _honeypot: honeypot,
          _timestamp: formLoadTime,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSubscribed(true);
        setEmail("");
        toast.success("You're on the list!");
      } else {
        throw new Error(data.message || FORM_ERRORS.SUBSCRIPTION_FAILED);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : FORM_ERRORS.NETWORK_ERROR);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubscribed) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="my-12 p-8 rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 10 }}
          className="text-5xl mb-4"
        >
          ✓
        </motion.div>
        <h3 className="text-xl font-heading font-bold text-emerald-900 mb-2">
          You&apos;re subscribed!
        </h3>
        <p className="text-emerald-700">
          Thanks for joining. You&apos;ll receive my latest articles in your inbox.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="my-12 p-8 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 text-white"
    >
      <div className="flex items-start gap-4 mb-6">
        <div className="p-3 rounded-2xl bg-white/10">
          <Sparkles className="w-6 h-6 text-yellow-400" />
        </div>
        <div>
          <h3 className="text-xl font-heading font-bold mb-1">
            Enjoyed this article?
          </h3>
          <p className="text-slate-300 text-sm">
            Subscribe to get my latest posts on product strategy, engineering, and building software.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        {/* Honeypot field - hidden from users, visible to bots */}
        <div style={{ position: "absolute", left: "-9999px", opacity: 0 }} aria-hidden="true">
          <label htmlFor="newsletter_hp">Leave this field empty</label>
          <input
            type="text"
            id="newsletter_hp"
            name="_honeypot"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>
        <div className="relative flex-1">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            type="email"
            id="newsletter_email"
            name="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            className="pl-12 h-12 bg-white/10 border-slate-600 text-white placeholder:text-slate-400 focus:border-white focus:ring-white/20 rounded-xl"
          />
        </div>
        <Button
          type="submit"
          disabled={isLoading}
          className="h-12 px-6 bg-white text-slate-900 hover:bg-slate-100 font-semibold rounded-xl"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Subscribing...
            </>
          ) : (
            "Subscribe"
          )}
        </Button>
      </form>

      <p className="mt-4 text-xs text-slate-400 text-center sm:text-left">
        No spam, unsubscribe anytime. I respect your inbox.
      </p>
    </motion.div>
  );
}
