"use client";
import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";
import { motion } from "framer-motion";
import axios from "axios";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const { token, email } = router.query;
    if (token) {
      const [tokenValue, emailValue] = token.split("?email=");
      setToken(tokenValue);
      if (emailValue) {
        setEmail(decodeURIComponent(emailValue));
      }
    }
  }, [router.query]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post("/api/auth/[...nextauth]", {
        action: "resetPassword",
        token,
        email,
        password,
      });
      if (response.data.success) {
        setSuccess(true);
        setMessage("Password reset successfully! Redirecting to login...");
        setTimeout(() => router.push("/signin"), 3000);
      }
    } catch (error) {
      console.error(
        "Reset password error:",
        error.response?.data?.message || error.message
      );
      setMessage(
        error.response?.data?.message || "An error occurred. Please try again."
      );
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
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 relative flex items-center justify-center overflow-hidden" style={{ fontFamily: "Inter, sans-serif" }}>
        {/* Decorative Color Splashes */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-blue-200/20 to-cyan-200/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-green-200/20 to-emerald-200/20 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-88 h-88 bg-gradient-to-tl from-orange-200/20 to-yellow-200/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md relative z-10"
        >
          <div className="bg-white/90 backdrop-blur-sm border-2 border-blue-200 rounded-3xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-100 to-cyan-100 border border-blue-200 rounded-full text-blue-700 text-sm font-semibold mb-6 shadow-lg"
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
                  🔑
                </motion.span>
                <span>Password Reset</span>
              </motion.div>
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                <span className="bg-gradient-to-r from-blue-600 via-cyan-600 to-purple-600 bg-clip-text text-transparent">
                  New Password
                </span>
              </h1>
              <p className="text-gray-600 text-lg font-medium">Enter your new secure password</p>
            </div>

            {success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <div className="mb-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 text-green-700 rounded-2xl shadow-lg">
                  <div className="text-4xl mb-4">✅</div>
                  <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                    Password Reset Complete!
                  </h3>
                  <p className="font-medium">
                    Your password has been updated successfully. You will be redirected to sign in shortly.
                  </p>
                </div>
                <Link href="/signin">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-3 mx-auto"
                  >
                    <span className="text-xl">🚀</span>
                    Continue to Sign In
                  </motion.button>
                </Link>
              </motion.div>
            ) : (
              <>
                {message && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`mb-6 p-4 rounded-2xl text-sm font-medium shadow-lg flex items-center gap-3 ${
                      success
                        ? "bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 text-green-700"
                        : "bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 text-red-700"
                    }`}
                  >
                    <span className="text-xl">{success ? "✅" : "⚠️"}</span>
                    {message}
                  </motion.div>
                )}
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-lg font-bold text-gray-800 mb-3" style={{ fontFamily: "Space Grotesk, sans-serif" }}
                    >
                      🔐 New Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-200 font-medium text-lg transition-all duration-300"
                      placeholder="Enter your new password"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-lg font-bold text-gray-800 mb-3" style={{ fontFamily: "Space Grotesk, sans-serif" }}
                    >
                      🔒 Confirm Password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full p-4 rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-200 font-medium text-lg transition-all duration-300"
                      placeholder="Confirm your new password"
                      required
                    />
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Resetting password...
                      </>
                    ) : (
                      <>
                        <span className="text-xl">🔄</span>
                        Reset Password
                      </>
                    )}
                  </motion.button>
                </form>
                <div className="mt-8 pt-6 border-t-2 border-blue-100 text-center">
                  <p className="text-gray-600 text-lg font-medium mb-4">
                    Remember your password?
                  </p>
                  <Link href="/signin">
                    <motion.button
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-white border-2 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 px-8 py-3 rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-3 mx-auto"
                    >
                      <span className="text-xl">🔐</span>
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
              className="flex items-center gap-3 px-6 py-3 bg-white/90 backdrop-blur-sm border-2 border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300 font-bold rounded-2xl shadow-lg transition-all duration-300"
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
