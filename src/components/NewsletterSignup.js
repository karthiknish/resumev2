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
    <div className="bg-white/10 backdrop-blur-sm p-8 rounded-3xl border border-white/20">
      <h3
        className="text-2xl font-bold mb-4"
        style={{ fontFamily: "Space Grotesk, sans-serif" }}
      >
        Stay in the Loop
      </h3>
      <p className="text-lg text-purple-100 mb-6 leading-relaxed">
        Get magical updates and exclusive content delivered to your inbox!
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
          <Input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white placeholder:text-purple-200 px-6 py-4 rounded-2xl text-lg font-medium focus:border-white/50 focus:ring-2 focus:ring-white/30 transition-all duration-300"
            disabled={isLoading}
            required
            aria-label="Email for newsletter"
          />
        </motion.div>
        <motion.button
          type="submit"
          disabled={isLoading}
          className="w-full bg-white text-purple-600 hover:bg-purple-100 font-bold py-4 px-6 rounded-2xl text-lg transition-all duration-300 shadow-xl hover:shadow-2xl disabled:bg-white/50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
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
                className="text-xl"
              >
                {/* Removed emoji for professional tone */}
              </motion.span>
              Subscribe Now
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
              ? "text-red-300"
              : "text-green-300"
          }`}
        >
          {message}
        </motion.p>
      )}
    </div>
  );
}
