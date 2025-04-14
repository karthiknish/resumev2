/**
 * Checks if the user associated with the session has admin privileges.
 * @param {import('next-auth').Session | null | undefined} session - The NextAuth session object.
 * @returns {boolean} True if the user is an admin, false otherwise.
 */
export function checkAdminStatus(session) {
  if (!session?.user) {
    return false;
  }

  // Check common admin indicators: role='admin', isAdmin=true, or matching admin email env var
  const isAdminByRole = session.user.role === "admin";
  const isAdminByFlag = session.user.isAdmin === true;
  const isAdminByEmail =
    process.env.NEXT_PUBLIC_ADMIN_EMAIL &&
    session.user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  return isAdminByRole || isAdminByFlag || isAdminByEmail;
}
