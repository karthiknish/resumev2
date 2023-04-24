const sendNewsletter = require("./mailer.js");

const subject = "Test Newsletter";
const htmlContent =
  "<h1>Hello from the Test Newsletter</h1><p>This is a test email sent using the sendNewsletter function.</p>";
const recipients = ["karthik.nishanth06.com", "karthik.nishanth006.com"];

(async () => {
  try {
    await sendNewsletter(subject, htmlContent, recipients);
    console.log("Test newsletter sent successfully");
  } catch (error) {
    console.error("Failed to send test newsletter:", error);
  }
})();
