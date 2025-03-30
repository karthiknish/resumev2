import { useState } from "react";
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
    <div>
      <h3 className="text-lg font-semibold text-gray-200 mb-3">Stay Updated</h3>
      <p className="text-gray-400 mb-4 text-sm">
        Get the latest articles and bytes delivered to your inbox.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          required
          className="flex-grow bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
          aria-label="Email for newsletter"
        />
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white shrink-0"
        >
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {isLoading ? "Subscribing..." : "Subscribe"}
        </Button>
      </form>
      {message && (
        <p
          className={`mt-2 text-sm ${
            message.includes("failed") || message.includes("error")
              ? "text-red-400"
              : "text-green-400"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
