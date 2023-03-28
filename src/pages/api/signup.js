import dbConnect from "../../lib/dbConnect";
import User from "../../models/User";
import nodemailer from "nodemailer";
// import path from "path";
// const logoPath = path.join(process.cwd(), "src", "assets", "logo.png");
function getEmailTemplate(name, verificationLink) {
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
      <h2 style="color: #4A5568;">Hi ${name},</h2>
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
Karthik
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
import crypto from "crypto";
function validateUserData(data) {
  if (!data.name) {
    return { isValid: false, message: "Enter a Name" };
  }
  if (!data.email) {
    return { isValid: false, message: "Enter an Email" };
  }
  if (!data.password) {
    return { isValid: false, message: "Enter a Password" };
  }
  if (!data.conpassword) {
    return { isValid: false, message: "Enter the same password again" };
  }

  if (!/\S+@\S+\.\S+/.test(data.email)) {
    return { isValid: false, message: "Invalid email address" };
  }

  if (data.password.length < 6) {
    return {
      isValid: false,
      message: "Password should be at least 6 characters long",
    };
  }
  console.log(data.password, data.conpassword);
  if (data.password !== data.conpassword) {
    return { isValid: false, message: "Passwords do not match" };
  }

  return { isValid: true, message: "" };
}
export default async function handler(req, res) {
  const { method } = req;
  await dbConnect();
  switch (method) {
    case "GET":
      try {
        if (!req.query.email) {
          return res
            .status(400)
            .json({ success: false, message: "Email is required" });
        }

        const user = await User.findOne({ email: req.query.email });
        res.status(200).json({
          success: true,
          data: user,
        });
      } catch (e) {
        res.status(500).json({ success: false, message: e.message });
      }
      break;
    case "POST":
      try {
        const validationResult = validateUserData(req.body);
        if (!validationResult.isValid) {
          return res
            .status(400)
            .json({ success: false, message: validationResult.message });
        }
        const { name, email, password, role } = req.body;
        const verificationToken = crypto.randomBytes(32).toString("hex");
        let u = new User({
          name,
          email,
          role,
          password,
          verificationToken,
          isVerified: false,
        });
        await u.save();

        if (u.email) {
          const transporter = nodemailer.createTransport({
            host: "smtppro.zoho.eu",
            port: 465,
            secure: true,
            auth: {
              user: process.env.NOREPLY_EMAIL,
              pass: process.env.NOREPLY_PASS,
            },
          });
          const verificationLink = `${process.env.URL}/api/verify?token=${verificationToken}`;
          const emailTemplate = getEmailTemplate(name, verificationLink);
          const mailOptions = {
            from: process.env.NOREPLY_EMAIL,
            to: email,
            subject: "Welcome to Karthiknish",
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
          res.status(200).json({
            success: true,
            message: "Registration success. Check your mail for validation",
          });
        }
      } catch (e) {
        if (e?.keyValue?.email) {
          res
            .status(400)
            .json({ success: false, message: "Email already registered" });
        } else {
          res.status(500).json({ success: false, message: e.message });
        }
      }
      break;
    default:
      res.status(405).json({ success: false, message: "Method not allowed" });
  }
}
