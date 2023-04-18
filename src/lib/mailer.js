import nodemailer from "nodemailer";

const sendNewsletter = async (subject, htmlContent, recipients) => {
  const transporter = nodemailer.createTransport({
    host: "smtppro.zoho.eu",
    port: 465,
    secure: true,
    auth: {
      user: process.env.NOREPLY_EMAIL,
      pass: process.env.NOREPLY_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: recipients.join(","),
    subject: subject,
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Newsletter sent successfully");
  } catch (error) {
    console.error("Failed to send newsletter:", error);
  }
};

export default sendNewsletter;
