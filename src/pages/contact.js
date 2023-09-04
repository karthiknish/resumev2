import Head from "next/head";
import { useState } from "react";
function Contact() {
  const [feedback, setFeedback] = useState({ message: "", isError: false });
  async function handleSubmit(e) {
    e.preventDefault();

    const formData = {
      name: e.target.name.value,
      email: e.target.email.value,
      message: e.target.message.value,
    };

    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      setFeedback({ message: "Thank you for contacting!", isError: false });
      e.target.reset();
    } else {
      setFeedback({
        message: "There was a problem submitting your form.",
        isError: true,
      });
    }
  }
  return (
    <>
      <Head>
        <title>contact // karthik nishanth.</title>
      </Head>
      <div className="min-h-screen p-4 md:p-8 flex flex-col font-display text-white">
        <h2 className="mb-6 text-3xl font-bold mx-auto">Get in touch</h2>
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <p className="text-lg">
              From a passionate production undergraduate with a keen interest in
              exploring cutting-edge technologies and building visually
              appealing software solutions. As a quick learner with excellent
              problem-solving and teamwork abilities, I enjoy designing and
              creating intuitive user interfaces and products that streamline
              workflows for not only myself but thousands of developers
              worldwide. Check out some of my achievements below.
            </p>
          </div>
          <ul className="list-disc pl-6 mb-8">
            <li className="mb-2">
              Finalist in Bizzventure, an annual pitching competition for our
              business idea PABO - an innovative approach to tackling parking
              issues in bustling cities.
            </li>
            <li className="mb-2">
              Completed an internship at Talent Logistics, Egypt, where I
              provided them with competitive digital solutions to expand their
              reach to other countries.
            </li>
            <li className="mb-2">
              Acquired years of experience working with JavaScript (ES6),
              Python, PHP, HTML, CSS (SASS/SCSS), Node.js, React, GitHub/Git,
              Firebase, SQL, WordPress, and Adobe XD.
            </li>
          </ul>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block mb-2">
                Name:
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="w-full p-2 text-black"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block mb-2">
                Email:
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full p-2 text-black"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="message" className="block mb-2">
                Message:
              </label>
              <textarea
                id="message"
                name="message"
                className="w-full p-2 text-black"
                required
              ></textarea>
            </div>
            <div className="mb-4">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
              >
                Submit
              </button>
              {feedback.message && (
                <p
                  className={`mt-4 ${
                    feedback.isError ? "text-red-500" : "text-green-500"
                  }`}
                >
                  {feedback.message}
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Contact;
