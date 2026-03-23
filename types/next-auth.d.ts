import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: number;
      nickname: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  interface User {
    id: string;
    role?: number;
    nickname?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: number;
    nickname?: string;
  }
}
