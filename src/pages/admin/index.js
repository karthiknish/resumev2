import Link from "next/link";
import { AiOutlineEdit, AiOutlineFileAdd } from "react-icons/ai";
import { MdOutlineUnsubscribe } from "react-icons/md";
import Head from "next/head";
function Index() {
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
            <AiOutlineFileAdd className="text-4xl mb-2" />
            <span>Create Blog</span>
          </Link>

          <Link
            href="/admin/blog/edit"
            className="flex flex-col items-center justify-center p-4 bg-white shadow-md rounded-md transition-all duration-200 hover:bg-gray-200"
          >
            <AiOutlineEdit className="text-4xl mb-2" />
            <span>Edit/Delete Blog</span>
          </Link>
          <Link
            className="flex flex-col items-center justify-center p-4 bg-white shadow-md rounded-md transition-all duration-200 hover:bg-gray-200"
            href="/admin/subscribers"
          >
            {" "}
            <MdOutlineUnsubscribe className="text-4xl mb-2" />
            <span>Subscribers</span>
          </Link>
        </div>
      </div>
    </>
  );
}

export default Index;
