import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      username: string;
      image: string;
    };
  }

  interface User {
    id: string;
    name: string;
    email: string;
    username: string;
    image: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    name: string;
    email: string;
    username: string;
    picture: string;
  }
}
