import { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

export default function SetupAdmin() {
  const [email, setEmail] = useState("");
  const [adminSecret, setAdminSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await fetch("/api/auth/make-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, adminSecret }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to set admin role");
      }

      setResult(data);

      // Reset form
      setEmail("");
      setAdminSecret("");
    } catch (err) {
      console.error("Error setting admin role:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Head>
        <title>Setup Admin User</title>
      </Head>

      <div className="container mx-auto px-4 py-12 max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Setup</h1>
          <p className="text-gray-400">Promote a user to admin status</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                User Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="adminSecret"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Admin Secret Key
              </label>
              <input
                type="password"
                id="adminSecret"
                value={adminSecret}
                onChange={(e) => setAdminSecret(e.target.value)}
                required
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your admin secret key"
              />
              <p className="mt-1 text-xs text-gray-400">
                This is the secret key set in your environment variables as
                ADMIN_SECRET_KEY
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 px-4 rounded-md font-medium ${
                loading
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Processing..." : "Make Admin"}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-3 bg-red-900/50 text-red-100 rounded-md">
              <p className="font-semibold">Error:</p>
              <p>{error}</p>
            </div>
          )}

          {result && (
            <div className="mt-4 p-3 bg-green-900/50 text-green-100 rounded-md">
              <p className="font-semibold">Success!</p>
              <p>{result.message}</p>
              {result.user && (
                <div className="mt-2 text-sm">
                  <p>User: {result.user.name}</p>
                  <p>Email: {result.user.email}</p>
                  <p>Role: {result.user.role}</p>
                </div>
              )}
            </div>
          )}

          <div className="mt-6 text-center">
            <button
              onClick={() => router.push("/admin")}
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              Return to Admin Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
