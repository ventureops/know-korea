"use client";

import SidebarContent from "@/components/layout/SidebarContent";

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-30 hidden h-full w-64 bg-surface/70 backdrop-blur-xl md:flex md:flex-col overflow-hidden">
      <SidebarContent />
    </aside>
  );
}
