import Link from "next/link";
import { useEffect, useState } from "react";
import {
  AiOutlineEdit,
  AiOutlineFileAdd,
  AiOutlineUserSwitch,
} from "react-icons/ai";
import { MdOutlineUnsubscribe } from "react-icons/md";
import { authOptions } from "../api/auth/[...nextauth]";
import Head from "next/head";
import { useSession } from "next-auth/react";
import { getServerSession } from "next-auth/next";
function Index() {
  const { data: session } = useSession();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  if (!session || session?.user?.role !== 1) {
    return (
      <>
        <Head>
          <title>Unauthorized</title>
        </Head>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h1 className="text-4xl font-medium mb-8 text-white">Unauthorized</h1>
          <p className="text-lg text-white">
            You don`t have permission to access this page.
          </p>
        </div>
      </>
    );
  }
  return (
    <>
      <Head>
        <title>Admin</title>
      </Head>
      <div className="flex flex-col items-center justify-center min-h-screen  ">
        <h1 className="text-4xl font-medium mb-8 text-white">Admin Panel</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            href="/admin/blog/create"
            className="flex flex-col items-center justify-center p-4 bg-white shadow-md rounded-md transition-all duration-200 hover:bg-gray-200"
          >
            <AiOutlineFileAdd className="text-4xl mb-2 text-black" />
            <span className="text-black">Create Blog</span>
          </Link>

          <Link
            href="/admin/blog/edit"
            className="flex flex-col items-center justify-center p-4 bg-white shadow-md rounded-md transition-all duration-200 hover:bg-gray-200"
          >
            <AiOutlineEdit className="text-4xl mb-2 text-black" />
            <span className="text-black">Edit/Delete Blog</span>
          </Link>
          <Link
            className="flex flex-col items-center justify-center p-4 bg-white shadow-md rounded-md transition-all duration-200 hover:bg-gray-200"
            href="/admin/subscribers"
          >
            <MdOutlineUnsubscribe className="text-4xl mb-2 text-black" />
            <span className="text-black">Subscribers</span>
          </Link>
          <Link
            className="flex flex-col items-center justify-center p-4 bg-white shadow-md rounded-md transition-all duration-200 hover:bg-gray-200"
            href="/admin/users"
          >
            <AiOutlineUserSwitch className="text-4xl mb-2 text-black" />
            <span className="text-black">Users</span>
          </Link>
        </div>
      </div>
    </>
  );
}
export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);
  return {
    props: {
      session,
    },
  };
}
export default Index;
