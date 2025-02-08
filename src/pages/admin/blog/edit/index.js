import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";

function Index() {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const res = await fetch("/api/blog");
    const data = await res.json();
    setData(data.data);
  };

  const deleteData = async () => {
    await fetch(`/api/blog?id=${deleteId}`, {
      method: "DELETE",
    });
    setShowModal(false);
    getData();
  };

  const Modal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black opacity-50"></div>
      <div className="relative bg-gray-800 rounded-lg p-6 max-w-sm w-full mx-4">
        <h3 className="text-lg font-medium mb-4 text-white">
          Are you sure you want to delete this post?
        </h3>
        <div className="flex justify-end gap-4">
          <button
            onClick={() => setShowModal(false)}
            className="px-4 py-2 text-gray-300 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={deleteData}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Head>
        <title>Manage Blog Posts</title>
      </Head>

      <div className="min-h-screen bg-black py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white font-calendas">
              Blog Posts
            </h1>
            <Link
              href="/admin/blog/create"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Create New Post
            </Link>
          </div>

          <div className="bg-gray-800 shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {data.map((post) => (
                  <tr key={post._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">
                        {post.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex gap-4">
                        <Link
                          href={`/admin/blog/edit/${post._id}`}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => {
                            setDeleteId(post._id);
                            setShowModal(true);
                          }}
                          className="text-red-400 hover:text-red-300"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && <Modal />}
    </>
  );
}

export default Index;
