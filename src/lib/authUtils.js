import AuthService from "./AuthService";

/**
 * Sign in with credentials or redirect to sign in page
 * @param {string|Object} provider - Authentication provider or credentials object
 * @param {Object} options - Sign in options
 * @returns {Promise<Object>} Sign in result
 */
export async function signIn(provider, options) {
  return AuthService.signIn(provider, options);
}

/**
 * Sign up a new user
 * @param {Object} userData - User registration data
 * @param {string} userData.name - User name
 * @param {string} userData.email - User email
 * @param {string} userData.password - User password
 * @returns {Promise<Object>} Sign up result
 */
export async function signUp({ name, email, password }) {
  return AuthService.signUp({ name, email, password });
}

/**
 * Sign out the user and clear session data
 * @param {Object} options - Sign out options
 * @param {string} options.callbackUrl - URL to redirect to after sign out
 * @returns {Promise<void>}
 */
export async function signOut({ callbackUrl = "/" } = {}) {
  return AuthService.signOut({ callbackUrl });
}

/**
 * Request password reset
 * @param {string} email - User email
 * @returns {Promise<Object>} Password reset result
 */
export async function forgotPassword(email) {
  return AuthService.forgotPassword(email);
}

/**
 * Reset password
 * @param {Object} resetData - Password reset data
 * @param {string} resetData.token - Reset token
 * @param {string} resetData.email - User email
 * @param {string} resetData.password - New password
 * @returns {Promise<Object>} Password reset result
 */
export async function resetPassword({ token, email, password }) {
  return AuthService.resetPassword({ token, email, password });
}

/**
 * Check if user has admin role
 * @param {Object} session - NextAuth session object
 * @returns {boolean}
 */
export function checkAdminStatus(session) {
  return AuthService.isAdmin(session);
}

/**
 * Check if user is authenticated
 * @param {Object} session - NextAuth session object
 * @returns {boolean}
 */
export function isAuthenticated(session) {
  return AuthService.isAuthenticated(session);
}

/**
 * Get user role from session
 * @param {Object} session - NextAuth session object
 * @returns {string|null}
 */
export function getUserRole(session) {
  return AuthService.getUserRole(session);
}

/**
 * Check if user has specific role
 * @param {Object} session - NextAuth session object
 * @param {string} role - Role to check
 * @returns {boolean}
 */
export function hasRole(session, role) {
  return AuthService.hasRole(session, role);
}