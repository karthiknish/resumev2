import { useState, useEffect } from "react";

import Head from "next/head";
import Router, { useRouter } from "next/router";
import { signIn, useSession } from "next-auth/react";

import { generateBG } from "../../utils/bgAnim.js";
function Index() {
  const { data } = useSession();
  const router = useRouter();
  const [signin, setSignin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [conpassword, setConpassword] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [elemProps, setElemProps] = useState({});

  useEffect(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const initialElemProps = generateBG(width, height, false);
    setElemProps(initialElemProps);

    let resized = false;

    const handleResize = () => {
      if (!resized) {
        resized = true;

        if (width !== window.innerWidth || height !== window.innerHeight) {
          const newElemProps = generateBG(
            window.innerWidth,
            window.innerHeight,
            true
          );
          setElemProps(newElemProps);
        }
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleResend = async (e) => {
    e.preventDefault();
    let res = await fetch("/api/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
      .then((res) => res.json())
      .then((d) => {
        if (d.success) {
          setMessage("");
        }
      });
  };

  useEffect(() => {

    if (data?.user) {
      Router.push("/admin");
    }
    if (router.query.error) {
      setMessage(decodeURIComponent(router.query.error));
    }
  }, [data, router.query]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (signin) {
      const data = await signIn("credentials", {
        redirect: false,
        email,
        password,
      }).then((d) => {
        setMessage([d?.ok, d?.error]);
        setSuccess(d?.ok);
      });
    } else {
      const role = 1;
      const data = { name, email, password, conpassword, role };
      let res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .then((d) => {
          if (d.success) {
            setEmail("");
            setName("");
            setConpassword("");
            setPassword("");
            setMessage(d.message);
            setSuccess(true);
          } else {
            setMessage(d.message);
            setSuccess(false);
          }
        });
    }
  };

  return (
    <>
      <Head>
        <title>Sign In | Sign Up</title>
      </Head>
      <section>
        <div className="container flex items-center justify-center min-h-screen px-6 mx-auto">
          <form className="w-full bg-white p-10 rounded-lg shadow-2xl max-w-md">
            <div className="flex justify-center mx-auto">
              {/* <img
                className="w-auto h-7 sm:h-8"
                src="https://merakiui.com/images/logo.svg"
                alt=""
              /> */}
            </div>

            <div className="flex items-center justify-center mt-6">
              <button
                type="button"
                onClick={() => {
                  setSignin(true);
                  setMessage("");
                }}
                className={`w-1/3 pb-4 font-medium text-center  ${
                  signin
                    ? "text-gray-800 border-b-2 border-blue-500"
                    : "text-gray-500"
                } capitalize border-b `}
              >
                sign in
              </button>

              <button
                type="button"
                onClick={() => {
                  setSignin(false);
                  setMessage("");
                }}
                className={`w-1/3 pb-4 font-medium text-center ${
                  signin
                    ? "text-gray-500"
                    : "text-gray-800 border-b-2 border-blue-500"
                } capitalize border-b `}
              >
                sign up
              </button>
            </div>

            {signin == true ? (
              <>
                <div className="relative flex items-center mt-8">
                  <span className="absolute">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6 mx-3 text-gray-300 "
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </span>

                  <input
                    value={email}
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full py-3 text-gray-700 bg-white border rounded-lg px-11  focus:border-blue-400  focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                    placeholder="Email"
                  />
                </div>

                <div className="relative flex items-center mt-4">
                  <span className="absolute">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6 mx-3 text-gray-300 "
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </span>

                  <input
                    value={password}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleSubmit(e);
                      }
                    }}
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full px-10 py-3 text-gray-700 bg-white border rounded-lg   focus:border-blue-400  focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                    placeholder="Password"
                  />
                </div>
                {message && !success && (
                  <div className="flex w-full my-4 max-w-sm overflow-hidden bg-slate-50 rounded-lg shadow-md ">
                    <div className="flex items-center justify-center w-12 bg-red-500">
                      <svg
                        className="w-6 h-6 text-white fill-current"
                        viewBox="0 0 40 40"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M20 3.36667C10.8167 3.36667 3.3667 10.8167 3.3667 20C3.3667 29.1833 10.8167 36.6333 20 36.6333C29.1834 36.6333 36.6334 29.1833 36.6334 20C36.6334 10.8167 29.1834 3.36667 20 3.36667ZM19.1334 33.3333V22.9H13.3334L21.6667 6.66667V17.1H27.25L19.1334 33.3333Z" />
                      </svg>
                    </div>

                    <div className="px-4 py-2 -mx-3">
                      <div className="mx-3">
                        <span className="font-semibold text-red-400">
                          Error
                        </span>
                        <p className="text-sm text-gray-600 ">
                          {message}

                          {message[1]
                            .toString()
                            .startsWith("Please verify") && (
                            <button
                              className="text-blue-400"
                              onClick={handleResend}
                            >
                              Resend Verification Mail
                            </button>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="w-full px-6 py-2.5 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-gray-800 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50"
                  >
                    Sign In
                  </button>
                  <div className="mt-6 text-center ">
                    <button
                      type="button"
                      onClick={() => Router.push("/sign/forgotpassword")}
                      className="text-sm text-blue-500 hover:underline "
                    >
                      Forgot Password
                    </button>
                  </div>
                  <div className="mt-2 text-center ">
                    <button
                      type="button"
                      onClick={() => setSignin(false)}
                      className="text-sm text-blue-500 hover:underline "
                    >
                      Don t have an account?
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <span className="w-1/5 border-b dark:border-gray-600 lg:w-1/5"></span>

                    <a
                      href="#"
                      className="text-xs text-center text-gray-500 uppercase dark:text-gray-400 hover:underline"
                    >
                      or login with Social Media
                    </a>

                    <span className="w-1/5 border-b dark:border-gray-400 lg:w-1/5"></span>
                  </div>
                  <div className="flex items-center mt-6 -mx-2">
                    <button
                      onClick={() => signIn("google")}
                      type="button"
                      className="flex items-center justify-center w-full px-6 py-2 mx-2 text-sm font-medium text-white transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:bg-blue-400 focus:outline-none"
                    >
                      <svg
                        className="w-4 h-4 mx-2 fill-current"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"></path>
                      </svg>

                      <span className="hidden mx-2 sm:inline">
                        Sign in with Google
                      </span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="relative flex items-center mt-8">
                  <span className="absolute">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6 mx-3 text-gray-300 "
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </span>

                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    type="text"
                    className="block w-full py-3 text-gray-700 bg-white border rounded-lg px-11  focus:border-blue-400  focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                    placeholder="Name"
                  />
                </div>

                <div className="relative flex items-center mt-6">
                  <span className="absolute">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6 mx-3 text-gray-300 "
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </span>

                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    className="block w-full py-3 text-gray-700 bg-white border rounded-lg px-11  focus:border-blue-400  focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                    placeholder="Email address"
                  />
                </div>

                <div className="relative flex items-center mt-4">
                  <span className="absolute">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6 mx-3 text-gray-300 "
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </span>

                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full px-10 py-3 text-gray-700 bg-white border rounded-lg   focus:border-blue-400  focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                    placeholder="Password"
                  />
                </div>

                <div className="relative flex items-center mt-4">
                  <span className="absolute">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6 mx-3 text-gray-300 "
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </span>

                  <input
                    type="password"
                    value={conpassword}
                    onChange={(e) => setConpassword(e.target.value)}
                    className="block w-full px-10 py-3 text-gray-700 bg-white border rounded-lg   focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                    placeholder="Confirm Password"
                  />
                </div>
                {message && (
                  <div className="flex w-full my-4 max-w-sm overflow-hidden bg-slate-50 rounded-lg shadow-md ">
                    <div
                      className={`flex items-center justify-center w-12 ${
                        success ? "bg-green-500" : "bg-red-500"
                      }`}
                    >
                      <svg
                        className="w-6 h-6 text-white fill-current"
                        viewBox="0 0 40 40"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M20 3.36667C10.8167 3.36667 3.3667 10.8167 3.3667 20C3.3667 29.1833 10.8167 36.6333 20 36.6333C29.1834 36.6333 36.6334 29.1833 36.6334 20C36.6334 10.8167 29.1834 3.36667 20 3.36667ZM19.1334 33.3333V22.9H13.3334L21.6667 6.66667V17.1H27.25L19.1334 33.3333Z" />
                      </svg>
                    </div>

                    <div className="px-4 py-2 -mx-3">
                      <div className="mx-3">
                        <span
                          className={`font-semibold ${
                            success ? "text-green-400" : "text-red-400"
                          }`}
                        >
                          {success ? "Success" : "Error"}
                        </span>
                        <p className="text-sm text-gray-600 ">{message}</p>
                      </div>
                    </div>
                  </div>
                )}
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="w-full px-6 py-2.5 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-gray-800 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50"
                  >
                    Sign Up
                  </button>
                  <div className="mt-6 text-center ">
                    <button
                      onClick={() => setSignin(true)}
                      className="text-sm text-blue-500 hover:underline "
                    >
                      Already have an account?
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <span className="w-1/5 border-b dark:border-gray-600 lg:w-1/5"></span>

                    <a
                      href="#"
                      className="text-xs text-center text-gray-500 uppercase dark:text-gray-400 hover:underline"
                    >
                      or register with Social Media
                    </a>

                    <span className="w-1/5 border-b dark:border-gray-400 lg:w-1/5"></span>
                  </div>
                  <div className="flex items-center mt-6 -mx-2">
                    <button
                      type="button"
                      className="flex items-center justify-center w-full px-6 py-2 mx-2 text-sm font-medium text-white transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:bg-blue-400 focus:outline-none"
                    >
                      <svg
                        className="w-4 h-4 mx-2 fill-current"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"></path>
                      </svg>

                      <span
                        onClick={() => signIn("google")}
                        className="hidden mx-2 sm:inline"
                      >
                        Sign up with Google
                      </span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </form>
        </div>
      </section>{" "}
      <div
        className={"background-overlay anim "}
        style={{
          gridTemplateColumns: `repeat(${elemProps.gridSizeX}, 1fr)`,
        }}
      >
        {[
          ...Array((elemProps.gridSizeX || 0) * (elemProps.gridSizeY || 0)),
        ].map((e, i) => (
          <span className="z-10" key={i}></span>
        ))}
      </div>
    </>
  );
}

export default Index;
