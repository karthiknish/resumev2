import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import User from "../../../models/User";
import dbConnect from "../../../lib/dbConnect";
export default NextAuth({
  session: { strategy: "jwt" },
  site: process.env.NEXTAUTH_URL,
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      async authorize(credentials, req) {
        try {
          await dbConnect();

          const { email, password } = credentials;
          if (!email) {
            throw new Error("Enter an email");
          }
          const r = String(email)
            .toLowerCase()
            .match(
              /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
          if (r === null) {
            throw new Error("Enter a valid email");
          }
          if (!password) {
            throw new Error("Enter a password");
          }
          const user = await User.findOne({ email });
          if (!user) {
            throw new Error("User not found.");
          }
          if (user.email && !user.isVerified) {
            throw new Error("Please verify your account from the email sent.");
          }

          const isPasswordMatched = await bcrypt.compare(
            password,
            user.password
          );
          if (!isPasswordMatched) {
            throw new Error("Wrong password.");
          }
          return user;
        } catch (error) {
          throw new Error(`${error.message}`);
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  events: {
    error(message) {
      console.error(message);
    },
  },
  pages: { signIn: "/sign", error: "/sign" },
  secret: process.env.NEXTAUTH_SECRET,
});