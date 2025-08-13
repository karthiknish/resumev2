import { signIn as nextAuthSignIn, signOut as nextAuthSignOut } from "next-auth/react";
import { toast } from "sonner";

class AuthService {
  /**
   * Sign in with credentials or redirect to sign in page
   * @param {string} provider - Authentication provider (default: 'credentials')
   * @param {Object} options - Sign in options
   * @returns {Promise<Object>} Sign in result
   */
  static async signIn(provider = "credentials", options = {}) {
    try {
      // If no provider or options provided, redirect to sign in page
      if (arguments.length === 0 || (typeof provider === 'object' && !options)) {
        options = provider || {};
        provider = "credentials";
      }
      
      // If only options provided (no provider)
      if (typeof provider === 'object' && !options) {
        options = provider;
        provider = "credentials";
      }
      
      const result = await nextAuthSignIn(provider, {
        redirect: false,
        ...options,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      toast.success("Successfully signed in!");
      return { success: true, data: result };
    } catch (error) {
      console.error("Sign in error:", error);
      toast.error(error.message || "Sign in failed. Please try again.");
      return { success: false, error: error.message };
    }
  }

  /**
   * Sign up a new user
   * @param {Object} userData - User registration data
   * @param {string} userData.name - User name
   * @param {string} userData.email - User email
   * @param {string} userData.password - User password
   * @returns {Promise<Object>} Sign up result
   */
  static async signUp({ name, email, password }) {
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Sign up failed");
      }

      toast.success("Account created successfully! Please sign in.");
      return { success: true, data };
    } catch (error) {
      console.error("Sign up error:", error);
      toast.error(error.message || "Sign up failed. Please try again.");
      return { success: false, error: error.message };
    }
  }

  /**
   * Sign out the user
   * @param {Object} options - Sign out options
   * @param {string} options.callbackUrl - URL to redirect to after sign out
   * @returns {Promise<void>}
   */
  static async signOut({ callbackUrl = "/" } = {}) {
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
   * Request password reset
   * @param {string} email - User email
   * @returns {Promise<Object>} Password reset result
   */
  static async forgotPassword(email) {
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send password reset email");
      }

      toast.success("Password reset email sent! Check your inbox.");
      return { success: true, data };
    } catch (error) {
      console.error("Forgot password error:", error);
      toast.error(error.message || "Failed to send password reset email. Please try again.");
      return { success: false, error: error.message };
    }
  }

  /**
   * Reset password
   * @param {Object} resetData - Password reset data
   * @param {string} resetData.token - Reset token
   * @param {string} resetData.email - User email
   * @param {string} resetData.password - New password
   * @returns {Promise<Object>} Password reset result
   */
  static async resetPassword({ token, email, password }) {
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to reset password");
      }

      toast.success("Password reset successfully!");
      return { success: true, data };
    } catch (error) {
      console.error("Reset password error:", error);
      toast.error(error.message || "Failed to reset password. Please try again.");
      return { success: false, error: error.message };
    }
  }

  /**
   * Check if user has admin role
   * @param {Object} session - NextAuth session object
   * @returns {boolean}
   */
  static isAdmin(session) {
    return session?.user?.role === "admin";
  }

  /**
   * Check if user is authenticated
   * @param {Object} session - NextAuth session object
   * @returns {boolean}
   */
  static isAuthenticated(session) {
    return !!session?.user;
  }

  /**
   * Get user role from session
   * @param {Object} session - NextAuth session object
   * @returns {string|null}
   */
  static getUserRole(session) {
    return session?.user?.role || null;
  }

  /**
   * Check if user has specific role
   * @param {Object} session - NextAuth session object
   * @param {string} role - Role to check
   * @returns {boolean}
   */
  static hasRole(session, role) {
    return session?.user?.role === role;
  }
}

export default AuthService;