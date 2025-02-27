import React from "react";
import { FadeIn, HoverCard } from "./animations/MotionComponents";
import { AiFillGithub, AiFillLinkedin } from "react-icons/ai";
import Link from "next/link";

export default function Footer() {
  return (
    <FadeIn>
      <footer className="bg-black text-white">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Brand section */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Karthik Nishanth</h3>
              <p className="text-gray-400">
                Building modern web experiences with the latest technologies.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
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
                <li>
                  <HoverCard>
                    <Link
                      href="/linkedin-manager"
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      LinkedIn Manager
                    </Link>
                  </HoverCard>
                </li>
              </ul>
            </div>

            {/* Social Links */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Connect</h3>
              <div className="flex space-x-4">
                <HoverCard>
                  <a
                    href="https://github.com/karthiksivaraman"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <AiFillGithub className="text-3xl" />
                  </a>
                </HoverCard>
                <HoverCard>
                  <a
                    href="https://linkedin.com/in/karthiksivaraman"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <AiFillLinkedin className="text-3xl" />
                  </a>
                </HoverCard>
              </div>
            </div>
          </div>

          <div className="text-center">
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
