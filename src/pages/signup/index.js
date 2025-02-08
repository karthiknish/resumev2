"use client";
import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
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

      router.push("/signin");
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  return (
    <>
      <Head>
        <title>Sign Up - Karthik Nishanth</title>
        <meta name="description" content="Create a new account" />
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
            Create Account
          </h1>
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500 text-red-500 rounded-md text-sm font-calendas">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-300 mb-1 font-calendas"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 rounded-md bg-gray-800 border border-gray-700 text-white font-calendas"
                required
              />
            </div>
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
                value={formData.email}
                onChange={handleChange}
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
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-2 rounded-md bg-gray-800 border border-gray-700 text-white font-calendas"
                required
              />
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-300 mb-1 font-calendas"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
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
              {isLoading ? "Creating account..." : "Sign Up"}
            </motion.button>
          </form>
          <p className="mt-4 text-center text-gray-400 text-sm font-calendas">
            Already have an account?{" "}
            <Link
              href="/signin"
              className="text-blue-500 hover:text-blue-400 font-calendas"
            >
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </>
  );
}
