'use client';

import { useState, useEffect } from 'react';
import Script from 'next/script';
import Link from 'next/link';

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export default function CookieConsent() {
  const [consent, setConsent] = useState<'accepted' | 'declined' | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('cookie-consent') as 'accepted' | 'declined' | null;
    setConsent(stored);
    if (!stored) setVisible(true);

    function handleReset() {
      setConsent(null);
      setVisible(true);
    }
    window.addEventListener('cookie-consent-reset', handleReset);
    return () => window.removeEventListener('cookie-consent-reset', handleReset);
  }, []);

  function accept() {
    localStorage.setItem('cookie-consent', 'accepted');
    setConsent('accepted');
    setVisible(false);
  }

  function decline() {
    localStorage.setItem('cookie-consent', 'declined');
    setConsent('declined');
    setVisible(false);
  }

  return (
    <>
      {/* GA4 — 동의한 경우에만 로드 */}
      {consent === 'accepted' && GA_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}');
            `}
          </Script>
        </>
      )}

      {/* Cookie 배너 */}
      {visible && (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-3 sm:p-4">
          <div className="max-w-2xl mx-auto bg-surface-container-lowest rounded-2xl shadow-lg border border-outline-variant/15 px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <p className="flex-1 text-sm font-body text-on-surface-variant leading-relaxed">
              We use cookies to understand how you use Know Korea.{' '}
              <Link href="/privacy-policy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
            </p>
            <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
              <button
                onClick={decline}
                className="px-4 py-1.5 rounded-full text-sm font-body text-on-surface-variant hover:bg-surface-container transition-colors"
              >
                Decline
              </button>
              <button
                onClick={accept}
                className="px-4 py-1.5 rounded-full bg-primary text-on-primary text-sm font-body font-medium hover:opacity-90 transition-all active:scale-95"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
