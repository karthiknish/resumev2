"use client";

import { useState, useEffect } from "react";
import { signIn, signOut } from "@/lib/authUtils";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import FormError from "@/components/ui/FormError";
import { FORM_ERRORS } from "@/lib/formErrors";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (session) {
      // Check if user is admin
      if (session?.user && 'role' in session.user && session.user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    }
  }, [session, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        rememberMe,
      });

      if (result?.error) {
        setError(result.error || FORM_ERRORS.INVALID_CREDENTIALS);
      } else if (result?.success) {
        // Redirect based on user role is handled by the auth utility
      }
    } catch (error: unknown) {
      setError(FORM_ERRORS.NETWORK_ERROR);
      toast.error(FORM_ERRORS.SUBMISSION_FAILED);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut({ callbackUrl: "/" });
      toast.success("Successfully signed out!");
    } catch (error: unknown) {
      toast.error(FORM_ERRORS.NETWORK_ERROR);
    }
  };

  // If still checking auth status, show loading
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="bg-card border border-border rounded-2xl px-8 py-6 shadow-sm flex items-center gap-4">
          <Loader2 className="size-6 animate-spin text-primary" />
          <span className="text-foreground font-semibold text-lg">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Sign In | Karthik Nishanth</title>
        <meta
          name="description"
          content="Sign in to your Karthik Nishanth account. Access your dashboard and manage your projects."
        />
        <meta name="robots" content="noindex, nofollow" />

        {/* Open Graph */}
        <meta property="og:title" content="Sign In | Karthik Nishanth" />
        <meta
          property="og:description"
          content="Sign in to your Karthik Nishanth account. Access your dashboard and manage your projects."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://karthiknish.com/signin" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Sign In | Karthik Nishanth" />
        <meta
          name="twitter:description"
          content="Sign in to your Karthik Nishanth account."
        />

        <meta name="theme-color" content="#0f172a" />
      </Head>

      <div className="min-h-screen bg-background relative flex items-center justify-center overflow-hidden py-12 sm:py-16 md:py-24">
        {/* Background gradients */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.16),_transparent_65%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(226,232,240,0.25),_transparent_70%)]" />

        {/* Back to Home Link */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="absolute top-6 left-6 z-50 md:top-8 md:left-8"
        >
          <Link href="/" className="inline-flex">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 rounded-full bg-card/80 border border-border shadow-sm hover:bg-card"
            >
              <ArrowLeft className="size-4" />
              <span className="hidden sm:inline">Back to Home</span>
              <span className="sm:hidden">Back</span>
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm relative z-10 px-4"
        >
          <div className="bg-card border border-border rounded-2xl shadow-md p-5 sm:p-6">
            {/* Header */}
            <div className="text-center mb-5">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-muted/50 border border-border rounded-full text-muted-foreground font-semibold mb-4 shadow-sm"
              >
                <span className="text-sm">👋</span>
                <span className="text-xs">Welcome back!</span>
              </motion.div>
              <h1 className="font-heading text-2xl sm:text-3xl text-foreground mb-2">
                Sign in
              </h1>
              <p className="text-muted-foreground text-sm font-medium">
                Access your account to continue
              </p>
            </div>

            <FormError message={error} />

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-semibold text-foreground">
                  Email Address
                </Label>
                <Input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-lg border-border bg-background focus:border-primary focus:ring-primary/20 h-10"
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                />
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs font-semibold text-foreground">
                    Password
                  </Label>
                  <Link
                    href="/forgot-password"
                    className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="rounded-lg border-border bg-background pr-9 focus:border-primary focus:ring-primary/20 h-10 text-sm"
                    placeholder="Enter your password"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-0.5 rounded-md hover:bg-muted"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="size-3.5" strokeWidth={2.5} />
                    ) : (
                      <Eye className="size-3.5" strokeWidth={2.5} />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-3.5 w-3.5 rounded border-border text-primary focus:ring-primary focus:ring-offset-0 cursor-pointer"
                />
                <Label
                  htmlFor="remember-me"
                  className="ml-1.5 text-xs text-muted-foreground cursor-pointer font-normal"
                >
                  Keep me signed in for 30 days
                </Label>
              </div>

              {/* Submit Button */}
              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-10 rounded-lg font-semibold text-sm shadow-md hover:shadow-lg"
                  size="default"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </motion.div>
            </form>

            {/* Sign Up Link */}
            <div className="mt-5 pt-4 border-t border-border text-center">
              <p className="text-muted-foreground text-xs font-medium mb-3">
                Don&apos;t have an account?
              </p>
              <Link href="/signup">
                <Button
                  variant="outline"
                  className="rounded-lg font-semibold px-6 h-9 shadow-sm hover:shadow-md text-sm"
                  size="sm"
                >
                  Create Account
                </Button>
              </Link>
            </div>

            {/* Additional Links */}
            <div className="mt-3 text-center">
              <Link
                href="/forgot-password"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Trouble signing in?
              </Link>
            </div>
          </div>

          {/* Trust Badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 text-center"
          >
            <p className="text-xs text-muted-foreground">
              🔒 Your information is secure and encrypted
            </p>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}
