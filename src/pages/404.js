import Link from "next/link";

import Head from "next/head";
function FourOhFour() {
  return (
    <div className="min-h-screen  flex justify-center">
      <Head>
        <title>it`s a 404 // karthik nishanth.</title>
      </Head>
      <div className="max-w-sm mx-auto p-8 relative text-center gap-4 my-auto z-30 bg-red-400 flex flex-col">
        <h1 className="text-black text-4xl">it`s a 404</h1>
        <Link className="text-gray-400" href="/">
          let`s go back home <span> &#8594;</span>
        </Link>
        <div className="absolute bg-white bottom-4 right-2 w-full h-full -z-10"></div>
      </div>
    </div>
  );
}

export default FourOhFour;
