import React from "react";
import { motion } from "framer-motion";
import { FadeIn, HoverCard } from "./animations/MotionComponents";
import { AiFillGithub, AiFillLinkedin } from "react-icons/ai";
import Link from "next/link";
import NewsletterSignup from "./NewsletterSignup"; // Import the new component

export default function Footer() {
  return (
    <FadeIn>
      <footer className="bg-gradient-to-br from-purple-600 to-blue-600 text-white relative overflow-hidden">
        {/* Floating Elements */}
        <motion.div
          className="absolute top-10 left-10 text-6xl opacity-10"
          animate={{
            y: [0, -30, 0],
            rotate: [0, 360],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        >
          💫
        </motion.div>
        <motion.div
          className="absolute bottom-10 right-20 text-5xl opacity-10"
          animate={{
            scale: [1, 1.4, 1],
            rotate: [0, -45, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        >
          ⭐
        </motion.div>
        <motion.div
          className="absolute top-20 right-10 text-4xl opacity-10"
          animate={{
            x: [0, 20, 0],
            y: [0, -15, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        >
          ✨
        </motion.div>
        
        <div className="max-w-6xl mx-auto px-6 py-16 relative z-10">
          {/* Changed grid to 3 columns on medium screens and up */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            {/* Brand and Connect section (Column 1) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3
                className="text-3xl font-black mb-6 flex items-center gap-3"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                Karthik Nishanth
                <motion.span
                  animate={{ rotate: [0, 20, -20, 0] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="text-2xl"
                >
                  ✨
                </motion.span>
              </h3>
              <p className="text-purple-100 mb-6 text-lg leading-relaxed">
                Building magical digital experiences with the latest technologies and a touch of creativity.
              </p>
              {/* Moved Connect section here */}
              <h3 className="text-2xl font-bold text-white mb-4">Let's Connect</h3>
              <div className="flex space-x-6">
                <motion.a
                  href="https://github.com/karthiknish"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="bg-white/20 backdrop-blur-sm p-3 rounded-xl hover:bg-white/30 transition-all duration-300 group"
                  whileHover={{ scale: 1.1, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <AiFillGithub className="text-3xl group-hover:text-yellow-300 transition-colors" />
                </motion.a>
                <motion.a
                  href="https://www.linkedin.com/in/karthik-nishanth/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="bg-white/20 backdrop-blur-sm p-3 rounded-xl hover:bg-white/30 transition-all duration-300 group"
                  whileHover={{ scale: 1.1, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <AiFillLinkedin className="text-3xl group-hover:text-cyan-300 transition-colors" />
                </motion.a>
              </div>
            </motion.div>

            {/* Quick Links (Column 2) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h3
                className="text-2xl font-bold mb-6 flex items-center gap-3"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                Quick Links
                <motion.span
                  animate={{ y: [0, -5, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="text-xl"
                >
                  🚀
                </motion.span>
              </h3>
              <ul className="space-y-3">
                {[
                  { href: "/", label: "Home", emoji: "🏠" },
                  { href: "/about", label: "About", emoji: "👋" },
                  { href: "/services", label: "Services", emoji: "⚡" },
                  { href: "/blog", label: "Blog", emoji: "📝" },
                  { href: "/contact", label: "Contact", emoji: "💬" },
                ].map((link, index) => (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                    viewport={{ once: true }}
                  >
                    <Link
                      href={link.href}
                      className="group flex items-center gap-3 text-purple-100 hover:text-white transition-all duration-300 text-lg font-medium"
                    >
                      <span className="group-hover:scale-125 transition-transform duration-300">
                        {link.emoji}
                      </span>
                      <span className="group-hover:translate-x-1 transition-transform duration-300">
                        {link.label}
                      </span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Newsletter Signup Column (Column 3) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <NewsletterSignup />
            </motion.div>
          </div>

          {/* Bottom section with copyright and policy links */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center border-t border-white/20 pt-8 mt-12"
          >
            <motion.p
              className="text-purple-100 text-lg font-medium mb-4"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              Made with{" "}
              <motion.span
                animate={{
                  scale: [1, 1.3, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="inline-block text-red-400 mx-1"
              >
                ❤️
              </motion.span>{" "}
              by Karthik Nishanth &copy; {new Date().getFullYear()}
            </motion.p>
            {/* Add policy links below copyright */}
            <div className="mt-4 flex flex-wrap justify-center gap-6">
              {[
                { href: "/terms-and-conditions", label: "Terms & Conditions" },
                { href: "/privacy-policy", label: "Privacy Policy" },
                { href: "/cookie-policy", label: "Cookie Policy" },
              ].map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  viewport={{ once: true }}
                >
                  <Link
                    href={link.href}
                    className="text-sm text-purple-200 hover:text-white transition-all duration-300 font-medium hover:underline underline-offset-4"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </footer>
    </FadeIn>
  );
}
