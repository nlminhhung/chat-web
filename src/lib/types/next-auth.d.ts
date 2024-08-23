import NextAuth from "next-auth";

type UserId = string

declare module "next-auth" {
  interface User {
    role?: string; // Add the role property to the User type
  }

  interface Session {
    user: {
      id: UserId;
      role?: string; // Add the role property to the Session user type
    } & DefaultSession["client"];
  }
}

// Extend the JWT type to include the role
declare module "next-auth/jwt" {
  interface JWT {
    id: UserId;
    role?: string; 
  }
}
