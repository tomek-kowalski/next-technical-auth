import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const allowedUsers = ["alloweduser1@gmail.com", "alloweduser2@example.com", "kc.tomasz.kowalski@gmail.com"];

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (allowedUsers.includes(user.email)) {
        return true; // ✅ Allow access
      }
      return false; // ❌ Deny access
    },
    async session({ session }) {
      return session;
    },
  },
};

export default NextAuth(authOptions);
