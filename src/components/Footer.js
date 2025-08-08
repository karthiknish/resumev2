import React from "react";
import { motion } from "framer-motion";
import { FadeIn, HoverCard } from "./animations/MotionComponents";
import { AiFillGithub, AiFillLinkedin } from "react-icons/ai";
import Link from "next/link";
import NewsletterSignup from "./NewsletterSignup"; // Import the new component

export default function Footer() {
  return (
    <FadeIn>
      <footer className="bg-foreground text-background relative overflow-hidden">
        {/* Decorative floating elements removed */}

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
                className="text-3xl font-black mb-6"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                Karthik Nishanth
              </h3>
              <p className="text-background/70 mb-6 text-lg leading-relaxed">
                Building modern, scalable digital solutions with a focus on
                usability and performance.
              </p>
              {/* Moved Connect section here */}
              <h3 className="text-2xl font-bold text-background mb-4">
                Let's Connect
              </h3>
              <div className="flex space-x-6">
                <motion.a
                  href="https://github.com/karthiknish"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="bg-background/10 backdrop-blur-sm p-3 rounded-xl hover:bg-background/20 transition-all duration-300 group"
                  whileHover={{ scale: 1.1, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <AiFillGithub className="text-3xl text-background transition-colors" />
                </motion.a>
                <motion.a
                  href="https://www.linkedin.com/in/karthik-nishanth/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="bg-background/10 backdrop-blur-sm p-3 rounded-xl hover:bg-background/20 transition-all duration-300 group"
                  whileHover={{ scale: 1.1, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <AiFillLinkedin className="text-3xl text-background transition-colors" />
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
                className="text-2xl font-bold mb-6"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                Quick Links
              </h3>
              <ul className="space-y-3">
                {[
                  { href: "/", label: "Home" },
                  { href: "/about", label: "About" },
                  { href: "/services", label: "Services" },
                  { href: "/blog", label: "Blog" },
                  { href: "/contact", label: "Contact" },
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
                      className="group flex items-center gap-3 text-background/70 hover:text-background transition-all duration-300 text-lg font-medium"
                    >
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
            className="text-center border-t border-background/20 pt-8 mt-12"
          >
            <motion.p
              className="text-background/70 text-lg font-medium mb-4"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              Crafted by Karthik Nishanth &copy; {new Date().getFullYear()}
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
                    className="text-sm text-background/70 hover:text-background transition-all duration-300 font-medium hover:underline underline-offset-4"
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
