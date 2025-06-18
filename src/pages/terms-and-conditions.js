import Head from "next/head";
import PageContainer from "@/components/PageContainer";
import { motion } from "framer-motion";

export default function TermsAndConditions() {
  return (
    <>
      <Head>
        <title>Terms and Conditions - Karthik Nishanth</title>
        <meta name="description" content="Website Terms and Conditions" />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <PageContainer className="mt-20 md:mt-24">
          <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
            {/* Hero Section */}
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center justify-center gap-4 mb-6">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="text-6xl"
                >
                  📄
                </motion.div>
                <h1
                  className="text-4xl md:text-6xl lg:text-7xl font-black bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"
                  style={{ fontFamily: "Space Grotesk, sans-serif" }}
                >
                  Terms & Conditions
                </h1>
              </div>
              <p className="text-xl text-gray-600 font-medium max-w-3xl mx-auto">
                Please read these terms carefully before using our services.
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="inline-block ml-2 text-2xl"
                >
                  ⚖️
                </motion.span>
              </p>
            </motion.div>

            {/* Content Container */}
            <motion.div
              className="bg-gradient-to-br from-purple-50/90 via-white/85 to-blue-50/90 backdrop-blur-sm border-2 border-purple-200 rounded-3xl p-8 md:p-12 shadow-2xl"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div
                className="prose prose-lg max-w-none prose-p:text-gray-700 prose-headings:text-gray-800 prose-a:text-purple-600 hover:prose-a:text-purple-800 prose-headings:font-black prose-h2:text-3xl prose-h3:text-2xl prose-strong:text-gray-800 prose-li:text-gray-700"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                <p>
                  <strong>Last updated: January 15, 2024</strong>
                </p>

                <p>
                  Please read these terms and conditions carefully before using
                  Our Service.
                </p>

                <h2>Interpretation and Definitions</h2>
                <p>
                  The words of which the initial letter is capitalized have
                  meanings defined under the following conditions. The following
                  definitions shall have the same meaning regardless of whether
                  they appear in singular or in plural.
                </p>

                <h3>Definitions</h3>
                <ul>
                  <li>
                    <strong>Website</strong> refers to Karthik Nishanth's
                    personal website, accessible from https://karthiknish.com
                  </li>
                  <li>
                    <strong>Service</strong> refers to the Website.
                  </li>
                  <li>
                    <strong>You</strong> means the individual accessing or using
                    the Website, or a company, or any legal entity on behalf of
                    which such individual is accessing or using the Website, as
                    applicable.
                  </li>
                  <li>
                    <strong>Company</strong> (referred to as either "the
                    Company", "We", "Us" or "Our" in this Agreement) refers to
                    the owner and operator of this Website.
                  </li>
                </ul>

                <h2>Acknowledgment</h2>
                <p>
                  These are the Terms and Conditions governing the use of this
                  Service and the agreement that operates between You and the
                  Company. These Terms and Conditions set out the rights and
                  obligations of all users regarding the use of the Service.
                </p>
                <p>
                  Your access to and use of the Service is conditioned on Your
                  acceptance of and compliance with these Terms and Conditions.
                  These Terms and Conditions apply to all visitors, users and
                  others who access or use the Service.
                </p>
                <p>
                  By accessing or using the Service, You agree to be bound by
                  these Terms and Conditions. If You disagree with any part of
                  these Terms and Conditions, You may not access the Service.
                </p>

                <h2>Content and Intellectual Property Rights</h2>
                <p>
                  The content on Our Website, including but not limited to text,
                  graphics, images, software, code, and other material
                  ("Content"), is owned by or licensed to Us and is protected by
                  copyright and other intellectual property laws.
                </p>
                <p>
                  You may view, download, and print Content from the Website for
                  Your personal, non-commercial use only. You must not modify,
                  copy, distribute, transmit, display, perform, reproduce,
                  publish, license, create derivative works from, transfer, or
                  sell any Content without Our prior written consent.
                </p>

                <h2>Links to Other Websites</h2>
                <p>
                  Our Service may contain links to third-party websites that are
                  not owned or controlled by Us. We have no control over, and
                  assume no responsibility for, the content, privacy policies,
                  or practices of any third-party websites or services.
                </p>
                <p>
                  We strongly advise You to read the terms and conditions and
                  privacy policies of any third-party websites that You visit.
                </p>

                <h2>Limitation of Liability</h2>
                <p>
                  To the maximum extent permitted by applicable law, We shall
                  not be liable for any indirect, incidental, special,
                  consequential, or punitive damages, or any loss of profits or
                  revenues, whether incurred directly or indirectly, or any loss
                  of data, use, goodwill, or other intangible losses resulting
                  from:
                </p>
                <ul>
                  <li>Your use or inability to use our Service</li>
                  <li>
                    Any unauthorized access to or use of our servers and/or any
                    personal information stored therein
                  </li>
                  <li>
                    Any interruption or cessation of transmission to or from our
                    Service
                  </li>
                  <li>
                    Any bugs, viruses, trojan horses, or the like that may be
                    transmitted to or through our Service
                  </li>
                </ul>

                <h2>Governing Law</h2>
                <p>
                  These Terms shall be governed and construed in accordance with
                  the laws of the United States, without regard to its conflict
                  of law provisions.
                </p>
                <p>
                  Our failure to enforce any right or provision of these Terms
                  will not be considered a waiver of those rights.
                </p>

                <h2>Changes to These Terms and Conditions</h2>
                <p>
                  We reserve the right to modify or replace these Terms at any
                  time at Our sole discretion. If a revision is material, We
                  will make reasonable efforts to provide at least 30 days'
                  notice prior to any new terms taking effect.
                </p>
                <p>
                  By continuing to access or use Our Service after those
                  revisions become effective, You agree to be bound by the
                  revised terms. If You do not agree to the new terms, in whole
                  or in part, please stop using the Website.
                </p>

                <h2>Contact Us</h2>
                <p>
                  If you have any questions about these Terms and Conditions,
                  You can contact us:
                </p>
                <ul>
                  <li>
                    By visiting this page on our website:{" "}
                    <a href="/contact">Contact Page</a>
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </PageContainer>
      </div>
    </>
  );
}
