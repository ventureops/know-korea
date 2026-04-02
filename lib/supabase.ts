import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "placeholder-anon-key";

// General-purpose client (server components, route handlers)
// Falls back to placeholder values during build when env vars are not set.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ──────────────────────────────────────────────
// Type definitions matching DB schema (SPEC.md §13)
// ──────────────────────────────────────────────
export interface Content {
  id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string | null;
  cover_image: string | null;
  cover_caption?: string | null;
  cover_alt?: string | null;
  body_mdx: string | null;
  tags: string[] | null;
  is_published: boolean;
  show_bmc: boolean;
  view_count: number;
  author_id: string | null;
  created_at: string;
  updated_at: string;
}
