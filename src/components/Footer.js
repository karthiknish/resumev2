import Link from "next/link";
import { AiFillGithub, AiFillLinkedin } from "react-icons/ai";
function Footer() {
  return (
    <div className="my-2 flex flex-col items-center gap-4 w-full">
      <div className="flex gap-4 justify-center">
        <Link
          target="_blank"
          rel="noopener noreferrer"
          href="https://github.com/karthiknish"
          className="text-2xl text-white hover:text-1536ba transition-all duration-300"
          aria-label="View my GitHub profile"
        >
          <AiFillGithub className="text-4xl" />
        </Link>
        <Link
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.linkedin.com/in/karthik-nishanth/"
          className="text-2xl text-white hover:text-1536ba transition-all duration-300"
          aria-label="View my LinkedIn profile"
        >
          <AiFillLinkedin className="text-4xl" />
        </Link>
      </div>
      <p className="text-sm text-gray-400">
        © {new Date().getFullYear()} Karthik Nishanth. All rights reserved.
      </p>
    </div>
  );
}

export default Footer;
