import Head from "next/head";
import Link from "next/link";
import PageContainer from "@/components/PageContainer";
import { Button } from "@/components/ui/button";
import { CheckCircle, Mail, Archive } from "lucide-react";
import { motion } from "framer-motion";

export default function NewsletterThankYou() {
  return (
    <>
      <Head>
        <title>Thank You for Subscribing! - Karthik Nishanth</title>
        <meta name="robots" content="noindex, nofollow" />{" "}
        {/* Prevent indexing */}
      </Head>
      <PageContainer>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.2,
            }}
            className="mb-6"
          >
            <CheckCircle className="w-16 h-16 text-green-500" />
          </motion.div>
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-white mb-4 font-calendas"
          >
            Thank You for Subscribing!
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="text-lg text-gray-300 mb-8 max-w-md"
          >
            You're all set! Keep an eye on your inbox for the latest articles,
            insights, and updates.
          </motion.p>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="flex flex-col md:flex-row gap-4 mb-8"
          >
            <Link href="/blog" passHref>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Back to Blog
              </Button>
            </Link>
            <Link href="/newsletter/preferences" passHref>
              <Button
                variant="outline"
                className="border-gray-600 text-white hover:bg-gray-800"
              >
                <Mail className="w-4 h-4 mr-2" />
                Manage Preferences
              </Button>
            </Link>
            <Link href="/newsletter/archive" passHref>
              <Button
                variant="outline"
                className="border-gray-600 text-white hover:bg-gray-800"
              >
                <Archive className="w-4 h-4 mr-2" />
                View Archive
              </Button>
            </Link>
          </motion.div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.5 }}
            className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 max-w-md w-full"
          >
            <h2 className="text-xl font-semibold text-white mb-2">
              Refer a Friend
            </h2>
            <p className="text-gray-400 mb-4">
              Invite friends to subscribe and unlock exclusive content or early
              access to new articles!
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="border-blue-600 text-blue-400 hover:bg-blue-900/30 flex-1"
                asChild
              >
                <a
                  href="https://twitter.com/intent/tweet?text=Check%20out%20Karthik%20Nishanth's%20newsletter%20for%20great%20tech%20insights!%20https://karthiknish.com/newsletter"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Share on Twitter
                </a>
              </Button>
              <Button
                variant="outline"
                className="border-blue-600 text-blue-400 hover:bg-blue-900/30 flex-1"
                asChild
              >
                <a
                  href="mailto:?subject=Subscribe%20to%20Karthik%20Nishanth's%20Newsletter&body=Hey,%20I%20thought%20you'd%20enjoy%20Karthik's%20newsletter%20on%20tech%20and%20development.%20Sign%20up%20here:%20https://karthiknish.com/newsletter"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Share via Email
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </PageContainer>
    </>
  );
}
