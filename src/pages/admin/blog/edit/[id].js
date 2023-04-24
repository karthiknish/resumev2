import { useEffect, useState } from "react";
import Head from "next/head";
import Markdown from "../../../../components/Markdown";
import { useRouter } from "next/router";

function Edit() {
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState([]);
  const [jsonInput, setJsonInput] = useState("");
  const [showJsonInput, setShowJsonInput] = useState(false);
  const handleJsonSubmit = () => {
    setShowJsonInput(false);
  };
  const toggleJsonInput = () => {
    setShowJsonInput((prevState) => !prevState);
  };
  useEffect(() => {
    const jsonData = {
      title,
      imageUrl,
      content,
    };
    setJsonInput(JSON.stringify(jsonData, null, 2));
  }, [title, imageUrl, content]);
  const handleJsonInput = (e) => {
    const input = e.target.value;
    setJsonInput(input);
    try {
      const json = JSON.parse(input);
      setTitle(json.title || "");
      setImageUrl(json.imageUrl || "");
      setContent(json.content || "");
    } catch (error) {
      // Handle JSON parsing errors
      console.error("Invalid JSON input");
    }
  };
  const router = useRouter();
  useEffect(() => {
    const { id } = router.query;
    const getData = async () => {
      if (id) {
        let res = await fetch(`/api/blog?id=${id}`, {
          method: "GET",
        })
          .then((res) => res.json())
          .then((d) => {
            if (d?.success) {
              setTitle(d?.data?.title);
              setImageUrl(d?.data?.imageUrl);
              setContent(d?.data?.content);
              const jsonData = {
                title: d?.data?.title,
                imageUrl: d?.data?.imageUrl,
                content: d?.data?.content,
              };
              setJsonInput(JSON.stringify(jsonData, null, 2));
            }
          });
      }
    };
    getData();
  }, [router]);
  const handleSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    const { id } = router.query;
    const data = { id, title, imageUrl, content };
    try {
      let res = await fetch(`/api/blog?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((res) => res.json());
      if (res.success) {
        setSubmitStatus([true, "Blog post submitted successfully!"]);
        // router.push(`/admin/blog`);
      } else {
        console.error(res.error);
      }
    } catch (error) {
      // Handle network error
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <Head>
        <title>Edit Blog</title>
      </Head>
      <div className="flex flex-col p-4 gap-4 mx-10">
        <h1 className="text-center text-4xl font-bold">Edit Blog</h1>
        <label htmlFor="title">Title</label>
        <input
          value={title || ""}
          type="text"
          onChange={(e) => setTitle(e.target.value)}
          className="block w-full px-10 py-3 text-gray-700 bg-white border rounded-lg   focus:border-blue-400  focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
          placeholder="Title"
        />

        <label htmlFor="imageUrl">Image URL</label>
        <input
          value={imageUrl || ""}
          type="text"
          onChange={(e) => setImageUrl(e.target.value)}
          className="block w-full px-10 py-3 text-gray-700 bg-white border rounded-lg  focus:border-blue-400  focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
          placeholder="Image URL"
        />
        <Markdown
          key={content}
          content={content || ""}
          setContent={setContent}
        />
        {submitStatus && (
          <div
            className={`text-center ${
              submitStatus[0] ? "text-green-500" : "text-red-500"
            } mb-2`}
          >
            {submitStatus[1]}
          </div>
        )}

        <button
          className="bg-blue-500 p-4 text-white rounded-lg shadow-lg hover:bg-blue-700"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Submit"}
        </button>
        <button
          className="bg-yellow-500 p-4 text-white rounded-lg shadow-lg hover:bg-yellow-700"
          onClick={toggleJsonInput}
        >
          {showJsonInput ? "Hide JSON Editor" : "Show JSON Editor"}
        </button>
        {showJsonInput && (
          <>
            <label htmlFor="jsonInput">Edit JSON</label>
            <textarea
              value={jsonInput}
              onChange={handleJsonInput}
              className="block w-full h-48 px-10 py-3 text-gray-700 bg-white border rounded-lg  focus:border-blue-400  focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
              placeholder='{"title": "Example Title", "imageUrl": "https://example.com/image.jpg", "content": "Example Content"}'
            />
            <button
              className="bg-green-500 p-4 text-white rounded-lg shadow-lg hover:bg-green-700"
              onClick={handleJsonSubmit}
            >
              Submit JSON
            </button>
          </>
        )}
      </div>
    </>
  );
}

export default Edit;
