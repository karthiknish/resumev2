import dbConnect from "../../lib/dbConnect";
import User from "../../models/User";
import nodemailer from "nodemailer";
// import path from "path";
// const logoPath = path.join(process.cwd(), "src", "assets", "logo.png");
async function sendVerificationEmail(user, verificationLink) {
  const transporter = nodemailer.createTransport({
    host: "smtppro.zoho.eu",
    port: 465,
    secure: true,
    auth: {
      user: process.env.NOREPLY_EMAIL,
      pass: process.env.NOREPLY_PASS,
    },
  });

  function getEmailTemplate(user, verificationLink) {
    return ` <body>
    <section style="max-width: 2xl; padding: 6px; margin: 0 auto; background-color: white;">
      <header>
        <a href="https://karthiknish.com">
          <img
            style="width: auto; height: 1.75rem;"
            src="cid:logo"
            alt="Logo"
          />
        </a>
      </header>
  
      <main style="margin-top: 2rem;">
        <h2 style="color: #4A5568;">Hi ${user.name},</h2>
  
        <p
          style="margin-top: 0.5rem; line-height: 1.625; color: #718096;"
        >
          Dream education consultancy has invited you to Signup on
          <span style="font-weight: 600;">karthiknish.com</span>.
        </p>
  
        <a
          href="${verificationLink}"
          style="display: inline-block; padding: 6px 12px; margin-top: 1rem; font-size: 0.875rem; font-weight: 500; letter-spacing: 0.025em; text-transform: capitalize; color: white; background-color: #4299E1; border-radius: 0.375rem; text-decoration: none; transition: background-color 0.3s ease; outline: none; cursor: pointer;"
        >
          Accept the invite
        </a>
  
        <p style="margin-top: 2rem; color: #718096;">
          Thanks, <br />
          Dream Ed Team
        </p>
      </main>
  
      <footer style="margin-top: 2rem;">
        <p style="margin-top: 0.75rem; color: #A0AEC0;">
          © ${new Date().getFullYear()} Dream Ed. All Rights Reserved.
        </p>
      </footer>
    </section>
  </body>`;
  }
  const emailTemplate = getEmailTemplate(user, verificationLink);
  const mailOptions = {
    from: process.env.NOREPLY_EMAIL,
    to: user.email,
    subject: "Welcome to Dream Education Consultancy",
    html: emailTemplate,
    // attachments: [
    //   {
    //     filename: "logo.png",
    //     path: logoPath,
    //     cid: "logo",
    //   },
    // ],
  };

  await transporter.sendMail(mailOptions).catch((err) => {
    console.error(err);
  });
}

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "POST") {
    const { email } = req.body;
    console.log(req.body);
    try {
      const user = await User.findOne({ email });

      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      if (user.isVerified) {
        return res
          .status(400)
          .json({ success: false, message: "Email already verified" });
      }

      const verificationLink = `${process.env.URL}/api/verification?token=${user.verificationToken}`;
      await sendVerificationEmail(user, verificationLink);

      res.status(200).json({
        success: true,
        message: "Verification email has been resent. Check your inbox.",
      });
    } catch (e) {
      res.status(500).json({ success: false, message: e.message });
    }
  } else if (req.method === "GET") {
    const { token } = req.query;

    try {
      const user = await User.findOne({ verificationToken: token });

      if (!user) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid token" });
      }

      user.isVerified = true;
      user.verificationToken = undefined;
      await user.save();

      res.status(200).json({
        success: true,
        message: "Email verified successfully. You can now log in.",
      });
    } catch (e) {
      res.status(500).json({ success: false, message: e.message });
    }
  } else {
    res.status(405).json({ success: false, message: "Method not allowed" });
  }
}
