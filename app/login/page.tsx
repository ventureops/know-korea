import Link from "next/link";
import Image from "next/image";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import LoginButtons from "@/components/auth/LoginButtons";
import WebViewWarning from "@/components/auth/WebViewWarning";

export const metadata = {
  title: "Sign In",
};

const DAEDONGYEOJIDO_URL =
  "https://res.cloudinary.com/db57m4q10/image/upload/v1775479274/know-korea/daedongyeojido.png";

export default async function LoginPage() {
  const session = await getSession();
  if (session) redirect("/");

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-stretch">
      {/* Left — 대동여지도 이미지 (데스크탑만) */}
      <div className="hidden md:flex md:w-1/2 relative bg-surface-container-low items-center justify-center">
        <div className="relative w-full h-full">
          <Image
            src={DAEDONGYEOJIDO_URL}
            alt="Dae-dong-yeo-ji-do, Korea's largest and most precise historical map"
            fill
            className="object-cover"
            priority
          />
          {/* 색상 오버레이 — 배경과 구분 */}
          <div className="absolute inset-0 bg-brand-navy/20" />
          {/* 하단 오버레이 */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
            <h3 className="text-white font-bold text-lg font-headline">
              대동여지도 (Daedongyeojido)
            </h3>
            <p className="text-white/80 text-sm mt-1">
              Korea&apos;s largest and most precise historical map.{" "}
              6.6 meters tall · Created in 1861 · National Treasure
            </p>
            <p className="text-white/50 text-xs mt-2">
              Photo: Yonhap News, Korea
            </p>
          </div>
        </div>
      </div>

      {/* Right — 로그인 폼 */}
      <div className="flex flex-1 items-center justify-center px-6 py-12 bg-surface">
        <div className="w-full max-w-sm">
          {/* WebView 안내 (인앱 브라우저 감지 시 표시) */}
          <WebViewWarning />

          {/* 제목 */}
          <h1 className="font-headline font-extrabold text-3xl text-on-surface tracking-tight mb-2">
            Sign in to Know Korea
          </h1>

          {/* 가입 혜택 훅 */}
          <div className="space-y-3 my-8">
            <div className="flex items-start gap-3 text-sm text-on-surface-variant">
              <span className="material-symbols-outlined text-primary text-lg mt-0.5">check_circle</span>
              <span>Track your reading progress across 190+ guides</span>
            </div>
            <div className="flex items-start gap-3 text-sm text-on-surface-variant">
              <span className="material-symbols-outlined text-primary text-lg mt-0.5">check_circle</span>
              <span>Join the Community — share experiences and start discussions</span>
            </div>
            <div className="flex items-start gap-3 text-sm text-on-surface-variant">
              <span className="material-symbols-outlined text-primary text-lg mt-0.5">check_circle</span>
              <span>Get faster responses when you Contact Us</span>
            </div>
            <div className="flex items-start gap-3 text-sm text-on-surface-variant">
              <span className="material-symbols-outlined text-primary text-lg mt-0.5">check_circle</span>
              <span>Personalize your profile — set your photo and nickname</span>
            </div>
          </div>

          {/* Google 로그인 버튼 */}
          <LoginButtons />

          {/* 보안 안내 강조 */}
          <div className="mt-6 flex items-start gap-2 bg-primary-container/20 rounded-xl p-3">
            <span className="material-symbols-outlined text-primary text-sm mt-0.5">lock</span>
            <p className="text-xs font-medium text-on-surface">
              Secured by Google — no passwords stored. Your account is protected by Google&apos;s industry-leading security.
            </p>
          </div>

          {/* 약관 동의 */}
          <p className="text-xs text-on-surface-variant/60 mt-4 text-center">
            By continuing, you agree to our{" "}
            <Link href="/privacy-policy" className="underline hover:text-on-surface-variant transition-colors">
              Privacy Policy
            </Link>
            {" & "}
            <Link href="/terms-of-service" className="underline hover:text-on-surface-variant transition-colors">
              Terms of Service
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
