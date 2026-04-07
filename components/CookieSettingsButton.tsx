'use client';

export default function CookieSettingsButton() {
  function handleClick() {
    localStorage.removeItem('cookie-consent');
    window.dispatchEvent(new Event('cookie-consent-reset'));
  }

  return (
    <button
      onClick={handleClick}
      className="text-xs font-body text-on-surface-variant hover:text-on-surface transition-colors"
    >
      Cookie Settings
    </button>
  );
}
