import { useState, useEffect } from "react";
import { BiSend, BiMessageSquareDots } from "react-icons/bi";
import Modal from "react-modal";
Modal.setAppElement("#__next");
function Chatbot() {
  const [message, setMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    sendMessage("Hello, how can I assist you today?");
  }, []);
  const sendMessage = async (content, user = "user") => {
    setMessages([...messages, { user, content }]);
    setMessage("");

    if (user === "user") {
      try {
        const response = await fetch(
          "https://api.openai.com/v1/engines/davinci-codex/completions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
              prompt: content,
              max_tokens: 100,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Error in API response");
        }

        const responseData = await response.json();
        console.log(responseData);
        if (!responseData.choices || !responseData.choices.length) {
          throw new Error("No choices in API response");
        }

        const botMessage = responseData.choices[0].text.trim();

        setMessages([...messages, { user: "bot", content: botMessage }]);
      } catch (error) {
        console.error("Error: ", error);
      }
    }
  };
  return (
    <div className="fixed  z-30 bottom-5 right-5">
      <button
        className="p-4 rounded-full bg-blue-500 text-white flex items-center"
        onClick={() => setIsOpen(true)}
      >
        <BiMessageSquareDots className="text-3xl" />
      </button>

      <Modal
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
        contentLabel="Chatbot Modal"
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            zIndex: 1000,
          },
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            width: "80%",
            height: "80%",
          },
        }}
      >
        <div className="flex flex-col h-full p-4 border-2 text-black bg-gray-600 border-gray-700 rounded-md shadow-lg space-y-4">
          <div className="overflow-auto h-full">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.user === "bot" ? "justify-start" : "justify-end"
                } items-end`}
              >
                <p
                  className={`p-2 rounded-md ${
                    message.user === "bot"
                      ? "bg-blue-400 text-white"
                      : "bg-green-400 text-white"
                  }`}
                >
                  {message.content}
                </p>
              </div>
            ))}
          </div>
          <div className="flex">
            <input
              className="flex-grow p-2 rounded-l-md border-2 border-gray-300"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button
              className="flex items-center justify-center p-2 rounded-r-md bg-blue-500 text-white"
              onClick={() => sendMessage(message)}
            >
              <BiSend />
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Chatbot;
