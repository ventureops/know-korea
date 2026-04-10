"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import MobileDrawer from "@/components/layout/MobileDrawer";
import Footer from "@/components/layout/Footer";

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  // Admin 레이아웃은 독립 유지
  if (pathname.startsWith("/admin")) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen">
      {/* 데스크탑 사이드바 */}
      <Sidebar />

      {/* 모바일 Drawer */}
      <MobileDrawer isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      {/* 우측: Header + Main + Footer */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <Header onMenuToggle={() => setMobileOpen(!mobileOpen)} />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
