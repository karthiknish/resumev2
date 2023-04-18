import Link from "next/link";
import { AiFillGithub, AiFillLinkedin } from "react-icons/ai";
function Footer() {
  return (
    <div className="my-2  flex gap-4 w-full justify-center">
      <Link
        target="_blank"
        rel="noopener noreferrer"
        href="https://github.com/karthiknish"
        className="text-2xl text-white hover:text-1536ba transition-all duration-300"
      >
        <AiFillGithub className="text-4xl" />
      </Link>
      <Link
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.linkedin.com/in/karthik-nishanth/"
        className="text-2xl text-white hover:text-1536ba transition-all duration-300"
      >
        <AiFillLinkedin className="text-4xl" />
      </Link>
    </div>
  );
}

export default Footer;
