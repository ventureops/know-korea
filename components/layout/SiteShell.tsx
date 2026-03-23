"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <Sidebar />
      <div className="pt-14 md:pl-64 min-h-screen flex flex-col">
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </>
  );
}
