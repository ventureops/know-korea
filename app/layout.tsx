import type { Metadata } from "next";
import "./globals.css";
import SessionProvider from "@/components/auth/SessionProvider";
import SiteShell from "@/components/layout/SiteShell";
import CookieConsent from "@/components/CookieConsent";

export const metadata: Metadata = {
  metadataBase: new URL("https://knowkorea.com"),
  title: {
    default: "Know Korea",
    template: "%s | Know Korea",
  },
  description: "Discover Curated Korea Insights.",
  openGraph: {
    title: "Know Korea",
    description: "Discover Curated Korea Insights.",
    siteName: "Know Korea",
    url: "https://knowkorea.com",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "https://knowkorea.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Know Korea",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Know Korea",
    description: "Discover Curated Korea Insights.",
    images: ["https://knowkorea.com/og-image.png"],
  },
  verification: {
    google: "GDLPG0wnYPyvRGJoChsboFkezLp5WSkTSInPi9SXKxo",
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
