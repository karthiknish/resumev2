import { useState, useEffect, useRef } from "react";
import { getDocument } from "pdfjs-dist";
import Head from "next/head";
import { signOut } from "next-auth/react";
async function extractTextFromPDF(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await getDocument({ data: arrayBuffer }).promise;
    let extractedText = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      extractedText += textContent.items.map((item) => item.str).join(" ");
    }
    return extractedText;
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    return null;
  }
}

function Covergenerator() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const pdfjs = require("pdfjs-dist");
      pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";
    }
  }, []);

  const [companyName, setCompanyName] = useState("");
  const [resume, setResume] = useState(null);
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchedText, setFetchedText] = useState("");
  const [extractedText, setExtractedText] = useState("");
  const downloadButtonRef = useRef(null);
  const [downloadUrl, setDownloadUrl] = useState("");
  const fetchExtractedText = async () => {
    try {
      const response = await fetch("/api/generate-cover-letter", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        const extractedText = data.extracted_text;
        console.log("Fetched Extracted Text:", extractedText);
        setFetchedText(extractedText);
        // Set the state or use the fetched extractedText as needed
      } else {
        console.error("Failed to fetch extracted text:", response.statusText);
      }
    } catch (error) {
      console.error("Failed to fetch extracted text:", error);
    }
  };
  useEffect(() => {
    if (fetchedText) {
      setExtractedText(fetchedText);
    } else if (resume) {
      const extractText = async () => {
        const extractedTextFromFile = await extractTextFromPDF(resume);
        setExtractedText(extractedTextFromFile);
      };
      extractText();
    }
  }, [fetchedText, resume]);
  const downloadCoverLetter = async (coverLetter, companyName, role) => {
    setLoading(true);

    const response = await fetch("/api/generate-pdf", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        coverLetter,
        companyName,
        role,
      }),
    });

    if (response.ok) {
      const pdfBlob = await response.blob();
      const fileName = `cover-letter-${companyName}-${role}.pdf`;
      const downloadUrl = URL.createObjectURL(pdfBlob);
      setDownloadUrl({ url: downloadUrl, fileName });
    } else {
      console.error("Failed to generate the PDF.");
    }

    setLoading(false);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("Company Name:", companyName);
    if (!fetchedText && !extractedText && resume) {
      console.log("Resume File:", resume);
      const extractedTextFromFile = await extractTextFromPDF(resume);
      console.log("Extracted Text:", extractedTextFromFile);
      setExtractedText(extractedTextFromFile);
    }
    const textToUse = fetchedText || extractedText;
    try {
      const response = await fetch("/api/generate-cover-letter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companyName,
          role,
          extractedText: textToUse,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const coverLetter = data.cover_letter;
        console.log("Generated Cover Letter:", coverLetter);
        await downloadCoverLetter(coverLetter, companyName, role);
      } else {
        console.error("Failed to generate cover letter: ", response.statusText);
      }
    } catch (error) {
      console.error("Failed to generate cover letter:", error);
    }
  };

  return (
    <>
      <Head>
        <title>Cover Generator</title>
      </Head>
      <div className="min-h-screen py-6 flex flex-col justify-center sm:py-12">
        <div className="flex justify-end mr-4 mt-4">
          <button
            type="button"
            className="py-2 px-4 bg-red-400 text-white font-semibold rounded-lg shadow-md hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75"
            onClick={() => {
              signOut();
            }}
          >
            Sign Out
          </button>
        </div>
        <div className="relative py-3 sm:max-w-xl sm:mx-auto">
          <div className="relative px-4 py-10 bg-gray-900 sm:p-20">
            <h1 className="text-2xl mb-6">Cover Generator</h1>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="companyName"
                  className="block text-sm font-medium text-white"
                >
                  Company Name:
                </label>
                <input
                  type="text"
                  id="companyName"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>{" "}
              <div className="mb-4">
                <label
                  htmlFor="companyName"
                  className="block text-sm font-medium text-white"
                >
                  Role:
                </label>
                <input
                  type="text"
                  id="Role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <button
                type="button"
                onClick={fetchExtractedText}
                className="w-full py-2 px-4 bg-blue-400 text-white font-semibold rounded-lg shadow-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 mb-4"
              >
                Load extracted text from database
              </button>
              <>
                {extractedText && (
                  <div>
                    <h2 className="text-xl text-white mb-2">
                      Ur text is extracted!!
                    </h2>
                    {/* <p className="text-white">{extractedText}</p> */}
                  </div>
                )}
              </>
              <div className="mb-4">
                <label
                  htmlFor="resume"
                  className="block text-sm font-medium text-white"
                >
                  Resume:
                </label>
                <input
                  type="file"
                  id="resume"
                  onChange={(e) => setResume(e.target.files[0])}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300  rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div className="mb-4">
                {loading && <p className="text-white">Processing...</p>}
              </div>
              <button
                type="submit"
                className="w-full py-2 px-4 bg-yellow-400 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-75"
              >
                Generate Cover Letter
              </button>
            </form>
            {downloadUrl.url && (
              <div className="mt-4">
                <a
                  href={downloadUrl.url}
                  download={downloadUrl.fileName}
                  className="w-full py-2 px-4 bg-green-400 text-white font-semibold rounded-lg shadow-md hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
                >
                  Download Cover Letter
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Covergenerator;
