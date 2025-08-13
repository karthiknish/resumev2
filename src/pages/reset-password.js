import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Lock, CheckCircle } from "lucide-react";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Get token and email from URL query parameters
    if (router.isReady) {
      const { token, email } = router.query;
      if (token) setToken(token);
      if (email) setEmail(email);
      
      // If token is missing, show error
      if (!token) {
        setMessage("Invalid or missing reset token.");
        toast.error("Invalid or missing reset token.");
      }
    }
  }, [router.isReady, router.query]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    setIsSuccess(false);

    // Validation
    if (!token) {
      setMessage("Invalid or missing reset token.");
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setMessage("Password must be at least 8 characters long.");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        setMessage(data.message || "Password reset successfully!");
        toast.success("Password reset successfully!");
        
        // Redirect to sign in after a short delay
        setTimeout(() => {
          router.push("/signin");
        }, 3000);
      } else {
        setMessage(data.message || "Failed to reset password.");
        toast.error(data.message || "Failed to reset password.");
      }
    } catch (error) {
      console.error("Reset password error:", error);
      setMessage("An error occurred. Please try again later.");
      toast.error("An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Reset Password - Karthik Nishanth</title>
        <meta name="description" content="Reset your password" />

        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-background via-background to-brandSecondary/10 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="bg-card/80 backdrop-blur-sm border-2 border-primary/20 rounded-3xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                {isSuccess ? (
                  <CheckCircle className="w-8 h-8 text-green-500" />
                ) : (
                  <Lock className="w-8 h-8 text-primary" />
                )}
              </motion.div>
              <h1
                className="text-3xl font-bold text-foreground mb-2"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                {isSuccess ? "Password Reset!" : "Reset Password"}
              </h1>
              <p className="text-muted-foreground">
                {isSuccess
                  ? "Your password has been reset successfully."
                  : "Enter your new password below."}
              </p>
            </div>

            {isSuccess ? (
              <div className="text-center py-6">
                <p className="text-foreground mb-6">
                  You will be redirected to the sign in page shortly.
                </p>
                <Button
                  onClick={() => router.push("/signin")}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-2xl transition-all duration-300"
                >
                  Sign In Now
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                    New Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-background/50 border-2 border-primary/20 focus:border-primary/50"
                    disabled={isLoading}
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Must be at least 8 characters long
                  </p>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-2">
                    Confirm New Password
                  </label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-background/50 border-2 border-primary/20 focus:border-primary/50"
                    disabled={isLoading}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg font-semibold rounded-2xl transition-all duration-300"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Resetting Password...
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </Button>
              </form>
            )}

            {message && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-4 p-3 rounded-xl text-center text-sm font-medium ${
                  isSuccess
                    ? "bg-green-500/20 text-green-700 dark:text-green-300"
                    : "bg-red-500/20 text-red-700 dark:text-red-300"
                }`}
              >
                {message}
              </motion.div>
            )}

            <div className="mt-6 text-center">
              <Link
                href="/signin"
                className="text-primary hover:text-primary/80 font-medium transition-colors duration-200"
              >
                ← Back to Sign In
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}