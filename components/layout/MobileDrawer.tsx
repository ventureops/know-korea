"use client";

import SidebarContent from "@/components/layout/SidebarContent";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  return (
    <>
      {/* 오버레이 */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-inverse-surface/30 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Drawer 패널 */}
      <div
        className={`fixed left-0 top-0 h-full w-64 bg-surface/95 backdrop-blur-2xl z-50 md:hidden flex flex-col overflow-hidden transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent onNavigate={onClose} />
      </div>
    </>
  );
}
