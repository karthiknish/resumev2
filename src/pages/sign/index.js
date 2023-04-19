import { useSession, signIn, signOut } from "next-auth/react";

export default function SignIn() {
  return (
    <div className="flex min-h-screen max-w-sm flex-col mx-auto">
      <h1 className="text-2xl">Sign in</h1>
      <button
        className="bg-orange-100 text-black rounded-lg p-4"
        onClick={() => signIn("google")}
      >
        Sign in with Google
      </button>
    </div>
  );
}
