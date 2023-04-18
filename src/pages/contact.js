import { useEffect, useState } from "react";
import Link from "next/link";

import Head from "next/head";
function Contact() {
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

          <div className="flex space-x-4">
            {/* <a
              target="_blank"
              href={pdf}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded"
            >
              Download CV
            </a> */}
            <a
              href="mailto:karthik.nishanth06@gmail.com"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
            >
              Email ME!
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

export default Contact;
