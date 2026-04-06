/**
 * 현재 브라우저가 인앱 브라우저(WebView)인지 감지
 * 카카오톡, 인스타그램, 페이스북, 네이버, 라인 등 주요 앱 커버
 */
export function isInAppBrowser(): boolean {
  if (typeof window === 'undefined') return false;

  const ua = navigator.userAgent || navigator.vendor || '';

  const inAppPatterns = [
    /KAKAOTALK/i,                    // 카카오톡
    /Instagram/i,                    // 인스타그램
    /FBAN|FBAV/i,                    // 페이스북
    /NAVER/i,                        // 네이버
    /Line\//i,                       // 라인
    /SamsungBrowser\/.*CrossApp/i,   // 삼성 인앱
    /wv\)/i,                         // Android WebView
    /WebView/i,                      // 일반 WebView
  ];

  return inAppPatterns.some(pattern => pattern.test(ua));
}

/**
 * 현재 URL을 외부 브라우저로 열기 시도
 * 플랫폼별 최적 방법 사용
 */
export function openInExternalBrowser(url?: string): boolean {
  const targetUrl = url || window.location.href;
  const ua = navigator.userAgent || '';

  try {
    // Android: intent 스킴으로 Chrome 열기
    if (/Android/i.test(ua)) {
      window.location.href = `intent://${targetUrl.replace(/^https?:\/\//, '')}#Intent;scheme=https;package=com.android.chrome;end`;
      return true;
    }

    // iOS: Safari로 열기
    if (/iPhone|iPad|iPod/i.test(ua)) {
      window.location.href = targetUrl;
      return true;
    }
  } catch (e) {
    return false;
  }

  return false;
}
