import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ | Know Korea",
  description:
    "Frequently asked questions about living in Korea as a foreigner — visas, banking, healthcare, housing, and more.",
  openGraph: {
    title: "FAQ | Know Korea",
    description:
      "Frequently asked questions about living in Korea as a foreigner.",
    url: "https://know-korea.vercel.app/faq",
    siteName: "Know Korea",
  },
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
