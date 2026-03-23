import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session || (session.user.role ?? 0) < 3) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-surface flex">
      <AdminSidebar role={session.user.role ?? 3} />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-14 bg-surface-container-lowest border-b border-outline-variant/15 flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <span className="font-headline font-bold text-primary text-sm">
              Know Korea Admin
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-surface-container transition-colors text-on-surface-variant">
              <span className="material-symbols-outlined text-[20px]">notifications</span>
            </button>
            <button className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-surface-container transition-colors text-on-surface-variant">
              <span className="material-symbols-outlined text-[20px]">settings</span>
            </button>
            <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center ml-1">
              <span className="text-on-primary-container text-xs font-bold">A</span>
            </div>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
