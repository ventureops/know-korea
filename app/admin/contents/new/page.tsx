import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import ContentEditor from "@/components/admin/ContentEditor";

export default async function NewContentPage() {
  const session = await getSession();
  if (!session || (session.user.role ?? 0) < 4) redirect("/admin");

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-headline text-xl font-bold text-on-surface">
          New Article
        </h1>
      </div>
      <ContentEditor mode="new" />
    </div>
  );
}
