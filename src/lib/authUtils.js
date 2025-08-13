import { signOut as nextAuthSignOut } from "next-auth/react";
import { toast } from "sonner";

/**
 * Sign out the user and clear session data
 * @param {Object} options - Sign out options
 * @param {string} options.callbackUrl - URL to redirect to after sign out
 * @returns {Promise<void>}
 */
export async function signOut({ callbackUrl = "/" } = {}) {
  try {
    // Call the signout API endpoint for additional cleanup
    const response = await fetch("/api/auth/signout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to sign out from server");
    }

    // Sign out from NextAuth
    await nextAuthSignOut({ callbackUrl });
    toast.success("Successfully signed out!");
  } catch (error) {
    console.error("Sign out error:", error);
    toast.error("Error signing out. Please try again.");
    // Even if server signout fails, still sign out locally
    await nextAuthSignOut({ callbackUrl });
  }
}

/**
 * Check if user has admin role
 * @param {Object} session - NextAuth session object
 * @returns {boolean}
 */
export function checkAdminStatus(session) {
  return session?.user?.role === "admin";
}

/**
 * Check if user is authenticated
 * @param {Object} session - NextAuth session object
 * @returns {boolean}
 */
export function isAuthenticated(session) {
  return !!session?.user;
}

/**
 * Get user role from session
 * @param {Object} session - NextAuth session object
 * @returns {string|null}
 */
export function getUserRole(session) {
  return session?.user?.role || null;
}

/**
 * Check if user has specific role
 * @param {Object} session - NextAuth session object
 * @param {string} role - Role to check
 * @returns {boolean}
 */
export function hasRole(session, role) {
  return session?.user?.role === role;
}