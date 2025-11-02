import React from "react";
import { motion } from "framer-motion";
import { FadeIn } from "./animations/MotionComponents";
import { AiFillGithub, AiOutlineMail } from "react-icons/ai";
import Link from "next/link";
import NewsletterSignup from "./NewsletterSignup";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

const socialLinks = [
  {
    href: "https://github.com/karthiknish",
    icon: AiFillGithub,
    label: "GitHub",
  },
  {
    href: "mailto:hello@karthiknish.com",
    icon: AiOutlineMail,
    label: "Email",
  },
];

export default function Footer() {
  return (
    <FadeIn>
      <footer className="relative overflow-hidden bg-slate-950 text-slate-100">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(236,72,153,0.15),_transparent_55%)]" />
        <div className="absolute inset-0 bg-slate-950/80" />

        <div className="relative max-w-6xl mx-auto px-6 sm:px-10 md:px-12 py-16 md:py-20">
          <div className="grid gap-12 md:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h3 className="font-heading text-3xl text-white">
                Karthik Nishanth
              </h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-md">
                Product-minded software engineer crafting resilient experiences across web and mobile. I partner with founders and teams to move fast without compromising on craft.
              </p>
              <div className="flex gap-4">
                {socialLinks.map(({ href, icon: Icon, label }) => (
                  <motion.a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-200 transition hover:border-white/30 hover:text-white"
                    whileHover={{ y: -2, scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="h-5 w-5" />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="space-y-5"
            >
              <h3 className="font-heading text-2xl text-white">Browse</h3>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.05 * index }}
                    viewport={{ once: true }}
                  >
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-2 text-sm sm:text-base text-slate-300 transition hover:text-white"
                    >
                      <span className="h-px w-6 bg-slate-500 transition group-hover:bg-white" />
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur"
            >
              <NewsletterSignup />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="mt-16 border-t border-white/10 pt-6 text-sm text-slate-400"
          >
            <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
              <p>
                &copy; {new Date().getFullYear()} Karthik Nishanth. Crafted with care in Liverpool.
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-xs uppercase tracking-[0.25em] text-slate-500">
                {[
                  { href: "/terms-and-conditions", label: "Terms" },
                  { href: "/privacy-policy", label: "Privacy" },
                  { href: "/cookie-policy", label: "Cookies" },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="transition hover:text-white"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </footer>
    </FadeIn>
  );
}
