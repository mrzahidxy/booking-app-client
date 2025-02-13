// next-auth.d.ts
import NextAuth from "next-auth";

// Extend the default session and user types
declare module "next-auth" {
  interface Session {
    user: {
      token: string; 
      role: string;
    } & DefaultSession["user"];
  }

  interface User {
    token: string;
    role: string;
  }
}