import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { createClient } from "@supabase/supabase-js";

// Service-role client for auth callbacks (bypasses RLS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? "placeholder-service-key"
);

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;

      try {
        const { data: existing } = await supabaseAdmin
          .from("users")
          .select("id, role")
          .eq("email", user.email)
          .single();

        if (existing) {
          await supabaseAdmin
            .from("users")
            .update({ last_login_at: new Date().toISOString() })
            .eq("id", existing.id);
        } else {
          await supabaseAdmin.from("users").insert({
            email: user.email,
            nickname: user.name ?? user.email.split("@")[0],
            avatar_url: user.image ?? null,
            role: 1,
            status: "active",
            last_login_at: new Date().toISOString(),
          });
        }
      } catch (err) {
        console.error("signIn callback error:", err);
        return false;
      }

      return true;
    },

    async session({ session }) {
      if (session.user?.email) {
        const { data } = await supabaseAdmin
          .from("users")
          .select("id, role, nickname, avatar_url")
          .eq("email", session.user.email)
          .single();

        if (data) {
          session.user.id = data.id;
          session.user.role = data.role;
          session.user.nickname = data.nickname;
          session.user.image = data.avatar_url ?? session.user.image;
        }
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
};
