"use client";

import SidebarContent from "@/components/layout/SidebarContent";

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-14 z-40 hidden h-[calc(100vh-3.5rem)] w-64 bg-surface/70 backdrop-blur-xl md:flex md:flex-col overflow-hidden">
      <SidebarContent />
    </aside>
  );
}
