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
import FormError from "@/components/ui/FormError";
import { FORM_ERRORS } from "@/lib/formErrors";

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
        setError(result.error || FORM_ERRORS.INVALID_CREDENTIALS);
      } else if (result?.success) {
        // Redirect based on user role is handled by the auth utility
      }
    } catch (error) {
      setError(FORM_ERRORS.NETWORK_ERROR);
      toast.error(FORM_ERRORS.SUBMISSION_FAILED);
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
      toast.error(FORM_ERRORS.NETWORK_ERROR);
    }
  };

  // If still checking auth status, show loading
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="bg-white border border-slate-200 rounded-2xl px-8 py-6 shadow-sm flex items-center gap-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-slate-900"></div>
          <span className="text-slate-900 font-semibold text-lg">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Sign In - Karthik Nishanth</title>
        <meta name="description" content="Sign in to your account" />
      </Head>
      <div
        className="min-h-screen bg-background relative flex items-center justify-center overflow-hidden py-12 sm:py-16 md:py-24"
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.16),_transparent_65%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(226,232,240,0.25),_transparent_70%)]" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md relative z-10"
        >
          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-8">
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="inline-flex items-center gap-3 px-6 py-3 bg-slate-100 border border-slate-200 rounded-full text-slate-700 font-semibold mb-6 shadow-sm"
              >
                <motion.span
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="text-xl"
                ></motion.span>
                <span>Welcome back!</span>
              </motion.div>
              <h1
                className="font-heading text-4xl md:text-5xl text-slate-900 mb-4"
              >
                Sign in
              </h1>
              <p className="text-slate-600 text-base sm:text-lg font-medium">
                Access your account to continue
              </p>
            </div>
            <FormError message={error} />
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-slate-700 mb-2"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-200 font-medium text-base transition-all duration-200"
                  placeholder="Enter your email address"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-slate-700 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 rounded-2xl bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-200 font-medium text-base transition-all duration-200"
                    placeholder="Enter your password"
                    required
                  />
                  <motion.button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-900 transition-colors p-2 rounded-xl hover:bg-slate-100"
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
                    className="h-4 w-4 text-slate-900 focus:ring-slate-900 border-slate-300 rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-slate-600"
                  >
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <Link
                    href="/forgot-password"
                    className="font-medium text-slate-900 hover:text-slate-600 transition-colors"
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
                className="w-full bg-slate-900 hover:bg-slate-800 text-slate-100 py-4 rounded-2xl font-semibold text-base shadow-sm hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground"></div>
                    Signing in...
                  </>
                ) : (
                  <>Sign In</>
                )}
              </motion.button>
            </form>

            <div className="mt-4 text-center">
              <Link
                href="/forgot-password"
                className="text-slate-900 hover:text-slate-600 font-medium transition-colors duration-200 text-sm"
              >
                Forgot Password?
              </Link>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
              <p className="text-slate-500 text-base font-medium mb-4">
                Don't have an account?
              </p>
              <Link href="/signup">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white border border-slate-200 text-slate-900 hover:bg-slate-100 px-8 py-3 rounded-2xl font-semibold text-base transition-all duration-200 shadow-sm hover:shadow-lg"
                >
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
          className="absolute top-8 left-8 z-50"
        >
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.05, x: -5 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 hover:bg-white hover:border-slate-300 font-semibold rounded-2xl shadow-sm transition-all duration-200"
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
