import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner"; // Using sonner for notifications
import { Input } from "@/components/ui/input"; // Assuming shadcn/ui input
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/router"; // Import useRouter

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter(); // Initialize router

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(""); // Clear previous messages

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setMessage("Please enter a valid email address.");
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
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect on success
        router.push("/newsletter/thank-you");
        // Optionally clear email here if needed, though redirect makes it less critical
        // setEmail("");
      } else {
        // Keep error handling
        toast.error(data.message || "Subscription failed. Please try again.");
        setMessage(data.message || "Subscription failed.");
      }
    } catch (error) {
      console.error("Subscription form error:", error);
      toast.error("An error occurred. Please try again later.");
      setMessage("An error occurred.");
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
      {message && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-4 text-sm text-center font-medium ${
            message.includes("failed") || message.includes("error")
              ? "text-red-500"
              : "text-emerald-600"
          }`}
        >
          {message}
        </motion.p>
      )}
    </div>
  );
}
