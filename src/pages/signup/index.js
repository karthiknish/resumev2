"use client";
import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const router = useRouter();

  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    return strength;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (passwordStrength < 50) {
      setError("Password is too weak. Please use a stronger password.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      toast.success("Account created successfully! Please sign in.");
      router.push("/signin");
    } catch (error) {
      setError(error.message);
      toast.error("Sign up failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });

    if (id === "password") {
      setPasswordStrength(checkPasswordStrength(value));
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 50) return "bg-red-500";
    if (passwordStrength < 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 50) return "Weak";
    if (passwordStrength < 75) return "Medium";
    return "Strong";
  };

  return (
    <>
      <Head>
        <title>Sign Up - Karthik Nishanth</title>
        <meta name="description" content="Create a new account" />
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
                >
                </motion.span>
                <span>Join the community!</span>
              </motion.div>
              <h1
                className="font-heading text-4xl md:text-5xl text-slate-900 mb-4"
              >
                Create account
              </h1>
              <p className="text-slate-600 text-base sm:text-lg font-medium">
                Get started with your new account
              </p>
            </div>
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-sm font-medium flex items-center gap-3"
              >
                <span className="text-xl"></span>
                {error}
              </motion.div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold text-slate-700 mb-2"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-200 font-medium text-base transition-all duration-200"
                  placeholder="Enter your full name"
                  required
                />
              </div>
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
                  value={formData.email}
                  onChange={handleChange}
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
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-200 font-medium text-base transition-all duration-200"
                  placeholder="Create a strong password"
                  required
                />
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex justify-between text-sm text-foreground mb-1">
                      <span>Password Strength</span>
                      <span className={passwordStrength < 50 ? "text-red-500" : passwordStrength < 75 ? "text-yellow-500" : "text-green-500"}>
                        {getPasswordStrengthText()}
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${getPasswordStrengthColor()}`} 
                        style={{ width: `${passwordStrength}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Use at least 8 characters with a mix of letters, numbers, and symbols
                    </div>
                  </div>
                )}
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
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-200 font-medium text-base transition-all duration-200"
                  placeholder="Confirm your password"
                  required
                />
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
                    Creating account...
                  </>
                ) : (
                  <>
                    Create Account
                  </>
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

            <div className="mt-8 pt-6 border-t-2 border-primary/10 text-center">
              <p className="text-slate-500 text-base font-medium mb-4">
                Already have an account?
              </p>
              <Link href="/signin">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white border border-slate-200 text-slate-900 hover:bg-slate-100 px-8 py-3 rounded-2xl font-semibold text-base transition-all duration-200 shadow-sm hover:shadow-lg"
                >
                  Sign In Instead
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
