import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, User, Mail, Lock } from "lucide-react";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    // Basic validation
    if (!name || !email || !password) {
      setMessage("All fields are required.");
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setMessage("Password must be at least 8 characters long.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Account created successfully! Please sign in.");
        // Redirect to sign in page
        setTimeout(() => {
          router.push("/signin");
        }, 2000);
      } else {
        setMessage(data.message || "Failed to create account.");
        toast.error(data.message || "Failed to create account.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setMessage("An error occurred. Please try again later.");
      toast.error("An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Sign Up - Karthik Nishanth</title>
        <meta name="description" content="Create a new account" />

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
                <User className="w-8 h-8 text-primary" />
              </motion.div>
              <h1
                className="text-3xl font-bold text-foreground mb-2"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                Create Account
              </h1>
              <p className="text-muted-foreground">
                Join our community to access exclusive content
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-background/50 border-2 border-primary/20 focus:border-primary/50 pl-10"
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-background/50 border-2 border-primary/20 focus:border-primary/50 pl-10"
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="At least 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-background/50 border-2 border-primary/20 focus:border-primary/50 pl-10"
                    disabled={isLoading}
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Must be at least 8 characters long
                </p>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg font-semibold rounded-2xl transition-all duration-300"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            {message && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-3 rounded-xl text-center text-sm font-medium bg-red-500/20 text-red-700 dark:text-red-300"
              >
                {message}
              </motion.div>
            )}

            <div className="mt-6 text-center">
              <p className="text-muted-foreground">
                Already have an account?{" "}
                <Link
                  href="/signin"
                  className="text-primary hover:text-primary/80 font-medium transition-colors duration-200"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}