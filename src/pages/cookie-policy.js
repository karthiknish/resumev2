import Head from "next/head";
import PageContainer from "@/components/PageContainer";

export default function CookiePolicy() {
  return (
    <>
      <Head>
        <title>Cookie Policy - Karthik Nishanth</title>
        <meta name="description" content="Website Cookie Policy" />
      </Head>
      <PageContainer className="mt-20 md:mt-24">
        <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
          <h1 className="text-3xl md:text-4xl font-bold text-center text-white mb-8 font-calendas">
            Cookie Policy
          </h1>

          <div className="prose prose-invert max-w-none prose-p:text-gray-300 prose-headings:text-white prose-a:text-blue-400 hover:prose-a:underline">
            <p>
              <strong>Last updated: January 15, 2024</strong>
            </p>

            <p>
              This Cookie Policy explains what Cookies are and how We use them.
              You should read this policy so You can understand what type of
              cookies We use, or the information We collect using Cookies and
              how that information is used.
            </p>
            <p>
              Cookies do not typically contain any information that personally
              identifies a user, but personal information that we store about
              You may be linked to the information stored in and obtained from
              Cookies. For further information on how We use, store and keep
              your personal data secure, see our{" "}
              <a href="/privacy-policy">Privacy Policy</a>.
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
                <strong>Cookies</strong> means small files that are placed on
                Your computer, mobile device, or any other device by a website.
              </li>
              <li>
                <strong>Website</strong> refers to Karthik Nishanth's personal
                website, accessible from https://karthiknishanth.com
              </li>
              <li>
                <strong>You</strong> means the individual accessing or using the
                Website, or a company, or any legal entity on behalf of which
                such individual is accessing or using the Website, as
                applicable.
              </li>
              <li>
                <strong>Company</strong> (referred to as either "the Company",
                "We", "Us" or "Our" in this Agreement) refers to the owner and
                operator of this Website.
              </li>
            </ul>

            <h2>What are Cookies?</h2>
            <p>
              Cookies are small files that are placed on Your computer, mobile
              device or any other device by a website, containing the details of
              Your browsing history on that website among its many uses.
            </p>

            <h2>How We Use Cookies</h2>
            <p>
              We use Cookies and similar tracking technologies to track the
              activity on Our Service and store certain information. Tracking
              technologies used are beacons, tags, and scripts to collect and
              track information and to improve and analyze Our Service.
            </p>

            <h2>Types of Cookies We Use</h2>
            <p>
              Cookies can be "Persistent" or "Session" Cookies. Persistent
              Cookies remain on your personal computer or mobile device when You
              go offline, while Session Cookies are deleted as soon as You close
              your web browser.
            </p>
            <p>
              We use both session and persistent Cookies for the purposes set
              out below:
            </p>

            <h4>Necessary / Essential Cookies</h4>
            <ul>
              <li>Type: Session Cookies</li>
              <li>Administered by: Us</li>
              <li>
                Purpose: These Cookies are essential to provide You with
                services available through the Website and to enable You to use
                some of its features. They help to authenticate users and
                prevent fraudulent use of user accounts. Without these Cookies,
                the services that You have asked for cannot be provided, and We
                only use these Cookies to provide You with those services.
              </li>
            </ul>

            <h4>Analytics Cookies</h4>
            <ul>
              <li>Type: Persistent Cookies</li>
              <li>Administered by: Google Analytics</li>
              <li>
                Purpose: These Cookies help us understand how visitors interact
                with the Website by collecting and reporting information
                anonymously. The information collected includes the number of
                visitors, where visitors come from, and the pages they visited.
                This helps us improve the Website and your experience.
              </li>
            </ul>

            <h2>Your Choices Regarding Cookies</h2>
            <p>
              Most web browsers are set to accept cookies by default. If you
              prefer, you can usually choose to set your browser to remove or
              reject browser cookies. Please note that if you choose to remove
              or reject cookies, this could affect the availability and
              functionality of our Website.
            </p>

            <h3>Instructions to Manage Cookies</h3>
            <ul>
              <li>
                <strong>Chrome</strong>: Settings → Privacy and Security →
                Cookies and other site data
              </li>
              <li>
                <strong>Firefox</strong>: Options → Privacy & Security → Cookies
                and Site Data
              </li>
              <li>
                <strong>Safari</strong>: Preferences → Privacy → Cookies and
                website data
              </li>
              <li>
                <strong>Edge</strong>: Settings → Cookies and site permissions →
                Manage and delete cookies
              </li>
            </ul>

            <h2>Contact Us</h2>
            <p>
              If you have any questions about this Cookie Policy, You can
              contact us:
            </p>
            <ul>
              <li>
                By visiting our <a href="/contact">Contact Page</a>
              </li>
            </ul>
          </div>
        </div>
      </PageContainer>
    </>
  );
}

