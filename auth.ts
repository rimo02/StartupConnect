import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { connectDB } from "./lib/db";
import User from "./lib/model/user";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [GitHub],
  callbacks: {
    async signIn({ profile }) {
      await connectDB();
      if (!profile?.email) return false;

      let user = await User.findOne({ email: profile.email });

      if (!user) {
        user = await User.create({
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
          username: profile.login,
          bio: profile.bio || "",
          githubId: profile.id,
        });

      }

      return true;
    },

    async jwt({ token, profile }) {
      if (profile) {
        const user = await User.findOne({ githubId: profile.id });
        if (!user) {
          token.id = user._id.toString();
          token.name = user.name;
          token.email = user.email;
          token.username = user.username;
          token.picture = user.image;
        }
      }
      return token;
    },

    async session({ session, token }) {
      session.user = {
        id: token.id as string,
        name: token.name as string,
        email: token.email as string,
        username: token.username as string,
        image: token.picture as string,
      };
      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
});
