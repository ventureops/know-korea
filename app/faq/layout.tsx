import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about living in Korea as a foreigner — visas, banking, healthcare, housing, and more.",
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
