import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/router";
import { FORM_ERRORS } from "@/lib/formErrors";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [formLoadTime, setFormLoadTime] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  // Track form load time for spam detection
  useEffect(() => {
    setFormLoadTime(Date.now());
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(""); // Clear previous messages

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setMessage(FORM_ERRORS.INVALID_EMAIL);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/subscribe", {
        // Target API endpoint
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          _honeypot: honeypot,
          _timestamp: formLoadTime,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push("/newsletter/thank-you");
      } else {
        toast.error(data.message || FORM_ERRORS.SUBSCRIPTION_FAILED);
        setMessage(data.message || FORM_ERRORS.SUBSCRIPTION_FAILED);
      }
    } catch (error) {
      console.error("Subscription form error:", error);
      toast.error(FORM_ERRORS.NETWORK_ERROR);
      setMessage(FORM_ERRORS.NETWORK_ERROR);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
      <h3 className="font-heading text-2xl text-slate-900 mb-3">
        Stay in the loop
      </h3>
      <p className="text-base text-slate-600 mb-6 leading-relaxed">
        Notes on product delivery, engineering systems, and the lessons learned while shipping with founders and teams.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Honeypot field - hidden from users, visible to bots */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            left: "-9999px",
            opacity: 0,
            height: 0,
            overflow: "hidden",
          }}
        >
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

        <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
          <Input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 px-5 py-4 rounded-2xl text-base focus:border-slate-400 focus:ring-4 focus:ring-slate-200 transition-all duration-300"
            disabled={isLoading}
            required
            aria-label="Email for newsletter"
          />
        </motion.div>
        <motion.button
          type="submit"
          disabled={isLoading}
          className="w-full bg-slate-900 text-slate-100 hover:bg-slate-800 font-semibold py-4 px-6 rounded-2xl text-base transition-all duration-300 shadow-sm hover:shadow-lg disabled:bg-slate-200 disabled:text-slate-500 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Subscribing...
            </>
          ) : (
            <>
              <motion.span
                animate={{ y: [0, -3, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="text-sm text-slate-400"
              >
                {/* Removed emoji for professional tone */}
              </motion.span>
              Subscribe now
            </>
          )}
        </motion.button>
      </form>
      {message ? (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-4 text-sm text-center font-medium ${
            message.includes("failed") || message.includes("error")
              ? "text-red-700"
              : "text-emerald-600"
          }`}
        >
          {message}
        </motion.p>
      ) : null}
    </div>
  );
}
