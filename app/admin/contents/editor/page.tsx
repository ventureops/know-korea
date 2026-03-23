import { redirect } from "next/navigation";

// Redirect old editor path → new /admin/contents/new
export default function AdminContentEditorPage() {
  redirect("/admin/contents/new");
}
