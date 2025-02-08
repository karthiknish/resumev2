"use client";
import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (session) {
      router.push("/admin");
    }
  }, [session, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError("Invalid email or password");
      }
      // Don't redirect here - let the useEffect handle it
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // If still checking auth status, show loading
  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Head>
        <title>Sign In - Karthik Nishanth</title>
        <meta name="description" content="Sign in to your account" />
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
            Sign In
          </h1>
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
                Email
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
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300 mb-1 font-calendas"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 rounded-md bg-gray-800 border border-gray-700 text-white font-calendas"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? (
                    <AiOutlineEyeInvisible size={20} />
                  ) : (
                    <AiOutlineEye size={20} />
                  )}
                </button>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors font-calendas disabled:opacity-50"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </motion.button>
            <div className="text-center mt-2">
              <Link
                href="/forgot-password"
                className="text-sm text-blue-500 hover:text-blue-400 font-calendas"
              >
                Forgot Password?
              </Link>
            </div>
          </form>
          <p className="mt-4 text-center text-gray-400 text-sm font-calendas">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="text-blue-500 hover:text-blue-400 font-calendas"
            >
              Sign up
            </Link>
          </p>
        </motion.div>
      </div>
    </>
  );
}
