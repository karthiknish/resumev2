import { useState } from "react";
import Head from "next/head";
import Markdown from "../../../components/Markdown";
function Create() {
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [content, setContent] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(content);
    const data = { title, imageUrl, content };
    let res = await fetch("/api/blog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((d) => {
        if (d.success) {
          setTitle("");
          setImageUrl("");
          setContent("");
        }
      });
  };
  return (
    <>
      <Head>
        <title>Create Blog</title>
      </Head>
      <div className="flex flex-col p-4 gap-4 mx-10">
        <h1 className="text-center text-4xl font-bold">Create Blog</h1>
        <input
          value={title}
          type="text"
          onChange={(e) => setTitle(e.target.value)}
          className="block w-full px-10 py-3 text-gray-700 bg-white border rounded-lg   focus:border-blue-400  focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
          placeholder="Title"
        />
        <input
          value={imageUrl}
          type="text"
          onChange={(e) => setImageUrl(e.target.value)}
          className="block w-full px-10 py-3 text-gray-700 bg-white border rounded-lg  focus:border-blue-400  focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
          placeholder="Image URL"
        />
        <Markdown content={content} setContent={setContent} />

        <button
          className="bg-blue-500 p-4 text-white rounded-lg shadow-lg hover:bg-blue-700"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </>
  );
}

export default Create;
