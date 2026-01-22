// Converted to TypeScript - migrated
"use client";
import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { toast } from "sonner";
import FormError from "@/components/ui/FormError";
import { FORM_ERRORS } from "@/lib/formErrors";

export default function ResetPassword() {
  const router = useRouter();
  const { token } = router.query;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError(FORM_ERRORS.PASSWORD_MISMATCH);
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setError(FORM_ERRORS.PASSWORD_TOO_SHORT);
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || FORM_ERRORS.GENERIC_ERROR);
      }

      setSuccess(true);
      toast.success("Password reset successfully");

      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push("/signin");
      }, 3000);
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
        <title>Reset Password - Karthik Nishanth</title>
        <meta name="description" content="Set a new password" />
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
                <span>New Password</span>
              </motion.div>
              <h1 className="font-heading text-4xl md:text-5xl text-slate-900 mb-4">
                Reset Password
              </h1>
              <p className="text-slate-600 text-base sm:text-lg font-medium">
                Create a strong password for your account
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
                    Password Reset!
                  </h3>
                  <p className="font-medium text-green-700">
                    Your password has been successfully updated. Redirecting to sign
                    in...
                  </p>
                </div>
                <Link href="/signin">
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-2xl font-semibold text-base shadow-sm hover:shadow-lg transition-all duration-200"
                  >
                    Sign In Now
                  </motion.button>
                </Link>
              </motion.div>
            ) : (
              <>
                <FormError message={error} />
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-semibold text-slate-700 mb-2"
                    >
                      New Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-200 font-medium text-base transition-all duration-200"
                      placeholder="Enter new password"
                      required
                      minLength={8}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-semibold text-slate-700 mb-2"
                    >
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-200 font-medium text-base transition-all duration-200"
                      placeholder="Confirm new password"
                      required
                      minLength={8}
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
                        Resetting...
                      </>
                    ) : (
                      "Reset Password"
                    )}
                  </motion.button>
                </form>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </>
  );
}

