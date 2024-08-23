import { UpstashRedisAdapter } from "@next-auth/upstash-redis-adapter";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { db } from "./db";
import { fetchRedis } from "../commands/redis";

export const authOptions: NextAuthOptions = {
  adapter: UpstashRedisAdapter(db),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    error: "/error",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (user) {
        const isNewUser = await db.exists(`user:${user.id}`)
        if (!isNewUser) {
          user.role = 'user'
        }
      }
      return true
    },
    async jwt({ token, user }) {
      const getUser = (await fetchRedis("get", `user:${token.id}`)) as
        | string
        | null

      if (!getUser) {
        if (user) {
          token.id = user.id;
          token.role = user.role
        }
        return token;
      }

      const userData = JSON.parse(getUser) as User;

      return {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        picture: userData.image,
        role: userData.role
      };
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
        session.user.role = token.role;
      }
      return session;
    },
    async redirect() {
      return "/chat";
    },
  },
};
