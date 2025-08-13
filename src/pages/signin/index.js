"use client";
import { useState, useEffect } from "react";
import { signIn, signOut } from "@/lib/authUtils";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

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
      if (session.user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    }
  }, [session, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn({
        email,
        password,
        rememberMe,
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else if (result?.success) {
        // Redirect based on user role is handled by the auth utility
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
      toast.error("Sign in failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut({ redirect: false });
      toast.success("Successfully signed out!");
      router.push("/");
    } catch (error) {
      toast.error("Error signing out. Please try again.");
    }
  };

  // If still checking auth status, show loading
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-brandSecondary/10 flex items-center justify-center">
        <div className="bg-card/80 backdrop-blur-sm border-2 border-primary/20 rounded-2xl px-8 py-6 shadow-xl flex items-center gap-4">
          <div className="animate-spin text-3xl">⚡</div>
          <span className="text-foreground font-bold text-xl">
            Loading...
          </span>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Sign In - Karthik Nishanth</title>
        <meta name="description" content="Sign in to your account" />

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
      <div
        className="min-h-screen bg-gradient-to-br from-background via-background to-brandSecondary/10 relative flex items-center justify-center overflow-hidden"
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        {/* Decorative Color Splashes */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-primary/10 to-brandSecondary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-primary/10 to-brandSecondary/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-primary/10 to-brandSecondary/10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-88 h-88 bg-gradient-to-tl from-primary/10 to-brandSecondary/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md relative z-10"
        >
          <div className="bg-card border-2 border-primary/20 rounded-3xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-primary/10 to-brandSecondary/10 border border-primary/20 rounded-full text-primary font-semibold mb-6 shadow-lg"
              >
                <motion.span
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="text-xl"
                >
                  🔐
                </motion.span>
                <span>Welcome back!</span>
              </motion.div>
              <h1
                className="text-4xl md:text-5xl font-black text-foreground mb-4"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                <span className="bg-gradient-to-r from-primary to-brandSecondary bg-clip-text text-transparent">
                  Sign In
                </span>
              </h1>
              <p className="text-muted-foreground text-lg font-medium">
                Access your account to continue
              </p>
            </div>
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6 p-4 bg-gradient-to-r from-destructive/10 to-destructive/5 border-2 border-destructive/20 text-destructive rounded-2xl text-sm font-medium shadow-lg flex items-center gap-3"
              >
                <span className="text-xl">⚠️</span>
                {error}
              </motion.div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-lg font-bold text-foreground mb-3"
                  style={{ fontFamily: "Space Grotesk, sans-serif" }}
                >
                  📧 Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-4 rounded-2xl bg-card border-2 border-input text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20 font-medium text-lg transition-all duration-300"
                  placeholder="Enter your email address"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-lg font-bold text-foreground mb-3"
                  style={{ fontFamily: "Space Grotesk, sans-serif" }}
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-4 pr-14 rounded-2xl bg-card border-2 border-input text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20 font-medium text-lg transition-all duration-300"
                    placeholder="Enter your password"
                    required
                  />
                  <motion.button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors p-2 rounded-xl hover:bg-primary/5"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {showPassword ? (
                      <AiOutlineEyeInvisible size={24} />
                    ) : (
                      <AiOutlineEye size={24} />
                    )}
                  </motion.button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-primary focus:ring-primary border-input rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-foreground"
                  >
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <Link
                    href="/forgot-password"
                    className="font-medium text-primary hover:text-brandSecondary transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-primary to-brandSecondary hover:from-primary/90 hover:to-brandSecondary/90 text-primary-foreground py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground"></div>
                    Signing in...
                  </>
                ) : (
                  <>
                    <span className="text-xl">🔑</span>
                    Sign In
                  </>
                )}
              </motion.button>
            </form>

            <div className="mt-4 text-center">
              <Link
                href="/forgot-password"
                className="text-primary hover:text-primary/80 font-medium transition-colors duration-200 text-sm"
              >
                Forgot Password?
              </Link>
            </div>

            <div className="mt-8 pt-6 border-t-2 border-primary/10 text-center">
              <p className="text-muted-foreground text-lg font-medium mb-4">
                Don't have an account?
              </p>
              <Link href="/signup">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-card border-2 border-primary text-primary hover:bg-primary/5 hover:border-primary/80 px-8 py-3 rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-3 mx-auto"
                >
                  <span className="text-xl">✨</span>
                  Create Account
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Back to Home Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="absolute top-8 left-8 z-20"
        >
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.05, x: -5 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3 px-6 py-3 bg-card/90 backdrop-blur-sm border-2 border-primary/20 text-primary hover:bg-primary/5 hover:border-primary/30 font-bold rounded-2xl shadow-lg transition-all duration-300"
            >
              <motion.svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                animate={{ x: [0, -3, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </motion.svg>
              Back to Home
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </>
  );
}
