import React from "react";
import { FadeIn, HoverCard } from "./animations/MotionComponents";
import { AiFillGithub, AiFillLinkedin } from "react-icons/ai";
import Link from "next/link";
import NewsletterSignup from "./NewsletterSignup"; // Import the new component

export default function Footer() {
  return (
    <FadeIn>
      <footer className="bg-black text-white">
        <div className="max-w-6xl mx-auto px-4 py-10">
          {/* Changed grid to 3 columns on medium screens and up */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Brand and Connect section (Column 1) */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Karthik Nishanth</h3>
              <p className="text-gray-400 mb-4">
                {" "}
                {/* Added margin-bottom */}
                Building modern web experiences with the latest technologies.
              </p>
              {/* Moved Connect section here */}
              <h3 className="text-lg font-semibold text-gray-200 mb-3">
                Connect
              </h3>
              <div className="flex space-x-4">
                <HoverCard>
                  <a
                    href="https://github.com/karthiknish"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {/* Reduced icon size */}
                    <AiFillGithub className="text-2xl" />
                  </a>
                </HoverCard>
                <HoverCard>
                  <a
                    href="https://www.linkedin.com/in/karthik-nishanth/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {/* Reduced icon size */}
                    <AiFillLinkedin className="text-2xl" />
                  </a>
                </HoverCard>
              </div>
            </div>

            {/* Quick Links (Column 2) */}
            <div>
              {/* Reduced heading size */}
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <HoverCard>
                    <Link
                      href="/"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      Home
                    </Link>
                  </HoverCard>
                </li>
                <li>
                  <HoverCard>
                    <Link
                      href="/about"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      About
                    </Link>
                  </HoverCard>
                </li>
                <li>
                  <HoverCard>
                    <Link
                      href="/blog"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      Blog
                    </Link>
                  </HoverCard>
                </li>
              </ul>
            </div>

            {/* Newsletter Signup Column (Column 3) */}
            <div>
              {" "}
              {/* Ensure it takes one column */}
              <NewsletterSignup />
            </div>
          </div>

          {/* Added border-t and padding-top */}
          <div className="text-center border-t border-gray-700 pt-6 mt-8">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} Karthik Nishanth. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </FadeIn>
  );
}
