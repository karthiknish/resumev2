import { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useMutation } from "react-query";
import axios from "axios";
import Link from "next/link";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const mutation = useMutation(async () => {
    try {
      const response = await axios.post("/api/auth/[...nextauth]", {
        action: "signup",
        email,
        password,
        name,
      });
      if (response.data.success) {
        // After successful signup, attempt to log in the user
        const loginResponse = await axios.post("/api/auth/[...nextauth]", {
          action: "login",
          email,
          password,
        });
        if (loginResponse.data.success) {
          // Store the token in localStorage
          localStorage.setItem("token", loginResponse.data.token);
          router.push("/");
        } else {
          setError(
            "Login after signup failed. Please try signing in manually."
          );
          setTimeout(() => router.push("/signin"), 3000);
        }
      }
    } catch (error) {
      console.error(
        "Signup error:",
        error.response?.data?.message || error.message
      );
      setError(
        error.response?.data?.message ||
          "An error occurred during signup. Please try again."
      );
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    mutation.mutate();
  };

  return (
    <>
      <Head>
        <title>Sign Up // Karthik Nishanth</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-100 to-orange-100">
        <div className="bg-white p-8 rounded-lg shadow-2xl w-96">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
            Create Your Account
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                className="w-full text-black px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
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
                  <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </span>
            </div>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full text-black px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
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
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-4 text-black py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
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
                  <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </span>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-teal-400 to-orange-400 text-white font-bold py-3 px-4 rounded-md hover:from-teal-500 hover:to-orange-500 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
              disabled={mutation.isLoading}
            >
              {mutation.isLoading ? "Signing Up..." : "Sign Up"}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
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
