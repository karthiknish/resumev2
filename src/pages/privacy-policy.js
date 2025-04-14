import Head from "next/head";
import PageContainer from "@/components/PageContainer";

export default function PrivacyPolicy() {
  return (
    <>
      <Head>
        <title>Privacy Policy - Karthik Nishanth</title>
        <meta name="description" content="Website Privacy Policy" />
      </Head>
      <PageContainer className="mt-20 md:mt-24">
        <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
          <h1 className="text-3xl md:text-4xl font-bold text-center text-white mb-8 font-calendas">
            Privacy Policy
          </h1>

          <div className="prose prose-invert max-w-none prose-p:text-gray-300 prose-headings:text-white prose-a:text-blue-400 hover:prose-a:underline">
            <p>
              <strong>Last updated: January 15, 2024</strong>
            </p>

            <p>
              This Privacy Policy describes Our policies and procedures on the
              collection, use and disclosure of Your information when You use
              the Service and tells You about Your privacy rights and how the
              law protects You.
            </p>
            <p>
              We use Your Personal data to provide and improve the Service. By
              using the Service, You agree to the collection and use of
              information in accordance with this Privacy Policy.
            </p>

            <h2>Interpretation and Definitions</h2>
            <p>
              The words of which the initial letter is capitalized have meanings
              defined under the following conditions. The following definitions
              shall have the same meaning regardless of whether they appear in
              singular or in plural.
            </p>

            <h3>Definitions</h3>
            <ul>
              <li>
                <strong>Service</strong> refers to the Website.
              </li>
              <li>
                <strong>Personal Data</strong> is any information that relates
                to an identified or identifiable individual.
              </li>
              <li>
                <strong>Website</strong> refers to Karthik Nishanth's personal
                website and portfolio, accessible from
                https://karthiknishanth.com
              </li>
              <li>
                <strong>You</strong> means the individual accessing or using the
                Service, or the company, or other legal entity on behalf of
                which such individual is accessing or using the Service, as
                applicable.
              </li>
            </ul>

            <h2>Collecting and Using Your Personal Data</h2>
            <h3>Types of Data Collected</h3>
            <h4>Personal Data</h4>
            <p>
              While using Our Service, We may ask You to provide Us with certain
              personally identifiable information that can be used to contact or
              identify You. This information includes:
            </p>
            <ul>
              <li>
                Email address (when using the contact form or chat feature)
              </li>
              <li>First name and last name (optional, when provided)</li>
              <li>Usage Data</li>
            </ul>

            <h4>Usage Data</h4>
            <p>Usage Data is collected automatically when using the Service.</p>
            <p>
              Usage Data may include information such as Your Device's Internet
              Protocol address (IP address), browser type, browser version, the
              pages of our Service that You visit, the time and date of Your
              visit, the time spent on those pages, unique device identifiers
              and other diagnostic data.
            </p>

            <h4>Tracking Technologies and Cookies</h4>
            <p>
              We use Cookies and similar tracking technologies to track the
              activity on Our Service and store certain information. These
              technologies are used to maintain session information and help
              analyze how visitors use the website.
            </p>
            <p>
              Cookies can be "Persistent" or "Session" cookies. Persistent
              Cookies remain on Your device for a set period, while Session
              Cookies are deleted when You close Your web browser.
            </p>
            <p>
              We use both Session and Persistent Cookies for the following
              purposes:
            </p>
            <ul>
              <li>
                <strong>Essential Cookies:</strong> To operate our Service
              </li>
              <li>
                <strong>Analytics Cookies:</strong> To understand how visitors
                interact with the website
              </li>
            </ul>

            <h3>Use of Your Personal Data</h3>
            <p>We may use Personal Data for the following purposes:</p>
            <ul>
              <li>
                To provide and maintain our Service, including monitoring the
                usage of our Service
              </li>
              <li>
                To manage Your requests: To attend and manage Your requests to
                Us through the contact form or chat feature
              </li>
              <li>
                For analytics: To evaluate and improve our Service, products,
                services, and marketing efforts
              </li>
              <li>
                To protect our Service: To detect, prevent and address technical
                issues or security concerns
              </li>
            </ul>

            <h3>Retention of Your Personal Data</h3>
            <p>
              We will retain Your Personal Data only for as long as is necessary
              for the purposes set out in this Privacy Policy. We will retain
              and use Your Personal Data to the extent necessary to comply with
              our legal obligations, resolve disputes, and enforce our legal
              agreements and policies.
            </p>

            <h3>Security of Your Personal Data</h3>
            <p>
              The security of Your Personal Data is important to Us. We
              implement appropriate technical and organizational measures to
              protect Your Personal Data. However, remember that no method of
              transmission over the Internet, or method of electronic storage is
              100% secure.
            </p>

            <h3>Children's Privacy</h3>
            <p>
              Our Service does not address anyone under the age of 13. We do not
              knowingly collect personally identifiable information from anyone
              under the age of 13. If You are a parent or guardian and You are
              aware that Your child has provided Us with Personal Data, please
              contact Us.
            </p>

            <h3>Links to Other Websites</h3>
            <p>
              Our Service may contain links to other websites that are not
              operated by Us. If You click on a third party link, You will be
              directed to that third party's site. We strongly advise You to
              review the Privacy Policy of every site You visit. We have no
              control over and assume no responsibility for the content, privacy
              policies or practices of any third party sites or services.
            </p>

            <h3>Changes to this Privacy Policy</h3>
            <p>
              We may update Our Privacy Policy from time to time. We will notify
              You of any changes by posting the new Privacy Policy on this page
              and updating the "Last updated" date. You are advised to review
              this Privacy Policy periodically for any changes. Changes to this
              Privacy Policy are effective when they are posted on this page.
            </p>

            <h3>Contact Us</h3>
            <p>
              If you have any questions about this Privacy Policy, You can
              contact us:
            </p>
            <ul>
              <li>
                By visiting our contact page:{" "}
                <a href="/contact">Contact Page</a>
              </li>
              <li>By sending an email to: privacy@karthiknishanth.com</li>
            </ul>
          </div>
        </div>
      </PageContainer>
    </>
  );
}
