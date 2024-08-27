import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Modal from "../../../components/Modal";

function Index() {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const res = await fetch("/api/blog");
      const { data } = await res.json();
      setData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const deleteData = async (id) => {
    try {
      await fetch(`/api/blog`, {
        method: "DELETE",
        body: JSON.stringify({ id }),
      });
      setShowModal(false);
      getData(); // Refresh data after deletion
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setShowModal(true);
  };

  return (
    <>
      <Head>
        <title>All Blogs</title>
      </Head>

      <section className="container mt-4 px-4 mx-auto bg-gray-100">
        <div className="flex flex-col">
          <h1 className="text-4xl my-4">All Blogs</h1>
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden border border-gray-200 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-4 py-3.5 text-left text-sm font-normal text-gray-500"
                      >
                        Name
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3.5 text-left text-sm font-normal text-gray-500"
                      >
                        Author
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3.5 text-left text-sm font-normal text-gray-500"
                      >
                        Content
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3.5 text-left text-sm font-normal text-gray-500"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data?.map((d) => (
                      <tr key={d._id}>
                        <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                          {d?.title}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {d?.author}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {d?.content}
                        </td>
                        <td className="px-4 py-4 text-sm whitespace-nowrap">
                          <div className="flex items-center gap-x-6">
                            <Link
                              href={`/admin/blog/edit/${d?._id}`}
                              className="text-yellow-900 transition-colors duration-200 hover:text-indigo-500 focus:outline-none"
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() => handleDeleteClick(d?._id)}
                              className="text-red-500 transition-colors duration-200 hover:text-indigo-500 focus:outline-none"
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
        </div>
      </section>
      {showModal && (
        <Modal
          id={selectedId}
          deleteData={deleteData}
          setshowModal={setShowModal}
        />
      )}
    </>
  );
}

export default Index;
