"use client";

import { useEffect, useState } from "react";
import { isInAppBrowser, openInExternalBrowser } from "@/lib/webview";

export default function WebViewWarning() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isInAppBrowser()) {
      const opened = openInExternalBrowser();
      // 외부 열기 성공 시 3초 대기, 실패 시 즉시 안내 표시
      setTimeout(() => setShow(true), opened ? 3000 : 0);
    }
  }, []);

  if (!show) return null;

  return (
    <div className="mb-6 p-4 bg-primary-container/20 text-on-surface rounded-xl text-sm border border-primary-container/40">
      <p className="font-bold mb-2">
        Google sign-in is not supported in this browser.
      </p>
      <p className="text-on-surface-variant mb-3">
        Please open this page in Chrome or Safari to sign in.
      </p>
      <button
        onClick={() => openInExternalBrowser()}
        className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg font-bold text-sm hover:opacity-90 transition-opacity active:scale-95"
      >
        <span className="material-symbols-outlined text-lg">open_in_browser</span>
        Open in Browser
      </button>
    </div>
  );
}
