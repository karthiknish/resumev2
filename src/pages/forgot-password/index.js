"use client";
import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
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
        throw new Error(data.message || "Something went wrong");
      }

      setSuccess(true);
    } catch (error) {
      setError(error.message);
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
      <div className="min-h-screen bg-black relative flex items-center justify-center">
        <BackgroundBeamsWithCollision className="absolute inset-0 -z-10" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md p-8 relative z-10"
        >
          <h1 className="text-3xl font-bold mb-6 text-center text-white font-calendas">
            Forgot Password
          </h1>

          {success ? (
            <div className="text-center">
              <div className="mb-4 p-3 bg-green-500/10 border border-green-500 text-green-500 rounded-md text-sm font-calendas">
                Password reset link has been sent to your email.
              </div>
              <Link
                href="/signin"
                className="text-blue-500 hover:text-blue-400 font-calendas"
              >
                Return to Sign In
              </Link>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500 text-red-500 rounded-md text-sm font-calendas">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-300 mb-1 font-calendas"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 rounded-md bg-gray-800 border border-gray-700 text-white font-calendas"
                    required
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors font-calendas disabled:opacity-50"
                >
                  {isLoading ? "Sending..." : "Reset Password"}
                </motion.button>
              </form>
              <p className="mt-4 text-center text-gray-400 text-sm font-calendas">
                Remember your password?{" "}
                <Link
                  href="/signin"
                  className="text-blue-500 hover:text-blue-400 font-calendas"
                >
                  Sign in
                </Link>
              </p>
            </>
          )}
        </motion.div>
      </div>
    </>
  );
}
