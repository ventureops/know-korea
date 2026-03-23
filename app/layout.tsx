import type { Metadata } from "next";
import "./globals.css";
import SessionProvider from "@/components/auth/SessionProvider";
import SiteShell from "@/components/layout/SiteShell";

export const metadata: Metadata = {
  title: "Know Korea",
  description: "Everything you need to navigate Korea — The Modern Envoy, Your Digital Curator",
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
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-surface min-h-screen">
        <SessionProvider>
          <SiteShell>{children}</SiteShell>
        </SessionProvider>
      </body>
    </html>
  );
}
