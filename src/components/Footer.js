import React from "react";
import { FadeIn, HoverCard } from "./animations/MotionComponents";
import { AiFillGithub, AiFillLinkedin } from "react-icons/ai";

export default function Footer() {
  return (
    <FadeIn>
      <footer className="bg-black text-white">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <div className="flex justify-center space-x-6 mb-6">
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
