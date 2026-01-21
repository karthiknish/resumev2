import AuthService, { SignInOptions } from "./AuthService";
import { ApiResponse } from "@/types";

export async function signIn(provider?: string, options?: SignInOptions): Promise<ApiResponse> {
  return AuthService.signIn(provider, options);
}

export async function signUp({ name, email, password }: { name: string; email: string; password: string }): Promise<ApiResponse> {
  return AuthService.signUp({ name, email, password });
}

export async function signOut({ callbackUrl = "/" } = {}): Promise<void> {
  return AuthService.signOut({ callbackUrl });
}

export async function forgotPassword(email: string): Promise<ApiResponse> {
  return AuthService.forgotPassword(email);
}

export async function resetPassword({ token, email, password }: { token: string; email: string; password: string }): Promise<ApiResponse> {
  return AuthService.resetPassword({ token, email, password });
}

export function checkAdminStatus(session: any): boolean {
  return AuthService.isAdmin(session);
}

export function isAuthenticated(session: any): boolean {
  return AuthService.isAuthenticated(session);
}

export function getUserRole(session: any): string | null {
  return AuthService.getUserRole(session);
}

export function hasRole(session: any, role: string): boolean {
  return AuthService.hasRole(session, role);
}
