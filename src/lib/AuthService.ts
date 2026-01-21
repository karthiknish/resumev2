import { signIn as nextAuthSignIn, signOut as nextAuthSignOut } from "next-auth/react";
import { toast } from "sonner";

export interface SignInOptions {
  redirect?: boolean;
  callbackUrl?: string;
  [key: string]: any;
}

interface SignUpData {
  name: string;
  email: string;
  password: string;
}

interface ForgotPasswordData {
  email: string;
}

interface ResetPasswordData {
  token: string;
  email: string;
  password: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

class AuthService {
  static async signIn(
    providerOrOptions: string | SignInOptions = "credentials",
    maybeOptions?: SignInOptions
  ): Promise<ApiResponse> {
    try {
      let provider = "credentials";
      let options: SignInOptions = {};

      if (typeof providerOrOptions === "string") {
        provider = providerOrOptions || "credentials";
        options = maybeOptions || {};
      } else if (typeof providerOrOptions === "object" && providerOrOptions !== null) {
        provider = "credentials";
        options = providerOrOptions;
      }

      const result = await nextAuthSignIn(provider, {
        redirect: false,
        ...options,
      });

      if (!result || result.ok !== true) {
        const message = result?.error || "Invalid email or password";
        throw new Error(message);
      }

      toast.success("Successfully signed in!");
      return { success: true, data: result };
    } catch (error: any) {
      console.error("Sign in error:", error);
      toast.error(error.message || "Sign in failed. Please try again.");
      return { success: false, error: error.message };
    }
  }

  static async signUp({ name, email, password }: SignUpData): Promise<ApiResponse> {
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
    } catch (error: any) {
      console.error("Sign up error:", error);
      toast.error(error.message || "Sign up failed. Please try again.");
      return { success: false, error: error.message };
    }
  }

  static async signOut({ callbackUrl = "/" } = {}): Promise<void> {
    try {
      const response = await fetch("/api/auth/signout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to sign out from server");
      }

      await nextAuthSignOut({ callbackUrl });
      toast.success("Successfully signed out!");
    } catch (error: any) {
      console.error("Sign out error:", error);
      toast.error("Error signing out. Please try again.");
      await nextAuthSignOut({ callbackUrl });
    }
  }

  static async forgotPassword(email: string): Promise<ApiResponse> {
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
    } catch (error: any) {
      console.error("Forgot password error:", error);
      toast.error(
        error.message ||
          "Failed to send password reset email. Please try again."
      );
      return { success: false, error: error.message };
    }
  }

  static async resetPassword({ token, email, password }: ResetPasswordData): Promise<ApiResponse> {
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
    } catch (error: any) {
      console.error("Reset password error:", error);
      toast.error(
        error.message || "Failed to reset password. Please try again."
      );
      return { success: false, error: error.message };
    }
  }

  static isAdmin(session: any): boolean {
    return session?.user?.role === "admin";
  }

  static isAuthenticated(session: any): boolean {
    return !!session?.user;
  }

  static getUserRole(session: any): string | null {
    return session?.user?.role || null;
  }

  static hasRole(session: any, role: string): boolean {
    return session?.user?.role === role;
  }
}

export default AuthService;
