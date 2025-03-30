import Head from "next/head";
import Link from "next/link";
import PageContainer from "@/components/PageContainer";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
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
          >
            <Link href="/blog" passHref>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Back to Blog
              </Button>
            </Link>
          </motion.div>
        </div>
      </PageContainer>
    </>
  );
}
