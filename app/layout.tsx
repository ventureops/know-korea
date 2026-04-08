import type { Metadata } from "next";
import "./globals.css";
import SessionProvider from "@/components/auth/SessionProvider";
import SiteShell from "@/components/layout/SiteShell";
import CookieConsent from "@/components/CookieConsent";

export const metadata: Metadata = {
  title: {
    default: "Know Korea",
    template: "%s | Know Korea",
  },
  description: "Actually need to navigate Korea.",
  openGraph: {
    title: "Know Korea",
    description: "Actually need to navigate Korea.",
    siteName: "Know Korea",
    url: "https://knowkorea.com",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Know Korea",
    description: "Actually need to navigate Korea.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Manrope:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-surface min-h-screen">
        <SessionProvider>
          <SiteShell>{children}</SiteShell>
        </SessionProvider>
        <CookieConsent />
      </body>
    </html>
  );
}
