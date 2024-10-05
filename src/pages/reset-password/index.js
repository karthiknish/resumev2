import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import axios from "axios";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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
    console.log(email);
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
        setMessage("Password reset successfully. Redirecting to login...");
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
        <title>Reset Password // Karthik Nishanth</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-100 to-orange-100">
        <div className="bg-white p-8 rounded-lg shadow-2xl w-96">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
            Reset Password
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="New Password"
                className="w-full px-4 py-3 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
            <div className="relative">
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm New Password"
                className="w-full px-4 py-3 text-black border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-teal-400 to-orange-400 text-white font-bold py-3 px-4 rounded-md hover:from-teal-500 hover:to-orange-500 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
              disabled={isLoading}
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
          {message && (
            <p
              className={`mt-4 text-center text-sm ${
                message.includes("successfully")
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}
        </div>
      </div>
    </>
  );
}
