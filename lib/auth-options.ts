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
          .select("id, role, status")
          .eq("email", user.email)
          .single();

        if (existing) {
          // Block suspended/banned users
          if (existing.status === "suspended" || existing.status === "banned") {
            return `/login?error=AccountBlocked`;
          }
          await supabaseAdmin
            .from("users")
            .update({ last_login_at: new Date().toISOString() })
            .eq("id", existing.id);
          // Log login activity
          await supabaseAdmin.from("activity_logs").insert({
            user_id: existing.id,
            action: "login",
          }).single();
        } else {
          const { data: newUser } = await supabaseAdmin.from("users").insert({
            email: user.email,
            nickname: user.name ?? user.email!.split("@")[0],
            avatar_url: user.image ?? null,
            role: 1,
            status: "active",
            last_login_at: new Date().toISOString(),
          }).select("id").single();
          if (newUser) {
            await supabaseAdmin.from("activity_logs").insert({
              user_id: newUser.id,
              action: "login",
            }).single();
          }
        }
      } catch (err) {
        console.error("signIn callback error:", err);
        return false;
      }

      return true;
    },

    async jwt({ token, trigger }) {
      // Fetch role from DB on sign-in or explicit session update
      if (token.email && (trigger === 'signIn' || trigger === 'update' || !token.role)) {
        const { data } = await supabaseAdmin
          .from("users")
          .select("id, role, nickname, avatar_url")
          .eq("email", token.email)
          .single();

        if (data) {
          token.id = data.id;
          token.role = data.role;
          token.nickname = data.nickname;
          token.picture = data.avatar_url ?? token.picture;
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as number;
        session.user.nickname = token.nickname as string;
        session.user.image = token.picture as string ?? session.user.image;
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
