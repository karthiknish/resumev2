// Converted to TypeScript - migrated
"use client";
import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";
import FormError from "@/components/ui/FormError";
import { FORM_ERRORS } from "@/lib/formErrors";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || FORM_ERRORS.GENERIC_ERROR);
      }

      setSuccess(true);
      toast.success("Reset link sent to your email");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : FORM_ERRORS.GENERIC_ERROR;
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Forgot Password - Karthik Nishanth</title>
        <meta name="description" content="Reset your password" />
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
                <span>Password Recovery</span>
              </motion.div>
              <h1 className="font-heading text-4xl md:text-5xl text-slate-900 mb-4">
                Forgot Password
              </h1>
              <p className="text-slate-600 text-base sm:text-lg font-medium">
                Don't worry, we'll help you reset it
              </p>
            </div>

            {success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <div className="mb-8 p-6 bg-green-50 border border-green-200 text-green-700 rounded-2xl">
                  <div className="text-4xl mb-4">✅</div>
                  <h3 className="text-xl font-bold mb-2 font-heading text-green-800">
                    Check your email!
                  </h3>
                  <p className="font-medium text-green-700">
                    A password reset link has been sent to your email address.
                  </p>
                </div>
                <Link href="/signin">
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-2xl font-semibold text-base shadow-sm hover:shadow-lg transition-all duration-200"
                  >
                    Return to Sign In
                  </motion.button>
                </Link>
              </motion.div>
            ) : (
              <>
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
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-2xl font-semibold text-base shadow-sm hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white inline-block mr-2"></div>
                        Sending reset link...
                      </>
                    ) : (
                      "Send Reset Link"
                    )}
                  </motion.button>
                </form>
                <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                  <p className="text-slate-500 text-base font-medium mb-4">
                    Remember your password?
                  </p>
                  <Link href="/signin">
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-white border border-slate-200 text-slate-900 hover:bg-slate-50 px-8 py-3 rounded-2xl font-semibold text-base transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      Sign In Instead
                    </motion.button>
                  </Link>
                </div>
              </>
            )}
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


