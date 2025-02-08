import Link from "next/link";
import { useEffect, useState } from "react";
import {
  AiOutlineEdit,
  AiOutlineFileAdd,
  AiOutlineUserSwitch,
} from "react-icons/ai";
import { MdOutlineUnsubscribe } from "react-icons/md";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

function Index() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Admin</title>
      </Head>
      <div className="min-h-screen bg-black p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-medium mb-12 text-white font-calendas text-center">
            Admin Panel
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
            <Link
              href="/admin/blog/create"
              className="flex flex-col items-center justify-center p-8 bg-gray-800 border border-gray-700 rounded-lg transition-all duration-200 hover:bg-gray-700 group"
            >
              <AiOutlineFileAdd className="text-5xl mb-4 text-blue-500 group-hover:text-blue-400" />
              <span className="text-white text-lg font-calendas">
                Create Blog
              </span>
            </Link>

            <Link
              href="/admin/blog/edit"
              className="flex flex-col items-center justify-center p-8 bg-gray-800 border border-gray-700 rounded-lg transition-all duration-200 hover:bg-gray-700 group"
            >
              <AiOutlineEdit className="text-5xl mb-4 text-blue-500 group-hover:text-blue-400" />
              <span className="text-white text-lg font-calendas">
                Edit/Delete Blog
              </span>
            </Link>

            <Link
              href="/admin/subscribers"
              className="flex flex-col items-center justify-center p-8 bg-gray-800 border border-gray-700 rounded-lg transition-all duration-200 hover:bg-gray-700 group"
            >
              <MdOutlineUnsubscribe className="text-5xl mb-4 text-blue-500 group-hover:text-blue-400" />
              <span className="text-white text-lg font-calendas">
                Subscribers
              </span>
            </Link>

            <Link
              href="/admin/users"
              className="flex flex-col items-center justify-center p-8 bg-gray-800 border border-gray-700 rounded-lg transition-all duration-200 hover:bg-gray-700 group"
            >
              <AiOutlineUserSwitch className="text-5xl mb-4 text-blue-500 group-hover:text-blue-400" />
              <span className="text-white text-lg font-calendas">Users</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Index;
