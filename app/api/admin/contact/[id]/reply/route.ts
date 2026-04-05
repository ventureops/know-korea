import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";
import { sendContactReply } from "@/lib/email";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? "placeholder"
);

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session || (session.user.role ?? 0) < 4) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { message } = await req.json();
  if (!message?.trim()) {
    return NextResponse.json({ error: "Message is required." }, { status: 400 });
  }

  const { data: submission, error: fetchError } = await supabaseAdmin
    .from("contact_submissions")
    .select("name, email, category, admin_note")
    .eq("id", params.id)
    .single();

  if (fetchError || !submission) {
    return NextResponse.json({ error: "Submission not found." }, { status: 404 });
  }

  try {
    await sendContactReply({
      to: submission.email,
      name: submission.name,
      category: submission.category,
      message: message.trim(),
    });
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    console.error("Email send error:", detail);
    return NextResponse.json({ error: "Failed to send email.", detail }, { status: 500 });
  }

  const timestamp = new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" });
  const noteEntry = `[Reply sent ${timestamp}]\n${message.trim()}`;
  const newNote = submission.admin_note
    ? `${noteEntry}\n\n---\n\n${submission.admin_note}`
    : noteEntry;

  const { error: updateError } = await supabaseAdmin
    .from("contact_submissions")
    .update({
      is_read: true,
      is_replied: true,
      replied_at: new Date().toISOString(),
      admin_note: newNote,
    })
    .eq("id", params.id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
