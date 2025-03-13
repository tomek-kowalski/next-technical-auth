import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const allowedEmails = [
  "dansoloway@gmail.com",
  "kc.tomasz.kowalski@gmail.com",
  "tuneupfitnessmarketing@gmail.com"
];

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    error: "/auth/error",
  },
  callbacks: {
    async signIn({ user }) {
      if (allowedEmails.includes(user.email)) {
        return true;
      } else {
        return false;
      }
    },
  },
  debug: true,
};

export default NextAuth(authOptions);
