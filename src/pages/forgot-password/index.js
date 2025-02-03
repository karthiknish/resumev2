import { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import axios from "axios";
import Link from "next/link";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    console.log(email);
    try {
      const response = await axios.post("/api/auth/[...nextauth]", {
        action: "forgotPassword",
        email,
      });
      if (response.data.success) {
        setMessage("Password reset email sent. Please check your inbox.");
        setTimeout(() => router.push("/signin"), 3000);
      }
    } catch (error) {
      console.error(
        "Forgot password error:",
        error.response?.data?.message || error.message
      );
      setMessage("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Forgot Password // Karthik Nishanth</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-100 to-orange-100">
        <div className="bg-white p-8 rounded-lg shadow-2xl w-96">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
            Forgot Password
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full px-4 py-3 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
              <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </span>
            </div>
            {message && (
              <p
                className={`text-sm ${
                  message.includes("error") ? "text-red-500" : "text-green-500"
                }`}
              >
                {message}
              </p>
            )}
            <button
              type="submit"
              className={`w-full bg-gradient-to-r from-teal-400 to-orange-400 text-white font-bold py-3 px-4 rounded-md hover:from-teal-500 hover:to-orange-500 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Reset Password"}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-gray-600">
            Remember your password?{" "}
            <Link
              href="/signin"
              className="font-medium text-teal-600 hover:text-teal-500"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
