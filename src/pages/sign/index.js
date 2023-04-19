import { useSession, signIn, signOut } from "next-auth/react";
import Head from "next/head";
import { FcGoogle } from "react-icons/fc";
export default function SignIn() {
  return (
    <>
      <Head>
        <title>Sign in</title>
      </Head>
      <div className="flex min-h-screen max-w-sm flex-col justify-center text-center mx-auto">
        <h1 className="text-2xl my-4">Sign in to continue to use the app</h1>
        <button
          className="bg-gradient-to-r flex w-full justify-center from-orange-100 to-teal-100  text-black rounded-lg p-4"
          onClick={() => signIn("google")}
        >
          <FcGoogle className="inline-block mr-2 text-2xl" />
          <p className="font-semibold">Sign in with Google</p>
        </button>
      </div>
    </>
  );
}
